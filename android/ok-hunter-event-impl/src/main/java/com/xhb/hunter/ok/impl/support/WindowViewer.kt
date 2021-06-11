package com.xhb.hunter.ok.impl.support

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.PixelFormat
import android.os.Build
import android.view.*
import android.widget.CheckBox
import android.widget.CompoundButton
import android.widget.TextView
import android.widget.Toast
import com.xhb.hunter.library.event.EventManager
import com.xhb.hunter.ok.impl.R
import com.xhb.hunter.ok.impl.model.AnAction
import com.xhb.hunter.ok.impl.util.ClipboardUtils
import java.io.Closeable
import kotlin.math.abs

/**
 * @author yangjianfei [Contact me.](y)
 * @version 1.0
 */
interface WindowViewEvent {
    fun onPageCopy(v: View)
    fun onPageSubmit(v: View, pageDesc: String)
    fun onItemSubmit(v: View, itemDesc: String)
}

class WindowViewer(private val context: Context, private val listener: WindowViewEvent) : View.OnTouchListener, Closeable {
    private val bigView: View = LayoutInflater.from(context).inflate(R.layout.layout_floating_view, null)
    private val smallView: View = LayoutInflater.from(context).inflate(R.layout.layout_floating_small, null)
    private val windowManager: WindowManager
    private val params: WindowManager.LayoutParams
    private var editable: Boolean = false

    private val lTvToSmall: TextView by lazy {
        bigView.findViewById<TextView>(R.id.tv_to_small)
    }

    private val lTvClose: TextView by lazy {
        bigView.findViewById<TextView>(R.id.tv_close)
    }

    private val lCbEnableTracker by lazy {
        bigView.findViewById<CheckBox>(R.id.cb_enable_tracker)
    }

    private val lTvPageName by lazy {
        bigView.findViewById<TextView>(R.id.tv_pageName)
    }

    private val lTvCopyPageName by lazy {
        bigView.findViewById<TextView>(R.id.tv_copyPageName)
    }

    private val lTvPageDesc by lazy {
        bigView.findViewById<TextView>(R.id.tv_pageDesc)
    }

    private val lTvPageId by lazy {
        bigView.findViewById<TextView>(R.id.tv_pageId)
    }

    private val lTvItemName by lazy {
        bigView.findViewById<TextView>(R.id.tv_itemName)
    }

    private val lTvCopyItemName by lazy {
        bigView.findViewById<TextView>(R.id.tv_copyItemName)
    }

    private val lTvCopyItemId by lazy {
        bigView.findViewById<TextView>(R.id.tv_itemCopy)
    }


    private val lTvItemDesc by lazy {
        bigView.findViewById<TextView>(R.id.tv_itemDesc)
    }

    private val lTvItemId by lazy {
        bigView.findViewById<TextView>(R.id.tv_itemId)
    }

    private val lTvItemParams by lazy {
        bigView.findViewById<TextView>(R.id.tv_parameters)
    }

    private val sTvToLarge by lazy {
        smallView.findViewById<TextView>(R.id.tv_scale_large)
    }

    private var uploadable: Boolean = lCbEnableTracker.isChecked
    private var currentView: View? = null

    private fun isSmall() = currentView === smallView
    fun uploadAble() = editable && uploadable

