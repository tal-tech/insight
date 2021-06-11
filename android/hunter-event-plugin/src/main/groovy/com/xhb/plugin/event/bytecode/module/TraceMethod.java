package com.xhb.plugin.event.bytecode.module;

import org.objectweb.asm.Opcodes;

import java.util.Arrays;

/**
 * Created by Jacky on 2020-05-14
 */
public class TraceMethod {
    private int accessFlag;
    private String className;
    private String methodName;
    private String desc;
    private String signature;
    private String[] exceptions;

    public static TraceMethod create(int accessFlag, String className, String methodName
        , String desc, String signature, String[] exceptions) {
        TraceMethod traceMethod = new TraceMethod();
        traceMethod.accessFlag = accessFlag;
        traceMethod.className = className.replace("/", ".");
        traceMethod.methodName = methodName;
        traceMethod.desc = desc.replace("/", ".");
        traceMethod.signature = signature;
        traceMethod.exceptions = exceptions;
        return traceMethod;
    }

    @Override
    public String toString() {
        return "TraceMethod{" +
            "accessFlag=" + accessFlag +
            ", className='" + className + '\'' +
            ", methodName='" + methodName + '\'' +
            ", desc='" + desc + '\'' +
            ", signature='" + signature + '\'' +
            ", exceptions=" + Arrays.toString(exceptions) +
            '}';
    }

    private boolean isNativeMethod() {
        return (accessFlag & Opcodes.ACC_NATIVE) != 0;
    }
}
