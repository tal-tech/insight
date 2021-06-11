package com.xhb.hunter.library.event.core.provider;

import android.view.View;

import com.xhb.hunter.library.event.core.base.Provider;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */
public interface ButtonKeyProvider extends Provider<String, View> {

    ButtonKeyProvider EMPTY = new ButtonKeyProvider() {
        @Override
        public String provide(View view) {
            CharSequence contentDescription = view.getContentDescription();
            return contentDescription == null ? null : contentDescription.toString();
        }
    };
}
