package com.storyreading.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SlugUtilsTest {

    @Test
    public void testToSlug_Basic() {
        assertEquals("hello-world", SlugUtils.toSlug("Hello World"));
    }

    @Test
    public void testToSlug_Vietnamese() {
        assertEquals("dac-nhan-tam", SlugUtils.toSlug("Đắc Nhân Tâm"));
        assertEquals("truyen-cua-toi-co-chu-d", SlugUtils.toSlug("Truyện của tôi có chữ đ"));
    }

    @Test
    public void testToSlug_SpecialCharacters() {
        assertEquals("story-title-123", SlugUtils.toSlug("Story Title! #123"));
    }

    @Test
    public void testToSlug_Empty() {
        assertEquals("", SlugUtils.toSlug(""));
        assertEquals("", SlugUtils.toSlug(null));
    }
}
