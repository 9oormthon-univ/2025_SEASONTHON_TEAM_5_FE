// src/features/mypage/screens/MypageScreen.js
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { colors } from "../../../theme/colors";
import { useLogin } from "../hooks/useLogin";
import LoginForm from "../components/LoginForm";

// ---- helpers ----
const decodeJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export default function MypageScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);
  const [hasToken, setHasToken] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  
  // useLogin 훅 사용
  const loginHook = useLogin();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("auth/accessToken");
      const last = await AsyncStorage.getItem("auth/lastResponse");
      const lastParsed = last ? JSON.parse(last) : null;

      let e =
        lastParsed?.user?.email ||
        lastParsed?.email ||
        lastParsed?.data?.email ||
        null;

      if (!e && token) {
        const payload = decodeJwt(token);
        e = payload?.email || payload?.sub || null;
      }

      setEmail(e);
      setHasToken(!!token);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem("auth/accessToken");
    await AsyncStorage.removeItem("auth/lastResponse");
    Alert.alert("로그아웃", "정상적으로 로그아웃되었습니다.");
    setEmail(null);
    setHasToken(false);
  };

  const goLogin = () => {
    setShowLoginForm(true);
  };

  const handleLogin = async () => {
    const result = await loginHook.login();
    if (result) {
      setShowLoginForm(false);
      await load(); // 로그인 후 상태 새로고침
    }
  };

  const handleRegister = async () => {
    const result = await loginHook.register();
    if (result) {
      Alert.alert("회원가입 완료", "이제 로그인해주세요.");
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <Text style={styles.title}>마이페이지</Text>

        {loading ? (
          <ActivityIndicator />
        ) : hasToken ? (
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(email || "?").slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.emailText}>{email || "계정"}</Text>

            <Pressable style={[styles.btn, styles.btnDanger]} onPress={handleLogout}>
              <Text style={styles.btnTextLight}>로그아웃</Text>
            </Pressable>
          </View>
        ) : showLoginForm ? (
          <View style={styles.card}>
            <Text style={styles.desc}>로그인</Text>
            <LoginForm
              email={loginHook.email}
              setEmail={loginHook.setEmail}
              password={loginHook.password}
              setPassword={loginHook.setPassword}
              loading={loginHook.loading}
              error={loginHook.error}
              onLogin={handleLogin}
              onRegister={handleRegister}
            />
            <Pressable 
              style={styles.backBtn} 
              onPress={() => setShowLoginForm(false)}
            >
              <Text style={styles.backBtnText}>뒤로가기</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.desc}>로그인이 필요합니다.</Text>
            <Pressable style={styles.btn} onPress={goLogin}>
              <Text style={styles.btnTextLight}>로그인하러 가기</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 16,
    textAlign: "left",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarText: { fontSize: 22, fontWeight: "800", color: "#16A34A" },
  emailText: { fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 14 },
  desc: { color: colors.accent, marginBottom: 12 },
  btn: {
    backgroundColor: "#22C55E",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    alignSelf: "stretch",
  },
  btnDanger: {
    backgroundColor: "#EF4444",
  },
  btnTextLight: { color: "#fff", fontWeight: "800" },
  backBtn: {
    marginTop: 16,
    paddingVertical: 8,
    alignItems: "center",
  },
  backBtnText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "600",
  },
});
