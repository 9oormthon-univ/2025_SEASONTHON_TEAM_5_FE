import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export default function CalendarHeader() {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>캘린더</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 12, marginTop:6 },
  title: { fontSize: 18, fontWeight: "800", color: colors.text },
});
