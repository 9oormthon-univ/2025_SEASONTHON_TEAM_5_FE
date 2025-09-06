import React from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { colors } from "../../../theme/colors";
import { useIngredientsStore } from "../store/ingredientsStore";
import { useNavigation } from "@react-navigation/native";

export default function IngredientCard({ item }) {
  const removeIngredient = useIngredientsStore((s) => s.removeIngredient);
  const navigation = useNavigation();

  // ✅ 삭제 확인
  const confirmDelete = () => {
    Alert.alert(
      "삭제 확인",
      `"${item.name}" 재료를 삭제하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        { text: "삭제", style: "destructive", onPress: () => removeIngredient(item.id) },
      ]
    );
  };

  // ✅ 남은 일수 계산 (D-2, D-3)
  const dDay = (() => {
    if (!item.expiry) return "-";
    const today = new Date();
    const expiry = new Date(item.expiry);
    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? `D-${diff}` : `만료`;
  })();

  // ✅ 수정하기 → IngredientAddScreen으로 이동, 기존 값 전달
  const handleEdit = () => {
    navigation.navigate("IngredientAdd", { ingredient: item });
  };

  return (
    <View style={styles.card}>
      {/* 재료 정보 */}
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.qty}>{item.qty || "-"}</Text>
      <Text style={styles.expiry}>{dDay}</Text>

      {/* 버튼 영역 */}
      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={confirmDelete}>
          <Text style={styles.actionText}>삭제하기</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={handleEdit}>
          <Text style={styles.actionText}>수정하기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    alignItems: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  qty: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  expiry: {
    fontSize: 13,
    color: colors.accent,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    backgroundColor: "#ECFDF5",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },
});
