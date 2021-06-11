package com.xhb.hunter.event.demo;

import android.app.Application;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import androidx.annotation.Nullable;

import com.xhb.hunter.event.demo.data.JsonObjectAble;
import com.xhb.hunter.event.demo.data.TraceDataKt;
import com.xhb.hunter.library.event.EventInitializer;
import com.xhb.hunter.library.event.core.visual.VisualSetting;
import com.xhb.hunter.library.event.impl.DefaultEventListener;
import com.xhb.hunter.ok.impl.AnOkEventListener;
import com.xhb.hunter.ok.impl.provider.OkFragmentPathProvider;
import com.xhb.hunter.ok.impl.provider.OkParamsProvider;
import com.xhb.hunter.ok.impl.provider.OkViewPathProvider;

/**
 * Created by Jacky on 2020-05-14
 */
public class MyApplication extends Application {
    public static boolean isOpen = false;

    @Override
    public void onCreate() {
        super.onCreate();

        final DefaultEventListener loggerEvent = new DefaultEventListener() {

            @Override
            public void onActivityCreate(Object obj, @Nullable Bundle savedInstanceState) {
                super.onActivityCreate(obj, savedInstanceState);

                log("onActivityCreate:" + obj.getClass().getSimpleName());
            }

            @Override
            public void onActivityResume(Object obj) {
                super.onActivityResume(obj);

                log("onActivityResume:" + obj.getClass().getSimpleName());
            }

            @Override
            public void onActivityPause(Object obj) {
                super.onActivityPause(obj);

                log("onActivityPause:" + obj.getClass().getSimpleName());
            }

            @Override
            public void onActivityDestroy(Object obj) {
                super.onActivityDestroy(obj);

                log("onActivityDestroy:" + obj.getClass().getSimpleName());
            }

            @Override
            public void onClick(View view) {
                log("onClick view");
                final JsonObjectAble traceData = TraceDataKt.getTraceData(view);
                if (traceData != null) {
                    log("business data:" + traceData.toJsonObject().toString());
                }
            }

            @Override
            public void onFragmentCreate(Object obj, Bundle savedInstanceState) {
                super.onFragmentCreate(obj, savedInstanceState);
                log("onFragmentCreate:" + obj.getClass().getSimpleName());
            }

            @Override
            public void onFragmentResume(Object obj) {
                super.onFragmentResume(obj);
                log("onFragmentResume:" + obj.getClass().getSimpleName());
            }

            @Override
            public void onFragmentPause(Object obj) {
                super.onFragmentPause(obj);
                log("onFragmentPause:" + obj.getClass().getSimpleName());
            }

            @Override
            public void onFragmentHiddenChanged(Object fragment, boolean hidden) {
                super.onFragmentHiddenChanged(fragment, hidden);
                log("onFragmentHiddenChanged:" + fragment.getClass().getSimpleName() + "\thidden:" + hidden);
            }

            @Override
            public void setFragmentUserVisibleHint(Object obj, boolean isUserVisibleHint) {
                super.setFragmentUserVisibleHint(obj, isUserVisibleHint);
                log("setFragmentUserVisibleHint:" + obj.getClass().getSimpleName() + "\tisUserVisibleHint:" + isUserVisibleHint);
            }
        };

        final AnOkEventListener instance = AnOkEventListener.getInstance();
        instance.setOnPreShow((anAction, view, aBoolean, state) -> {
            Log.d("MyApplication", String.format("preShow[%s;%b]", anAction.toString(), aBoolean));
            return true;
        });
        instance.setAnActionConverter(anAction -> {
            Log.d("MyApplication", String.format("converter[%s]", anAction));
            return anAction;
        });
        final EventInitializer initializer = new EventInitializer.Builder(this)
            .addEventListener(loggerEvent)
            .addEventListener(instance)
            .setVisualSetting(new MyVisualSetting())
            .setParamsProvider(new OkParamsProvider())
            .setFragmentPathProvider(new OkFragmentPathProvider())
            .setViewPathProvider(new OkViewPathProvider())
            .build();
        EventInitializer.init(initializer);
    }

    private void log(String msg) {
        Log.d("MyApplication", msg);
    }

    private static class MyVisualSetting implements VisualSetting {

        @Override
        public boolean isOpen() {
            return isOpen;
        }

    }
}
