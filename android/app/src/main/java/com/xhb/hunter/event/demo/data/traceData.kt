package com.xhb.hunter.event.demo.data;

import android.view.View

/**
 * Created by Jacky on 2021/1/4
 */

private const val id = Int.MAX_VALUE - 1000

infix fun View.traceData(any: JsonObjectAble) {
    this.setTag(id, any)
}

fun View.getTraceData(): JsonObjectAble? = this.getTag(id) as? JsonObjectAble