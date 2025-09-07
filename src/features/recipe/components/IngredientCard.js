import React from "react";
import { View, Text, StyleSheet, Pressable, Alert, Dimensions } from "react-native";
import { colors } from "../../../theme/colors";
import { useIngredientsStore } from "../store/ingredientsStore";
import { useNavigation } from "@react-navigation/native";
import { useIngredientDelete } from "../hooks/useIngredientDelete";
import { useIngredientList } from "../hooks/useIngredientList";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 16 * 2 - 10) / 2; 
// 좌우 패딩 16*2, 열 간격 10을 고려해서 반 나눈 값

export default function IngredientCard({ item }) {
  const removeIngredient = useIngredientsStore((s) => s.removeIngredient);
  const loadFromServer = useIngredientsStore((s) => s.loadFromServer);
  const navigation = useNavigation();
  const { deleteIngredient, loading, error } = useIngredientDelete();
  const { fetchIngredients } = useIngredientList();

  const confirmDelete = async () => {
    Alert.alert(
      "삭제 확인",
      `"${item.name}" 재료를 삭제하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        { 
          text: "삭제", 
          style: "destructive", 
          onPress: async () => {
            try {
              // 서버에서 삭제
              const result = await deleteIngredient(item.id);
              if (result === null || result === undefined) {
                Alert.alert("삭제 실패", error || "다시 시도해주세요.");
                return;
              }

              // 로컬 스토어에서도 삭제
              removeIngredient(item.id);

              // 서버에서 최신 목록 가져와서 동기화
              try {
                const serverIngredients = await fetchIngredients();
                if (serverIngredients.length >= 0) { // 0개여도 성공
                  loadFromServer(serverIngredients);
                  console.log("🔄 [INGREDIENT] List refreshed after delete");
                }
              } catch (e) {
                console.warn("재료 목록 갱신 실패:", e);
              }

              console.log("✅ [INGREDIENT] Delete completed successfully");
            } catch (e) {
              console.error("❌ [INGREDIENT] Delete failed:", e);
              Alert.alert("삭제 실패", "재료 삭제 중 오류가 발생했습니다.");
            }
          }
        },
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

  // 수량 표시 포맷팅
  const formatQty = (qty) => {
    if (!qty) return "-";
    // "0개" 같은 경우 "0"으로 표시하지 않고 "-"로 표시
    if (qty === "0" || qty === "0개" || qty === "0g" || qty === "0ml") return "-";
    return qty;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.qty}>{formatQty(item.qty)}</Text>
      <Text style={styles.expiry}>{dDay}</Text>

      <View style={styles.actions}>
        <Pressable 
          style={[styles.actionBtn, loading && { opacity: 0.7 }]} 
          onPress={confirmDelete}
          disabled={loading}
        >
          <Text style={styles.actionText}>
            {loading ? "삭제 중..." : "삭제하기"}
          </Text>
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
