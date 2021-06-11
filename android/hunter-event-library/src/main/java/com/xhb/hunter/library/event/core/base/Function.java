package com.xhb.hunter.library.event.core.base;

import androidx.annotation.NonNull;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 *
 * A functional interface that takes a value and returns another value, possibly with a
 * different type and allows throwing a checked exception.
 *
 * @param <T> the input value type
 * @param <R> the output value type
 */
public interface Function<T, R> {
    /**
     * Apply some calculation to the input value and return some other value.
     *
     * @param t the input value
     * @return the output value
     * @throws Exception on error
     */
    R apply(@NonNull T t) throws Exception;
}
