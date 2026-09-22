import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle2 } from "lucide-react-native";
import { Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { total } = useLocalSearchParams<{ total?: string }>();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <ThemedView style={styles.content}>
          {/* Animated/Clean Verified Icon Container */}
          <ThemedView style={styles.iconContainer}>
            <CheckCircle2 size={150} color="#10B981" strokeWidth={2.2} />
          </ThemedView>

          <ThemedText type="subtitle" style={styles.title}>
            Order Confirmed!
          </ThemedText>

          <ThemedText themeColor="textSecondary" style={styles.message}>
            Thank you for your purchase. Your order has been placed successfully
            and is being processed.
          </ThemedText>

          {total ? (
            <ThemedView style={styles.totalBox}>
              <ThemedText type="small" style={styles.totalBoxLabel}>
                Total Amount Paid
              </ThemedText>
              <ThemedText type="subtitle" style={styles.totalBoxValue}>
                ${total}
              </ThemedText>
            </ThemedView>
          ) : null}

          <Pressable
            onPress={() => router.replace("/")}
            style={({ pressed }) => [
              styles.buttonWrapper,
              pressed && styles.pressed,
            ]}
          >
            <ThemedView style={styles.button}>
              <ThemedText type="smallBold" style={styles.buttonText}>
                Continue Shopping
              </ThemedText>
            </ThemedView>
          </Pressable>
        </ThemedView>
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
  content: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    maxWidth: MaxContentWidth,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(16, 185, 129, 0.1)", // Soft emerald background tint
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.one,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    marginTop: 20,
    fontWeight: "700",
  },
  message: {
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 20,
  },
  totalBox: {
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    gap: Spacing.one,
    backgroundColor: "#F7F7F7", // Rich modern dark tone
    width: "100%",
    maxWidth: 280,
    marginTop: Spacing.two,
  },
  totalBoxLabel: {
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 11,
  },
  totalBoxValue: {
    color: "#000000",
    fontSize: 22,
    fontWeight: "700",
  },
  buttonWrapper: {
    alignSelf: "stretch",
    marginTop: Spacing.two,
  },
  button: {
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: Spacing.three,
    backgroundColor: "#000000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
