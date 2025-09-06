import React from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export default function LoginForm({
  email, setEmail,
  password, setPassword,
  loading, error,
  onLogin, onRegister,
}) {
  return (
    <View>
      <TextInput
        placeholder="이메일"
        placeholderTextColor={colors.accent}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { textAlign: "left", color: colors.text }]}
      />
      <TextInput
        placeholder="비밀번호"
        placeholderTextColor={colors.accent}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={[styles.input, { textAlign: "left", color: colors.text }]}
      />

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <Pressable onPress={onLogin} style={[styles.btn, loading && { opacity: 0.7 }]} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>로그인</Text>}
      </Pressable>

      <Pressable onPress={onRegister} style={[styles.btnGhost]} disabled={loading}>
        <Text style={styles.btnGhostText}>이메일로 회원가입</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.card,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  errorText: {
    color: "#ef4444",
    marginBottom: 8,
    fontSize: 13,
  },
  btn: {
    backgroundColor: "#22C55E",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "800" },
  btnGhost: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  btnGhostText: { color: colors.text, fontWeight: "700" },
});
