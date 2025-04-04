package org.cuit.meeting.web.service.impl;

import com.alibaba.dashscope.aigc.generation.GenerationResult;
import com.alibaba.dashscope.aigc.multimodalconversation.MultiModalConversationResult;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.apache.commons.lang3.StringUtils;
import org.cuit.meeting.constant.NotificationConstants;
import org.cuit.meeting.constant.ParticipantsConstants;
import org.cuit.meeting.constant.RedisConstants;
import org.cuit.meeting.constant.ReservationConstants;
import org.cuit.meeting.dao.MeetingRoomMapper;
import org.cuit.meeting.dao.ReservationMapper;
import org.cuit.meeting.dao.UserMapper;
import org.cuit.meeting.domain.Result;
import org.cuit.meeting.domain.dto.PageDTO;
import org.cuit.meeting.domain.dto.ReservationDTO;
import org.cuit.meeting.domain.entity.MeetingRoom;
import org.cuit.meeting.domain.entity.Participants;
import org.cuit.meeting.domain.entity.Reservation;
import org.cuit.meeting.domain.entity.User;
import org.cuit.meeting.domain.request.ReservationBody;
import org.cuit.meeting.domain.request.ReservationPageQuery;
import org.cuit.meeting.domain.request.SummaryBody;
import org.cuit.meeting.utils.OpenAPIUtil;
import org.cuit.meeting.web.service.FileService;
import org.cuit.meeting.web.service.MeetingNotificationService;
import org.cuit.meeting.web.service.ParticipantsService;
import org.cuit.meeting.web.service.ReservationService;
import org.jetbrains.annotations.NotNull;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.stream.Collectors;

