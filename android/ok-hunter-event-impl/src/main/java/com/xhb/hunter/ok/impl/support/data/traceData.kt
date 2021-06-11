package com.xhb.hunter.ok.impl.support.data

import android.view.View
import com.xhb.hunter.library.event.core.base.JsonObjectAble

/**
 * Created by Jacky on 2021/1/4
 */

const val xId = Int.MAX_VALUE - 1000

infix fun View.traceData(any: JsonObjectAble) {
    this.setTag(xId, any)
}

fun View.getTraceData(): JsonObjectAble? = this.getTag(xId) as? JsonObjectAble