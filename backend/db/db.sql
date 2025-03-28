drop database if exists meeting;
create database meeting;
use meeting;

drop table if exists user;
create table user(
    id int(11) not null auto_increment primary key comment '主键id',
    username varchar(50) unique not null default '' comment '用户名',
    password varchar(60) not null default '' comment '密码',
    avatar_url varchar(200) not null default '' comment '头像地址',
    is_active tinyint(2) not null default 0 comment '账号状态（0启用/1禁用）',
    create_time datetime not null default CURRENT_TIMESTAMP comment '注册时间',
    update_time datetime not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  comment '修改时间'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='用户基本信息表';

drop table if exists role;
create table role(
    id int(11) not null auto_increment primary key comment '主键id',
    role_code varchar(50) unique not null default '' comment '角色编码',
    name varchar(50) unique not null default '' comment '角色名',
    description varchar(200) not null default '该角色还没有描述' comment '角色描述'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

drop table if exists user_role;
create table user_role(
    id int(11) not null auto_increment primary key comment '主键id',
    user_id int(11) not null default 0 comment '用户id',
    role_id int(11) not null default 0 comment '角色id',
    create_time datetime not null default CURRENT_TIMESTAMP comment '创建时间'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

drop table if exists meeting_room;
create table meeting_room
(
    id int(11) not null auto_increment primary key comment '主键id',
    name varchar(50) unique not null default '' comment '会议室名称',
    location varchar(50) not null default '' comment '所在位置',
    capacity int(11) not null default 0 comment '容纳人数',
    equipment varchar(200) not null default '' comment '设备',
    user_id int(11) not null default 0 comment '用户id',
    create_time datetime not null default CURRENT_TIMESTAMP comment '创建时间'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='会议室基础信息表';

drop table if exists reservation;
create table reservation
(
    id int(11) not null auto_increment primary key comment '主键id',
    topic varchar(50) not null default '' comment '会议主题',
    description varchar(200) not null default '' comment '会议描述',
    booker_id int(11) not null default 0 comment '预约用户id',
    room_id int(11) not null default 0 comment '会议室id',
    voice_url varchar(200) not null default '' comment '议题语音地址',
    summary varchar(200) not null default '' comment '议题会议总结',
    start_time time not null comment '起始时间',
    end_time time not null comment '结束时间',
    status tinyint(2) not null default 0 comment '预约状态（0待审核/1已通过/2已拒绝）',
    reserve_date date not null comment '预约日期',
    create_time datetime not null default CURRENT_TIMESTAMP comment '创建时间'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='预约表';

drop table if exists participants;
create table participants
(
    id int(11) not null auto_increment primary key comment '主键id',
    reservation_id int(11) not null default 0 comment '预约id',
    user_id int(11) not null default 0 comment '用户id',
    status tinyint(2) NOT NULL DEFAULT 1 COMMENT '状态(0:待处理 1:已接受 2:已拒绝)',
    create_time datetime not null default CURRENT_TIMESTAMP comment '创建时间'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='参会用户表';

drop table if exists subtopics;
create table subtopics
(
    id int(11) not null auto_increment primary key comment '主键id',
    reservation_id int(11) not null default 0 comment '预约id',
    subtopics varchar(50) not null default '' comment '子主题',
    description varchar(200) default '' comment '子主题描述',
    create_time datetime not null default CURRENT_TIMESTAMP comment '创建时间'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='子主题表';

drop table if exists subtopics_file;
create table subtopics_file
(
    id int(11) not null auto_increment primary key comment '主键id',
    subtopics_id int(11) not null default 0 comment '议题id',
    file_name varchar(50) not null default '' comment '文件名',
    file_url varchar(200) not null default '' comment '文件地址',
    create_time datetime not null default CURRENT_TIMESTAMP comment '创建时间'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='议题文件表';

drop table if exists meeting_notification;
create table meeting_notification (
    id int(11) not null auto_increment primary key comment '主键id',
    reservation_id int(11) not null default 0 comment '',
    notify_type tinyint(2) not null comment '通知类型(1:预定成功 2:变更通知 3:取消通知 4:会前提醒)',
    title varchar(100) COMMENT '通知标题',
    content varchar(200) NOT NULL COMMENT '通知内容',
    sender_id int(11) NOT NULL COMMENT '发送人(系统用户填0)',
    create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    schedule_time datetime COMMENT '定时发送时间',
    status tinyint(2) NOT NULL DEFAULT 1 COMMENT '状态(0:已取消 1:待发送 2:已发送 3:发送失败)'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='会议相关通知表';

-- 防止会议室时段重复预约
ALTER TABLE reservation
    ADD UNIQUE uniq_room_slot_date (room_id, reserve_date, start_time, end_time);

-- 防止重复添加参会人
ALTER TABLE participants
    ADD UNIQUE uniq_reservation_user (reservation_id, user_id);

