package com.xhb.hunter.library.event.core.base;

public abstract class LazyInstance<T> {
    private T instance;

    public abstract T create();

    public final T get() {
        synchronized (this) {
            if (instance == null) {
                instance = create();
            }
            return instance;
        }
    }
}
