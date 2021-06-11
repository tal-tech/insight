package com.xhb.hunter.ok.impl.model;

import android.os.Parcel;
import android.os.Parcelable;

import androidx.annotation.NonNull;

import com.xhb.hunter.library.event.util.Util;
import com.xhb.hunter.ok.impl.util.Strings;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.UUID;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 * <p>
 * 描述一个事件的 Action
 */
public class AnAction implements Parcelable {
    public static String FRAGMENT_DIVIDER = "#";
    private String id = UUID.randomUUID().toString();

    // 主页面名称
    @NotNull
    private final String main;

    @NotNull
    private final ActionType actionType;

    @NotNull
    private final ActionFrom from;
    @Nullable
    private String fragments;
    @Nullable
    private String title;
    @Nullable
    private String path;
    @Nullable
    private String desc;
    @Nullable
    private Long stayTime;
    @Nullable
    private String buttonKey;
    @Nullable
    private String params;

    @Nullable
    private String pageKey;

    @Nullable
    public String getParams() {
        return params;
    }

    public void setParams(@Nullable String params) {
        this.params = params;
    }

    public void setPageKey(@Nullable String pageKey) {
        this.pageKey = pageKey;
    }

    @Nullable
    public String getFragments() {
        return fragments;
    }

    public void setFragments(@Nullable String fragments) {
        this.fragments = fragments;
    }

    @Nullable
    public String getTitle() {
        return title;
    }

    public void setTitle(@Nullable String title) {
        this.title = title;
    }

    @Nullable
    public String getPath() {
        return path;
    }

    public void setPath(@Nullable String path) {
        this.path = path;
    }

    @Nullable
    public String getDesc() {
        return desc;
    }

    public void setDesc(@Nullable String desc) {
        this.desc = desc;
    }

    @Nullable
    public Long getStayTime() {
        return stayTime;
    }

    public void setStayTime(@Nullable Long stayTime) {
        this.stayTime = stayTime;
    }

    @Nullable
    public String getButtonKey() {
        return buttonKey;
    }

    public void setButtonKey(@Nullable String buttonKey) {
        this.buttonKey = buttonKey;
    }

    public String getId() {
        return id;
    }

    @NotNull
    public String getMain() {
        return main;
    }

    @NotNull
    public ActionType getActionType() {
        return actionType;
    }

    @NotNull
    public ActionFrom getFrom() {
        return from;
    }

    /**
     * @return '${Activity}#{$fragment1}#{$fragment2}'
     */
    @NonNull
    public String getFullName() {
        if (Strings.isNotBlank(fragments)) {
            return main + FRAGMENT_DIVIDER + fragments;
        }

        return main;
    }

    @Nullable
    public String getPageKey() {
        return pageKey;
    }

    private AnAction(@NotNull String main, @NotNull ActionType actionType, @NotNull ActionFrom from) {
        this.main = Util.ensureNoNull(main);
        this.actionType = Util.ensureNoNull(actionType);
        this.from = Util.ensureNoNull(from);


    }

    protected AnAction(Parcel in) {
        id = in.readString();
        main = in.readString();
        actionType = ActionType.from(in.readInt());
        from = ActionFrom.values()[in.readInt()];
        fragments = in.readString();
        title = in.readString();
        path = in.readString();
        desc = in.readString();
        if (in.readByte() == 0) {
            stayTime = null;
        } else {
            stayTime = in.readLong();
        }
        buttonKey = in.readString();
        pageKey = in.readString();
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(id);
        dest.writeString(main);
        dest.writeInt(actionType.getType());
        dest.writeInt(from.ordinal());
        dest.writeString(fragments);
        dest.writeString(title);
        dest.writeString(path);
        dest.writeString(desc);
        if (stayTime == null) {
            dest.writeByte((byte) 0);
        } else {
            dest.writeByte((byte) 1);
            dest.writeLong(stayTime);
        }
        dest.writeString(buttonKey);
        dest.writeString(pageKey);
    }

    public static AnAction create(@NotNull String componentName, @NotNull ActionType actionType, @NotNull ActionFrom from) {
        return new AnAction(componentName, actionType, from);
    }

    @Override
    public int describeContents() {
        return 0;
    }

    public static final Creator<AnAction> CREATOR = new Creator<AnAction>() {
        @Override
        public AnAction createFromParcel(Parcel in) {
            return new AnAction(in);
        }

        @Override
        public AnAction[] newArray(int size) {
            return new AnAction[size];
        }
    };

    @Override
    public String toString() {
        return "AnAction{" +
            "id='" + id + '\'' +
            ", main='" + main + '\'' +
            ", actionType=" + actionType +
            ", from=" + from +
            ", fragments='" + fragments + '\'' +
            ", title='" + title + '\'' +
            ", path='" + path + '\'' +
            ", desc='" + desc + '\'' +
            ", stayTime=" + stayTime +
            ", buttonKey='" + buttonKey + '\'' +
            ", params='" + params + '\'' +
            ", pageKey='" + pageKey + '\'' +
            '}';
    }
}
