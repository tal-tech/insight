package com.xhb.hunter.ok.impl.support;

import android.app.Application;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.StringRes;

import com.xhb.hunter.library.event.EventInitializer;
import com.xhb.hunter.library.event.core.base.IState;
import com.xhb.hunter.library.event.core.base.LazyInstance;
import com.xhb.hunter.library.event.core.base.NoNullInstance;
import com.xhb.hunter.library.event.util.Util;
import com.xhb.hunter.ok.impl.AnOkEventListener;
import com.xhb.hunter.ok.impl.R;
import com.xhb.hunter.ok.impl.model.ActionType;
import com.xhb.hunter.ok.impl.model.AnAction;
import com.xhb.hunter.ok.impl.model.MuteAction;
import com.xhb.hunter.ok.impl.util.ClipboardUtils;
import com.xhb.hunter.ok.impl.util.Strings;

import java.lang.ref.WeakReference;

public class FloatingViewService extends Service implements WindowViewEvent {

    private static final String TAG = "FloatingViewService";

    public static final String INTENT_KEY_ACTION = "INTENT_KEY_ACTION";

    private final NoNullInstance<AnAction> noNullPage = new NoNullInstance<AnAction>() {
        @Override
        public AnAction backup() {
            return AnOkEventListener.getInstance().lastPageAction;
        }
    };
    private final NoNullInstance<AnAction> noNullEvent = new NoNullInstance<AnAction>() {
        @Override
        public AnAction backup() {
            return AnOkEventListener.getInstance().lastEventAction;
        }
    };

    private final LazyInstance<WindowViewer> viewerLazyInstance = new LazyInstance<WindowViewer>() {
        @Override
        public WindowViewer create() {
            return new WindowViewer(FloatingViewService.this, FloatingViewService.this);
        }
    };

    private WindowViewer getWindowViewer() {
        return viewerLazyInstance.get();
    }

    static void send(@NonNull Context context, @NonNull AnAction action) {
        Intent intent = new Intent(context, FloatingViewService.class);
        intent.putExtra(INTENT_KEY_ACTION, Util.ensureNoNull(action));
        context.startService(intent);
    }

    static void stop(Context context) {
        context.stopService(new Intent(context, FloatingViewService.class));
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            AnAction anAction = intent.getParcelableExtra(INTENT_KEY_ACTION);
            if (anAction != null) {
                final ActionType actionType = anAction.getActionType();
                boolean isPage = false;
                if (actionType == ActionType.onVisibleToUser) {
                    noNullPage.update(anAction);
                    isPage = true;
                } else {
                    noNullEvent.update(anAction);
                    AnAction page = noNullPage.get();
                    if (page == null) {
                        return super.onStartCommand(intent, flags, startId);
                    }
                    page.setFragments(noNullEvent.get().getFragments());
                }

                if (getWindowViewer().uploadAble()) {
                    try {
                        AnOkEventListener.getInstance().getAnActionConverter().apply(anAction);
                        submit(new MuteAction(anAction), true);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                final AnAction event = isPage ? null : noNullEvent.get();
                getWindowViewer().updateView(noNullPage.get(), event);
            }
        }
        return super.onStartCommand(intent, flags, startId);
    }

    private void submit(final MuteAction muteAction, boolean auto) {
        View view = null;
        AnAction anAction = muteAction.getAnAction();
        final ActionType action = anAction.getActionType();

        WeakReference<AnOkEventListener.ViewHolder> viewHolderWeakReference = null;
        if (action == ActionType.onClick) {
            viewHolderWeakReference = AnOkEventListener.getInstance().getLastViewHolder();
        } else if (action == ActionType.onVisibleToUser) {
            viewHolderWeakReference = AnOkEventListener.getInstance().getLastPageViewHolder();
        }

        if (viewHolderWeakReference == null) {
            Log.d(TAG, String.format("ignore commit for action type:%d", action.getType()));
            return;
        }

        final AnOkEventListener.ViewHolder viewHolder = viewHolderWeakReference.get();
        if (viewHolder != null && Strings.equals(viewHolder.getId(), anAction.getId())) {
            view = viewHolder.getView();
        }

        if (view == null) {
            Log.d(TAG, "the view is null,cancel submit");
            showToast("the view is null,cancel submit, Power off and then power on can reset the page view");
            return;
        }

        try {
            AnOkEventListener.getInstance().getOnPreShow().apply(anAction, view, auto, new IState() {
                @Override
                public void success() {
                    String desc = anAction.getFullName();
                    showToast(desc);
                }

                @Override
                public void fail() {
                    showToast("上传失败!!! ");
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();

        getWindowViewer().init();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Util.closeQuietly(getWindowViewer());
    }

    @Override
    public void onPageCopy(View v) {
        String pageKey = noNullPage.get().getPageKey();
        if (Strings.isNotBlank(pageKey)) {
            ClipboardUtils.textCopy(FloatingViewService.this, pageKey);
            Toast.makeText(FloatingViewService.this, R.string.tracker_copy_successful, Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(FloatingViewService.this, R.string.tracker_component_name_null, Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void onPageSubmit(View v, @NonNull String pageDesc) {
        final MuteAction muteAction = new MuteAction(noNullPage.get());
        muteAction.setDesc(pageDesc);
        if (getWindowViewer().uploadAble()) {
            submit(muteAction, false);
        } else {
            showToast("无权限上传或者上传开关没有打开");
        }
    }

    @Override
    public void onItemSubmit(View v, @NonNull String itemDesc) {
        final MuteAction muteAction = new MuteAction(noNullEvent.get());
        muteAction.setDesc(itemDesc);
        if (getWindowViewer().uploadAble()) {
            submit(muteAction, false);
        } else {
            showToast("无权限上传或者上传开关没有打开");
        }
    }

    void showToast(String msg) {
        final Application application = EventInitializer.with().getApplication();
        Toast.makeText(application, msg, Toast.LENGTH_SHORT).show();
    }

    void showToast(@StringRes int id) {
        final Application application = EventInitializer.with().getApplication();
        showToast(application.getResources().getString(id));
    }
}
