package com.xhb.plugin.event.bytecode.module;

import java.util.Arrays;

/**
 * Created by Jacky on 2020-05-14
 */
public final class TraceClass {
    private int version;
    private int access;
    private String name;
    private String signature;
    private String superName;
    private String[] interfaces;

    public static TraceClass create(int version, int access, String name,
                                    String signature, String superName, String[] interfaces) {
        final TraceClass traceClass = new TraceClass();
        traceClass.version = version;
        traceClass.access = access;
        traceClass.name = name;
        traceClass.signature = signature;
        traceClass.superName = superName;
        traceClass.interfaces = interfaces;

        return traceClass;
    }

    @Override
    public String toString() {
        return "TraceClass{" +
            "version=" + version +
            ", access=" + access +
            ", name='" + name + '\'' +
            ", signature='" + signature + '\'' +
            ", superName='" + superName + '\'' +
            ", interfaces=" + Arrays.toString(interfaces) +
            '}';
    }
}
