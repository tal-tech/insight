package com.xhb.plugin.event.bytecode;

import com.xhb.plugin.event.bytecode.collect.ClassTracer;
import com.xhb.plugin.event.bytecode.collect.TracerPrinter;
import com.xhb.plugin.event.bytecode.config.EventConfig;
import com.xhb.plugin.event.bytecode.module.MethodCell;
import com.xhb.plugin.event.bytecode.module.TraceClass;
import com.xhb.plugin.event.extension.EventHunterExtension;
import com.xhb.plugin.event.extension.EventTraceExtension;

import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.Label;
import org.objectweb.asm.MethodVisitor;
import org.objectweb.asm.Opcodes;

import java.io.File;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 注意点：
 * 1. 对于 Fragment
 * 插桩直接继承 android/app/Fragment;android/support/v4/app/Fragment;androidx/fragment/app/Fragment
 * 类的子类Fragment
 * <p>
 * 2. 对于 Activity
 * 直接插桩继承 android/app/Activity 的子类就行了
 */
public class EventClassAdapter extends ClassVisitor implements Opcodes {
    private final EventHunterExtension eventHunterExtension;
    private final EventTraceExtension eventTraceExtension;
    private String name;
    private String superName;
    private boolean isABSClass = false;
    private boolean isInheritFromEventListener = false;
    private Map<String, MethodCell> baseLifeCircleMap;
    private boolean isBaseActivity;
    private boolean isBaseFragment;

    EventClassAdapter(ClassVisitor classVisitor,
                      EventHunterExtension eventHunterExtension,
                      EventTraceExtension eventTraceExtension) {
        super(Opcodes.ASM5, eventTraceExtension.enable ? new TraceVisitor(classVisitor) : classVisitor);
        this.eventHunterExtension = eventHunterExtension;
        this.eventTraceExtension = eventTraceExtension;
    }

    @Override
    public void visit(int version, int access, String name, String signature, String superName,
                      String[] interfaces) {
        this.name = name;
        this.superName = superName;
        this.isBaseActivity = IdentifyObject.isDirectBaseActivity(superName);
        this.isBaseFragment = IdentifyObject.isDirectBaseFragment(superName);
        this.isInheritFromEventListener = Arrays.toString(interfaces)
            .contains(EventConfig.PLUGIN_LISTENER_OWNER) ||
            superName.equals(EventConfig.PLUGIN_DEFAULT_LISTENER);

        if ((access & Opcodes.ACC_ABSTRACT) > 0 || (access & Opcodes.ACC_INTERFACE) > 0) {
            this.isABSClass = true;
        }
        if (isBaseActivity) {
            baseLifeCircleMap = new HashMap<>(EventConfig.sActivityMethods);
        }
        if (isBaseFragment) {
            baseLifeCircleMap = new HashMap<>(EventConfig.sFragmentMethods);
        }
        super.visit(version, access, name, signature, superName, interfaces);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name, String desc, String signature,
                                     String[] exceptions) {
        MethodVisitor mv = cv.visitMethod(access, name, desc, signature, exceptions);
        if (isInheritFromEventListener || isABSClass) {
            return mv;
        }

        if (mv == null) {
            return null;
        }

        final String key = name + desc;
        // 1. visit event
        if (EventConfig.sInterfaceMethods.containsKey(key)) {
            final MethodCell methodCell = EventConfig.sInterfaceMethods.get(key);
            return new EventInterfaceMethodVisitor(mv, methodCell, eventTraceExtension);
        }

        // visit Fragment
        MethodCell lifeMethodCell = null;
        if (isBaseFragment && EventConfig.sFragmentMethods.containsKey(key)) {
            lifeMethodCell = EventConfig.sFragmentMethods.get(key);
        }

        // visit Activity
        if (isBaseActivity && EventConfig.sActivityMethods.containsKey(key)) {
            lifeMethodCell = EventConfig.sActivityMethods.get(key);
        }

        if (lifeMethodCell != null) {
            return new LifeComponentMethodVisitor(key, mv, lifeMethodCell);
        }

        return mv;
    }

    @Override
    public void visitEnd() {
        super.visitEnd();

        if (isBaseActivity || isBaseFragment) {
            if (baseLifeCircleMap != null && !baseLifeCircleMap.isEmpty()) {
                // insert method not override by baseActivity
                for (MethodCell value : baseLifeCircleMap.values()) {
                    insertMethod(cv, superName, value);
                }
            }
        }
    }

    private class LifeComponentMethodVisitor extends MethodVisitor implements Opcodes {
        private final MethodCell methodCell;
        private final String key;

        LifeComponentMethodVisitor(String key, MethodVisitor mv, MethodCell methodCell) {
            super(Opcodes.ASM5, mv);
            this.key = key;
            this.methodCell = methodCell;
        }

