package com.xhb.hunter.ok.impl.base;

import com.xhb.hunter.library.event.core.base.Function;
import com.xhb.hunter.ok.impl.model.AnAction;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */
public interface AnActionConvert extends Function<AnAction, AnAction> {

    AnActionConvert EMPTY = anAction -> anAction;
}
