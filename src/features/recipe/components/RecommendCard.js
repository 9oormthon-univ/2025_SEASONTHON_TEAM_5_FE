import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "../../../theme/colors";

export default function RecommendCard({ hasIngredients, onRecommend }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>레시피 추천</Text>
      <View style={styles.card}>
        <View style={styles.image} />
        <Text style={styles.title}>
          {hasIngredients ? "재료로 만들 수 있는 레시피를 찾아볼까요?" : "추천 레시피가 없어요"}
        </Text>
        <Text style={styles.desc}>
          {hasIngredients
            ? "등록된 재료를 기반으로 가능한 레시피를 추천합니다."
            : "재료를 추가하시면, 가지고 계신 재료로 만들 수 있는 레시피를 추천해 드릴게요."}
        </Text>
        <Pressable style={styles.cta} onPress={onRecommend}>
          <Text style={styles.ctaText}>레시피 추천</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontWeight: "800", marginBottom: 10, color: colors.text },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, gap: 10, borderWidth: 1, borderColor: "#E5E7EB" },
  image: { height: 120, borderRadius: 12, backgroundColor: colors.card },
  title: { fontSize: 16, fontWeight: "800", color: colors.text },
  desc: { fontSize: 12, color: colors.sub },
  cta: { alignSelf: "flex-start", backgroundColor: "#10B981", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  ctaText: { color: "#fff", fontWeight: "800" },
});
