package com.xhb.plugin.event.bytecode;


/**
 * Created by Jacky on 2020-05-13
 * 鉴别工具类
 */
public final class IdentifyObject {

    public static boolean isDirectBaseFragment(String superName) {
        return "android/app/Fragment".equals(superName)
            || "android/support/v4/app/Fragment".equals(superName)
            || "androidx/fragment/app/Fragment".equals(superName);
    }

    /**
     * 对于 Activity, 直接插桩在 Activity的子类就行了，
     * 因为对于业务代码，不是直接继承 Activity的。
     * Activity只插桩一次
     */
    public static boolean isDirectBaseActivity(String superName) {
        return "android/app/Activity".equals(superName);
    }
}
