package com.xhb.hunter.library.event.impl;

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

import com.xhb.hunter.library.event.core.event.EventListener;

/**
 * Created by Jacky on 2020-05-14
 */
public class DefaultEventListener implements EventListener {

    @Override
    public void onClick(View view) {

    }

    @Override
    public void onClick(Object obj, DialogInterface dialogInterface, int which) {

    }

    @Override
    public void onItemClick(Object obj, AdapterView parent, View view, int position, long id) {

    }

    @Override
    public void onItemSelected(Object obj, AdapterView parent, View view, int position, long id) {

    }

    @Override
    public void onGroupClick(Object obj, ExpandableListView parent, View v, int groupPosition, long id) {

    }

    @Override
    public void onChildClick(Object obj, ExpandableListView parent, View v, int groupPosition, int childPosition, long id) {

    }

    @Override
    public void onStopTrackingTouch(Object obj, SeekBar seekBar) {

    }

    @Override
    public void onRatingChanged(Object obj, RatingBar ratingBar, float rating, boolean fromUser) {

    }

    @Override
    public void onCheckedChanged(Object obj, RadioGroup radioGroup, int checkedId) {

    }

    @Override
    public void onCheckedChanged(Object obj, CompoundButton button, boolean isChecked) {

    }

    @Override
    public void onFragmentCreate(Object obj, Bundle savedInstanceState) {

    }

    @Override
    public void onFragmentResume(Object obj) {

    }

    @Override
    public void onFragmentPause(Object obj) {

    }

    @Override
    public void setFragmentUserVisibleHint(Object obj, boolean isUserVisibleHint) {

    }

    @Override
    public void onFragmentHiddenChanged(Object fragment, boolean hidden) {

    }

    @Override
    public void onFragmentDestroy(Object fragment) {

    }

    @Override
    public void onActivityCreate(Object obj, @Nullable Bundle savedInstanceState) {

    }

    @Override
    public void onActivityDestroy(Object obj) {

    }

    @Override
    public void onActivityResume(Object obj) {

    }

    @Override
    public void onActivityPause(Object obj) {

    }
}
