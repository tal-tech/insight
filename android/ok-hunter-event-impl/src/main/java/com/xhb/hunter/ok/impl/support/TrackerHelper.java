package com.xhb.hunter.ok.impl.support;

import android.content.Context;

import com.xhb.hunter.ok.impl.model.AnAction;

public class TrackerHelper {

    public static void send(final Context context, AnAction event) {
        FloatingViewService.send(context, event);
    }

    public static void stop(final Context context) {
        FloatingViewService.stop(context);
    }

}
