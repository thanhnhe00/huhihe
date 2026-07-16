package com.storyreading.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class SlugUtils {
    public static String toSlug(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }
        // Remove accents
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String slug = pattern.matcher(normalized).replaceAll("");

        // Specific Vietnamese characters mapping if normalize didn't catch everything (e.g., đ/Đ)
        slug = slug.replace("đ", "d").replace("Đ", "D");

        // Lowercase, replace non-alphanumeric (excluding hyphens/spaces) with empty, then replace spaces/hyphens with hyphens
        slug = slug.toLowerCase()
                   .replaceAll("[^a-z0-9\\s-]", "")
                   .replaceAll("[\\s-]+", " ")
                   .trim()
                   .replace(' ', '-');

        return slug;
    }
}
