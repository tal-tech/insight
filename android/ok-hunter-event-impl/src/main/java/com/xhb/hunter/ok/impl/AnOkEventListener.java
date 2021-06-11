package com.xhb.hunter.ok.impl;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Fragment;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Pair;
import android.util.SparseArray;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.ExpandableListView;
import android.widget.RadioGroup;
import android.widget.RatingBar;
import android.widget.SeekBar;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentActivity;

import com.xhb.hunter.library.event.EventInitializer;
import com.xhb.hunter.library.event.core.base.Function;
import com.xhb.hunter.library.event.core.base.JsonObjectAble;
import com.xhb.hunter.library.event.core.base.LazyInstance;
import com.xhb.hunter.library.event.core.base.Registry;
import com.xhb.hunter.library.event.core.event.EventListener;
import com.xhb.hunter.library.event.util.Util;
import com.xhb.hunter.ok.impl.base.ActionProvider;
import com.xhb.hunter.ok.impl.base.AnActionConvert;
import com.xhb.hunter.ok.impl.base.OnPreShow;
import com.xhb.hunter.ok.impl.model.ActionFrom;
import com.xhb.hunter.ok.impl.model.ActionType;
import com.xhb.hunter.ok.impl.model.AnAction;
import com.xhb.hunter.ok.impl.support.TrackerHelper;
import com.xhb.hunter.ok.impl.util.PathUtil;

import java.lang.ref.WeakReference;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */
public class AnOkEventListener extends Registry<ActionProvider> implements EventListener {
    private ViewHolder clickViewHolder;
    private ViewHolder pageViewHolder;
    private WeakReference<ViewHolder> lastViewHolder = new WeakReference<>(null);
    private WeakReference<ViewHolder> lastPageViewHolder = new WeakReference<>(null);

    public WeakReference<ViewHolder> getLastViewHolder() {
        tryGc();
        return lastViewHolder;
    }

    public WeakReference<ViewHolder> getLastPageViewHolder() {
        tryGc();
        return lastPageViewHolder;
    }

    private OnPreShow onPreShow = OnPreShow.EMPTY;
    private AnActionConvert anActionConverter = AnActionConvert.EMPTY;

    @NonNull
    public Function<AnAction, AnAction> getAnActionConverter() {
        return anActionConverter;
    }

    public void setAnActionConverter(AnActionConvert anActionConverter) {
        this.anActionConverter = Util.ensureNoNull(anActionConverter);
    }

    @NonNull
    public OnPreShow getOnPreShow() {
        return onPreShow;
    }

    public void setOnPreShow(OnPreShow onPreShow) {
        this.onPreShow = Util.ensureNoNull(onPreShow);
    }

    public static volatile AnOkEventListener instance = new AnOkEventListener();
    private final LazyInstance<Handler> handlerLazyInstance = new LazyInstance<Handler>() {

        @Override
        public Handler create() {
            return new Handler(Looper.getMainLooper());
        }
    };

    public final SparseArray<Pair<Integer, String>> sAliveFragMap = new SparseArray<>();

    private AnOkEventListener() {
    }

    public static AnOkEventListener getInstance() {
        return instance;
    }

    private void clickEvent(View view, AnAction anAction) {
        ViewHolder viewHolder = new ViewHolder(anAction.getId(), view);
        this.clickViewHolder = viewHolder;
        lastViewHolder = new WeakReference<>(viewHolder);
    }

    private void pageEvent(View view, AnAction anAction) {
        ViewHolder viewHolder = new ViewHolder(anAction.getId(), view);
        this.pageViewHolder = viewHolder;
        lastPageViewHolder = new WeakReference<>(viewHolder);
    }

    public AnAction lastPageAction;
    public AnAction lastEventAction;

    private void dispatchAction(AnAction a) {
        final ActionType actionType = a.getActionType();
        if (actionType == ActionType.onVisibleToUser) {
            this.lastPageAction = a;
        }

        if (actionType == ActionType.onClick) {
            this.lastEventAction = a;
        }

        for (ActionProvider listener : getListeners()) {
            listener.provide(a);
        }
    }

    @Override
    public void onClick(View view) {
        Context context = view.getContext();
        Activity activity = Util.getActivity(context);
        if (activity != null) {
            doClick(view, activity);
        }
    }

    private void doClick(View view, Activity activity) {
        EventInitializer initializer = EventInitializer.with();
        final String simplePageName = activity.getClass().getSimpleName();

        final String title = initializer.getTitleProvider().provide(activity);
        final String fragments = initializer.getFragmentPathProvider().provide(view);
        final String desc = initializer.getDescProvider().provide(view);
        final String viewPath = initializer.getViewPathProvider().provide(view);
        final String buttonKey = initializer.getButtonKeyProvider().provide(view);
        final JsonObjectAble params = initializer.getParamsProvider().provide(view);

        AnAction anAction = AnAction.create(simplePageName, ActionType.onClick, ActionFrom.NATIVE);
        anAction.setFragments(fragments);
        anAction.setTitle(title);
        anAction.setPath(viewPath);
        anAction.setDesc(desc);
        anAction.setButtonKey(buttonKey);
        if (params != null) {
            anAction.setParams(params.toString());
        }

        dispatchAction(anAction);

        if (initializer.getVisualSetting().isOpen()) {
            clickEvent(view, anAction);
            TrackerHelper.send(activity, anAction);
        }
    }

