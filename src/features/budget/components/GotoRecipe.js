import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../theme/colors";

export default function GotoRecipe() {
  const navigation = useNavigation();
  return (
    <View>
      <Text style={styles.title}>향후 식단 추천</Text>
      <Text style={styles.desc}>설정된 예산에 따라 향후 식단을 추천받으세요.</Text>
      <Pressable
        style={styles.cta}
        onPress={() => navigation.navigate("레시피 추천")}
      >
        <Text style={styles.ctaText}>레시피 추천으로 이동하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: "800", color: colors.text, marginBottom: 6, marginTop: 4 },
  desc: { color: colors.sub, marginBottom: 10 },
  cta: { alignSelf: "flex-start", borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  ctaText: { fontWeight: "800", color: colors.text, fontSize: 12 },
});
