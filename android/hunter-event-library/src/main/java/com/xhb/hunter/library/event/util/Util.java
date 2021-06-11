package com.xhb.hunter.library.event.util;

import android.app.Activity;
import android.content.Context;
import android.content.ContextWrapper;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.io.Closeable;
import java.io.IOException;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */
public class Util {
    private static void checkNoNull(Object object, String msg) {
        if (object == null) {
            throw new NullPointerException();
        }
    }

    public static <T> T ensureNoNull(T t) {
        checkNoNull(t, "object must not be null");
        return t;
    }

    public static <T> T ensureNoNull(T t, String msg) {
        checkNoNull(t, msg);
        return t;
    }

    public static Activity getActivity(Context context) {
        if (context == null) {
            return null;
        } else if (context instanceof ContextWrapper) {
            if (context instanceof Activity) {
                return (Activity) context;
            } else {
                return getActivity(((ContextWrapper) context).getBaseContext());
            }
        }

        return null;
    }

    @NonNull
    public static String getFirstTextViewDescription(View view) {
        TextView firstTextView = getFirstTextView(view);
        if (firstTextView == null) {
            final ViewParent parent = view.getParent();
            if (parent instanceof View) {
                firstTextView = getFirstTextView((View) parent);
            }
        }
        return firstTextView != null ? firstTextView.getText().toString() : "";
    }

    @Nullable
    private static TextView getFirstTextView(View view) {
        if (view instanceof TextView) {
            return (TextView) view;
        }

        if (view instanceof ViewGroup) {
            ViewGroup viewGroup = (ViewGroup) view;
            for (int i = 0; i < viewGroup.getChildCount(); i++) {
                View childAt = viewGroup.getChildAt(i);
                if (childAt instanceof TextView) {
                    return (TextView) childAt;
                }

                if (childAt instanceof ViewGroup) {
                    return getFirstTextView(childAt);
                }
            }
        }

        return null;
    }

    public static void closeQuietly(Closeable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException ignore) {
            }
        }
    }
}
