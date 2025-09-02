import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../../theme/colors";

export default function RegisterButtons({ onScan, onManual }) {
  return (
    <View style={styles.row}>
      <Pressable style={styles.btn} onPress={onScan}>
        <Ionicons name="scan-outline" size={20} color={colors.text} />
        <Text style={styles.btnText}>영수증 스캔</Text>
      </Pressable>
      <Pressable style={styles.btn} onPress={onManual}>
        <Ionicons name="create-outline" size={20} color={colors.text} />
        <Text style={styles.btnText}>직접 입력</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10, marginBottom: 16 },
  btn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: colors.card, paddingVertical: 12, borderRadius: 12,
  },
  btnText: { fontWeight: "800", color: colors.text },
});
