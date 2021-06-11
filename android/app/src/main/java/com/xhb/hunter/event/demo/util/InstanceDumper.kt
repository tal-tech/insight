package com.xhb.hunter.event.demo.util

/**
 * Created by Jacky on 2020/12/2
 */

class FNode(name: String, value: Any?) {
    var parent: FNode? = null
    var next: FNode? = null
}

object InstanceDumper {

//    fun dump(any: Any, stopClazz: Class<*>, filters: List<String>? = null): List<FNode> {
//        val nodes = ArrayList<FNode>()
//        val fields = ReflectUtil.getAllFields(LinkedList(), any.javaClass, stopClazz)
//        for (f in fields) {
//            if (Modifier.isStatic(f.modifiers)) {
//                continue
//            }
//
//            try {
//                f.isAccessible = true
//                val value = f.get(any) ?: continue
//
//                val fieldName: String = f.name
//                if (fieldName.startsWith("shadow$") ||
//                    (filters != null && filters.contains(fieldName))) {
//                    continue
//                }
//
//                val fNode = FNode(f.name, value)
//                val type = f.type
//                if (type == stopClazz) {
//                    break
//                }
//            } catch (e: Exception) {
//                e.printStackTrace()
//            }
//        }
//        return nodes
//    }
//
//    private fun dumpInner(parent: FNode?, fields:): List<FNode> {
//
//    }
}