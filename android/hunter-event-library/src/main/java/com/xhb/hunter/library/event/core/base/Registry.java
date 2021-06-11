package com.xhb.hunter.library.event.core.base;

import androidx.annotation.NonNull;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */
public class Registry<T> {
    private Set<T> listeners;

    @NonNull
    protected Set<T> getListeners() {
        if (listeners == null) {
            listeners = Collections.synchronizedSet(new HashSet<T>());
        }
        return listeners;
    }

    public void addListener(T listener) {
        getListeners().add(listener);
    }

    public boolean removeListener(T listener) {
        return getListeners().remove(listener);
    }

    public void apply(Registry<T> other){
        for (T listener : getListeners()) {
            other.addListener(listener);
        }
    }

}
