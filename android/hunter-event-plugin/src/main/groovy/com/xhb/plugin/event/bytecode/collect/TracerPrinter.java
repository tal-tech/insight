package com.xhb.plugin.event.bytecode.collect;

import com.xhb.plugin.event.bytecode.module.TraceMethod;
import com.xhb.plugin.event.bytecode.module.TraceWrapper;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by Jacky on 2020-05-14
 */
public final class TracerPrinter {
    private static final Map<String, TraceWrapper> map = new ConcurrentHashMap<>();


    static void add(String className, TraceWrapper wrapper) {
        if (map.containsKey(className)) {
            return;
        }

        map.put(className, wrapper);
    }

    public static void startTrace(File file) {
        if (file.exists()) {
            file.delete();
        }

        file.getParentFile().mkdirs();

        // print
        FileWriter fileWriter = null;
        try {
            fileWriter = new FileWriter(file, true);
        } catch (IOException e) {
            e.printStackTrace();
        }

        if (fileWriter == null) {
            return;
        }

        addHeader(fileWriter);
        for (Map.Entry<String, TraceWrapper> next : map.entrySet()) {
            final String key = next.getKey();
            try {
                fileWriter
                    .append(String.format(Locale.ENGLISH, "visit class[I]:%s", key));
                final TraceWrapper value = next.getValue();
                fileWriter.append("\n")
                    .append(value.traceClass.toString());

                int methodId = 0;
                for (TraceMethod traceMethod : value.traceMethods) {
                    fileWriter
                        .append(String.format(Locale.ENGLISH, "\nvisit Method[%d]", methodId++))
                        .append(traceMethod.toString());
                }

                fileWriter
                    .append("\n")
                    .append("=====================================================================")
                    .append("\n\n");
                fileWriter.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private static void addHeader(FileWriter fileWriter) {
        try {
            final SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy MM-dd HH:mm:ss", Locale.CHINA);
            final String format = simpleDateFormat.format(new Date(System.currentTimeMillis()));
            fileWriter.append(format).append("\n");

            final int size = map.size();
            int method = 0;
            for (TraceWrapper value : map.values()) {
                method += value.traceMethods.size();
            }
            fileWriter.append("trace class count:").append(String.valueOf(size))
                .append("trace method count:").append(String.valueOf(method))
                .append("\n");
            fileWriter.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
