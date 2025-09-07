// src/features/mypage/components/LoginForm.js
import React from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  error,
  onLogin,
  onRegister,
}) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="이메일"
        placeholderTextColor={colors.sub}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        placeholderTextColor={colors.sub}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="password"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={onLogin}
        disabled={loading}
      >
        <Text style={styles.btnText}>로그인</Text>
      </Pressable>

      <Pressable style={styles.outlineBtn} onPress={onRegister}>
        <Text style={styles.outlineBtnText}>이메일로 회원가입</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    alignItems: "center",
  },
  input: {
    alignSelf: "stretch",     // 🔹 카드 너비 그대로 사용
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    marginBottom: 12,
    color: colors.text,
  },
  error: {
    alignSelf: "stretch",
    color: "#EF4444",
    marginBottom: 8,
  },
  btn: {
    alignSelf: "stretch",     // 🔹 버튼도 가로 100%
    backgroundColor: "#22C55E",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  outlineBtn: {
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#22C55E",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  outlineBtnText: {
    color: "#22C55E",
    fontWeight: "700",
    fontSize: 15,
  },
});
