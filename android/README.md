# Hunter-Event
一个利用字节码插桩实现对常见Android常见事件接口拦截的框架，拦截支持的 [接口方法](#support_listener_list)。
同时支持 [Activity生命周期](#support_activity_list) 与 [Fragment生命周期](#support_fragment_list) 的监听。

[English](./README.md)

原理：借助gradle transfrom api，通过ASM直接操作字节码，注入指定的代码。



#### Feature

1. 插件
    - 支持插桩的动态配置详见[插件配置模块]()
    - 支持 ButterKnife 动态生成的 Click 事件
    - 支持 Activity 生命周期的插桩
    - 支持 Fragment 生命周期的插桩
    - 支持 Androidx, KotlinActivity
2. 无痕埋点，兼容业务代码埋点
3. 可视化埋点支持 （好未来-晓黑板事业部方案）
    - 见模块： ok-hunter-event-impl

---

#### Demo 下载

- [Demo apk下载-unsigned](./profiles/apk/app-no-sign-debug.apk)
- [Demo apk下载-signed-debug](./profiles/apk/app-signed-debug.apk)
- [Demo apk下载-signed-release](./profiles/apk/app-signed-release.apk)

---

## 插桩方法列表
#### <span id="support_listener_list">支持的接口列表</span>
    - View.OnClickListener
        - onClick(Landroid/view/View;)V
    - android.content.DialogInterface
        - onClick(Landroid/content/DialogInterface;I)V
    - android.widget.AdapterView.OnItemClickListener
        - onItemClick(Landroid/widget/AdapterView;Landroid/view/View;IJ)V
    - android.widget.AdapterView.OnItemSelectedListener
        - onItemSelected(Landroid/widget/AdapterView;Landroid/view/View;IJ)V
    - android.widget.ExpandableListView.OnGroupClickListener
        - onGroupClick(Landroid/widget/ExpandableListView;Landroid/view/View;IJ)Z
    - android.widget.ExpandableListView.OnChildClickListener
        - onChildClick(Landroid/widget/ExpandableListView;Landroid/view/View;IIJ)Z
    - android.widget.RatingBar.OnRatingBarChangeListener
        - onRatingChanged(Landroid/widget/RatingBar;FZ)V
    - android.widget.SeekBar.OnSeekBarChangeListener
        - onStopTrackingTouch(Landroid/widget/SeekBar;)V
    - android.widget.CompoundButton.OnCheckedChangeListener
        - onCheckedChanged(Landroid/widget/CompoundButton;Z)V
    - android.widget.RadioGroup.OnCheckedChangeListener
        - onCheckedChanged(Landroid/widget/RadioGroup;I)V

#### <span id="support_activity_list">支持的Actvitiy生命周期的列表</span>
    - onCreate(Landroid/os/Bundle;)V
    - onResume()V
    - onPause()V
    - onDestroy()V

#### <span id="support_fragment_list">支持的Fragment生命周期的列表</span>
    - onCreate(Landroid/os/Bundle;)V
    - onResume()V
    - onPause()V
    - setUserVisibleHint(Z)V
    - onHiddenChanged(Z)V
    - onDestroy()V

#### 用法

    可参照 [Demo](./app)

   ```java
    1. 配置插件
    2. 加入EventLibray,实现接口
   ```

**配置插件**

1. 在project下面的build.gradle配置集团仓库和classpath
    ```groovy
    buildscript {
        repositories {
            maven {
                url ""
                credentials {
                    username = "guest"
                    password = "xhb123"
                }
            }
        }
        dependencies {
            classpath 'com.xhb.component.hunter:hunter-event-plugin:1.0.3'
        }
    }
    ```

2. 在 application module 下面的 build.gradle

    ```groovy
    apply plugin: 'hunter-event'

    // 自定义配置插桩信息
    eventHunterExt {
        runVariant = 'ALWAYS'
        whitelist = ['*']

        trace {
            enable = true
            outPath = "${projectDir.getAbsolutePath()}/trace/trace.txt"
        }
    }
    ```

配置项说明

    ```groovy
    eventHunterExt {
        runVariant:                 // 可选参数，DEBUG;RELEASE;ALWAYS;NEVER
        duplicatedClassSafeMode:    // 是否启用重复class安全模式
        scanAllExceptBlack:         // 删除除了黑名单外对所有类，当为true的时候，忽略白名单列表
        whitelist:                  // 白名单；在whitelist只配置*值，代表，扫描所有类
        blacklist:                  // 黑名单

        trace {                     // 一般测试用
            enable: boolean         // 是否开启trace
            outPath: String         // trace输出文件路径
        }
    }
    ```

2. hunter-event-library 接入

    a. 依赖最新的版本
    ```groovy
    dependencies {
        implementation 'com.xhb.component.hunter:hunter-event-library:1.0.3'
    }
    ```

    b. 监听全局Event事件,并使用
    ```java
    EventManager.initEventListener(new EventListener() {
        @Override
        public void onClick(View view) {

        }

        @Override
        public void onClick(Object obj, DialogInterface dialogInterface, int which) {

        }

        @Override
        public void onItemClick(Object obj, AdapterView parent, View view, int position, long id) {

        }

        @Override
        public void onItemSelected(Object obj, AdapterView parent, View view, int position, long id) {

        }

        @Override
        public void onGroupClick(Object obj, ExpandableListView parent, View v, int groupPosition, long id) {

        }

        @Override
        public void onChildClick(Object obj, ExpandableListView parent, View v, int groupPosition, int childPosition, long id) {

        }

        @Override
        public void onStopTrackingTouch(Object obj, SeekBar seekBar) {

        }

        @Override
        public void onRatingChanged(Object obj, RatingBar ratingBar, float rating, boolean fromUser) {

        }

        @Override
        public void onCheckedChanged(Object obj, RadioGroup radioGroup, int checkedId) {

        }

        @Override
        public void onCheckedChanged(Object obj, CompoundButton button, boolean isChecked) {

        }

        @Override
        public void onFragmentCreate(Object obj, Bundle savedInstanceState) {

        }

        @Override
        public void onFragmentResume(Object obj) {

        }

        @Override
        public void onFragmentPause(Object obj) {

        }

        @Override
        public void setFragmentUserVisibleHint(Object obj, boolean isUserVisibleHint) {

        }

        @Override
        public void onFragmentHiddenChanged(Object fragment, boolean hidden) {

        }

        @Override
        public void onActivityCreate(Object obj, @Nullable Bundle savedInstanceState) {

        }

        @Override
        public void onActivityDestroy(Object obj) {

        }

        @Override
        public void onActivityResume(Object obj) {

        }

        @Override
        public void onActivityPause(Object obj) {

        }
    });
    ```

#### 业务数据支持
```
private const val id = Int.MAX_VALUE - 1000

infix fun View.traceData(any: JsonObjectAble) {
    this.setTag(id, any)
}

fun View.getTraceData(): JsonObjectAble? = this.getTag(id) as? JsonObjectAble
```

此操作在UI线程，所以，尽量减少序列化反序列化处理了

#### Q&A
1. 怎么查看插桩的字节码

    A: 在 `$project/build/intermediates/transforms/EventHunterTransform` 目录下有完整的插桩后字节码。
    对于第三方jar包字节码的搜索，可以通过 profiles/tools/jar-searcher.jar 工具，找到指定的 class 文件。如下
    ```
    java jar $jar-path -h   // 帮助

    The tool is intent to search file in dir or jar/zip file
    GIT URL: git@github.com:ad-ppp/JavaTools.git
    -h for helper"
    -t for search text

    The arguments are as followers:
        1) the path for dir or file
        2) the file name to be searched
        3) the path for output trace
    ```
    根据自己的需要查找 class 文件。然后通过把 class 文件用 AS 打开查看

2. 字节码没有插桩进去

    通过字节码扫描确定插桩位置，对于 lambda 表达式,在 **desugar** 方式和 **非desugar** 生成的字节码是有区别的。
    在 gralde.properties文件中 添加如下配置
    ```
    android.enableD8.desugaring=false
    ```
3. 怎么通过源码生成 ASM BYTE

    Android Studio 安装 ASM Bytecode Outline插件。 然后在code->Show Bytecode outline.