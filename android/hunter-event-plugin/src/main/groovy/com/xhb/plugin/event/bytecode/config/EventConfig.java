package com.xhb.plugin.event.bytecode.config;

import com.xhb.plugin.event.bytecode.module.MethodCell;

import org.objectweb.asm.Opcodes;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Jacky on 2020-05-14
 */
public class EventConfig {
    public static final String PLUGIN_LIBRARY = "com.xhb.hunter.library.event";

    // owner 千万不要写错哦
    public static final String PLUGIN_OWNER = "com/xhb/hunter/library/event/EventManager";
    public static final String PLUGIN_OWNER_SHOULD_STOP_ACTION = "shouldStopAction";
    public static final String PLUGIN_OWNER_SHOULD_STOP_ACTION_DESC = "()Z";
    public static final String PLUGIN_LISTENER_OWNER = "com/xhb/hunter/library/event/EventListener";
    public static final String PLUGIN_DEFAULT_LISTENER = "com/xhb/hunter/library/event/impl/DefaultEventListener";

    public final static Map<String, MethodCell> sInterfaceMethods = new HashMap<>();
    public final static Map<String, MethodCell> sFragmentMethods = new HashMap<>();
    public final static Map<String, MethodCell> sActivityMethods = new HashMap<>();

    static {
        // 监听
        //butterKnife 8.0+ 支持 -> ext onClickListener -> DebounceOnClickListener
        sInterfaceMethods.put("doClick(Landroid/view/View;)V", new MethodCell(
            "doClick",
            "(Landroid/view/View;)V",
            "android/view/View$OnClickListener",
            "onClick",
            "(Landroid/view/View;)V",
            1, 1, Collections.singletonList(Opcodes.ALOAD)));
        sInterfaceMethods.put("onClick(Landroid/view/View;)V", new MethodCell(
            "onClick",
            "(Landroid/view/View;)V",
            "android/view/View$OnClickListener",
            "onClick",
            "(Landroid/view/View;)V",
            1, 1,
            Collections.singletonList(Opcodes.ALOAD)));
        sInterfaceMethods.put("onClick(Landroid/content/DialogInterface;I)V", new MethodCell(
            "onClick",
            "(Landroid/content/DialogInterface;I)V",
            "android/content/DialogInterface$OnClickListener",
            "onClick",
            "(Ljava/lang/Object;Landroid/content/DialogInterface;I)V",
            0, 3,
            Arrays.asList(Opcodes.ALOAD, Opcodes.ALOAD, Opcodes.ILOAD)));
        sInterfaceMethods.put("onItemClick(Landroid/widget/AdapterView;Landroid/view/View;IJ)V", new MethodCell(
            "onItemClick",
            "(Landroid/widget/AdapterView;Landroid/view/View;IJ)V",
            "android/widget/AdapterView$OnItemClickListener",
            "onItemClick",
            "(Ljava/lang/Object;Landroid/widget/AdapterView;Landroid/view/View;IJ)V",
            0, 5,
            Arrays.asList(Opcodes.ALOAD, Opcodes.ALOAD, Opcodes.ALOAD, Opcodes.ILOAD, Opcodes.LLOAD)));
        sInterfaceMethods.put("onItemSelected(Landroid/widget/AdapterView;Landroid/view/View;IJ)V", new MethodCell(
            "onItemSelected",
            "(Landroid/widget/AdapterView;Landroid/view/View;IJ)V",
            "android/widget/AdapterView$OnItemSelectedListener",
            "onItemSelected",
            "(Ljava/lang/Object;Landroid/widget/AdapterView;Landroid/view/View;IJ)V",
            0, 5,
            Arrays.asList(Opcodes.ALOAD, Opcodes.ALOAD, Opcodes.ALOAD, Opcodes.ILOAD, Opcodes.LLOAD)));
        sInterfaceMethods.put("onGroupClick(Landroid/widget/ExpandableListView;Landroid/view/View;IJ)Z", new MethodCell(
            "onGroupClick",
            "(Landroid/widget/ExpandableListView;Landroid/view/View;IJ)Z",
            "android/widget/ExpandableListView$OnGroupClickListener",
            "onGroupClick",
            "(Ljava/lang/Object;Landroid/widget/ExpandableListView;Landroid/view/View;IJ)V",
            0, 5,
            Arrays.asList(Opcodes.ALOAD, Opcodes.ALOAD, Opcodes.ALOAD, Opcodes.ILOAD, Opcodes.LLOAD)));
        sInterfaceMethods.put("onChildClick(Landroid/widget/ExpandableListView;Landroid/view/View;IIJ)Z", new MethodCell(
            "onChildClick",
            "(Landroid/widget/ExpandableListView;Landroid/view/View;IIJ)Z",
            "android/widget/ExpandableListView$OnChildClickListener",
            "onChildClick",
            "(Ljava/lang/Object;Landroid/widget/ExpandableListView;Landroid/view/View;IIJ)V",
            0, 6,
            Arrays.asList(Opcodes.ALOAD, Opcodes.ALOAD, Opcodes.ALOAD, Opcodes.ILOAD, Opcodes.ILOAD, Opcodes.LLOAD)))
        ;
        sInterfaceMethods.put("onRatingChanged(Landroid/widget/RatingBar;FZ)V", new MethodCell(
            "onRatingChanged",
            "(Landroid/widget/RatingBar;FZ)V",
            "android/widget/RatingBar$OnRatingBarChangeListener",
            "onRatingChanged",
            "(Ljava/lang/Object;Landroid/widget/RatingBar;FZ)V",
            0, 4,
            Arrays.asList(Opcodes.ALOAD, Opcodes.ALOAD, Opcodes.FLOAD, Opcodes.ILOAD)));
        sInterfaceMethods.put("onStopTrackingTouch(Landroid/widget/SeekBar;)V", new MethodCell(
            "onStopTrackingTouch",
            "(Landroid/widget/SeekBar;)V",
            "android/widget/SeekBar$OnSeekBarChangeListener",
            "onStopTrackingTouch",
            "(Ljava/lang/Object;Landroid/widget/SeekBar;)V",
            0, 2,
            Arrays.asList(Opcodes.ALOAD, Opcodes.ALOAD)));
        sInterfaceMethods.put("onCheckedChanged(Landroid/widget/CompoundButton;Z)V", new MethodCell(
            "onCheckedChanged",
            "(Landroid/widget/CompoundButton;Z)V",
            "android/widget/CompoundButton$OnCheckedChangeListener",
            "onCheckedChanged",
            "(Ljava/lang/Object;Landroid/widget/CompoundButton;Z)V",
            0, 3,
            Arrays.asList(Opcodes.ALOAD, Opcodes.ALOAD, Opcodes.ILOAD)));
        sInterfaceMethods.put("onCheckedChanged(Landroid/widget/RadioGroup;I)V", new MethodCell(
            "onCheckedChanged",
            "(Landroid/widget/RadioGroup;I)V",
            "android/widget/RadioGroup$OnCheckedChangeListener",
            "onCheckedChanged",
            "(Ljava/lang/Object;Landroid/widget/RadioGroup;I)V",
            0, 3,
            Arrays.asList(Opcodes.ALOAD, Opcodes.ALOAD, Opcodes.ILOAD)));


        // fragment
        sFragmentMethods.put("onCreate(Landroid/os/Bundle;)V", new MethodCell(
            "onCreate",
            "(Landroid/os/Bundle;)V",
            "",             // parent省略，均为 android/app/Fragment 或 android/support/v4/app/Fragment;
            "onFragmentCreate",
            "(Ljava/lang/Object;Landroid/os/Bundle;)V",
            0, 2,
            Arrays.asList(Opcodes.ALOAD, Opcodes.ALOAD)));
        sFragmentMethods.put("onResume()V", new MethodCell(
            "onResume",
            "()V",
            "",// parent省略，均为 android/app/Fragment 或 android/support/v4/app/Fragment;
            "onFragmentResume",
            "(Ljava/lang/Object;)V",
            0, 1,
            Collections.singletonList(Opcodes.ALOAD)));
        sFragmentMethods.put("onPause()V", new MethodCell(
            "onPause",
            "()V",
            "",
            "onFragmentPause",
            "(Ljava/lang/Object;)V",
            0, 1,
            Collections.singletonList(Opcodes.ALOAD)));
        sFragmentMethods.put("setUserVisibleHint(Z)V", new MethodCell(
            "setUserVisibleHint",
            "(Z)V",
            "",// parent省略，均为 android/app/Fragment 或 android/support/v4/app/Fragment;
            "setFragmentUserVisibleHint",
            "(Ljava/lang/Object;Z)V",
            0, 2,
            Arrays.asList(Opcodes.ALOAD, Opcodes.ILOAD)));
        sFragmentMethods.put("onHiddenChanged(Z)V", new MethodCell(
            "onHiddenChanged",
            "(Z)V",
            "",
            "onFragmentHiddenChanged",
            "(Ljava/lang/Object;Z)V",
            0, 2,
            Arrays.asList(Opcodes.ALOAD, Opcodes.ILOAD)));
        sFragmentMethods.put("onDestroy()V", new MethodCell(
            "onDestroy",
            "()V",
            "",
            "onFragmentDestroy",
            "(Ljava/lang/Object;)V",
            0, 1,
            Collections.singletonList(Opcodes.ALOAD)));

        // activity
        sActivityMethods.put("onCreate(Landroid/os/Bundle;)V", new MethodCell(
            "onCreate",
            "(Landroid/os/Bundle;)V",
            "",             // parent省略，均为 android/app/Fragment 或 android/support/v4/app/Fragment;
            "onActivityCreate",
            "(Ljava/lang/Object;Landroid/os/Bundle;)V",
            0, 2,
            Arrays.asList(Opcodes.ALOAD, Opcodes.ALOAD)));
        sActivityMethods.put("onResume()V", new MethodCell(
            "onResume",
            "()V",
            "",             // parent省略，均为 android/app/Fragment 或 android/support/v4/app/Fragment;
            "onActivityResume",
            "(Ljava/lang/Object;)V",
            0, 1,
            Collections.singletonList(Opcodes.ALOAD)));
        sActivityMethods.put("onPause()V", new MethodCell(
            "onPause",
            "()V",
            "",
            "onActivityPause",
            "(Ljava/lang/Object;)V",
            0, 1,
            Collections.singletonList(Opcodes.ALOAD)));
        sActivityMethods.put("onDestroy()V", new MethodCell(
            "onDestroy",
            "()V",
            "",
            "onActivityDestroy",
            "(Ljava/lang/Object;)V",
            0, 1,
            Collections.singletonList(Opcodes.ALOAD)));
    }

}
