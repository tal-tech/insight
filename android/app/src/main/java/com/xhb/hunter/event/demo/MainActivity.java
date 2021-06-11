package com.xhb.hunter.event.demo;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.Toast;

import androidx.fragment.app.ListFragment;

import com.xhb.hunter.event.demo.data.TraceData;
import com.xhb.hunter.event.demo.data.TraceDataKt;
import com.xhb.hunter.library.event.EventInitializer;
import com.xhb.hunter.ok.impl.support.TrackerHelper;

public class MainActivity extends BaseActivity {

    private ListFragment fragment;

    private final static String[] array = new String[100];

    static {
        for (int i = 0; i < 100; i++) {
            array[i] = String.valueOf(i);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 非 lambda
        findViewById(R.id.textView).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                TraceDataKt.traceData(v, new TraceData.Builder()
                    .put("name", "jacky")
                    .put("manager", true)
                    .put("level", LEVEL.low)
                    .build());
                startActivity(new Intent(MainActivity.this, KotlinActivity.class));
                Toast.makeText(MainActivity.this, "hello world", Toast.LENGTH_SHORT).show();
            }
        });

        // lambda
        findViewById(R.id.test_lambda).setOnClickListener(v -> {
            TraceDataKt.traceData(v, new TraceData.Builder()
                .put("name", "jacky111")
                .put("manager", true)
                .put("level", LEVEL.low)
                .build());
            Toast.makeText(MainActivity.this, "hello lambda", Toast.LENGTH_SHORT).show();
        });

        CheckBox checkBox=  findViewById(R.id.checkbox);
        final Settings settings = new Settings();
        checkBox.setOnCheckedChangeListener(settings);

        fragment = new ListFragment();
        fragment.setListAdapter(new ArrayAdapter<>(MainActivity.this, android.R.layout.simple_list_item_1, array));
        getSupportFragmentManager().beginTransaction()
            .add(R.id.container, fragment)
            .addToBackStack(null)
            .commitAllowingStateLoss();
    }
}
