import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export default function ModeSwitch({ mode, onChange }) {
  return (
    <View style={styles.wrap}>
      <Pressable
        style={[styles.tab, mode === "register" && styles.active]}
        onPress={() => onChange("register")}
      >
        <Text style={[styles.label, mode === "register" && styles.activeLabel]}>재료 등록</Text>
      </Pressable>
      <Pressable
        style={[styles.tab, mode === "mine" && styles.active]}
        onPress={() => onChange("mine")}
      >
        <Text style={[styles.label, mode === "mine" && styles.activeLabel]}>내 재료</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row", backgroundColor: "#F1F5F9",
    borderRadius: 10, padding: 4, marginBottom: 12,
  },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: "center" },
  active: { backgroundColor: "#FFFFFF" },
  label: { fontSize: 13, color: colors.sub, fontWeight: "700" },
  activeLabel: { color: colors.text },
});
