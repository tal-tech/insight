package com.xhb.hunter.ok.impl.util;

import org.jetbrains.annotations.NotNull;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class Strings {
    public static String empty = "";

    // Don't let anyone instantiate this class.
    private Strings() {
        // This constructor is intentionally empty.
    }

    /**
     * Compare protocol commands, why we don't use
     * string.equals/string.equalsIgnoreCase is because we need to make it be
     * easy maintained. Like, if we want to make the command comparison be case
     * insensitive, we only need to change this method.
     *
     * @param cmd     the first command
     * @param another another command
     * @return true for command equality, false for otherwise
     */
    public static boolean equalCommands(final String cmd, final String another) {
        return equalsIgnoreCase(cmd, another);
    }

    /**
     * Compare user names, why we don't use
     * string.equals/string.equalsIgnoreCase is because we need to make it be
     * easy maintained. Like, if we want to make the name comparison be case
     * insensitive, we only need to change this method.
     *
     * @param name    the first name
     * @param another another name
     * @return true for name equality, false for otherwise
     */
    public static boolean equalNames(final String name, final String another) {
        return equals(name, another);
    }

    /**
     * Checks if two strings are equals. What this method differs from
     * String.equals(s) is that this method allows the strings to be null.
     *
     * @param s1 the first input string
     * @param s2 the second input string
     * @return true when two not null strings are equal, false for otherwise.
     */
    public static boolean equals(final String s1, final String s2) {
        return (s1 == null && s2 == null) || (s1 != null && s2 != null && s1.equals(s2));
    }

    /**
     * Checks if two strings are equal case insensitively. What this method
     * differs from String.equals(s) is that this method allows the strings to
     * be null.
     *
     * @param s1 the first input string
     * @param s2 the second input string
     * @return true when two not null strings are equal case insensitively,
     * false for otherwise.
     */
    public static boolean equalsIgnoreCase(final String s1, final String s2) {
        return (s1 == null && s2 == null) || (s1 != null && s2 != null && s1.equalsIgnoreCase(s2));
    }

    /**
     * Checks if all the chars in the string are digits.
     *
     * @param value the input string
     * @return true for all digits, false for otherwise.
     */
    public static boolean isDigits(final String value) {
        return !isNullOrEmpty(value) && value.matches("-?\\d+");
    }

    /**
     * Joins multiple strings to a string with specified separator.
     *
     * @param strings   The set of strings;
     * @param separator The specified separator
     * @return The joined string.
     */
    public static String joinStrings(final Iterable<? extends CharSequence> strings, final char separator) {
        return joinCollection(strings, separator);
    }

    /**
     * Checks if the string is null or empty.
     *
     * @param value the input string
     * @return true when the string is either null or empty, false for
     * otherwise.
     */
    public static boolean isNullOrEmpty(final CharSequence value) {
        return value == null || value.length() == 0;
    }

    public static boolean parseBoolean(final String value) {
        return Strings.equals("1", value) || Boolean.parseBoolean(value);
    }

    /**
     * Joins multiple numbers to a string with specified separator.
     *
     * @param numbers   The set of numbers
     * @param separator The specified separator
     * @return The joined string.
     */
    public static String joinLong(final Iterable<Long> numbers, final char separator) {
        return joinCollection(numbers, separator);
    }

    /**
     * Joins multiple items to a string with specified separator.
     *
     * @param items     The set of items
     * @param separator The specified separator
     * @return The joined string.
     */
    private static <T> String joinCollection(final Iterable<T> items, final char separator) {
        if (items == null) {
            return "";
        }
        final StringBuilder builder = new StringBuilder();
        boolean first = true;
        for (final T item : items) {
            if (!first) {
                builder.append(separator);
            }
            builder.append(item);
            first = false;
        }
        return builder.toString();
    }

    public static boolean isNotBlank(String value) {
        return !isBlank(value);
    }

    /**
     * 去除字符串中的空格\t、回车\n、换行符\r、制表符\t
     *
     * @param src
     */
    @NotNull
    public static String simplify(String src) {
        if (src != null) {
            Pattern p = Pattern.compile("\\s*|\t|\r|\n");
            Matcher m = p.matcher(src);
            return m.replaceAll("");
        }

        return "";
    }

    public static boolean isBlank(final CharSequence cs) {
        int strLen;
        if (cs == null || (strLen = cs.length()) == 0) {
            return true;
        }
        for (int i = 0; i < strLen; i++) {
            if (Character.isWhitespace(cs.charAt(i)) == false) {
                return false;
            }
        }
        return true;
    }
}
