import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../../theme/colors";
import Logo from "../../../assets/images/logo.png";
import { HEADER_HEIGHT, HEADER_HORIZONTAL_PADDING } from "../../../theme/styles";

export default function MainHeader({ onAdd }) {
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>메인화면</Text>
      <Pressable onPress={onAdd} style={styles.iconBox} hitSlop={8}>
        <Ionicons name="add" size={24} color={colors.text} />
      </Pressable>
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
  iconBox: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
});