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

/**
 * Created by Jacky on 2020-05-14
 */
public interface EventListener {
    void onClick(View view);

    void onClick(Object obj, DialogInterface dialogInterface, int which);

    void onItemClick(Object obj, AdapterView parent, View view, int position, long id);

    void onItemSelected(Object obj, AdapterView parent, View view, int position, long id);

    void onGroupClick(Object obj, ExpandableListView parent, View v
        , int groupPosition, long id);

    void onChildClick(Object obj, ExpandableListView parent, View v
        , int groupPosition, int childPosition, long id);

    void onStopTrackingTouch(Object obj, SeekBar seekBar);

    void onRatingChanged(Object obj, RatingBar ratingBar, float rating, boolean fromUser);

    void onCheckedChanged(Object obj, RadioGroup radioGroup, int checkedId);

    void onCheckedChanged(Object obj, CompoundButton button, boolean isChecked);

    void onFragmentCreate(Object obj, Bundle savedInstanceState);

    void onFragmentResume(Object obj);

    void onFragmentPause(Object obj);

    void setFragmentUserVisibleHint(Object obj, boolean isUserVisibleHint);

    void onFragmentHiddenChanged(Object fragment, boolean hidden);

    void onFragmentDestroy(Object fragment);

    void onActivityCreate(Object obj, @Nullable Bundle savedInstanceState);

    void onActivityDestroy(Object obj);

    void onActivityResume(Object obj);

    void onActivityPause(Object obj);
}
