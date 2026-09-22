import { Image } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!username.trim() || !password) {
      setError("Enter a username and password.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await signIn(username.trim(), password);
      // Routing is handled by the root navigator's protected screens.
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Sign in failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/splash.jpg")}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        blurRadius={2}
      />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
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
                  Welcome back
                </ThemedText>
                <ThemedText style={styles.subtitle}>
                  Sign in to continue your shopping journey.
                </ThemedText>
              </View>
            </View>

            <View style={styles.card}>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="username"
                style={styles.input}
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                textContentType="password"
                style={styles.input}
              />

              {error ? (
                <ThemedText style={styles.error}>{error}</ThemedText>
              ) : null}

              <Pressable
                onPress={handleSubmit}
                disabled={isSubmitting}
                style={({ pressed }) => [
                  styles.submitButton,
                  (pressed || isSubmitting) && styles.submitPressed,
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <ThemedText style={styles.submitLabel}>Sign in</ThemedText>
                )}
              </Pressable>
            </View>

            <ThemedText style={styles.hint}>
              Demo credentials: <ThemedText type="code">emilys</ThemedText> /{" "}
              <ThemedText type="code">emilyspass</ThemedText>
            </ThemedText>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
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
    flexGrow: 1,
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    gap: Spacing.four,
  },
  heroSection: {
    alignItems: "center",
    gap: Spacing.four,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
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
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  input: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
    backgroundColor: "#F3F4F6",
    color: "#000000",
  },
  error: {
    textAlign: "center",
    color: "#FF4E50",
  },
  submitButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    backgroundColor: "#000000",
  },
  submitPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  submitLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  hint: {
    textAlign: "center",
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
});
