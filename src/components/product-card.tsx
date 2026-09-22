import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/lib/products";
import { Star } from "lucide-react-native";

type ProductCardProps = {
  product: Product;
  onPress?: (product: Product) => void;
};

export function ProductCard({ product, onPress }: ProductCardProps) {
  const { items, add, updateQuantity, remove } = useCart();
  const quantity =
    items.find((item) => item.product.id === product.id)?.quantity ?? 0;

  return (
    <Pressable
      onPress={() => onPress?.(product)}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <ThemedView style={styles.card}>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          contentFit="cover"
        />
        {quantity > 0 ? (
          <View style={styles.stepper}>
            <Pressable
              onPress={(event) => {
                event.stopPropagation();
                if (quantity === 1) remove(product.id);
                else updateQuantity(product.id, quantity - 1);
              }}
              hitSlop={8}
              style={({ pressed }) => [
                styles.stepButton,
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={styles.stepText}>−</ThemedText>
            </Pressable>
            <ThemedText type="smallBold" style={styles.qty}>
              {quantity}
            </ThemedText>
            <Pressable
              onPress={(event) => {
                event.stopPropagation();
                updateQuantity(product.id, quantity + 1);
              }}
              hitSlop={8}
              style={({ pressed }) => [
                styles.stepButton,
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={styles.stepText}>+</ThemedText>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              add(product);
            }}
            hitSlop={8}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.pressed,
            ]}
          >
            <ThemedText style={styles.stepText}>+</ThemedText>
          </Pressable>
        )}
        <ThemedView style={styles.info}>
          <ThemedText
            type="small"
            style={styles.secondaryText}
            numberOfLines={1}
          >
            {product.brand}
          </ThemedText>
          <ThemedText numberOfLines={2} style={styles.title}>
            {product.title}
          </ThemedText>
          <ThemedView style={styles.priceRow}>
            <ThemedText type="small" numberOfLines={1} style={styles.price}>
              ${product.price.toFixed(2)}
            </ThemedText>
            {product.discountPercentage > 0 ? (
              <ThemedText type="small" numberOfLines={1} style={styles.offtext}>
                {product.discountPercentage.toFixed(0)}% OFF
              </ThemedText>
            ) : null}
          </ThemedView>
          <View style={styles.ratingBadge}>
            <Star size={12} color="#f59e0b" fill="#f59e0b" />
            <ThemedText type="small" style={styles.secondaryText}>
              {product.rating.toFixed(1)}
            </ThemedText>
          </View>
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F7F7F7",
  },
  title: {
    fontSize: 13,
    lineHeight: 18,
    height: 36,
    fontWeight: 600,
    color: "#000000",
  },
  secondaryText: {
    color: "#53575f",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    alignSelf: "flex-start",
  },
  offtext: {
    color: "#ef4444",
    fontSize: 10,
    backgroundColor: "#ef444420",
    borderWidth: 1,
    borderColor: "#ef4444",
    borderStyle: "dashed",
    borderRadius: 4,
    paddingHorizontal: Spacing.two,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  addButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  stepper: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  stepButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    color: "#ffffff",
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 700,
  },
  qty: {
    minWidth: 28,
    textAlign: "center",
    color: "#ffffff",
  },
  info: {
    padding: 8,
    gap: 4,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    flex: 1,
    fontWeight: 700,
    color: "#000000",
  },
});
