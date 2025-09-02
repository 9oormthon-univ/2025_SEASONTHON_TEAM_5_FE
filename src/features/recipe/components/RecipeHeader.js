import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export default function RecipeHeader() {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>레시피 추천</Text>
      {/* 필요하면 오른쪽에 설정/추가 버튼 붙이면 됨 */}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 12, marginTop:6 },
  title: { fontSize: 18, fontWeight: "800", color: colors.text },
});
