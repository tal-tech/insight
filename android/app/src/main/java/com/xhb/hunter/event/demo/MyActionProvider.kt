package com.xhb.hunter.event.demo

import android.util.Log
import com.xhb.hunter.ok.impl.model.ActionType
import com.xhb.hunter.ok.impl.model.AnAction
import com.xhb.hunter.ok.impl.base.ActionProvider

/**
 * @author yangjianfei [Contact me.](y)
 * @version 1.0
 */
class MyActionProvider : ActionProvider {


    override fun provide(anAction: AnAction): Boolean {
        Log.d("MyActionProvider", "action==>$anAction")

        when (anAction.actionType) {
            ActionType.onCreate -> {

            }
        }
        return true
    }
}