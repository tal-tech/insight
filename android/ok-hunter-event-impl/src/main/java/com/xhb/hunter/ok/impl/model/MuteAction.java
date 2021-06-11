package com.xhb.hunter.ok.impl.model;

import com.xhb.hunter.library.event.util.Util;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */
public class MuteAction {
    private final AnAction anAction;

    /**
     * user set
     */
    private String desc;

    public MuteAction(AnAction anAction) {
        this.anAction = Util.ensureNoNull(anAction);
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public AnAction getAnAction() {
        return anAction;
    }
}
