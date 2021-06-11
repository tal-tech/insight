package com.xhb.hunter.library.event.core.visual;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */
public interface VisualSetting {
    boolean isOpen();

    VisualSetting EMPTY = new VisualSetting() {
        @Override
        public boolean isOpen() {
            return true;
        }
    };

}