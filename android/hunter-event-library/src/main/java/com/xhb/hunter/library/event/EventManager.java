package com.xhb.hunter.library.event;

import android.content.DialogInterface;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.CompoundButton;
import android.widget.ExpandableListView;
import android.widget.RadioGroup;
import android.widget.RatingBar;
import android.widget.SeekBar;

import androidx.annotation.Nullable;

import com.xhb.hunter.library.event.core.base.Registry;
import com.xhb.hunter.library.event.core.event.EventListener;
import com.xhb.hunter.library.event.core.event.EventListenerRegistry;
import com.xhb.hunter.library.event.util.Util;

/**
 * 事件管理类
 */
public final class EventManager {

    private static final EventListenerRegistry registry = new EventListenerRegistry();

    private static boolean stopAction = false;

    public static void setStopAction(boolean b) {
        stopAction = b;
    }

    public static boolean shouldStopAction() {
        return stopAction;
    }

    public static void addEventListener(EventListener eventListener) {
        registry.addListener(Util.ensureNoNull(eventListener));
    }

    public static void addEventListeners(Registry<EventListener> registry) {
        registry.apply(EventManager.registry);
    }

    public static boolean removeEventListener(EventListener eventListener) {
        return registry.removeListener(Util.ensureNoNull(eventListener));
    }

    // Interface
    public static void onClick(View view) {
        registry.onClick(view);
    }

    public static void onClick(Object object, DialogInterface dialogInterface, int which) {
        registry.onClick(object, dialogInterface, which);
    }

    public static void onItemClick(Object object, AdapterView parent, View view, int position
        , long id) {
        registry.onItemClick(object, parent, view, position, id);
    }

    public static void onItemSelected(Object object, AdapterView parent, View view, int position
        , long id) {
        registry.onItemSelected(object, parent, view, position, id);
    }

    public static void onGroupClick(Object object, ExpandableListView parent, View v
        , int groupPosition, long id) {
        registry.onGroupClick(object, parent, v, groupPosition, id);
    }

    public static void onChildClick(Object object, ExpandableListView parent, View v
        , int groupPosition, int childPosition, long id) {
        registry.onChildClick(object, parent
            , v, groupPosition, childPosition, id);
    }

    public static void onStopTrackingTouch(Object object, SeekBar seekBar) {
        registry.onStopTrackingTouch(object, seekBar);
    }

    public static void onRatingChanged(Object object, RatingBar ratingBar, float rating, boolean fromUser) {
        registry.onRatingChanged(object, ratingBar, rating, fromUser);
    }

    public static void onCheckedChanged(Object object, RadioGroup radioGroup, int checkedId) {
        registry.onCheckedChanged(object, radioGroup, checkedId);
    }

    public static void onCheckedChanged(Object object, CompoundButton button, boolean isChecked) {
        registry.onCheckedChanged(object, button, isChecked);
    }

    // Fragment
    public static void onFragmentCreate(Object object, Bundle savedInstanceState) {
        registry.onFragmentCreate(object, savedInstanceState);
    }

    public static void onFragmentResume(Object obj) {
        registry.onFragmentResume(obj);
    }

    public static void onFragmentPause(Object obj) {
        registry.onFragmentPause(obj);
    }

    public static void setFragmentUserVisibleHint(Object obj, boolean isUserVisibleHint) {
        registry.setFragmentUserVisibleHint(obj, isUserVisibleHint);
    }

    public static void onFragmentHiddenChanged(Object fragment, boolean hidden) {
        registry.onFragmentHiddenChanged(fragment, hidden);
    }

    public static void onFragmentDestroy(Object fragment) {
        registry.onFragmentDestroy(fragment);
    }

    // Activity
    public static void onActivityCreate(Object object, @Nullable Bundle savedInstanceState) {
        registry.onActivityCreate(object, savedInstanceState);
    }

    public static void onActivityDestroy(Object object) {
        registry.onActivityDestroy(object);
    }

    public static void onActivityResume(Object object) {
        registry.onActivityResume(object);
    }

    public static void onActivityPause(Object object) {
        registry.onActivityPause(object);
    }
}
