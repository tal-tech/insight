package com.xhb.hunter.ok.impl.util;

import android.app.Fragment;
import android.content.Context;
import android.text.TextUtils;
import android.util.Log;
import android.util.Pair;
import android.util.SparseArray;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.AdapterView;
import android.widget.ExpandableListView;

import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager.widget.ViewPager;

import com.xhb.hunter.ok.impl.ConfigConstants;
import com.xhb.hunter.ok.impl.model.AnAction;

import org.jetbrains.annotations.NotNull;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PathUtil {
    private static String MainWindowType = "/MainWindow";
    private static final int NO_POSITION = -1;
    public final static String EXCEPTION = "Exception";
    private static final int MAX_CLASS_NAME_CACHE_SIZE = 255;
    public static final ClassNameCache sClassnameCache = new ClassNameCache(MAX_CLASS_NAME_CACHE_SIZE);

    public static String getResIdName(Context context, View view) {
        final int viewId = view.getId();
        if (-1 == viewId) {
            return null;
        } else {
            return ResourceReader.Ids.getInstance(context).nameForId(viewId);
        }
    }

    public static String dumpFragments(Fragment fragment) {
        Fragment f = fragment;
        StringBuilder builder = new StringBuilder();
        while (f != null) {
            builder.insert(0, f.getClass().getSimpleName());
            builder.insert(0, AnAction.FRAGMENT_DIVIDER);
            f = f.getParentFragment();
        }
        builder.deleteCharAt(builder.length() - 1);
        return builder.toString();
    }

    public static String dumpFragments(androidx.fragment.app.Fragment fragment) {
        androidx.fragment.app.Fragment f = fragment;
        StringBuilder builder = new StringBuilder();
        while (f != null) {
            builder.insert(0, f.getClass().getSimpleName());
            builder.insert(0, AnAction.FRAGMENT_DIVIDER);
            f = f.getParentFragment();
        }
        builder.deleteCharAt(builder.length() - 1);
        return builder.toString();
    }

    public static Object getDataObj(Object obj, String dataPath) {
        // 按照路径dataPath搜集数据
        String[] paths = dataPath.split("\\.");
        Object refer = obj;
        for (int j = 0; j < paths.length; j++) {
            String path = paths[j];
            switch (path) {
                case ConfigConstants.START_THIS:
                    refer = obj;
                    break;
                case ConfigConstants.START_ITEM:
                    if (obj instanceof View) {
                        // 路径的起点
                        View view = (View) obj;
                        Object viewParent = view.getParent();
                        if (ReflectorUtil.isInstanceOfV7RecyclerView(viewParent)) {
                            RecyclerView recyclerView = (RecyclerView) viewParent;
                            RecyclerView.ViewHolder vh = recyclerView.getChildViewHolder(view);
                            refer = vh;
                        }
                    }
                    break;
                case ConfigConstants.KEY_CONTEXT:
                    refer = ((View) refer).getContext();
                    break;
                case ConfigConstants.KEY_PARENT:

                    break;
                default:
                    // 反射获取变量值
                    refer = ReflectUtil.getObjAttr(refer, path);
                    break;
            }
        }

        return refer;
    }

    public static String getViewPath(View view, SparseArray<Pair<Integer, String>> aliveFragments) {
        StringBuilder builder = new StringBuilder();
        ViewParent parent = view.getParent();
        View child = view;
        while (parent instanceof ViewGroup) {
            ViewGroup group = (ViewGroup) parent;
            // 根据parent推算[index]部分
            String validIndexSegment;
            if (group instanceof AdapterView) {
                validIndexSegment = buildAdapterViewItemIndex(child, group);
            } else if (ReflectorUtil.isInstanceOfV7RecyclerView(group)) {
                validIndexSegment = buildRecyclerViewItemIndex(child, group);
            } else if (ReflectorUtil.isInstanceOfV4ViewPager(group)) {
                validIndexSegment = buildViewPagerItemIndex(aliveFragments, child, (ViewPager) group);
            } else {
                int index = getChildIndex(group, child);
                String indexStr = (index == NO_POSITION ? "-" : String.valueOf(index));
                validIndexSegment = "[" + indexStr + "]";
            }

            String elementFrag = buildFragmentSegment(aliveFragments, child, validIndexSegment);
            if (TextUtils.isEmpty(elementFrag)) {
                StringBuilder element = new StringBuilder();
                element.append(child.getClass().getSimpleName())
                    .append(validIndexSegment);
                String childDistinctId = getResIdName(group.getContext().getApplicationContext(), child);
                if (childDistinctId != null) {
                    element.append("#").append(childDistinctId);
                }
                element.append("/");
                builder.insert(0, element.toString());
                if ("android:content".equals(childDistinctId)) {
                    break;
                }
            } else {
                builder.insert(0, elementFrag);
            }

            child = group;
            parent = group.getParent();
        }
        return builder.toString();
    }

    /**
     * 如果有多个 fragment 通过 '#' 分割
     *
     * @param view
     * @param aliveFragments
     * @return
     */
    public static String getFragments(@NotNull View view, SparseArray<Pair<Integer, String>> aliveFragments) {
        ViewParent parent = view.getParent();
        View child = view;
        StringBuilder fs = null;
        while (parent instanceof ViewGroup) {
            ViewGroup group = (ViewGroup) parent;
            final String fragment = findFragment(aliveFragments, child);
            if (fragment != null) {
                if (fs == null) {
                    fs = new StringBuilder(fragment);
                } else {
                    fs.insert(0, fragment + "#");
                }
            }

            child = group;
            parent = group.getParent();
        }

        return fs == null ? null : fs.toString();
    }

    private static String buildViewPagerItemIndex(SparseArray<Pair<Integer, String>> aliveFragments, View child, ViewPager group) {
        int index = NO_POSITION;
        // ViewPager
        ViewPager _group = group;
        try {
            if (!ReflectorUtil.isV4ViewPagerCached) {
                ReflectorUtil.cacheV4ViewPager();// reflects fields and caches the result
            }
            if (ReflectorUtil.isV4ViewPagerCached) {
                List items = (List) ReflectorUtil.fieldmItems.get(_group);
                int position = _group.getCurrentItem();
                for (int i = 0; items != null && i < items.size(); i++) {
                    Object item = items.get(i);
                    int itemPosition = (int) ReflectorUtil.fieldPosition.get(item);
                    if (itemPosition == position) {
                        Object currPagerObject = ReflectorUtil.fieldObject.get(item);
                        boolean isViewFromObject = _group.getAdapter().isViewFromObject(child, currPagerObject);
                        Log.d("ViewPagerItemView", "@items.size = " + items.size() + ", @isViewFromObject = " + isViewFromObject + ", @position = " + position + ", @child = " + child.getClass().getSimpleName());
                        if (isViewFromObject) {
                            index = position;
                            if (currPagerObject instanceof Fragment || ReflectorUtil.isInstanceOfV4Fragment(currPagerObject)) {
                                int viewCode = (currPagerObject instanceof Fragment) ? ((Fragment) currPagerObject).getView().hashCode() : ((androidx.fragment.app.Fragment) currPagerObject).getView().hashCode();
                                aliveFragments.put(currPagerObject.hashCode(), new Pair<Integer, String>(viewCode, currPagerObject.getClass().getSimpleName()));
                            }
                            break;
                        }
                    }
                }
            }
        } catch (Exception e) {
            Log.e(EXCEPTION, e.getLocalizedMessage());
        }
        if (index == NO_POSITION) {
            index = getChildIndex(group, child);
        }
        return "[" + index + "]";
    }

    private static String buildRecyclerViewItemIndex(View child, ViewGroup group) {
        int index = getChildPositionForRecyclerView(child, group);
        return "[" + index + "]";
    }

    private static String buildAdapterViewItemIndex(View child, ViewGroup group) {
        int index = ((AdapterView) group).getPositionForView(child);
        // ExpandableListView
        if (group instanceof ExpandableListView) {
            StringBuilder element = new StringBuilder();
            String exListIndicator = "";
            ExpandableListView _group = (ExpandableListView) group;
            long l = _group.getExpandableListPosition(index);
            int groupIndex;
            if (ExpandableListView.getPackedPositionType(l) == ExpandableListView.PACKED_POSITION_TYPE_NULL) {
                if (index < _group.getHeaderViewsCount()) {
                    exListIndicator = "[header:" + index + "]";// header
                } else {
                    groupIndex = index - (_group.getCount() - _group.getFooterViewsCount());
                    exListIndicator = "[footer:" + groupIndex + "]";// footer
                }
            } else {
                groupIndex = ExpandableListView.getPackedPositionGroup(l);
                int childIndex = ExpandableListView.getPackedPositionChild(l);
                if (childIndex != -1) {
                    exListIndicator = "[group:" + groupIndex + ",child:" + childIndex + "]";// group/child
                } else {
                    exListIndicator = "[group:" + groupIndex + "]";// group
                }
            }
            Log.d("ExpandableListViewItem", "@index = " + index + ", @exListIndicator = " + exListIndicator);
            return exListIndicator;
        }

        return "[" + index + "]";
    }

    /**
     * 判断child是否是Fragment View实例
     *
     * @param aliveFragments
     * @param child
     * @return
     */
    private static String buildFragmentSegment(SparseArray<Pair<Integer, String>> aliveFragments, View child, String validIndexSegment) {
        // deal with Fragment
        StringBuilder element = new StringBuilder();
        if (aliveFragments != null) {
            final int size = aliveFragments.size();
            for (int i = 0; i < size; i++) {
                Pair<Integer, String> pair = aliveFragments.valueAt(i);
                int viewCode = pair.first;
                String fragName = pair.second;
                if (viewCode == child.hashCode()) {
                    element.append("/")
                        .append(fragName)
                        .append(validIndexSegment);
                    Log.d(fragName, "@fragIndex = " + validIndexSegment + "@view = " + child + ", @fragment = " + fragName);
                    break;
                }
            }
        }
        return element.toString();
    }

    /**
     * 判断child是否是Fragment View实例
     *
     * @param aliveFragments
     * @param child
     * @return
     */
    private static String findFragment(SparseArray<Pair<Integer, String>> aliveFragments, View child) {
        // deal with Fragment
        if (aliveFragments != null) {
            final int size = aliveFragments.size();
            for (int i = 0; i < size; i++) {
                Pair<Integer, String> pair = aliveFragments.valueAt(i);
                int viewCode = pair.first;
                String fragName = pair.second;
                if (viewCode == child.hashCode()) {
                    return fragName;
                }
            }
        }
        return null;
    }

    public static int getChildPositionForRecyclerView(View child, ViewGroup group) {
        if ((ReflectorUtil.isV7RecyclerViewLoaded) && ((group instanceof RecyclerView))) {
            RecyclerView localRecyclerView = (RecyclerView) group;
            if (ReflectorUtil.hasChildAdapterPosition) {
                return localRecyclerView.getChildAdapterPosition(child);
            }
            return localRecyclerView.getChildPosition(child);
        }
        if ((ReflectorUtil.isV7RecyclerViewCached) && (group.getClass().equals(ReflectorUtil.sClassRecyclerView))) {
            try {
                return ((Integer) ReflectorUtil.methodItemPosition.invoke(group, new Object[]{child})).intValue();
            } catch (Exception e) {
                Log.e(EXCEPTION, e.getLocalizedMessage());
            }
        }
        return NO_POSITION;
    }

    private static int getChildIndex(ViewGroup parent, View child) {
        if (parent == null) {
            return NO_POSITION;
        }

        final String childIdName = getResIdName(parent.getContext().getApplicationContext(), child);
        String childClassName = sClassnameCache.get(child.getClass());
        for (int i = 0; i < parent.getChildCount(); i++) {
            View brother = parent.getChildAt(i);

            if (!hasClassName(brother, childClassName)) {
                continue;
            }

            String brotherIdName = getResIdName(parent.getContext().getApplicationContext(), brother);

            if (null != childIdName && !childIdName.equals(brotherIdName)) {
                continue;
            }

            if (brother == child) {
                return i;
            }
        }
        return NO_POSITION;
    }

    public static boolean hasClassName(Object o, String className) {
        Class<?> klass = o.getClass();
        if (klass != null && klass.getCanonicalName() != null && klass.getCanonicalName().equals(className)) {
            return true;
        }
        return false;
    }

    private static String getMainWindowType() {
        return MainWindowType;
    }

    /**
     * 当条件满足时，将返回true，否则返回false
     *
     * @param currViewPath
     * @param viewPath
     * @return
     */
    public static boolean match(String currViewPath, String viewPath) {
        if (TextUtils.isEmpty(currViewPath) || TextUtils.isEmpty(viewPath)) {
            return false;
        }
        try {
            Pattern pattern = Pattern.compile(viewPath);
            Matcher matcher = pattern.matcher(currViewPath);
            return matcher.matches();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
