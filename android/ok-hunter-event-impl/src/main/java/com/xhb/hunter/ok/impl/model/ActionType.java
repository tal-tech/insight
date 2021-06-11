package com.xhb.hunter.ok.impl.model;

public enum ActionType {
    onCreate(1), onClick(2), onLoadUrl(3), onStayTime(4), onEnter(5), onLeft(6), xpEvent(7), onLoadUrlDelta(8), flutterEvent(9), onVisibleToUser(10);

    private int type;

    ActionType(int type) {
        this.type = type;
    }

    public int getType() {
        return type;
    }

    public static ActionType from(int type) {
        for (ActionType actionType : ActionType.values()) {
            if (actionType.getType() == type) {
                return actionType;
            }
        }
        throw new IllegalArgumentException("unknown action type");
    }
}