/**
* @author 18425
* @description 针对表【reservation(预约表)】的数据库操作Service实现
* @createDate 2025-03-16 21:56:32
*/
@Service
public class ReservationServiceImpl extends ServiceImpl<ReservationMapper, Reservation>
    implements ReservationService {

    @Autowired
    MeetingNotificationService notificationService;

    @Autowired
    private FileService fileService;

    @Autowired
    private OpenAPIUtil openAPIUtil;

    @Autowired
    UserMapper userMapper;

    @Autowired
    MeetingRoomMapper roomMapper;

    @Autowired
    ReservationMapper reservationMapper;

    @Autowired
    private ParticipantsService participantsService;

    @Autowired
    private RedissonClient redissonClient;

    @Override
    public String approve(int id, boolean isAllowed) {
        String msg="";
        Reservation meeting = getById(id);
        if(Objects.isNull(meeting)){
            msg="预约id错误";
        }else {
            meeting.setStatus(isAllowed?ReservationConstants.ALLOW
                    :ReservationConstants.REFUSED);
            if(!updateById(meeting)){
                msg="审批失败";
            }else {
                if(!notificationService.notifyApprove(meeting,isAllowed)){
                    msg="通知失败";
                }
            }
        }
        return msg;
    }

    @Override
    public PageDTO<ReservationDTO> summaryPage(ReservationPageQuery query) {
        LambdaQueryWrapper<Reservation> wrapper = new LambdaQueryWrapper<>();

        //日期+时间
        if(!Objects.isNull(query.getReserveDate())){
            wrapper.eq(Reservation::getReserveDate,getDate(query.getReserveDate()));
            if(!Objects.isNull(query.getStartTime())&&!Objects.isNull(query.getEndTime())) {
                //查询开始时间在范围内的会议
                wrapper.ge(Reservation::getStartTime, query.getStartTime());
                wrapper.le(Reservation::getStartTime, query.getEndTime());
            }
        }

        Page<Reservation> page = page(query.toMpPage(),wrapper);
        PageDTO<ReservationDTO> res = new PageDTO<>();
        res.setPages(page.getPages());
        res.setTotal(page.getTotal());
        if(!page.getRecords().isEmpty()){
            List<Reservation> records = page.getRecords();
            //record存在时，userid、roomsId肯定不为空，所以不用判断
            //获取用户名
            List<Integer> ids = records.stream().map(Reservation::getBookerId).collect(Collectors.toList());
            Map<Integer, String> usersName = getUsersName(ids);
            //获取会议室名字
            ids = records.stream().map(Reservation::getRoomId).collect(Collectors.toList());
            Map<Integer, String> roomsName = getRoomsName(ids);

            res.setList(records.stream().map(r->convert(r,usersName,roomsName)).collect(Collectors.toList()));
        }
        return res;
    }

    @Override
    public String cancel(int id, int userID) {
        //todo：通知是否需要事务?
        Reservation reservation = getById(id);
        String msg="";
        if(Objects.isNull(reservation)){
            msg="会议id不存在";
        } else if (reservation.getStatus() == ReservationConstants.REFUSED) {
            msg="会议已失效";
        } else if (reservation.getStartTime().before(new Date())) {
            msg="超出时限，不可取消";
        }else if (userID!= NotificationConstants.SYS_ADMIN &&reservation.getBookerId()!=userID) {
            //管理员和预约人可以取消
            msg="非本人预约，无权限";
        }else {
            reservation.setStatus(ReservationConstants.REFUSED);
            if(!updateById(reservation)){
                msg="取消失败，会议id:"+id;
            }else {
                if(!notificationService.notify(reservation,ReservationConstants.REFUSED)){
                    msg="通知记录失败";
                }
            }
        }
        return msg;
    }

    @Override
    public void uploadAudioAndSummary(int reservationId, String fileUrl) {
        // 先上传文件
        // 获取会议
        Reservation reservation = this.getById(reservationId);
        if (Objects.isNull(reservation)) {
            throw new RuntimeException("会议不存在");
        }

        reservation.setVoiceUrl(fileUrl);
        this.updateById(reservation);

        // 生成总结
        getSummary(reservation, fileUrl);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String book(ReservationBody body, int userId) {
        StringBuffer msg = new StringBuffer();
        boolean checkResult = checkParam(body, msg);

        if(!checkResult){
            return msg.toString();
        }
        //验证用户id有效
        List<Integer> list = body.getParticipants();
        LambdaQueryWrapper<User> w = new LambdaQueryWrapper<>();
        w.in(User::getId,list);
        if(list.size()!=userMapper.selectCount(w)){
            msg.append("存在无效用户id");
            return msg.toString();
        } else if (!roomMapper.exists(new LambdaQueryWrapper<MeetingRoom>().eq(MeetingRoom::getId,body.getRoomId()))) {
            msg.append("room id不存在");
            return msg.toString();
        } else if (!isValid(body)) {
            msg.append("时间段冲突");
            return msg.toString();
        }

        //需要上锁
        String key = RedisConstants.RESERVATION_LOCK_PREFIX + body.getRoomId();
        RLock lock = redissonClient.getLock(key);
        if (!lock.tryLock()) {
            return "预约失败，会议室已被占用";
        }
        try {
            Reservation reservation = getReservation(body, userId);
            reservationMapper.insert(reservation);
            Integer reservationId = reservation.getId();
            //插入participants
            Date date = new Date();
            //如果不包含，需加入预约人本人id
            if(!body.getParticipants().contains(userId)) {
                body.getParticipants().add(userId);
            }

            List<Participants> participants = body.getParticipants().stream()
                    .map(id -> {
                        Participants participant = new Participants();
                        participant.setStatus(ParticipantsConstants.NORMAl);
                        participant.setReservationId(reservationId);
                        participant.setUserId(id);
                        participant.setCreateTime(date);
                        return participant;
                    })
                    .collect(Collectors.toList());

            participantsService.saveBatch(participants);
            return reservation.getId().toString();
        } finally {
            lock.unlock();
        }
    }

    @Override
    public Result<Object> getSummary(int id) {
        Reservation reservation = getById(id);
        if (Objects.isNull(reservation)) {
            return Result.fail("会议不存在");
        }

        HashMap<String, String> map = new HashMap<>();
        map.put("summary", reservation.getSummary());
        return Result.ok(map);
    }

    /**
     * 更新会议总结
     * @param body
     * @return
     */
    @Override
    public Result<Object> updateSummary(SummaryBody body) {
        Integer reservationId = body.getReservationId();
        Reservation reservation = getById(reservationId);
        if (Objects.isNull(reservation)) {
            return Result.fail("会议不存在");
        }

        if (StringUtils.isBlank(body.getSummary())) {
            return Result.fail("总结不能为空");
        }

        reservation.setSummary(body.getSummary());
        updateById(reservation);
        return Result.ok();
    }

    @NotNull
    private static boolean checkParam(ReservationBody body, StringBuffer msg) {
        if(StringUtils.isBlank(body.getTopic())){
            msg.append("标题不得为空");
            return false;
        } else if (StringUtils.isBlank(body.getDescription())) {
            body.setDescription("");
        } else if (Objects.isNull(body.getRoomId())) {
            msg.append("会议室id不得为空");
            return false;
        } else if (Objects.isNull(body.getStartTime()) || Objects.isNull(body.getEndTime())) {
            msg.append("开始或结束时间不得为空");
            return false;
        } else if (Objects.isNull(body.getReserveDate())) {
            msg.append("预约日期不得为空");
            return false;
        } else if (body.getTopic().length() > ReservationConstants.topic_LENGTH) {
            msg.append("标题长度大于5");
            return false;
        }
        return true;
    }

    /**
     * 时间段是否可用
     */
    private boolean isValid(ReservationBody body){
        Date endTime = body.getEndTime();
        Date startTime = body.getStartTime();

        LambdaQueryWrapper<Reservation> w = new LambdaQueryWrapper<>();
        //新会议的 start_time 必须小于已有会议的 end_time，且已有会议的 start_time 必须小于新会议的 end_time
        w.eq(Reservation::getRoomId,body.getRoomId()).eq(Reservation::getReserveDate, getDate(body.getReserveDate()))
                .lt(Reservation::getStartTime, endTime)
                .gt(Reservation::getEndTime, startTime);

        return this.count(w)==0L;
    }

    /**
     * 格式化之后是8：00，要转换成0：00
     * @return
     */
    private Date getDate(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY,0);
        return calendar.getTime();
    }

    private Reservation getReservation(ReservationBody body, int userId) {
        Reservation reservation = new Reservation();
        reservation.setTopic(body.getTopic());
        reservation.setDescription(body.getDescription());
        reservation.setRoomId(body.getRoomId());
        reservation.setBookerId(userId);
        reservation.setStartTime(body.getStartTime());
        reservation.setEndTime(body.getEndTime());
        reservation.setStatus(ReservationConstants.NORMAL);
        reservation.setReserveDate(body.getReserveDate());
        reservation.setCreateTime(new Date());
        return reservation;
    }

    @Async
    public void getSummary(Reservation reservation, String fileUrl) {
        try {
            MultiModalConversationResult multiModalConversationResult = openAPIUtil.analysisAudio(fileUrl);
            // 语音转文字
            String text = String.valueOf(multiModalConversationResult.getOutput().getChoices().get(0).getMessage().getContent().get(0).get("text"));
            // 生成摘要
            String prompt = "帮我总结下面的话 生成一个会议总结 字数控制在1000字左右 根据实际内容量决定 最多不可超过1000字\n" + text;
            GenerationResult completion = openAPIUtil.getCompletion(prompt);
            String content = completion.getOutput().getChoices().get(0).getMessage().getContent();
            reservation.setSummary(content);
            // 更新会议
            this.updateById(reservation);
        } catch (Exception e) {
            log.error("生成摘要失败", e);
            throw new RuntimeException("生成摘要失败");
        }
    }

    private ReservationDTO convert(Reservation record, Map<Integer,String> users, Map<Integer,String> rooms){
        ReservationDTO dto = new ReservationDTO();
        dto.setId(record.getId());
        dto.setDescription(record.getDescription());
        dto.setReserveDate(record.getReserveDate());
        String status;
        switch (record.getStatus()){
            case ReservationConstants.ALLOW:
                status=ReservationConstants.RESP_ALLOW;
                break;
            case ReservationConstants.REFUSED:
                status=ReservationConstants.RESP_REFUSED;
                break;
            default:
                status=ReservationConstants.RESP_NORMAL;
        }
        dto.setStatus(status);
        dto.setStartTime(record.getStartTime());
        dto.setEndTime(record.getEndTime());
        dto.setBooker(users.get(record.getBookerId()));
        dto.setTopic(record.getTopic());
        dto.setRoom(rooms.get(record.getRoomId()));
        return dto;
    }

    /**
     * 获取user id：name
     * 使用前需判断id list是否为空
     */
    private Map<Integer,String> getUsersName(List<Integer> ids){
        return userMapper.selectList(new LambdaQueryWrapper<User>().in(User::getId, ids))
                .stream().collect(Collectors.toMap(User::getId, User::getUsername));
    }

    /**
     * 获取room id：name
     * 使用前需判断id list是否为空
     */
    private Map<Integer,String> getRoomsName(List<Integer> ids){
        return roomMapper.selectList(new LambdaQueryWrapper<MeetingRoom>().in(MeetingRoom::getId, ids))
                .stream().collect(Collectors.toMap(MeetingRoom::getId, MeetingRoom::getName));
    }
}




