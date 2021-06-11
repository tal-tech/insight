package com.xhb.hunter.event.demo

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.Toast
import com.xhb.hunter.event.demo.data.TraceData
import com.xhb.hunter.event.demo.data.traceData

/**
 * Created by Jacky on 2020/6/2
 */
private val activityFieldFilters = mutableListOf(
    "_${'$'}_findViewCache"
)

class KotlinActivity : BaseActivity() {
    private var person = Person("jacky")
    private val name = "alice"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        person.age = 40
        person.addChild(Person("child-1").apply {
            age = 5
        })
        setContentView(Button(this).apply {
            this.setOnClickListener {
                it.traceData(TraceData.Builder()
                    .put("age", 100)
                    .put("child", person)
                    .put("manager", true)
                    .put("level", LEVEL.low)
                    .build())
                clickAction(it)
            }
        })
    }

    private fun clickAction(view: View) {
        Toast.makeText(this@KotlinActivity, "Hello Second", Toast.LENGTH_LONG).show()
//        val toJson = JsonConvert.toJson(view.context, AppCompatActivity::class.java, activityFieldFilters)
//        Log.d(tag, toJson.toString())

        // pop Window

    }
}