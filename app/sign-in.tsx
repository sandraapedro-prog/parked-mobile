import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Brand } from "@/components/Brand";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { fontFamily } from "@/lib/fonts";

const c = colors.light;

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top + 24, 96) : insets.top;
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      await signIn(email, password);
      router.replace("/(app)");
    } catch (e) {
      Alert.alert("Sign in", e instanceof Error ? e.message : "Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={10}
        >
          <Feather name="arrow-left" size={20} color={c.textPrimary} />
        </Pressable>
        <Brand size="sm" />
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAwareScrollViewCompat
        contentContainerStyle={styles.scroll}
        bottomOffset={20}
      >
        <View style={styles.head}>
          <Text style={styles.eyebrow}>Welcome back</Text>
          <Text style={styles.title}>Pick up where you parked.</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
          />
          <Button
            label="Sign in"
            onPress={submit}
            loading={busy}
            size="lg"
            style={{ marginTop: 6 }}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New here?</Text>
          <Pressable onPress={() => router.replace("/register")}>
            <Text style={styles.footerLink}>Create an account</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: c.border,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 60,
    gap: 24,
  },
  head: {
    gap: 6,
  },
  eyebrow: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: c.textSecondary,
  },
  title: {
    fontFamily: fontFamily.serifBold,
    fontWeight: "700",
    fontSize: 28,
    color: c.textPrimary,
    lineHeight: 34,
  },
  form: {
    gap: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
  },
  footerText: {
    fontFamily: fontFamily.sans,
    fontSize: 14,
    color: c.textSecondary,
  },
  footerLink: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 14,
    color: c.textPrimary,
    textDecorationLine: "underline",
  },
});
