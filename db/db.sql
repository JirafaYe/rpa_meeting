drop database meeting;
create database meeting;
use meeting;
create table user(
    id int(11) not null default 0 auto_increment primary key comment '主键id',
    username varchar(50) unique not null default '' comment '用户名',
    password varchar(60) not null default '' comment '密码',
    avatar_url varchar(200) not null default '' comment '头像地址',
    is_active tinyint(2) not null default 0 comment '账号状态（0启用/1禁用）',
    create_time datetime not null default CURRENT_TIMESTAMP comment '注册时间',
    update_time datetime not null default CURRENT_TIMESTAMP comment '修改时间'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='用户基本信息表';

create table role(
    id int(11) not null default 0 auto_increment primary key comment '主键id',
    role_code varchar(50) unique not null default '' comment '角色编码',
    name varchar(50) unique not null default '' comment '角色名',
    description varchar(200) not null default '该角色还没有描述' comment '角色描述'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

create table user_role(
    id int(11) not null default 0 auto_increment primary key comment '主键id',
    user_id int(11) not null default 0 comment '用户id',
    role_id int(11) not null default 0 comment '角色id',
    create_time datetime not null default CURRENT_TIMESTAMP comment '创建时间'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

create table meeting_room
(
     id int(11) not null default 0 auto_increment primary key comment '主键id',
     name varchar(50) unique not null default '' comment '会议室名称',
     location varchar(50) not null default '' comment '所在位置',
     capacity int(11) not null default 0 comment '容纳人数',
     equipment varchar(200) not null default '' comment '设备',
     role_id int(11) not null default 0 comment '角色id',
     create_time datetime not null default CURRENT_TIMESTAMP comment '创建时间'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='会议室基础信息表';

create table reservation
(
    id int(11) not null default 0 auto_increment primary key comment '主键id',
    topic varchar(50) not null default '' comment '会议主题',
    description varchar(200) not null default '' comment '会议描述',
    booker_id int(11) not null default 0 comment '预约用户id',
    room_id int(11) not null default 0 comment '会议室id',
    start_time time not null comment '起始时间',
    end_time time not null comment '结束时间',
    status tinyint(2) not null default 0 comment '预约状态（0待审核/1已通过/2已拒绝）',
    reserve_date date not null comment '预约日期',
    create_time datetime not null default CURRENT_TIMESTAMP comment '创建时间'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='预约表';

create table participants
(
    id int(11) not null default 0 auto_increment primary key comment '主键id',
    reservation_id int(11) not null default 0 comment '预约id',
    user_id int(11) not null default 0 comment '用户id',
    create_time datetime not null default CURRENT_TIMESTAMP comment '创建时间'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='参会用户表';

create table subtopics
(
    id int(11) not null default 0 auto_increment primary key comment '主键id',
    reservation_id int(11) not null default 0 comment '预约id',
    subtopics varchar(50) not null default '' comment '子主题',
    description varchar(200) not null default '' comment '子主题描述',
    voice_url varchar(200) not null default '' comment '议题语音地址',
    summary varchar(200) not null default '' comment '议题会议总结',
    create_time datetime not null default CURRENT_TIMESTAMP comment '创建时间'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='子主题表';

create table subtopics_file
(
    id int(11) not null default 0 auto_increment primary key comment '主键id',
    subtopics_id int(11) not null default 0 comment '议题id',
    file_name varchar(50) not null default '' comment '文件名',
    file_url varchar(200) not null default '' comment '文件地址',
    create_time datetime not null default CURRENT_TIMESTAMP comment '创建时间'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='议题文件表';


-- 防止会议室时段重复预约
ALTER TABLE reservation
    ADD UNIQUE uniq_room_slot_date (room_id, reserve_date, start_time, end_time);

-- 防止重复添加参会人
ALTER TABLE participants
    ADD UNIQUE uniq_reservation_user (reservation_id, user_id);