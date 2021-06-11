package com.xhb.plugin.event.PluginHelper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * Created by Jacky on 2020-05-14
 */
public class HelpReader {
    public static String getHelper() {
        final InputStream inputStream = HelpReader.class.getClassLoader()
            .getResourceAsStream("plugin.helper");

        if (inputStream != null) {
            final BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
            try {
                String line;
                final StringBuilder strBuilder = new StringBuilder();
                while ((line = bufferedReader.readLine()) != null) {
                    strBuilder.append(line).append("\n");
                }
                strBuilder.deleteCharAt(strBuilder.length() - 1);
                return strBuilder.toString();
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                try {
                    inputStream.close();
                    bufferedReader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return null;
    }
}
