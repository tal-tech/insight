package com.xhb.hunter.event.demo.util

import java.lang.reflect.Field

/**
 * Created by Jacky on 2020/12/1
 */

object ReflectUtil {
    fun getAllFields(fields: MutableList<Field>, type: Class<*>, stopClazz: Class<*>? = null): List<Field> {
        fields.addAll(listOf<Field>(*type.declaredFields))

        val superClazz = type.superclass
        if (superClazz != null && superClazz != stopClazz) {
            getAllFields(fields, superClazz, stopClazz)
        }

        return fields
    }
}