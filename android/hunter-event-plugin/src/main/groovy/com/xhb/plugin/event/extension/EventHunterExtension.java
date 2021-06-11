package com.xhb.plugin.event.extension;

import com.quinn.hunter.transform.RunVariant;

import java.util.ArrayList;
import java.util.List;

public class EventHunterExtension {
    public RunVariant runVariant = RunVariant.ALWAYS;
    public boolean duplicatedClassSafeMode = false;
    public boolean scanAllExceptBlack = false;
    public List<String> whitelist = new ArrayList<>();
    public List<String> blacklist = new ArrayList<>();
}
