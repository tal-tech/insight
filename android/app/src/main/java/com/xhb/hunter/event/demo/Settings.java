package com.xhb.hunter.event.demo;

import android.widget.CompoundButton;

import com.xhb.hunter.ok.impl.support.OverLaySettingActivity;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */
public class Settings implements CompoundButton.OnCheckedChangeListener, OverLaySettingActivity.PermissionListener {

    public Settings() {
        OverLaySettingActivity.requestPermission(this);
    }

    @Override
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        MyApplication.isOpen = isChecked;
    }

    @Override
    public void onGrant() {

    }

    @Override
    public void onDisGrant() {

    }
}
