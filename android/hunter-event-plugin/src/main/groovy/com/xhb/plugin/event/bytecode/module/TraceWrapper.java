package com.xhb.plugin.event.bytecode.module;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Jacky on 2020-05-14
 */
public class TraceWrapper {
    public TraceClass traceClass;
    public final List<TraceMethod> traceMethods = new ArrayList<>();
}
