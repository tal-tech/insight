# 说明
此插件用于插桩Event信息，配合 hunter-event-library使用

hunter-event is a

## 原理介绍


#### [插件配置及说明](./src/main/resources/plugin.helper)
- 包含了Trace class和method的日志功能。

#### 发布及注意点
- 修改 lib-config.gradle 中的 'LIB_VERSION' 值
- 运行脚本 deploy.sh. 此处注意 jdk版本为1.8，因为用jdk12版本编译的时候出现了错误如下：
```java
com/xhb/plugin/event/EventHunterPlugin has been compiled by a more recent version of the Java Runtime (class file version 56.0), this version of the Java Runtime only recognizes class file versions up to 52.0
```

---

List of Java class file format major version numbers
- Java 1.2 uses major version 46
- Java 1.3 uses major version 47
- Java 1.4 uses major version 48
- Java 5 uses major version 49
- Java 6 uses major version 50
- Java 7 uses major version 51
- Java 8 uses major version 52
- Java 9 uses major version 53
- Java 10 uses major version 54
- Java 11 uses major version 55
- Java 12 uses major version 56
- Java 13 uses major version 57
- Java 14 uses major version 58

---