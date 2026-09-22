import { Image } from "expo-image";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/hooks/use-theme";

import {
  Bell,
  ClipboardList,
  CreditCard,
  Heart,
  LogOut,
  MapPin,
  User,
  type LucideIcon,
} from "lucide-react-native";

const MENU_ITEMS: { id: string; icon: LucideIcon; label: string }[] = [
  { id: "1", icon: User, label: "Edit Profile" },
  { id: "2", icon: MapPin, label: "Shopping Address" },
  { id: "3", icon: Heart, label: "Wishlist" },
  { id: "4", icon: ClipboardList, label: "Order History" },
  { id: "5", icon: Bell, label: "Notification" },
  { id: "6", icon: CreditCard, label: "Cards" },
] as const;

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, signOut } = useAuth();

  const name = user ? `${user.firstName} ${user.lastName}` : "Profile";
  const email = user?.email ?? "";
  const gender = user?.gender ?? "";
  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()
    : "P";

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.topBar}>
            <View style={styles.topSpacer} />
            <ThemedText type="smallBold" style={styles.topTitle}>
              Profile
            </ThemedText>
            <View style={styles.topSpacer} />
          </ThemedView>

          <ThemedView style={styles.profileSection}>
            <ThemedView style={[styles.outerRing, { borderColor: "#D0D0D0" }]}>
              <ThemedView
                style={[styles.innerRing, { borderColor: theme.background }]}
              >
                {user?.image ? (
                  <Image
                    source={{ uri: "https://i.pravatar.cc/300?img=47" }}
                    style={styles.profilePhoto}
                    contentFit="cover"
                  />
                ) : (
                  <ThemedText type="subtitle" themeColor="textSecondary">
                    {initials}
                  </ThemedText>
                )}
              </ThemedView>
            </ThemedView>

            <ThemedText style={styles.userName}>{name}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {email}
            </ThemedText>
            {gender ? (
              <ThemedText type="small" themeColor="textSecondary">
                {gender}
              </ThemedText>
            ) : null}

            <View style={styles.statusRow}>
              <View style={styles.activeDot} />
              <ThemedText type="small" themeColor="textSecondary">
                Active status
              </ThemedText>
            </View>
          </ThemedView>

          <ThemedView style={styles.menuContainer}>
            {MENU_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => {}}
                  style={({ pressed }) => [
                    styles.menuItem,
                    index !== MENU_ITEMS.length - 1 && styles.menuBorder,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.menuLeft}>
                    <Icon size={20} />
                    <ThemedText style={styles.menuLabel}>
                      {item.label}
                    </ThemedText>
                  </View>
                  <ThemedText
                    themeColor="textSecondary"
                    style={styles.menuArrow}
                  >
                    ›
                  </ThemedText>
                </Pressable>
              );
            })}
          </ThemedView>

          <Pressable
            onPress={signOut}
            style={({ pressed }) => [
              styles.signOutBtn,
              { backgroundColor: theme.background },
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.signOutContent}>
              <LogOut size={18} color="#FF4E50" />
              <ThemedText type="smallBold" style={styles.signOutText}>
                Sign Out
              </ThemedText>
            </View>
          </Pressable>

          <View
            style={[styles.bottomIndicator, { backgroundColor: "#D0D0D0" }]}
          />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    width: "100%",
  },
  content: {
    alignSelf: "center",
    width: "100%",
    maxWidth: MaxContentWidth,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.one,
  },
  topSpacer: {
    width: 40,
  },
  topTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: Spacing.four,
    gap: Spacing.one,
  },
  outerRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
  innerRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 3,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD6D6",
  },
  profilePhoto: {
    width: "100%",
    height: "100%",
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginBottom: 0,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2ECC71",
  },
  menuContainer: {
    marginHorizontal: Spacing.four,
    borderRadius: 24,
    paddingVertical: Spacing.one,
    backgroundColor: "#FFFFFF",
    elevation: 4,
    shadowColor: "#B0BAD3",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff1f",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  menuIcon: {
    fontSize: 20,
    width: 28,
    textAlign: "center",
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
  },
  menuArrow: {
    fontSize: 22,
    fontWeight: "400",
    color: "#B0B4BA",
  },
  signOutBtn: {
    marginHorizontal: Spacing.four,
    marginTop: Spacing.four,
    borderRadius: 20,
    paddingVertical: Spacing.three,
    alignItems: "center",
    elevation: 3,
    borderWidth: 2,
    borderColor: "#FF4E50",
    backgroundColor: "#fff",
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF4E50",
    letterSpacing: 0.4,
  },
  bottomIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: Spacing.four,
  },
  pressed: {
    opacity: 0.7,
  },
  signOutContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
});
