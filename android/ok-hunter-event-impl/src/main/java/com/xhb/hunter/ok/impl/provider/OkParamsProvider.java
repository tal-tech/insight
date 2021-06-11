package com.xhb.hunter.ok.impl.provider;

import android.view.View;
import android.widget.CompoundButton;

import com.xhb.hunter.library.event.core.base.JsonObjectAble;
import com.xhb.hunter.library.event.core.provider.ParamsProvider;
import com.xhb.hunter.ok.impl.support.data.TraceDataKt;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * @author yangjianfei <a href="y">Contact me.</a>
 * @version 1.0
 */
public class OkParamsProvider implements ParamsProvider {

    @Override
    public JsonObjectAble provide(View view) {
        JsonObjectAble traceData = TraceDataKt.getTraceData(view);
        if (view instanceof CompoundButton) {
            final CompoundButton compoundButton = (CompoundButton) view;
            JsonObjectAble finalJsonObjectAble = traceData;
            final boolean checked = compoundButton.isChecked();
            traceData = () -> {
                final JSONObject result = finalJsonObjectAble != null ? finalJsonObjectAble.toJsonObject() : new JSONObject();
                try {
                    result.put("value", checked ? "open" : "close");
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                return result;
            };
        }

        return traceData;
    }

}
