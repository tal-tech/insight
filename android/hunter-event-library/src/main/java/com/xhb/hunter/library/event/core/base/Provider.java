package com.xhb.hunter.library.event.core.base;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */
public interface Provider<T,R> {
    T provide(R r);
}
