import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, ScrollView, StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export const FEATURED_BANNERS: string[] = [
  "https://img.magnific.com/premium-vector/black-friday-sale-poster-with-gift-box-tags-vector-illustration_696265-4131.jpg?w=1480",
  "https://img.magnific.com/premium-vector/black-friday-web-banner-social-media-cover-template-modern-banner-with-retro-vintage-style_612040-4911.jpg?w=1060",
];

const AUTO_SCROLL_MS = 3000;

export function FeaturedBanners() {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (FEATURED_BANNERS.length < 2) return;
    const timer = setInterval(() => {
      const next = (activeIndex + 1) % FEATURED_BANNERS.length;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
    }, AUTO_SCROLL_MS);
    return () => clearInterval(timer);
  }, [activeIndex, width]);

  if (FEATURED_BANNERS.length === 0) return null;

  function handleLayout(event: LayoutChangeEvent) {
    setWidth(event.nativeEvent.layout.width);
  }

  function handleMomentumEnd(event: {
    nativeEvent: { contentOffset: { x: number } };
  }) {
    if (width === 0) return;
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(Math.max(0, Math.min(index, FEATURED_BANNERS.length - 1)));
  }

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {width > 0 ? (
        <>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumEnd}
          >
            {FEATURED_BANNERS.map((uri, index) => (
              <View key={`${uri}-${index}`} style={[styles.slide, { width }]}>
                <Image
                  source={{ uri }}
                  style={styles.banner}
                  contentFit="cover"
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.dots}>
            {FEATURED_BANNERS.map((uri, index) => (
              <View
                key={`${uri}-${index}`}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === activeIndex
                        ? theme.text
                        : theme.backgroundSelected,
                  },
                ]}
              />
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
  },
  slide: {
    width: "100%",
  },
  banner: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    backgroundColor: "#F0F0F3",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.one,
    paddingTop: Spacing.two,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
