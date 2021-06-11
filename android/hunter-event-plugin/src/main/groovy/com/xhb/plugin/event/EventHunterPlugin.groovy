package com.xhb.plugin.event

import com.android.build.gradle.AppExtension
import com.google.common.base.Strings
import com.xhb.plugin.event.PluginHelper.HelpReader
import org.gradle.api.GradleException
import org.gradle.api.Plugin
import org.gradle.api.Project

class EventHunterPlugin implements Plugin<Project> {

    @Override
    void apply(Project project) {
        if (!project.plugins.hasPlugin('com.android.application')) {
            throw new GradleException('EventHunterPlugin, Android Application plugin required')
        }
        printHelper(project)

        AppExtension appExtension = (AppExtension) project.getProperties().get("android")
        appExtension.registerTransform(new EventHunterTransform(project), Collections.EMPTY_LIST)
    }

    private void printHelper(Project project) {
        def help = HelpReader.getHelper()
        System.out.println(Strings.nullToEmpty(help))
    }
}
