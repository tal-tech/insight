package com.xhb.hunter.ok.impl.base;

import android.view.View;

import com.xhb.hunter.library.event.core.base.Function4;
import com.xhb.hunter.library.event.core.base.IState;
import com.xhb.hunter.ok.impl.model.AnAction;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 * <p>
 * View
 * Boolean : auto or not
 */
public interface OnPreShow extends Function4<AnAction, View, Boolean, IState, Boolean> {
    OnPreShow EMPTY = (anAction, view, b, state) -> true;
}
