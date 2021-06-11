package com.xhb.plugin.event

import com.android.build.api.transform.TransformException
import com.android.build.api.transform.TransformInvocation
import com.quinn.hunter.transform.HunterTransform
import com.quinn.hunter.transform.RunVariant
import com.xhb.plugin.event.bytecode.EventWeaver
import com.xhb.plugin.event.bytecode.collect.TracerPrinter
import com.xhb.plugin.event.extension.EventHunterExtension
import com.xhb.plugin.event.extension.EventTraceExtension
import org.gradle.api.Project

class EventHunterTransform extends HunterTransform {
    private final Project project
    private EventHunterExtension eventHunterExtension
    private EventTraceExtension eventTraceExtension

    EventHunterTransform(Project project) {
        super(project)

        this.project = project

        project.extensions.create("eventHunterExt", EventHunterExtension.class)
        project.eventHunterExt.extensions.create("trace", EventTraceExtension.class)
        this.bytecodeWeaver = new EventWeaver()
    }

    @Override
    void transform(TransformInvocation transformInvocation) throws TransformException, InterruptedException, IOException {
        eventHunterExtension = (EventHunterExtension) project.extensions.getByName("eventHunterExt")
        eventTraceExtension = (EventTraceExtension) project.eventHunterExt.extensions.getByName("trace")
        bytecodeWeaver.setExtension(eventHunterExtension)
        ((EventWeaver) bytecodeWeaver).setEventTraceExtension(eventTraceExtension)

        super.transform(transformInvocation)

        if (eventTraceExtension.enable) {
            TracerPrinter.startTrace(new File(eventTraceExtension.outPath))
        }
    }

    @Override
    protected RunVariant getRunVariant() {
        return eventHunterExtension.runVariant
    }

    @Override
    protected boolean inDuplcatedClassSafeMode() {
        return eventHunterExtension.duplicatedClassSafeMode
    }
}