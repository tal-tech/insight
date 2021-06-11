package com.xhb.hunter.ok.impl.util;

import android.app.Activity;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentController;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager.widget.ViewPager;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.List;

public class ReflectorUtil {
    // isLoaded
    public static boolean isV7RecyclerViewLoaded = true;
    public static boolean hasChildAdapterPosition = true;
    public static boolean isV4ViewPagerLoaded = true;
    public static boolean isV4SwipeRefreshLayoutLoaded = true;
    public static boolean isV7AlertDialogLoaded = true;
    public static boolean isV4FragActivityLoaded = true;
    public static boolean isV4FragmentLoaded = true;
    public static boolean isV4FragmentControllerLoaded = true;

    // isCached
    public static boolean isV4ViewPagerCached = false;
    public static boolean isV7RecyclerViewCached = false;

    // class
    public static Class sClassSwipeRefreshLayout;
    public static Class sClassRecyclerView;
    public static Class sClassV4ViewPager;

    // method
    public static Method methodItemPosition;
    public static Method methodLayoutManager;
    public static Method methodCanScrollVertically;
    public static Method methodCanScrollHorizontally;

    // field
    public static Field fieldmFragments;// Field in android.support.v4.app.FragmentActivity
    public static Field fieldmActive;// Field in android.app.FragmentManager
    public static Field fieldmItems;// androidx.viewpager.widget.ViewPager
    public static Field fieldObject;// androidx.viewpager.widget.ViewPager$ItemInfo
    public static Field fieldPosition;// androidx.viewpager.widget.ViewPager$ItemInfo

    public static void cacheV4RecyclerView(Class clazz, String paramString) {
        if ((!isV7RecyclerViewLoaded) || ((!clazz.equals(RecyclerView.class)) && (!isV7RecyclerViewCached) && (paramString.contains("RecyclerView")))) {
            try {
                Class classRecyclerView = getClassRecyclerView(clazz);
                if ((classRecyclerView != null) && (methodItemPosition != null)) {
                    methodLayoutManager = classRecyclerView.getDeclaredMethod("getLayoutManager", new Class[0]);
                    Class classLayoutManager = classRecyclerView.getClassLoader().loadClass(classRecyclerView.getName() + "$LayoutManager");
                    methodCanScrollHorizontally = classLayoutManager.getMethod("canScrollHorizontally", new Class[0]);
                    methodCanScrollVertically = classLayoutManager.getMethod("canScrollVertically", new Class[0]);
                    sClassRecyclerView = clazz;
                    isV7RecyclerViewCached = true;
                }
            } catch (Exception e) {
                Log.e(EXCEPTION, e.getLocalizedMessage());
            }
        }
    }

    public static void cacheV4ViewPager() {
        if (sClassV4ViewPager == null) {
            try {
                sClassV4ViewPager = Class.forName("androidx.viewpager.widget.ViewPager");
            } catch (ClassNotFoundException e) {
                Log.e(EXCEPTION, e.getLocalizedMessage());
            }
        }
        if (!isV4ViewPagerCached && sClassV4ViewPager != null) {
            try {
                fieldmItems = sClassV4ViewPager.getDeclaredField("mItems");
                fieldmItems.setAccessible(true);
                Class classItemInfo = Class.forName("androidx.viewpager.widget.ViewPager$ItemInfo");
                fieldObject = classItemInfo.getDeclaredField("object");
                fieldPosition = classItemInfo.getDeclaredField("position");
                fieldObject.setAccessible(true);
                fieldPosition.setAccessible(true);
                isV4ViewPagerCached = true;
            } catch (Exception e) {
                Log.e(EXCEPTION, e.getLocalizedMessage());
            }
        }
    }

    private static Class getClassRecyclerView(Class clazz) {
        while ((clazz != null) && (!clazz.equals(ViewGroup.class))) {
            try {
                methodItemPosition = clazz.getDeclaredMethod("getChildAdapterPosition", new Class[]{View.class});
            } catch (NoSuchMethodException e) {
            }
            if (methodItemPosition == null) {
                try {
                    methodItemPosition = clazz.getDeclaredMethod("getChildPosition", new Class[]{View.class});
                } catch (NoSuchMethodException e) {
                }
            }
            if (methodItemPosition != null) {
                return clazz;
            }
            clazz = clazz.getSuperclass();
        }
        return null;
    }

