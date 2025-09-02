import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export default function BudgetHeader() {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>예산 관리</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 12, marginTop:6 },
  title: { fontSize: 18, fontWeight: "800", color: colors.text },
});
