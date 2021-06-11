package com.xhb.hunter.library.event;

import android.app.Application;

import com.xhb.hunter.library.event.core.base.Registry;
import com.xhb.hunter.library.event.core.event.EventListener;
import com.xhb.hunter.library.event.core.provider.ButtonKeyProvider;
import com.xhb.hunter.library.event.core.provider.DescProvider;
import com.xhb.hunter.library.event.core.provider.FragmentPathProvider;
import com.xhb.hunter.library.event.core.provider.ParamsProvider;
import com.xhb.hunter.library.event.core.provider.TitleProvider;
import com.xhb.hunter.library.event.core.provider.ViewPathProvider;
import com.xhb.hunter.library.event.core.visual.VisualSetting;
import com.xhb.hunter.library.event.impl.DefaultDescProvider;
import com.xhb.hunter.library.event.impl.DefaultTitleProvider;
import com.xhb.hunter.library.event.util.Util;

import java.io.Closeable;
import java.io.IOException;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */
public final class EventInitializer implements Closeable {
    private final Application application;
    private final VisualSetting visualSetting;
    private final TitleProvider titleProvider;
    private final FragmentPathProvider fragmentPathProvider;
    private final DescProvider descProvider;
    private final ViewPathProvider viewPathProvider;
    private final ButtonKeyProvider buttonKeyProvider;
    private final ParamsProvider paramsProvider;

    private static volatile EventInitializer sInstance;

    public Application getApplication() {
        return application;
    }

    public TitleProvider getTitleProvider() {
        return titleProvider;
    }

    public FragmentPathProvider getFragmentPathProvider() {
        return fragmentPathProvider;
    }

    public DescProvider getDescProvider() {
        return descProvider;
    }

    public ViewPathProvider getViewPathProvider() {
        return viewPathProvider;
    }

    public ButtonKeyProvider getButtonKeyProvider() {
        return buttonKeyProvider;
    }

    public VisualSetting getVisualSetting() {
        return visualSetting;
    }

    public ParamsProvider getParamsProvider() {
        return paramsProvider;
    }

    public static boolean isInstalled() {
        return sInstance != null;
    }

    public static EventInitializer with() {
        if (sInstance == null) {
            throw new RuntimeException("you must init Event sdk first");
        }
        return sInstance;
    }

    public static EventInitializer init(EventInitializer initializer) {
        synchronized (EventInitializer.class) {
            if (isInstalled()) {
                throw new IllegalStateException("you have init event sdk");
            }
            sInstance = Util.ensureNoNull(initializer, "Event init, EventInitializer should not be null.");
        }
        return sInstance;
    }

    public EventInitializer(Application application, Registry<EventListener> registry, VisualSetting visualSetting, TitleProvider titleProvider, FragmentPathProvider fragmentPathProvider, DescProvider descProvider, ViewPathProvider viewPathProvider, ButtonKeyProvider buttonKeyProvider, ParamsProvider paramsProvider) {
        this.application = application;
        this.visualSetting = visualSetting;
        this.titleProvider = titleProvider;
        this.fragmentPathProvider = fragmentPathProvider;
        this.descProvider = descProvider;
        this.viewPathProvider = viewPathProvider;
        this.buttonKeyProvider = buttonKeyProvider;
        this.paramsProvider = paramsProvider;
        EventManager.addEventListeners(registry);
    }

    @Override
    public void close() throws IOException {
        // todo
    }

    public static class Builder {
        private final Application application;
        private final Registry<EventListener> registry = new Registry<>();
        private VisualSetting visualSetting;
        private TitleProvider titleProvider;
        private FragmentPathProvider fragmentPathProvider;
        private DescProvider descProvider;
        private ViewPathProvider viewPathProvider;
        private ButtonKeyProvider buttonKeyProvider;
        private ParamsProvider paramsProvider;

        public Builder(Application application) {
            this.application = Util.ensureNoNull(application);
        }

        public Builder addEventListener(EventListener listener) {
            registry.addListener(Util.ensureNoNull(listener));
            return this;
        }

        public Builder setVisualSetting(VisualSetting visualSetting) {
            this.visualSetting = visualSetting;
            return this;
        }

        public Builder setTitleProvider(TitleProvider titleProvider) {
            this.titleProvider = titleProvider;
            return this;
        }

        public Builder setFragmentPathProvider(FragmentPathProvider fragmentPathProvider) {
            this.fragmentPathProvider = fragmentPathProvider;
            return this;
        }

        public Builder setDescProvider(DescProvider descProvider) {
            this.descProvider = descProvider;
            return this;
        }

        public Builder setViewPathProvider(ViewPathProvider viewPathProvider) {
            this.viewPathProvider = viewPathProvider;
            return this;
        }

        public Builder setButtonKeyProvider(ButtonKeyProvider buttonKeyProvider) {
            this.buttonKeyProvider = buttonKeyProvider;
            return this;
        }

        public Builder setParamsProvider(ParamsProvider paramsProvider) {
            this.paramsProvider = paramsProvider;
            return this;
        }

        public EventInitializer build() {
            return new EventInitializer(
                application,
                registry,
                visualSetting == null ? visualSetting.EMPTY : visualSetting,
                titleProvider == null ? new DefaultTitleProvider() : titleProvider,
                fragmentPathProvider == null ? FragmentPathProvider.EMPTY : fragmentPathProvider,
                descProvider == null ? new DefaultDescProvider() : descProvider,
                viewPathProvider == null ? ViewPathProvider.EMPTY : viewPathProvider,
                buttonKeyProvider == null ? ButtonKeyProvider.EMPTY : buttonKeyProvider,
                paramsProvider == null ? ParamsProvider.EMPTY : paramsProvider
            );
        }

    }

}
