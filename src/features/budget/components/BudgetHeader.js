import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";
import Logo from "../../../assets/images/logo.png";
import { HEADER_HEIGHT, HEADER_HORIZONTAL_PADDING } from "../../../theme/styles";

export default function BudgetHeader() {
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>예산관리</Text>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: HEADER_HORIZONTAL_PADDING,
    marginTop: 6,
    marginBottom: 12,
  },
  logo: { width: 32, height: 32 },
  title: { fontSize: 18, fontWeight: "800", color: colors.text },
  spacer: { width: 32, height: 32 },
});