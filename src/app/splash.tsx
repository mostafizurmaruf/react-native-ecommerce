import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";

export default function SplashScreen() {
  const router = useRouter();

  function handleContinue() {
    router.replace("/login");
  }

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require("@/assets/images/splash.jpg")}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        blurRadius={2}
      />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/expo-logo.png")}
                style={styles.logo}
                contentFit="contain"
              />
            </View>

            <View style={styles.textSection}>
              <ThemedText type="title" style={styles.title}>
                Welcome
              </ThemedText>

              <ThemedText style={styles.subtitle}>
                Discover amazing products, great deals, and everything you need
                in one place.
              </ThemedText>
            </View>
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <Pressable
              onPress={handleContinue}
              style={({ pressed }) => [
                styles.continueButton,
                pressed && styles.continuePressed,
              ]}
            >
              <ThemedText style={styles.continueLabel}>Get Started</ThemedText>

              <View style={styles.arrowContainer}>
                <ArrowRight size={19} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            </Pressable>

            <ThemedText style={styles.bottomText}>
              Your shopping journey starts here
            </ThemedText>
          </View>
        </View>
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

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  content: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
  },

  heroSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
  },

  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    marginBottom: Spacing.five,
  },

  logo: {
    width: 90,
    height: 90,
  },

  textSection: {
    alignItems: "center",
    gap: Spacing.two,
  },

  title: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: "#FFFFFF",
  },

  subtitle: {
    textAlign: "center",
    maxWidth: 320,
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255,255,255,0.85)",
  },

  bottomSection: {
    width: "100%",
    gap: Spacing.three,
  },

  continueButton: {
    width: "100%",
    minHeight: 56,
    borderRadius: 16,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#000000",
  },

  continueLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  arrowContainer: {
    position: "absolute",
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  continuePressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  bottomText: {
    textAlign: "center",
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
});
