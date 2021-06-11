package com.xhb.plugin.event.bytecode.collect;

import com.xhb.plugin.event.bytecode.module.TraceClass;
import com.xhb.plugin.event.bytecode.module.TraceMethod;
import com.xhb.plugin.event.bytecode.module.TraceWrapper;

/**
 * Created by Jacky on 2020-05-13
 */
public final class ClassTracer {
    private final TraceWrapper wrapper = new TraceWrapper();
    private String className;

    public void visitClass(int version, int access, String name, String signature, String superName, String[] interfaces) {
        if (!isEnableTrace()) {
            return;
        }

        final String className = name.replaceAll("/", ".");
        this.className = className;
        wrapper.traceClass =
            TraceClass.create(version, access, className, signature, superName, interfaces);
    }

    public void visitMethod(int access, String name, String desc, String signature, String[] exceptions) {
        if (!isEnableTrace()) {
            return;
        }

        if (this.className == null) {
            // should not run to this
            return;
        }

        final TraceMethod traceMethod = TraceMethod.create(access, className, name, desc, signature, exceptions);
        wrapper.traceMethods.add(traceMethod);
    }

    public void visitEnd() {
        if (this.className == null) {
            return;
        }

        TracerPrinter.add(this.className, wrapper);
    }

    private boolean isEnableTrace() {
        return true;
    }
}
