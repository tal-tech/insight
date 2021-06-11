package com.xhb.hunter.ok.impl.provider;

import android.view.View;

import com.xhb.hunter.library.event.core.provider.ViewPathProvider;
import com.xhb.hunter.ok.impl.AnOkEventListener;
import com.xhb.hunter.ok.impl.util.PathUtil;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */
public class OkViewPathProvider implements ViewPathProvider {

    @Override
    public String provide(View view) {
        return PathUtil.getViewPath(view, AnOkEventListener.getInstance().sAliveFragMap);
    }

}
