package com.xhb.hunter.event.demo


/**
 * Created by Jacky on 2020/11/30
 */


class Person(private val name: String) {
    var age: Int = 10
    private var children: MutableList<Person>? = null

    fun addChild(p: Person) {
        if (children == null) {
            children = ArrayList()
        }
        children?.add(p)
    }
}