    init {
        // params
        val params = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
                PixelFormat.TRANSLUCENT)
        } else {
            WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.TYPE_PHONE,
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
                PixelFormat.TRANSLUCENT)
        }
        //初始化位置
        params.gravity = Gravity.TOP or Gravity.START

        this.params = params
        this.windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
        this.smallView.setOnTouchListener(this)
        this.bigView.setOnTouchListener(this)
    }

    @SuppressLint("ClickableViewAccessibility")
    fun init() {
        lTvPageDesc.isEnabled = false
        lTvItemDesc.isEnabled = false

        windowManager.addView(bigView, params)
        currentView = bigView
        (bigView.findViewById(R.id.cb_disableInput) as CheckBox).apply {
            this.setOnCheckedChangeListener { _: CompoundButton?, b: Boolean ->
                params.flags = if (b) {
                    params.flags or WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                } else {
                    params.flags and WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                }
                windowManager.updateViewLayout(bigView, params)
            }
        }

        bigView.findViewById<TextView>(R.id.tv_pageCopy).setOnClickListener {
            listener.onPageCopy(it)
        }

        bigView.findViewById<TextView>(R.id.tv_pageSubmit).setOnClickListener {
            listener.onPageSubmit(it, lTvPageDesc.text?.toString() ?: "")
        }

        bigView.findViewById<TextView>(R.id.tv_itemSubmit).setOnClickListener {
            listener.onItemSubmit(it, lTvItemDesc.text?.toString() ?: "")
        }

        bigView.findViewById<CheckBox>(R.id.cb_stopAction).setOnCheckedChangeListener { _, isChecked ->
            EventManager.setStopAction(isChecked)
        }

        lCbEnableTracker.setOnCheckedChangeListener { _, isChecked ->
            this.uploadable = isChecked
        }

        lTvClose.setOnLongClickListener {
            TrackerHelper.stop(context)
            true
        }

        lTvToSmall.setOnClickListener {
            toggleWindowSize()
        }

        lTvCopyPageName.setOnClickListener {
            val toString = lTvPageName.text?.toString()?.replace("页面: ", "")
            if (toString == null) {
                Toast.makeText(context, R.string.tracker_component_name_null, Toast.LENGTH_SHORT).show()
            } else {
                ClipboardUtils.textCopy(context, toString)
                Toast.makeText(context, R.string.tracker_copy_successful, Toast.LENGTH_SHORT).show()
            }
        }

        lTvCopyItemName.setOnClickListener {
            val toString = lTvItemName.text?.toString()?.replace("路径: ", "")
            if (toString == null) {
                Toast.makeText(context, R.string.tracker_component_name_null, Toast.LENGTH_SHORT).show()
            } else {
                ClipboardUtils.textCopy(context, toString)
                Toast.makeText(context, R.string.tracker_copy_successful, Toast.LENGTH_SHORT).show()
            }
        }

        lTvCopyItemId.setOnClickListener {
            val toString = lTvItemId.text?.toString()?.replace("编号: ", "")
            if (toString == null) {
                Toast.makeText(context, R.string.tracker_component_name_null, Toast.LENGTH_SHORT).show()
            } else {
                ClipboardUtils.textCopy(context, toString)
                Toast.makeText(context, R.string.tracker_copy_successful, Toast.LENGTH_SHORT).show()
            }
        }

        setEditable(false)
    }

    private fun setEditable(editable: Boolean) {
        this.editable = editable
        lTvItemDesc.isEnabled = editable

        bigView.findViewById<TextView>(R.id.tv_pageSubmit).visibility = if (editable) View.VISIBLE else View.INVISIBLE
        bigView.findViewById<TextView>(R.id.tv_itemSubmit).visibility = if (editable) View.VISIBLE else View.INVISIBLE
        bigView.findViewById<CheckBox>(R.id.cb_stopAction).visibility = if (editable) View.VISIBLE else View.INVISIBLE
        lCbEnableTracker.visibility = if (editable) View.VISIBLE else View.INVISIBLE
    }

    fun updateView(pageEvent: AnAction, event: AnAction?) {
        lTvPageDesc.text = pageEvent.title
        lTvPageName.text = "页面: ${pageEvent.fullName}"
        lTvPageId.text = "编号: " + pageEvent.pageKey

        lTvItemDesc.text = event?.title
        lTvItemId.text = "编号: " + event?.buttonKey
        lTvItemName.text = "路径: " + event?.path
        lTvItemParams.text = "参数: " + event?.params
    }

    private fun toggleWindowSize() {
        val small = isSmall()
        currentView = if (small) {
            windowManager.removeView(smallView)
            windowManager.addView(bigView, params)
            bigView
        } else {
            windowManager.removeView(bigView)
            windowManager.addView(smallView, params)
            smallView
        }
    }


    private var startX = 0
    private var startY = 0
    private var startTouchX = 0f
    private var startTouchY = 0f

    override fun onTouch(v: View, event: MotionEvent): Boolean {
        when (event.action) {
            MotionEvent.ACTION_DOWN -> {
                startX = params.x
                startY = params.y
                startTouchX = event.rawX
                startTouchY = event.rawY
                return true
            }
            MotionEvent.ACTION_MOVE -> {
                params.x = startX + (event.rawX - startTouchX).toInt()
                params.y = startY + (event.rawY - startTouchY).toInt()
                //更新View的位置
                windowManager.updateViewLayout(v, params)
                return true
            }
            MotionEvent.ACTION_UP -> {
                if (v == smallView) {
                    if (abs(event.rawX - startTouchX) < 5 && abs(event.rawY - startTouchY) < 5) {
                        toggleWindowSize()
                        return true
                    }
                }
            }
        }
        return false
    }

    override fun close() {
        val view = currentView
        if (view != null) {
            windowManager.removeView(view)
        }
    }
}