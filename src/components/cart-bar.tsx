import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useCart } from "@/context/cart-context";

export function CartBar() {
  const router = useRouter();
  const { items, totalQuantity, total } = useCart();

  if (items.length === 0) return null;

  return (
    <ThemedView type="background" style={styles.bar}>
      <ThemedView style={styles.summary}>
        <ThemedText type="smallBold">
          {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
        </ThemedText>
        <ThemedText type="smallBold">${total.toFixed(2)}</ThemedText>
      </ThemedView>
      <Pressable
        onPress={() => router.push("/cart")}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <ThemedView type="backgroundSelected" style={styles.goButton}>
          <ThemedText type="smallBold" style={{ color: "#fff" }}>
            Go to Cart →
          </ThemedText>
        </ThemedView>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    bottom: Spacing.three,
    left: Spacing.four,
    right: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
    borderRadius: 16,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  summary: {
    gap: 2,
  },
  goButton: {
    borderRadius: 12,
    backgroundColor: "#000",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
});
