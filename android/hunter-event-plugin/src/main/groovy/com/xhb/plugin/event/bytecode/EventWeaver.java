package com.xhb.plugin.event.bytecode;

import com.quinn.hunter.transform.asm.BaseWeaver;
import com.xhb.plugin.event.bytecode.config.EventConfig;
import com.xhb.plugin.event.extension.EventHunterExtension;
import com.xhb.plugin.event.extension.EventTraceExtension;

import org.objectweb.asm.ClassVisitor;
import org.objectweb.asm.ClassWriter;

import java.util.List;

public class EventWeaver extends BaseWeaver {
    private EventHunterExtension eventHunterExtension;
    private EventTraceExtension eventTraceExtension = new EventTraceExtension();

    @Override
    public void setExtension(Object extension) {
        if (extension == null) return;
        this.eventHunterExtension = (EventHunterExtension) extension;
    }

    public void setEventTraceExtension(Object extension) {
        if (extension != null) {
            this.eventTraceExtension = (EventTraceExtension) extension;
        }
    }

    @Override
    public boolean isWeavableClass(String fullQualifiedClassName) {
        final boolean superResult = super.isWeavableClass(fullQualifiedClassName);
        boolean isByteCodePlugin = fullQualifiedClassName.startsWith(EventConfig.PLUGIN_LIBRARY);


        if (eventHunterExtension != null) {
            if (eventHunterExtension.scanAllExceptBlack) {
                boolean inBlackList = startWithCollections(eventHunterExtension.blacklist
                    , fullQualifiedClassName);
                return superResult && !isByteCodePlugin && !inBlackList;
            }


            boolean inWhiteList = true;
            boolean inBlackList = false;
            if (!eventHunterExtension.whitelist.isEmpty()) {
                inWhiteList = startWithCollections(eventHunterExtension.whitelist, fullQualifiedClassName);
            }
            if (!eventHunterExtension.blacklist.isEmpty()) {
                inBlackList = startWithCollections(eventHunterExtension.blacklist, fullQualifiedClassName);
            }
            return inWhiteList && !inBlackList && superResult && !isByteCodePlugin;
        }
        return superResult && !isByteCodePlugin;
    }

    private boolean startWithCollections(List<String> list, String fullQualifiedClassName) {
        for (String s : list) {
            if (fullQualifiedClassName.startsWith(s)) {
                return true;
            }
        }
        return false;
    }

    @Override
    protected ClassVisitor wrapClassWriter(ClassWriter classWriter) {
        return new EventClassAdapter(classWriter, eventHunterExtension, eventTraceExtension);
    }
}
