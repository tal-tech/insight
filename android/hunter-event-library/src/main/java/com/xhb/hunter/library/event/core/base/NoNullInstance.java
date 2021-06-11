package com.xhb.hunter.library.event.core.base;

import com.xhb.hunter.library.event.util.Util;

public abstract class NoNullInstance<T> {
    private T t;

    public void update(T t) {
        this.t = t;
    }

    public abstract T backup();

    public final T get() {
        synchronized (this) {
            if (t == null) {
                t = backup();
            }
            return Util.ensureNoNull(t);
        }
    }
}
