import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { SortByOption } from "@/lib/products";
import { ChevronLeft, CircleX } from "lucide-react-native";

const SORT_OPTIONS: { value: SortByOption; label: string }[] = [
  { value: "title", label: "Title" },
  { value: "price", label: "Price" },
  { value: "rating", label: "Rating" },
  { value: "brand", label: "Brand" },
];

const ORDER_OPTIONS: { value: "asc" | "desc"; label: string }[] = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

const DEFAULT_SORT: SortByOption = "title";
const DEFAULT_ORDER: "asc" | "desc" = "asc";

export default function FiltersScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{
    sortBy?: string;
    order?: string;
    minPrice?: string;
    maxPrice?: string;
  }>();

  const [sortBy, setSortBy] = useState<SortByOption>(
    SORT_OPTIONS.some((option) => option.value === params.sortBy)
      ? (params.sortBy as SortByOption)
      : DEFAULT_SORT,
  );
  const [order, setOrder] = useState<"asc" | "desc">(
    params.order === "asc" || params.order === "desc"
      ? params.order
      : DEFAULT_ORDER,
  );
  const [minPrice, setMinPrice] = useState(params.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(params.maxPrice ?? "");

  function apply(nextSort: SortByOption, nextOrder: "asc" | "desc") {
    router.navigate({
      pathname: "/search",
      params: {
        sortBy: nextSort,
        order: nextOrder,
        minPrice,
        maxPrice,
      },
    });
  }

  function onReset() {
    setSortBy(DEFAULT_SORT);
    setOrder(DEFAULT_ORDER);
    setMinPrice("");
    setMaxPrice("");
    apply(DEFAULT_SORT, DEFAULT_ORDER);
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
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
            Filters
          </ThemedText>
          <Pressable
            onPress={onReset}
            hitSlop={12}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <CircleX color={theme.text} />
          </Pressable>
        </ThemedView>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText type="smallBold">Sort By</ThemedText>
          <View style={styles.optionRow}>
            {SORT_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => setSortBy(option.value)}
              >
                <ThemedView
                  style={[
                    styles.optionChip,
                    sortBy === option.value && styles.optionSelected,
                  ]}
                >
                  <ThemedText
                    type="small"
                    style={[
                      sortBy === option.value
                        ? styles.optionTextSelected
                        : styles.optionText,
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            ))}
          </View>

          <ThemedText type="smallBold">Order</ThemedText>
          <View style={styles.optionRow}>
            {ORDER_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => setOrder(option.value)}
              >
                <ThemedView
                  style={[
                    styles.optionChip,
                    order === option.value && styles.optionSelected,
                  ]}
                >
                  <ThemedText
                    type="small"
                    style={[
                      order === option.value
                        ? styles.optionTextSelected
                        : styles.optionText,
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            ))}
          </View>

          <ThemedText type="smallBold">Price Range</ThemedText>
          <View style={styles.priceRow}>
            <TextInput
              value={minPrice}
              onChangeText={setMinPrice}
              placeholder="Min"
              placeholderTextColor="#B0B4BA"
              keyboardType="numeric"
              style={[
                styles.priceInput,
                { color: "#000000", backgroundColor: "#F7F7F7" },
              ]}
            />
            <ThemedText themeColor="textSecondary">—</ThemedText>
            <TextInput
              value={maxPrice}
              onChangeText={setMaxPrice}
              placeholder="Max"
              placeholderTextColor="#B0B4BA"
              keyboardType="numeric"
              style={[
                styles.priceInput,
                { color: "#000000", backgroundColor: "#F7F7F7" },
              ]}
            />
          </View>

          <Pressable
            onPress={() => apply(sortBy, order)}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <ThemedView style={styles.applyButton}>
              <ThemedText type="smallBold" style={{ color: "#fff" }}>
                Apply
              </ThemedText>
            </ThemedView>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
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
    paddingVertical: Spacing.two,
    backgroundColor: "#fff",
  },
  appBarTitle: {
    flex: 1,
    textAlign: "center",
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
  content: {
    alignSelf: "center",
    width: "100%",
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  optionChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 12,
  },
  optionSelected: {
    backgroundColor: "#000000",
  },
  optionText: {
    color: "#60646C",
  },
  optionTextSelected: {
    color: "#ffffff",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  priceInput: {
    flex: 1,
    borderRadius: 12,
    padding: Spacing.three,
    fontSize: 16,
  },
  applyButton: {
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: Spacing.three,
    marginTop: Spacing.two,
    backgroundColor: "#000",
  },
});
