package com.xhb.hunter.event.demo;

import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

/**
 * Created by Jacky on 2020-05-14
 */
public class BaseActivity extends AppCompatActivity {
    protected String tag = this.getClass().getSimpleName();
    public int key = 1;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }
}
