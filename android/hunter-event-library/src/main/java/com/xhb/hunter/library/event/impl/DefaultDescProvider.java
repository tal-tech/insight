package com.xhb.hunter.library.event.impl;

import android.view.View;

import com.xhb.hunter.library.event.core.provider.DescProvider;
import com.xhb.hunter.library.event.util.Util;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */
public class DefaultDescProvider implements DescProvider {

    @Override
    public String provide(View view) {
        return Util.getFirstTextViewDescription(view);
    }
}