    public static List getActiveV4Fragments(Activity activity) {
        List v4Fragments = null;
        if (fieldmFragments == null) {
            getClassFragmentActivity(activity.getClass());
        }
        if (fieldmFragments != null && isV4FragmentControllerLoaded) {
            fieldmFragments.setAccessible(true);
            FragmentController controller = null;
            try {
                controller = (FragmentController) fieldmFragments.get(activity);
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
            if (controller != null) {
                v4Fragments = controller.getActiveFragments(null);
            }
        }
        return v4Fragments;
    }

    public static List getActiveFragments(Activity activity) {
        List fragments = null;
        if (fieldmActive == null) {
            getFragmentManager();
        }
        if (fieldmActive != null) {
            fieldmActive.setAccessible(true);
            try {
                fragments = (List) fieldmActive.get(activity.getFragmentManager());
            } catch (IllegalAccessException e) {
                Log.e(EXCEPTION, e.getLocalizedMessage());
            }
        }
        return fragments;
    }

    private static void getClassFragmentActivity(Class clazz) {
        while ((clazz != null) && (!clazz.equals(FragmentActivity.class))) {
            try {
                fieldmFragments = clazz.getDeclaredField("mFragments");
            } catch (NoSuchFieldException e) {
                Log.e(EXCEPTION, e.getLocalizedMessage());
            }
            if (fieldmFragments != null) {
                return;
            }
            clazz = clazz.getSuperclass();
        }
    }

    private static void getFragmentManager() {
        try {
            Class classFragmentManager = Class.forName("android.app.FragmentManagerImpl");
            fieldmActive = classFragmentManager.getDeclaredField("mActive");
        } catch (Exception e) {
            Log.e(EXCEPTION, e.getLocalizedMessage());
        }
    }

    public static boolean isInstanceOfV7RecyclerView(Object paramObject) {
        return ((isV7RecyclerViewLoaded) && ((paramObject instanceof RecyclerView))) || ((isV7RecyclerViewCached) && (paramObject.getClass() == sClassRecyclerView));
    }

    public static boolean isInstanceOfV4ViewPager(Object paramObject) {
        return (isV4ViewPagerLoaded) && ((paramObject instanceof ViewPager));
    }

    public static boolean isInstanceOfV4FragActivity(Object paramObject) {
        return (isV4FragActivityLoaded) && ((paramObject instanceof FragmentActivity));
    }

    public static boolean isInstanceOfV4Fragment(Object paramObject) {
        return (isV4FragmentLoaded) && ((paramObject instanceof Fragment));
    }

    public final static String EXCEPTION = "Exception";

    static {
        try {
            Class localClass = Class.forName("androidx.recyclerview.widget.RecyclerView");
            localClass.getDeclaredMethod("getChildAdapterPosition", new Class[]{View.class});
        } catch (ClassNotFoundException e) {
            isV7RecyclerViewLoaded = false;
            hasChildAdapterPosition = false;
        } catch (NoSuchMethodException e) {
            hasChildAdapterPosition = false;
        }
        try {
            sClassSwipeRefreshLayout = Class.forName("androidx.swiperefreshlayout.widget.SwipeRefreshLayout");
        } catch (ClassNotFoundException e) {
            isV4SwipeRefreshLayoutLoaded = false;
        }
        try {
            sClassV4ViewPager = Class.forName("androidx.viewpager.widget");
        } catch (ClassNotFoundException e) {
            isV4ViewPagerLoaded = false;
            sClassV4ViewPager = null;
        }
        try {
            Class.forName("androidx.appcompat.app.AlertDialog");
        } catch (ClassNotFoundException e) {
            isV7AlertDialogLoaded = false;
        }
        try {
            Class clazz = Class.forName("androidx.fragment.app.FragmentActivity");
            fieldmFragments = clazz.getDeclaredField("mFragments");
        } catch (ClassNotFoundException e) {
            isV4FragActivityLoaded = false;
        } catch (NoSuchFieldException e) {
            fieldmFragments = null;
        }
        try {
            Class.forName("androidx.fragment.app.Fragment");
        } catch (ClassNotFoundException e) {
            isV4FragmentLoaded = false;
        }
        try {
            Class.forName("androidx.fragment.app.FragmentController");
        } catch (ClassNotFoundException e) {
            isV4FragmentControllerLoaded = false;
        }
    }
}

