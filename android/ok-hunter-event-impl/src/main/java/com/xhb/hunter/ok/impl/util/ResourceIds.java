package com.xhb.hunter.ok.impl.util;

public interface ResourceIds {
    boolean knownIdName(String name);

    int idFromName(String name);

    String nameForId(int id);
}
