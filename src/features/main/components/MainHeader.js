import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../../theme/colors";

export default function MainHeader({ onAdd }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>예산관리</Text>
      <Pressable onPress={onAdd} hitSlop={8}>
        <Ionicons name="add" size={24} color={colors.text} />
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 18, fontWeight: "700", color: colors.text },
});