    @Override
    public void onClick(Object obj, DialogInterface dialogInterface, int which) {
        Button button = null;
        if (dialogInterface instanceof androidx.appcompat.app.AlertDialog) {
            androidx.appcompat.app.AlertDialog dialog = (androidx.appcompat.app.AlertDialog) dialogInterface;
            button = dialog.getButton(which);
        }

        if (dialogInterface instanceof AlertDialog) {
            AlertDialog dialog2 = (AlertDialog) dialogInterface;
            button = dialog2.getButton(which);
        }

        if (button == null) {
            return;
        }
        Context context = button.getContext();
        Activity activity = Util.getActivity(context);
        if (activity != null) {
            EventInitializer initializer = EventInitializer.with();

            final String simplePageName = activity.getClass().getSimpleName();
            final String buttonKey = initializer.getButtonKeyProvider().provide(button);
            final String desc = initializer.getDescProvider().provide(button);

            final AnAction anAction = AnAction.create(simplePageName, ActionType.onClick, ActionFrom.NATIVE);
            anAction.setButtonKey(buttonKey);
            anAction.setDesc(desc);
            anAction.setPath(simplePageName + "_dialog");
            anAction.setTitle(desc);

            dispatchAction(anAction);

            if (EventInitializer.with().getVisualSetting().isOpen()) {
                clickEvent(button, anAction);
                TrackerHelper.send(button.getContext(), anAction);
            }
        }

    }

    @Override
    public void onItemClick(Object obj, AdapterView parent, View view, int position, long id) {

    }

    @Override
    public void onItemSelected(Object obj, AdapterView parent, View view, int position, long id) {
        onItemClick(obj, parent, view, position, id);
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
        onClick(button);
    }

    @Override
    public void onFragmentCreate(Object obj, Bundle savedInstanceState) {
        if (obj != null && savedInstanceState == null) {
            if (obj instanceof androidx.fragment.app.Fragment) {
                doFragmentCreate((androidx.fragment.app.Fragment) obj);
            }

            if (obj instanceof android.app.Fragment) {
                doFragmentCreate((Fragment) obj);
            }
        }
    }

    private void doFragmentCreate(Fragment fragment) {
        Activity activity = fragment.getActivity();
        AnAction anAction = AnAction.create(activity.getClass().getName(), ActionType.onCreate, ActionFrom.NATIVE);
        anAction.setFragments(PathUtil.dumpFragments(fragment));
        anAction.setDesc("onCreate");
    }

    private void doFragmentCreate(androidx.fragment.app.Fragment fragment) {
        FragmentActivity activity = fragment.getActivity();
        AnAction anAction = AnAction.create(activity.getClass().getName(), ActionType.onCreate, ActionFrom.NATIVE);
        anAction.setFragments(PathUtil.dumpFragments(fragment));
        anAction.setDesc("onCreate");
    }

    @Override
    public void onFragmentResume(Object obj) {
        addAliveFragment(obj);
    }

    @Override
    public void onFragmentPause(Object obj) {
        removeAliveFragment(obj);
    }

    @Override
    public void setFragmentUserVisibleHint(Object obj, boolean isUserVisibleHint) {
        if (isUserVisibleHint) {
            addAliveFragment(obj);
        } else {
            removeAliveFragment(obj);
        }
    }

    @Override
    public void onFragmentHiddenChanged(Object fragment, boolean hidden) {

    }

    @Override
    public void onFragmentDestroy(Object fragment) {

    }

    @Override
    public void onActivityCreate(Object obj, @Nullable Bundle savedInstanceState) {
        String name = obj.getClass().getName();

        AnAction anAction = AnAction.create(name, ActionType.onCreate, ActionFrom.NATIVE);
        anAction.setDesc("onCreate");
        dispatchAction(anAction);
    }

    @Override
    public void onActivityDestroy(Object obj) {

    }

    @Override
    public void onActivityResume(Object object) {
        final EventInitializer with = EventInitializer.with();
        handlerLazyInstance.get().post(() -> {
            final Activity activity = (Activity) object;
            if (activity == null) {
                return;
            }
            final String name = activity.getClass().getSimpleName();

            final AnAction anAction = AnAction.create(name, ActionType.onVisibleToUser, ActionFrom.NATIVE);
            anAction.setTitle(with.getTitleProvider().provide(activity));
            anAction.setDesc(name);

            final View decorView = activity.getWindow().getDecorView();
            pageEvent(decorView, anAction);
            if (with.getVisualSetting().isOpen()) {
                TrackerHelper.send((Activity) object, anAction);
            }
            dispatchAction(anAction);
        });
    }

    @Override
    public void onActivityPause(Object obj) {

    }

    private void addAliveFragment(Object obj) {
        View view = null;
        if (obj instanceof Fragment) {
            view = ((Fragment) obj).getView();
        } else if (obj instanceof androidx.fragment.app.Fragment) {
            view = ((androidx.fragment.app.Fragment) obj).getView();
        }

        if (view != null) {
            int viewCode = view.hashCode();
            sAliveFragMap.put(obj.hashCode(), new Pair<>(viewCode, obj.getClass().getSimpleName()));
        }
    }

    private void removeAliveFragment(Object obj) {
        if (obj != null) {
            sAliveFragMap.remove(obj.hashCode());
        }
    }

    private void tryGc() {
        Runtime.getRuntime().gc();
    }

    public static class ViewHolder {
        // 关联 track id
        private final String id;
        private final WeakReference<View> viewWeakReference;

        public ViewHolder(String id, View view) {
            this.id = id;
            this.viewWeakReference = new WeakReference<>(view);
        }

        public String getId() {
            return id;
        }

        @Nullable
        public View getView() {
            final WeakReference<View> reference = viewWeakReference;
            if (reference != null) {
                return reference.get();
            }
            return null;
        }
    }
}
