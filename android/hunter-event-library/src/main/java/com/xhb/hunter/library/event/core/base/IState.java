package com.xhb.hunter.library.event.core.base;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */
public interface IState {
    void success();

    void fail();

    IState EMPTY = new IState() {
        @Override
        public void success() {

        }

        @Override
        public void fail() {

        }
    };
}
