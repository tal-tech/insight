package com.xhb.hunter.library.event.core.provider;

import android.view.View;

import com.xhb.hunter.library.event.core.base.JsonObjectAble;
import com.xhb.hunter.library.event.core.base.Provider;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */
public interface ParamsProvider extends Provider<JsonObjectAble, View> {

    ParamsProvider EMPTY = new ParamsProvider() {
        @Override
        public JsonObjectAble provide(View view) {
            return null;
        }
    };
}
