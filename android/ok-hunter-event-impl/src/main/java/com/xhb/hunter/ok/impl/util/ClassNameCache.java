package com.xhb.hunter.ok.impl.util;

import android.util.LruCache;

public class ClassNameCache extends LruCache<Class<?>, String> {
    public ClassNameCache(int maxSize) {
        super(maxSize);
    }

    @Override
    protected String create(Class<?> klass) {
        return klass.getCanonicalName();
    }
}
