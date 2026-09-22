import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { CategoryRow } from "@/components/category-row";
import { CartBar } from "@/components/cart-bar";
import { FeaturedBanners } from "@/components/featured-banners";
import { ProductCard } from "@/components/product-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useInfiniteProducts } from "@/hooks/use-infinite-products";
import { useTheme } from "@/hooks/use-theme";
import {
  getCategories,
  type Category,
} from "@/lib/products";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const productsQuery = useInfiniteProducts(
    selectedCategory ? { category: selectedCategory } : {},
  );

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function loadHomeData() {
      try {
        const cats = await getCategories();
        if (cancelled) return;
        setCategories(cats);
      } catch {
        // Non-critical: keep empty sections.
      }
    }
    loadHomeData();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.container}>
        <FlatList
          data={productsQuery.products}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={(product) => router.push(`/product/${product.id}`)}
            />
          )}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.header}>
              <FeaturedBanners />
              <CategoryRow
                categories={categories}
                selected={selectedCategory}
                onSelect={(category) =>
                  setSelectedCategory(category ? category.slug : null)
                }
              />
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                {selectedCategory
                  ? selectedCategory.replace(/-/g, " ")
                  : "All Products"}
              </ThemedText>
            </View>
          }
          ListEmptyComponent={
            productsQuery.error ? (
              <EmptyState
                message={productsQuery.error}
                actionLabel="Retry"
                onAction={() => productsQuery.refresh()}
              />
            ) : (
              <EmptyState message="Loading products…" />
            )
          }
          ListFooterComponent={
            productsQuery.isLoadingMore ? (
              <ActivityIndicator
                style={styles.footerLoader}
                color={theme.text}
              />
            ) : null
          }
          onEndReached={() => productsQuery.loadMore()}
          onEndReachedThreshold={0.5}
          onRefresh={productsQuery.refresh}
          refreshing={productsQuery.isRefreshing}
        />
        <CartBar />
      </SafeAreaView>
    </ThemedView>
  );
}

function EmptyState({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <ThemedView style={styles.empty}>
      <ThemedText themeColor="textSecondary">{message}</ThemedText>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction}>
          <ThemedView style={styles.retryButton}>
            <ThemedText type="smallBold" style={styles.retryButtonText}>
              {actionLabel}
            </ThemedText>
          </ThemedView>
        </Pressable>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  listContent: {
    flexGrow: 1,
    maxWidth: MaxContentWidth,
    width: "100%",
    paddingHorizontal: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  header: {
    gap: Spacing.three,
    paddingBottom: Spacing.two,
  },
  sectionTitle: {
    textTransform: "capitalize",
    fontSize: 24,
    lineHeight: 32,
  },
  columnWrapper: {
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  footerLoader: {
    paddingVertical: Spacing.four,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.six,
    gap: Spacing.three,
  },
  retryButton: {
    borderRadius: 12,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    backgroundColor: "#000000",
  },
  retryButtonText: {
    color: "#ffffff",
  },
});
