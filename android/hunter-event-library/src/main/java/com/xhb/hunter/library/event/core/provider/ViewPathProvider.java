package com.xhb.hunter.library.event.core.provider;

import android.view.View;

import com.xhb.hunter.library.event.core.base.Provider;
import com.xhb.hunter.library.event.util.Util;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 * <p>
 * fragment getter
 * 多个Fragment 用 "#" 链接
 */
public interface ViewPathProvider extends Provider<String, View> {

    ViewPathProvider EMPTY = new ViewPathProvider() {
        @Override
        public String provide(View view) {
            return Util.ensureNoNull(view).toString();
        }
    };
}
