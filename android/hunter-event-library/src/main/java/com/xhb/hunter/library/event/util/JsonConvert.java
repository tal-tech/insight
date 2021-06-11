package com.xhb.hunter.library.event.util;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class JsonConvert {
    public static JSONObject toJsonMap(Map<String, Object> map) {
        JSONObject jsonObject = new JSONObject();

        for (String key : map.keySet()) {
            try {
                Object obj = map.get(key);
                if (obj instanceof Map) {
                    jsonObject.put(key, toJsonMap((Map) obj));
                } else if (obj instanceof List) {
                    jsonObject.put(key, toJsonList((List) obj));
                } else if (isPrimitiveType(obj)) {
                    jsonObject.put(key, obj);
                } else {
                    jsonObject.put(key, toJson(map.get(key)));
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return jsonObject;
    }

    // attention: java.util.ConcurrentModificationException
    public static JSONArray toJsonList(List<? extends Object> list) {
        JSONArray jsonArray = new JSONArray();

        for (Object obj : list) {
            if (obj instanceof Map) {
                jsonArray.put(toJsonMap((Map) obj));
            } else if (obj instanceof List) {
                jsonArray.put(toJsonList((List) obj));
            } else if (isPrimitiveType(obj)) {
                jsonArray.put(obj);
            } else if (obj != null) {
                jsonArray.put(toJson(obj));
            }
        }
        return jsonArray;
    }

    public static boolean isPrimitiveType(Object object) {
        return object instanceof String
            || object instanceof Boolean
            || object instanceof Enum
            || object instanceof Number;
    }

    public static JSONObject toJson(Object object) {
        List<Field> fields = getAllFields(new LinkedList<Field>(), object.getClass());
        JSONObject jsonObject = new JSONObject();
        for (Field field : fields) {
            if (Modifier.isStatic(field.getModifiers())) {
                continue;
            }
            try {
                field.setAccessible(true);
                Object value = field.get(object);
                if (value == null) {
                    continue;
                }
                if (field.getName().startsWith("shadow$")) {
                    continue;
                }
                Class<?> fieldType = field.getType();
                if (isPrimitiveType(value) || fieldType.isEnum()) {
                    jsonObject.put(field.getName(), value);
                } else if (Map.class.isAssignableFrom(fieldType)) {
                    if (!((Map) value).isEmpty()) {
                        jsonObject.put(field.getName(), JsonConvert.toJsonMap((Map) value));
                    }
                } else if (List.class.isAssignableFrom(fieldType)) {
                    if (!((List) value).isEmpty()) {
                        jsonObject.put(field.getName(), JsonConvert.toJsonList((List) value));
                    }
                } else {
                    jsonObject.put(field.getName(), toJson(value));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return jsonObject;
    }

    public static List<Field> getAllFields(List<Field> fields, Class<?> type) {
        fields.addAll(Arrays.asList(type.getDeclaredFields()));

        if (type.getSuperclass() != null) {
            getAllFields(fields, type.getSuperclass());
        }

        return fields;
    }

    public static Map<String, Object> fromJson(JSONObject jsonObject) {
        Map<String, Object> map = new HashMap<String, Object>();

        Iterator<String> keyIterator = jsonObject.keys();
        while (keyIterator.hasNext()) {
            String key = keyIterator.next();
            try {
                Object obj = jsonObject.get(key);

                if (obj instanceof JSONObject) {
                    map.put(key, fromJson((JSONObject) obj));
                } else if (obj instanceof JSONArray) {
                    map.put(key, fromJson((JSONArray) obj));
                } else {
                    map.put(key, obj);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        return map;
    }

    public static List<Object> fromJson(JSONArray jsonArray) {
        List<Object> list = new ArrayList<Object>();

        for (int i = 0; i < jsonArray.length(); i++) {
            try {
                Object obj = jsonArray.get(i);

                if (obj instanceof JSONObject) {
                    list.add(fromJson((JSONObject) obj));
                } else if (obj instanceof JSONArray) {
                    list.add(fromJson((JSONArray) obj));
                } else {
                    list.add(obj);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        return list;
    }
}
