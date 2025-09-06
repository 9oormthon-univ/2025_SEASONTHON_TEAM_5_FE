import React from "react";
import { View, Text, StyleSheet, Pressable, Alert, Dimensions } from "react-native";
import { colors } from "../../../theme/colors";
import { useIngredientsStore } from "../store/ingredientsStore";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 16 * 2 - 10) / 2; 
// 좌우 패딩 16*2, 열 간격 10을 고려해서 반 나눈 값

export default function IngredientCard({ item }) {
  const removeIngredient = useIngredientsStore((s) => s.removeIngredient);
  const navigation = useNavigation();

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

  const dDay = (() => {
    if (!item.expiry) return "-";
    const today = new Date();
    const expiry = new Date(item.expiry);
    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? `D-${diff}` : `만료`;
  })();

  const handleEdit = () => {
    navigation.navigate("IngredientAdd", { ingredient: item });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.qty}>{item.qty || "-"}</Text>
      <Text style={styles.expiry}>{dDay}</Text>

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
    width: CARD_WIDTH,   // ✅ 고정 너비
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
