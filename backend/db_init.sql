create database trace_visual;


create table if not exists element_info
(
    id int auto_increment
    primary key,
    trace_name varchar(255) null comment '用户定义的埋点名称',
    is_page tinyint(1) not null comment '是否是页面',
    page_module_id int null comment '页面的模块 id',
    page_name varchar(255) null comment '页面名称',
    page_id varchar(255) not null comment '页面的标识，android 是取 componentName 中的 activeiy，ios 是 componentName 的值',
    component_name varchar(255) not null,
    path varchar(1000) null,
    picture varchar(255) not null comment '截图的 url',
    position varchar(255) null comment '元素的坐标',
    version varchar(255) not null comment '版本号',
    app_id varchar(255) not null,
    platform varchar(255) not null comment 'android,iOS,flutter',
    create_time timestamp default CURRENT_TIMESTAMP not null,
    update_time timestamp default '0000-00-00 00:00:00' not null on update CURRENT_TIMESTAMP,
    is_dynamic_element tinyint(1) null comment '是否是动态的元素,根据林志航的算法',
    trace_type varchar(255) null comment '埋点类型，待定',
    creator varchar(255) not null comment '上传者的名称或 user_id',
    updater varchar(255) null,
    android_ios_relation varchar(255) null comment 'android ios 关于同一个页面的对应关系',
    page_group_id varchar(255) null comment 'android和ios 同一个页面的id，只有是页面时才有值',
    page_title varchar(255) default '' null comment '页面的标题',
    full_picture varchar(255) default '' null comment '元素所属页面的截图，如果是页面，该字段为空',
    uniq_col varchar(191) as (md5(concat(`page_id`,`component_name`,if(isnull(`path`),'',`path`),`version`))) comment '用来做唯一索引',
    constraint idx_uniq_col
    unique (uniq_col)
    );

create table if not exists module
(
    id int auto_increment
    primary key,
    module_name varchar(20) default '' null,
    create_by int default 0 not null,
    update_by int default 0 not null,
    create_time timestamp default CURRENT_TIMESTAMP not null,
    update_time timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    model tinyint(1) default 0 null,
    page_order mediumblob null,
    constraint index_module_name
    unique (module_name)
    );

create table if not exists related_page
(
    id int auto_increment
    primary key,
    component_name varchar(100) null,
    version varchar(100) null,
    os varchar(100) null,
    related_pages text null,
    exec_time timestamp default CURRENT_TIMESTAMP not null,
    data_time timestamp default CURRENT_TIMESTAMP not null
    );

create index index_component_name
	on related_page (component_name);

