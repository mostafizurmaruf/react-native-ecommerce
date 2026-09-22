import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";

import { CartBar } from "@/components/cart-bar";
import { ProductCard } from "@/components/product-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useInfiniteProducts } from "@/hooks/use-infinite-products";
import { useTheme } from "@/hooks/use-theme";
import type { SortByOption } from "@/lib/products";
import { Filter, Search } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SORT_OPTIONS: { value: SortByOption; label: string }[] = [
  { value: "title", label: "Title" },
  { value: "price", label: "Price" },
  { value: "rating", label: "Rating" },
  { value: "brand", label: "Brand" },
];

type FilterState = {
  sortBy: SortByOption;
  order: "asc" | "desc";
  minPrice: string;
  maxPrice: string;
};

const DEFAULT_FILTERS: FilterState = {
  sortBy: "title",
  order: "asc",
  minPrice: "",
  maxPrice: "",
};

type FilterParams = {
  sortBy?: string;
  order?: string;
  minPrice?: string;
  maxPrice?: string;
};

function filtersFromParams(params: FilterParams): FilterState {
  return {
    sortBy: SORT_OPTIONS.some((option) => option.value === params.sortBy)
      ? (params.sortBy as SortByOption)
      : DEFAULT_FILTERS.sortBy,
    order:
      params.order === "asc" || params.order === "desc"
        ? params.order
        : DEFAULT_FILTERS.order,
    minPrice: params.minPrice ?? DEFAULT_FILTERS.minPrice,
    maxPrice: params.maxPrice ?? DEFAULT_FILTERS.maxPrice,
  };
}

export default function SearchScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<FilterParams>();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const filters = filtersFromParams(params);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const productsQuery = useInfiniteProducts({
    q: debouncedQuery || undefined,
    sortBy: filters.sortBy,
    order: filters.order,
  });

  const min = filters.minPrice ? Number(filters.minPrice) : null;
  const max = filters.maxPrice ? Number(filters.maxPrice) : null;
  const visibleProducts = productsQuery.products.filter((product) => {
    if (min !== null && product.price < min) return false;
    if (max !== null && product.price > max) return false;
    return true;
  });

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ThemedView style={styles.appBar}>
        <ThemedView type="background" style={styles.searchBox}>
          <Search size={16} color={theme.text} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search products"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </ThemedView>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/filters",
              params: {
                sortBy: filters.sortBy,
                order: filters.order,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
              },
            })
          }
          style={({ pressed }) => pressed && styles.pressed}
        >
          <ThemedView style={styles.filterButton}>
            <Filter size={16} color="#ffffff" />
            <ThemedText type="smallBold" style={styles.filterButtonText}>
              Filter
            </ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>

      <FlatList
        data={visibleProducts}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={(product) => router.push(`/product/${product.id}`)}
          />
        )}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          productsQuery.error ? (
            <ThemedView style={styles.empty}>
              <ThemedText themeColor="textSecondary">
                {productsQuery.error}
              </ThemedText>
            </ThemedView>
          ) : productsQuery.isLoading ? (
            <ThemedView style={styles.empty}>
              <ActivityIndicator color={theme.text} />
            </ThemedView>
          ) : (
            <ThemedView style={styles.empty}>
              <ThemedText themeColor="textSecondary">
                {debouncedQuery ? "No products found." : "Loading products…"}
              </ThemedText>
            </ThemedView>
          )
        }
        ListFooterComponent={
          productsQuery.isLoadingMore ? (
            <ActivityIndicator style={styles.footerLoader} color={theme.text} />
          ) : null
        }
        onEndReached={() => productsQuery.loadMore()}
        onEndReachedThreshold={0.5}
        onRefresh={productsQuery.refresh}
        refreshing={productsQuery.isRefreshing}
      />

      <CartBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  appBar: {
    width: "100%",
    maxWidth: MaxContentWidth,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    backgroundColor: "#ffffff",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    marginBottom: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: "#000000",
  },
  filterButtonText: {
    color: "#ffffff",
  },
  pressed: {
    opacity: 0.7,
  },
  list: {
    flex: 1,
    width: "100%",
  },
  listContent: {
    maxWidth: MaxContentWidth,
    width: "100%",
    paddingHorizontal: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  columnWrapper: {
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  footerLoader: {
    paddingVertical: Spacing.four,
  },
  empty: {
    alignItems: "center",
    paddingVertical: Spacing.six,
  },
});
