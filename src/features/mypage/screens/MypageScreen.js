// src/features/mypage/screens/MypageScreen.js
import React, { useCallback, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Animated,
  PanResponder,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { colors } from "../../../theme/colors";
import { useLogin } from "../hooks/useLogin";
import LoginForm from "../components/LoginForm";
import { clearAllStores } from "../../../utils/storeManager";

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
  const [showHiddenUI, setShowHiddenUI] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

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

  const handleClearAllData = () => {
    Alert.alert(
      "모든 데이터 초기화",
      "모든 지출 내역, 예산 설정, 재료 목록이 삭제됩니다.\n이 작업은 되돌릴 수 없습니다.\n\n정말 초기화하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "초기화",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await clearAllStores();
              if (result.success) {
                Alert.alert("초기화 완료", result.message);
              } else {
                Alert.alert("초기화 실패", result.message);
              }
            } catch (error) {
              Alert.alert("오류", "초기화 중 오류가 발생했습니다.");
            }
          },
        },
      ]
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // 위로 슬라이드할 때만 반응
        return Math.abs(gestureState.dy) > 10 && gestureState.dy < 0;
      },
      onPanResponderGrant: () => {
        translateY.setOffset(translateY._value);
        translateY.setValue(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        translateY.flattenOffset();
        
        if (gestureState.dy < -50) { // 위로 50px 이상 슬라이드
          setShowHiddenUI(true);
        }
        
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Animated.View 
        style={[styles.container, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
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
              <Text style={styles.cardTitle}>로그인</Text>
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
              <Pressable style={styles.backBtn} onPress={() => setShowLoginForm(false)}>
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

          {/* 숨겨진 UI - 위로 슬라이드하면 나타남 */}
          {showHiddenUI && (
            <View style={styles.hiddenCard}>
              <Text style={styles.hiddenTitle}>개발자 옵션</Text>
              <Text style={styles.hiddenDesc}>위로 슬라이드하여 표시됨</Text>
              
              <Pressable style={[styles.btn, styles.btnWarning]} onPress={handleClearAllData}>
                <Text style={styles.btnTextLight}>모든 데이터 초기화</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.btn, styles.btnSecondary]} 
                onPress={() => setShowHiddenUI(false)}
              >
                <Text style={styles.btnTextDark}>숨기기</Text>
              </Pressable>
            </View>
          )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  card: {
    alignSelf: "stretch",          // 🔹 카드 폭 = 화면 폭(좌우 패딩만 반영)
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 10,
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
    borderRadius: 12,
    alignItems: "center",
    alignSelf: "stretch",         // 🔹 버튼이 카드 너비를 꽉 채움
  },
  btnDanger: { backgroundColor: "#EF4444", marginTop: 8 },
  btnWarning: { backgroundColor: "#F59E0B", marginTop: 8 },
  btnSecondary: { backgroundColor: "#E5E7EB", marginTop: 8 },
  btnTextLight: { color: "#fff", fontWeight: "800" },
  btnTextDark: { color: "#374151", fontWeight: "800" },
  hiddenCard: {
    alignSelf: "stretch",
    backgroundColor: "#FEF3C7",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F59E0B",
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  hiddenTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 4,
  },
  hiddenDesc: {
    fontSize: 12,
    color: "#A16207",
    marginBottom: 12,
  },
  backBtn: {
    marginTop: 16,
    paddingVertical: 8,
    alignItems: "center",
    alignSelf: "stretch",
  },
  backBtnText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