        @Override
        public void visitInsn(int opcode) {
            // 确保super.onHiddenChanged(hidden);等先被调用;
            if (opcode == RETURN) {
                if (baseLifeCircleMap != null) {
                    baseLifeCircleMap.remove(key);
                }

                visitMethodWithLoadedParams(mv, Opcodes.INVOKESTATIC,
                    EventConfig.PLUGIN_OWNER, methodCell.getAgentName(),
                    methodCell.getAgentDesc(), methodCell.getParamsStart(),
                    methodCell.getParamsCount(), methodCell.getOpcodes());
            }
            super.visitInsn(opcode);
        }
    }

    private static class EventInterfaceMethodVisitor extends MethodVisitor {
        private final MethodCell methodCell;
        private final EventTraceExtension eventTraceExtension;

        EventInterfaceMethodVisitor(MethodVisitor mv, MethodCell methodCell, EventTraceExtension eventTraceExtension) {
            super(Opcodes.ASM5, mv);
            this.methodCell = methodCell;
            this.eventTraceExtension = eventTraceExtension;
        }

        @Override
        public void visitCode() {
            if (eventTraceExtension.canStopAction && methodCell.getDesc().endsWith(")V")) { // ExpandableListView return boolean
                mv.visitMethodInsn(Opcodes.INVOKESTATIC,
                    EventConfig.PLUGIN_OWNER, EventConfig.PLUGIN_OWNER_SHOULD_STOP_ACTION,
                    EventConfig.PLUGIN_OWNER_SHOULD_STOP_ACTION_DESC, false);
                Label action = new Label();
                mv.visitJumpInsn(Opcodes.IFEQ, action);
                visitInsn(Opcodes.RETURN);
                mv.visitLabel(action);
            }
            super.visitCode();
        }

        @Override
        public void visitInsn(int opcode) {
            // add click event at the end of method
            if (opcode == RETURN) {
                visitMethodWithLoadedParams(mv, Opcodes.INVOKESTATIC,
                    EventConfig.PLUGIN_OWNER, methodCell.getAgentName(),
                    methodCell.getAgentDesc(), methodCell.getParamsStart(),
                    methodCell.getParamsCount(), methodCell.getOpcodes());
            }
            super.visitInsn(opcode);
        }
    }

    private static class TraceVisitor extends ClassVisitor {
        private final ClassTracer classTracer = new ClassTracer();

        TraceVisitor(ClassVisitor cv) {
            super(Opcodes.ASM5, cv);
        }

        @Override
        public void visit(int version, int access, String name, String signature, String superName,
                          String[] interfaces) {
            classTracer.visitClass(version, access, name, signature, superName, interfaces);
            super.visit(version, access, name, signature, superName, interfaces);
        }

        @Override
        public MethodVisitor visitMethod(int access, String name, String desc, String signature,
                                         String[] exceptions) {
            classTracer.visitMethod(access, name, desc, signature, exceptions);
            return super.visitMethod(access, name, desc, signature, exceptions);
        }

        @Override
        public void visitEnd() {
            classTracer.visitEnd();
            super.visitEnd();
        }
    }

    private static void visitMethodWithLoadedParams(MethodVisitor methodVisitor, int opcode,
                                                    String owner, String methodName, String methodDesc,
                                                    int start, int count, List<Integer> paramOpcodes) {
        for (int i = start; i < start + count; i++) {
            methodVisitor.visitVarInsn(paramOpcodes.get(i - start), i);
        }
        methodVisitor.visitMethodInsn(opcode, owner, methodName, methodDesc, false);
    }

    private static void insertMethod(ClassVisitor cv, String superName,
                                     MethodCell methodCell) {
        MethodVisitor mv = cv.visitMethod(Opcodes.ACC_PROTECTED, methodCell.getName()
            , methodCell.getDesc(), null, null);
        mv.visitCode();
        // call super
        visitMethodWithLoadedParams(mv, Opcodes.INVOKESPECIAL, superName, methodCell.getName(),
            methodCell.getDesc(), methodCell.getParamsStart()
            , methodCell.getParamsCount(), methodCell.getOpcodes());
        // call injected method
        visitMethodWithLoadedParams(mv, Opcodes.INVOKESTATIC, EventConfig.PLUGIN_OWNER
            , methodCell.getAgentName(), methodCell.getAgentDesc(), methodCell.getParamsStart()
            , methodCell.getParamsCount(), methodCell.getOpcodes());
        mv.visitInsn(Opcodes.RETURN);
        mv.visitMaxs(methodCell.getParamsCount(), methodCell.getParamsCount());
        mv.visitEnd();
    }
}
