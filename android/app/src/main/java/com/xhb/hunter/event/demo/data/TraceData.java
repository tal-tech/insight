package com.xhb.hunter.event.demo.data;


import com.xhb.hunter.library.event.util.JsonConvert;

import org.jetbrains.annotations.NotNull;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by Jacky on 2021/1/4
 */
public final class TraceData implements JsonObjectAble {
    private final JSONObject jsonObject;

    private TraceData(@NotNull JSONObject jsonObject) {
        this.jsonObject = jsonObject;
    }

    @Override
    public JSONObject toJsonObject() {
        return jsonObject;
    }

    public static class Builder {
        private final JSONObject jsonObject = new JSONObject();

        public Builder put(String key, Object object) {
            try {
                if (JsonConvert.isPrimitiveType(object)) {
                    jsonObject.put(key, object);
                } else {
                    jsonObject.put(key, JsonConvert.toJson(object));
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
            return this;
        }

        public TraceData build() {
            return new TraceData(jsonObject);
        }
    }
}
