package com.xhb.hunter.library.event.core.event;

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

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */
public class EventListenerRegistry extends Registry<EventListener> implements EventListener {

    @Override
    public void onClick(View view) {
        for (EventListener listener : getListeners()) {
            listener.onClick(view);
        }
    }

    @Override
    public void onClick(Object obj, DialogInterface dialogInterface, int which) {
        for (EventListener listener : getListeners()) {
            listener.onClick(obj, dialogInterface, which);
        }
    }

    @Override
    public void onItemClick(Object obj, AdapterView parent, View view, int position, long id) {
        for (EventListener listener : getListeners()) {
            listener.onItemClick(obj, parent, view, position, id);
        }
    }

    @Override
    public void onItemSelected(Object obj, AdapterView parent, View view, int position, long id) {
        for (EventListener listener : getListeners()) {
            listener.onItemSelected(obj, parent, view, position, id);
        }
    }

    @Override
    public void onGroupClick(Object obj, ExpandableListView parent, View v, int groupPosition, long id) {
        for (EventListener listener : getListeners()) {
            listener.onGroupClick(obj, parent, v, groupPosition, id);
        }
    }

    @Override
    public void onChildClick(Object obj, ExpandableListView parent, View v, int groupPosition, int childPosition, long id) {
        for (EventListener listener : getListeners()) {
            listener.onChildClick(obj, parent, v, groupPosition, childPosition, id);
        }
    }

    @Override
    public void onStopTrackingTouch(Object obj, SeekBar seekBar) {
        for (EventListener listener : getListeners()) {
            listener.onStopTrackingTouch(obj, seekBar);
        }
    }

    @Override
    public void onRatingChanged(Object obj, RatingBar ratingBar, float rating, boolean fromUser) {
        for (EventListener listener : getListeners()) {
            listener.onRatingChanged(obj, ratingBar, rating, fromUser);
        }
    }

    @Override
    public void onCheckedChanged(Object obj, RadioGroup radioGroup, int checkedId) {
        for (EventListener listener : getListeners()) {
            listener.onCheckedChanged(obj, radioGroup, checkedId);
        }
    }

    @Override
    public void onCheckedChanged(Object obj, CompoundButton button, boolean isChecked) {
        for (EventListener listener : getListeners()) {
            listener.onCheckedChanged(obj, button, isChecked);
        }
    }

    @Override
    public void onFragmentCreate(Object obj, Bundle savedInstanceState) {
        for (EventListener listener : getListeners()) {
            listener.onFragmentCreate(obj, savedInstanceState);
        }
    }

    @Override
    public void onFragmentResume(Object obj) {
        for (EventListener listener : getListeners()) {
            listener.onFragmentResume(obj);
        }
    }

    @Override
    public void onFragmentPause(Object obj) {
        for (EventListener listener : getListeners()) {
            listener.onFragmentPause(obj);
        }
    }

    @Override
    public void setFragmentUserVisibleHint(Object obj, boolean isUserVisibleHint) {
        for (EventListener listener : getListeners()) {
            listener.setFragmentUserVisibleHint(obj, isUserVisibleHint);
        }
    }

    @Override
    public void onFragmentHiddenChanged(Object fragment, boolean hidden) {
        for (EventListener listener : getListeners()) {
            listener.onFragmentHiddenChanged(fragment, hidden);
        }
    }

    @Override
    public void onFragmentDestroy(Object fragment) {
        for (EventListener listener : getListeners()) {
            listener.onFragmentDestroy(fragment);
        }
    }

    @Override
    public void onActivityCreate(Object obj, @Nullable Bundle savedInstanceState) {
        for (EventListener listener : getListeners()) {
            listener.onActivityCreate(obj, savedInstanceState);
        }
    }

    @Override
    public void onActivityDestroy(Object obj) {
        for (EventListener listener : getListeners()) {
            listener.onActivityDestroy(obj);
        }
    }

    @Override
    public void onActivityResume(Object obj) {
        for (EventListener listener : getListeners()) {
            listener.onActivityResume(obj);
        }
    }

    @Override
    public void onActivityPause(Object obj) {
        for (EventListener listener : getListeners()) {
            listener.onActivityPause(obj);
        }
    }
}
