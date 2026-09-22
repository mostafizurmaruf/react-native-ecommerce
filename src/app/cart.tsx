import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useCart } from "@/context/cart-context";
import {
  ChevronLeft,
  Eraser,
  ShoppingCart,
  Trash
} from "lucide-react-native";

const DISCOUNT = 10;
const DELIVERY_CHARGE = 10;

export default function CartScreen() {
  const router = useRouter();
  const {
    items,
    isLoading,
    total,
    totalQuantity,
    updateQuantity,
    remove,
    clear,
  } = useCart();

  function handlePlaceOrder() {
    clear();
    router.push({
      pathname: "/order-confirmation",
      params: { total: (total - DISCOUNT + DELIVERY_CHARGE).toFixed(2) },
    });
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <ThemedView type="background" style={styles.appBar}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <ChevronLeft />
          </Pressable>
          <ThemedText type="smallBold" style={styles.appBarTitle}>
            My Cart
          </ThemedText>
          <Pressable
            onPress={clear}
            hitSlop={12}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <View style={styles.deleteIconWrapper}>
              <Eraser size={16} color="#e11d48" />
            </View>
          </Pressable>
        </ThemedView>

        {isLoading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator />
          </View>
        ) : items.length === 0 ? (
          <View style={styles.stateBox}>
            <ShoppingCart size={50} />
            <ThemedText themeColor="textSecondary">
              Your cart is empty.
            </ThemedText>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <ThemedView type="background" style={styles.backHomeButton}>
                <ThemedText type="smallBold" style={{ color: "#fff" }}>
                  Keep Shopping
                </ThemedText>
              </ThemedView>
            </Pressable>
          </View>
        ) : (
          <>
            <FlatList
              data={items}
              renderItem={({ item }) => (
                <ThemedView type="background" style={styles.card}>
                  <Image
                    source={{ uri: item.product.thumbnail }}
                    style={styles.thumb}
                    contentFit="cover"
                  />
                  <ThemedView style={styles.details}>
                    <View style={styles.titleRow}>
                      <ThemedText
                        type="smallBold"
                        numberOfLines={2}
                        style={styles.title}
                      >
                        {item.product.title}
                      </ThemedText>
                      <Pressable
                        onPress={() => remove(item.product.id)}
                        hitSlop={8}
                        style={({ pressed }) => pressed && styles.pressed}
                      >
                        <View style={styles.deleteIconWrapper}>
                          <Trash size={16} color="#e11d48" />
                        </View>
                      </Pressable>
                    </View>
                    <ThemedText type="small" themeColor="textSecondary">
                      ${item.product.price.toFixed(2)}
                      {item.product.discountPercentage > 0 ? (
                        <ThemedText type="small" themeColor="textSecondary">
                          {"  "}·{"  "}
                          {item.product.discountPercentage.toFixed(0)}% off
                        </ThemedText>
                      ) : null}
                    </ThemedText>
                    <View style={styles.bottomRow}>
                      <View style={styles.stepper}>
                        <Pressable
                          onPress={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          hitSlop={6}
                          style={({ pressed }) => [
                            styles.stepButton,
                            pressed && styles.pressed,
                          ]}
                        >
                          <ThemedText type="smallBold">−</ThemedText>
                        </Pressable>
                        <ThemedText type="smallBold" style={styles.qty}>
                          {item.quantity}
                        </ThemedText>
                        <Pressable
                          onPress={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          hitSlop={6}
                          style={({ pressed }) => [
                            styles.stepButton,
                            pressed && styles.pressed,
                          ]}
                        >
                          <ThemedText type="smallBold">+</ThemedText>
                        </Pressable>
                      </View>
                      <ThemedText type="smallBold" style={styles.lineTotal}>
                        $
                        {(
                          item.product.price *
                          (1 - item.product.discountPercentage / 100) *
                          item.quantity
                        ).toFixed(2)}
                      </ThemedText>
                    </View>
                  </ThemedView>
                </ThemedView>
              )}
              keyExtractor={(item) => String(item.product.id)}
              contentContainerStyle={styles.listContent}
              style={styles.list}
            />
            <ThemedView style={styles.footer}>
              <ThemedText type="smallBold">Order Summary</ThemedText>
              <View style={styles.summaryRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  Items
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
                </ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  Amount
                </ThemedText>
                <ThemedText type="smallBold">${total.toFixed(2)}</ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  Discount
                </ThemedText>
                <ThemedText type="smallBold" style={styles.discountText}>
                  -${DISCOUNT.toFixed(2)}
                </ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  Delivery Charge
                </ThemedText>
                <ThemedText type="smallBold">
                  +${DELIVERY_CHARGE.toFixed(2)}
                </ThemedText>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <ThemedText type="smallBold">Total</ThemedText>
                <ThemedText type="smallBold">
                  ${(total - DISCOUNT + DELIVERY_CHARGE).toFixed(2)}
                </ThemedText>
              </View>
              <Pressable
                onPress={handlePlaceOrder}
                style={({ pressed }) => pressed && styles.pressed}
              >
                <ThemedView style={styles.placeOrderButton}>
                  <ThemedText type="smallBold" style={styles.placeOrderText}>
                    Place Order
                  </ThemedText>
                </ThemedView>
              </Pressable>
            </ThemedView>
          </>
        )}
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
    marginBottom: 10,
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
  stateBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
  },
  backHomeButton: {
    borderRadius: 12,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    backgroundColor: "#000",
  },
  list: {
    flex: 1,
  },
  listContent: {
    alignSelf: "center",
    width: "100%",
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  card: {
    flexDirection: "row",
    borderRadius: 16,
    overflow: "hidden",
    gap: Spacing.three,
  },
  thumb: {
    width: 96,
    height: 96,
  },
  deleteIconWrapper: {
    backgroundColor: "#fee2e2",
    padding: Spacing.two,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  details: {
    flex: 1,
    paddingVertical: Spacing.two,
    paddingRight: Spacing.three,
    gap: Spacing.one,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  title: {
    flex: 1,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  stepButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#00000010",
    alignItems: "center",
    justifyContent: "center",
  },
  qty: {
    minWidth: 24,
    textAlign: "center",
  },
  lineTotal: {
    flex: 1,
    textAlign: "right",
  },
  footer: {
    alignSelf: "center",
    width: "100%",
    maxWidth: MaxContentWidth,
    borderTopWidth: 1,
    borderTopColor: "#00000012",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    gap: Spacing.two,
    backgroundColor: "#fff",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  discountText: {
    color: "#16A34A",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#00000012",
    paddingTop: Spacing.three,
    marginTop: Spacing.two,
  },
  placeOrderButton: {
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: Spacing.three,
    backgroundColor: "#000000",
  },
  placeOrderText: {
    color: "#ffffff",
  },
});
