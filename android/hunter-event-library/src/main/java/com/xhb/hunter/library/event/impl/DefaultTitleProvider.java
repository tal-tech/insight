package com.xhb.hunter.library.event.impl;

import android.app.Activity;
import android.content.Context;
import android.util.SparseArray;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;

import androidx.appcompat.app.AppCompatActivity;

import com.xhb.hunter.library.event.core.provider.TitleProvider;
import com.xhb.hunter.library.event.util.Util;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */
public class DefaultTitleProvider implements TitleProvider {

    private static final SparseArray<String> titles = new SparseArray<>();

    @Override
    public String provide(Context context) {
        Activity activity = Util.getActivity(context);
        if (activity == null) {
            return null;
        }

        final int key = activity.hashCode();
        final String value = titles.get(key);
        if (value != null) {
            return value;
        }

        final View contentView = ((ViewGroup) (activity.getWindow().getDecorView()
            .findViewById(Window.ID_ANDROID_CONTENT))).getChildAt(0);
        if (contentView == null) {
            titles.put(key, null);
            return null;
        }

        if (activity instanceof AppCompatActivity) {
            final String s = String.valueOf(activity.getTitle());
            titles.put(key, s);
            return s;
        }

        titles.put(key, null);
        return null;
    }
}
