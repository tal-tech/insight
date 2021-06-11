package com.xhb.hunter.ok.impl.support;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;

import androidx.annotation.Nullable;

import com.xhb.hunter.library.event.EventInitializer;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */

@TargetApi(Build.VERSION_CODES.M)
public class OverLaySettingActivity extends Activity {
    public interface PermissionListener {
        void onGrant();

        void onDisGrant();
    }

    private static final int ACTION_MANAGE_OVERLAY_PERMISSION_REQUEST_CODE = 2 << 10;
    private static PermissionListener permissionListener;

    public static void requestPermission(PermissionListener permissionListener) {
        final Application application = EventInitializer.with().getApplication();
        final Intent intent = new Intent(application, OverLaySettingActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        application.startActivity(intent);
        OverLaySettingActivity.permissionListener = permissionListener;
    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        checkPermission();
    }

    private void checkPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(this)) {
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + getPackageName()));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivityForResult(intent, ACTION_MANAGE_OVERLAY_PERMISSION_REQUEST_CODE);
            } else {
                doGrant();
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == ACTION_MANAGE_OVERLAY_PERMISSION_REQUEST_CODE) {
            if (!Settings.canDrawOverlays(this)) {
                // You don't have permission
                doDisGrant();
            } else {
                doGrant();
            }

        }

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        permissionListener = null;
    }

    private void doDisGrant() {
        PermissionListener listener = permissionListener;
        if (listener != null) {
            listener.onDisGrant();
        }
        finish();
    }

    private void doGrant() {
        PermissionListener listener = permissionListener;
        if (listener != null) {
            listener.onGrant();
        }
        finish();
    }
}
