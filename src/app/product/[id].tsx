import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useCart } from "@/context/cart-context";
import { useTheme } from "@/hooks/use-theme";
import { getProduct, type Product } from "@/lib/products";
import { ChevronLeft } from "lucide-react-native";

const SCREEN_WIDTH = Math.min(Dimensions.get("window").width, MaxContentWidth);

export default function ProductDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const cart = useCart();
  const insets = useSafeAreaInsets();

  const [product, setProduct] = useState<Product | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const promise = (() => {
      const productId = Number(id);
      if (!Number.isFinite(productId)) {
        return Promise.reject(new Error("Invalid product."));
      }
      return getProduct(productId);
    })();
    promise
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof Error && err.message !== "Invalid product."
            ? "Failed to load product."
            : err instanceof Error
              ? err.message
              : "Failed to load product.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const images = product?.images?.length
    ? product.images
    : product
      ? [product.thumbnail]
      : [];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ThemedView style={styles.appBar}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <ChevronLeft />
          </Pressable>
          <ThemedText
            type="smallBold"
            numberOfLines={1}
            style={styles.appBarTitle}
          >
            Product
          </ThemedText>
          <View style={styles.appBarSpacer} />
        </ThemedView>

        {error ? (
          <ThemedView style={styles.stateBox}>
            <ThemedText themeColor="textSecondary">{error}</ThemedText>
          </ThemedView>
        ) : !product ? (
          <ThemedView style={styles.stateBox}>
            <ActivityIndicator color={theme.text} />
          </ThemedView>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <FlatList
              data={images}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={styles.image}
                  contentFit="cover"
                />
              )}
              keyExtractor={(item, index) => `${item}-${index}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x /
                    event.nativeEvent.layoutMeasurement.width,
                );
                setImageIndex(index);
              }}
            />
            {images.length > 1 ? (
              <ThemedView style={styles.dots}>
                {images.map((_, index) => (
                  <ThemedView
                    key={index}
                    type="background"
                    style={[
                      styles.dot,
                      index === imageIndex && styles.dotActive,
                    ]}
                  />
                ))}
              </ThemedView>
            ) : null}

            <ThemedView style={styles.section}>
              <ThemedView style={styles.titleRow}>
                <ThemedText
                  type="subtitle"
                  style={styles.title}
                  numberOfLines={2}
                >
                  {product.title}
                </ThemedText>
                <ThemedText type="subtitle" themeColor="textSecondary">
                  ${product.price.toFixed(2)}
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.metaRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  ★ {product.rating.toFixed(1)}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {product.brand || "—"}
                </ThemedText>
                <ThemedText
                  type="small"
                  themeColor="textSecondary"
                  style={styles.metaCategory}
                >
                  {product.category.replace(/-/g, " ")}
                </ThemedText>
              </ThemedView>

              {product.discountPercentage > 0 ? (
                <ThemedView style={styles.discountBadge}>
                  <ThemedText type="smallBold" style={styles.discountBadgeText}>
                    {product.discountPercentage.toFixed(0)}% off
                  </ThemedText>
                </ThemedView>
              ) : null}
            </ThemedView>

            <ThemedView style={styles.section}>
              <ThemedText type="smallBold">Description</ThemedText>
              <ThemedText themeColor="textSecondary">
                {product.description}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.section}>
              <Row label="Stock" value={`${product.stock} available`} />
              <Row label="Brand" value={product.brand || "—"} />
              <Row
                label="Category"
                value={product.category.replace(/-/g, " ")}
              />
            </ThemedView>
          </ScrollView>
        )}

        {product ? (
          <ThemedView
            style={[
              styles.buyBar,
              { paddingBottom: Math.max(insets.bottom, Spacing.three) },
            ]}
          >
            <ThemedView style={styles.buyPrice}>
              <ThemedText type="small" themeColor="textSecondary">
                Buy for
              </ThemedText>
              <ThemedText type="subtitle">
                ${product.price.toFixed(2)}
              </ThemedText>
            </ThemedView>
            <Pressable
              onPress={() => {
                cart.add(product);
                router.push("/cart");
              }}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <ThemedView style={styles.buyButton}>
                <ThemedText type="smallBold" style={styles.buyButtonText}>
                  Buy Now
                </ThemedText>
              </ThemedView>
            </Pressable>
          </ThemedView>
        ) : null}
      </SafeAreaView>
    </ThemedView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <ThemedView style={styles.row}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="smallBold" numberOfLines={1} style={styles.rowValue}>
        {value}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.three,
    backgroundColor: "#fff",
    paddingVertical: Spacing.two,
  },
  appBarTitle: {
    flex: 1,
    textAlign: "center",
  },
  appBarSpacer: {
    width: 44,
  },
  backIcon: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: 400,
    paddingHorizontal: Spacing.three,
  },
  pressed: {
    opacity: 0.7,
  },
  stateBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
  },
  content: {
    alignSelf: "center",
    width: "100%",
    maxWidth: MaxContentWidth,
    paddingBottom: Spacing.six,
  },
  buyBar: {
    alignSelf: "center",
    width: "100%",
    maxWidth: MaxContentWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  buyPrice: {
    gap: 2,
  },
  buyButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  buyButtonText: {
    color: "#ffffff",
  },
  image: {
    width: SCREEN_WIDTH,
    aspectRatio: 1,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.two,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: "#000",
  },
  section: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  titleRow: {
    gap: Spacing.one,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  metaCategory: {
    flex: 1,
  },
  discountBadge: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    backgroundColor: "#000000",
  },
  discountBadgeText: {
    color: "#ffffff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.three,
  },
  rowValue: {
    flex: 1,
    textAlign: "right",
  },
});
