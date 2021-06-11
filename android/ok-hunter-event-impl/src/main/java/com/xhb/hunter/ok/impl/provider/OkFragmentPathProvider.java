package com.xhb.hunter.ok.impl.provider;

import android.util.Pair;
import android.util.SparseArray;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import com.xhb.hunter.library.event.core.provider.FragmentPathProvider;
import com.xhb.hunter.ok.impl.AnOkEventListener;

import org.jetbrains.annotations.NotNull;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */
public class OkFragmentPathProvider implements FragmentPathProvider {

    @Override
    public String provide(View view) {
        return getFragments(view, AnOkEventListener.getInstance().sAliveFragMap);
    }


    public String getFragments(@NotNull View view, SparseArray<Pair<Integer, String>> aliveFragments) {
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

    private String findFragment(SparseArray<Pair<Integer, String>> aliveFragments, View child) {
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

}
