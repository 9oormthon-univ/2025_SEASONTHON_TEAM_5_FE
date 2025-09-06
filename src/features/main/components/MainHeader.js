import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";
import Logo from "../../../assets/images/logo.png";
import { HEADER_HEIGHT, HEADER_HORIZONTAL_PADDING } from "../../../theme/styles";

export default function MainHeader() {
  return (
    <View style={styles.container}>
      {/* 왼쪽 로고 */}
      <Image source={Logo} style={styles.logo} resizeMode="contain" />

      {/* 중앙 제목 */}
      <Text style={styles.title}>메인화면</Text>

      {/* 오른쪽 스페이서 */}
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
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  spacer: { width: 32, height: 32 },
});
