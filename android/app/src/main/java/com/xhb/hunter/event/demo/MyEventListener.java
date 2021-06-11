package com.xhb.hunter.event.demo;

import com.xhb.hunter.library.event.impl.DefaultEventListener;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */
public class MyEventListener extends DefaultEventListener {

    @Override
    public void onActivityResume(Object obj) {
        super.onActivityResume(obj);

        // addUrl?

    }


    @Override
    public void onActivityPause(Object obj) {
        super.onActivityPause(obj);

        // removeUrl?
    }
}
