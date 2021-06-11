package com.xhb.hunter.ok.impl.util;

import android.content.ClipData;
import android.content.Context;

import static android.content.Context.CLIPBOARD_SERVICE;

public class ClipboardUtils {
    private final static String CLIPBOARD_LABEL = "label";

    @SuppressWarnings("deprecation")
    public static void textCopy(Context context, String message) {
        int currentApiVersion = android.os.Build.VERSION.SDK_INT;
        if (currentApiVersion >= android.os.Build.VERSION_CODES.HONEYCOMB) {
            android.content.ClipboardManager clipboard = (android.content.ClipboardManager) context.getSystemService(CLIPBOARD_SERVICE);
            ClipData clip = ClipData.newPlainText(CLIPBOARD_LABEL, message);
            if (clipboard != null) {
                clipboard.setPrimaryClip(clip);
            }
        } else {
            android.text.ClipboardManager clipboard = (android.text.ClipboardManager) context.getSystemService(CLIPBOARD_SERVICE);
            if (clipboard != null) {
                clipboard.setText(message);
            }
        }
    }
}
