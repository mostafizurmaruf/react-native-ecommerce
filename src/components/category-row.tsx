import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import type { Category } from "@/lib/products";
import { Tag } from "lucide-react-native";

type CategoryRowProps = {
  categories: Category[];
  selected: string | null;
  onSelect: (category: Category | null) => void;
};

export function CategoryRow({
  categories,
  selected,
  onSelect,
}: CategoryRowProps) {
  function handlePress(category: Category) {
    onSelect(selected === category.slug ? null : category);
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => {
        const isSelected = selected === category.slug;
        return (
          <View key={category.slug}>
            <Pressable onPress={() => handlePress(category)}>
              <ThemedView
                style={[styles.chip, isSelected && styles.chipSelected]}
              >
                <View style={styles.row}>
                  <Tag size={16} color={isSelected ? "#ffffff" : "#B0B4BA"} />
                  <ThemedText
                    type="small"
                    style={[
                      styles.label,
                      isSelected
                        ? styles.labelSelected
                        : styles.labelUnselected,
                    ]}
                  >
                    {category.name}
                  </ThemedText>
                  {isSelected ? (
                    <Pressable
                      onPress={() => onSelect(null)}
                      hitSlop={8}
                      style={({ pressed }) => pressed && styles.pressed}
                    >
                      <ThemedText type="smallBold" style={styles.close}>
                        ✕
                      </ThemedText>
                    </Pressable>
                  ) : null}
                </View>
              </ThemedView>
            </Pressable>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: "#eeeeee",
  },
  chipSelected: {
    backgroundColor: "#000000",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  label: {
    textTransform: "capitalize",
  },
  labelSelected: {
    fontWeight: 700,
    color: "#ffffff",
  },
  labelUnselected: {
    color: "#000",
  },
  close: {
    fontSize: 14,
    lineHeight: 20,
    color: "#ffffff",
  },
  pressed: {
    opacity: 0.5,
  },
});
