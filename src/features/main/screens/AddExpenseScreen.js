// 📂 src/features/expense/screens/AddExpenseScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useExpenseStore } from "../store/expenseStore";
import { colors } from "../../../theme/colors";
import { nanoid } from "nanoid/non-secure"; // 파일 상단에 추가

export default function AddExpenseScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const presetDate = route.params?.date; // YYYY-MM-DD
  const addExpense = useExpenseStore((s) => s.addExpense);

  const [categories, setCategories] = useState([
    { name: "식사", amount: "" },
    { name: "음료", amount: "" },
    { name: "간식", amount: "" },
    { name: "술", amount: "" },
  ]);
  const [newCategory, setNewCategory] = useState("");
  const date = presetDate || new Date().toISOString().slice(0, 10);
  const [method, setMethod] = useState("신용");

  const goMain = () => navigation.navigate("메인화면", { screen: "MainHome" });

  // 총 금액 계산
  const totalAmount = categories.reduce(
    (sum, c) => sum + (Number(c.amount) || 0),
    0
  );

  // 카테고리 금액 변경
  const updateAmount = (name, value) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.name === name ? { ...c, amount: value.replace(/[^0-9]/g, "") } : c
      )
    );
  };

  // 카테고리 삭제
  const removeCategory = (name) => {
    setCategories((prev) => prev.filter((c) => c.name !== name));
  };

  // 새 카테고리 추가
  const addNewCategory = () => {
    if (!newCategory.trim()) return;
    if (categories.some((c) => c.name === newCategory.trim())) {
      Alert.alert("이미 존재하는 카테고리입니다.");
      return;
    }
    setCategories((prev) => [...prev, { name: newCategory.trim(), amount: "" }]);
    setNewCategory("");
  };

  const onSubmit = () => {
    if (totalAmount <= 0) return Alert.alert("금액을 입력하세요");

    categories.forEach((c) => {
      if (c.amount && Number(c.amount) > 0) {
        addExpense({
          id: nanoid(),               // ✅ 고유 ID 추가
          title: c.usage || c.name,   // 사용처 있으면 title로
          category: c.name,           // 카테고리는 분류
          amount: Number(c.amount),
          date: new Date(date).toISOString(),
          method,
          memo: "",
        });
      }
  });

  goMain();
};


  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Pressable onPress={goMain} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>지출 내역 추가</Text>
          <Ionicons name="checkmark" size={24} color={colors.text} />
        </View>

        {/* 날짜 */}
        <Text style={styles.dateText}>{date.replace(/-/g, ".")}</Text>

        {/* 총 금액 */}
        <Text style={styles.totalAmount}>{totalAmount.toLocaleString()}원</Text>

        {/* 결제 수단 */}
        <View style={styles.methodRow}>
          {["신용", "체크", "현금", "계좌이체"].map((m) => (
            <Pressable
              key={m}
              style={[styles.methodBtn, method === m && styles.methodBtnActive]}
              onPress={() => setMethod(m)}
            >
              <Text
                style={[
                  styles.methodText,
                  method === m && styles.methodTextActive,
                ]}
              >
                {m}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* 카테고리별 입력 */}
        {categories.map((c) => (
        <View key={c.name} style={styles.categoryRow}>
          <Text style={styles.categoryName}>{c.name}</Text>

          {/* 사용처 입력 */}
          <TextInput
            placeholder="사용처"
            value={c.usage || ""}
            onChangeText={(val) =>
              setCategories((prev) =>
                prev.map((x) =>
                  x.name === c.name ? { ...x, usage: val } : x
                )
              )
            }
            style={[styles.categoryInput, { flex: 1, marginRight: 8 }]}
            placeholderTextColor={colors.accent}
          />

          {/* 금액 입력 */}
          <TextInput
            placeholder="0"
            keyboardType="number-pad"
            value={c.amount}
            onChangeText={(val) => updateAmount(c.name, val)}
            style={styles.categoryInput}
            placeholderTextColor={colors.accent}
          />

          <Pressable onPress={() => removeCategory(c.name)}>
            <Ionicons name="close" size={18} color={colors.accent} />
          </Pressable>
        </View>
      ))}


        {/* 새 카테고리 추가 */}
        <View style={styles.newCategoryRow}>
          <TextInput
            placeholder="새 카테고리 입력"
            value={newCategory}
            onChangeText={setNewCategory}
            style={[styles.input, { flex: 1 }]}
            placeholderTextColor={colors.accent}
          />
          <Pressable style={styles.addCatBtn} onPress={addNewCategory}>
            <Text style={styles.addCatBtnText}>+</Text>
          </Pressable>
        </View>

        {/* 추가 버튼 */}
        <Pressable style={styles.addBtn} onPress={onSubmit}>
          <Text style={styles.addBtnText}>추가</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 6,
    paddingBottom: 10,
  },
  headerTitle: { fontSize: 16, fontWeight: "800", color: colors.text },
  dateText: {
    alignSelf: "center",
    fontSize: 14,
    color: colors.text,
    marginBottom: 6,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
    color: colors.text,
  },
  methodRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    padding: 6,
  },
  methodBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  methodBtnActive: {
    backgroundColor: "#22C55E20",
  },
  methodText: { fontSize: 14, color: colors.accent },
  methodTextActive: { color: "#15803D", fontWeight: "700" },
  categoryRow: {
    backgroundColor: "#ECFDF5",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryName: { flex: 1, fontSize: 16, color: colors.text },
  categoryInput: {
    width: 80,
    textAlign: "right",
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    color: colors.text,
  },
  newCategoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 12,
    marginRight: 8,
  },
  addCatBtn: {
    backgroundColor: "#22C55E",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addCatBtnText: { color: "#fff", fontSize: 18, fontWeight: "800" },
  addBtn: {
    marginTop: "auto",
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
