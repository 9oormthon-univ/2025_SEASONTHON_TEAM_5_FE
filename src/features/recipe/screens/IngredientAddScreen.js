import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../../theme/colors";
import { useIngredientsStore } from "../store/ingredientsStore";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";

// ✅ 단위 옵션
const UNITS = ["개", "통", "봉지", "g", "kg", "ml", "L"];

export default function IngredientAddScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { ingredient } = route.params || {}; // 수정 모드면 ingredient 전달됨

  const addIngredient = useIngredientsStore((s) => s.addIngredient);
  const updateIngredient = useIngredientsStore((s) => s.updateIngredient);

  // ✅ 상태
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("개"); // 기본 단위
  const [expiry, setExpiry] = useState("");
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    if (ingredient) {
      setName(ingredient.name);
      setQty(ingredient.qty?.replace(/[^0-9]/g, "") || "");
      setUnit(ingredient.qty?.replace(/[0-9]/g, "") || "개");
      setExpiry(ingredient.expiry);
    }
  }, [ingredient]);

  const closeToRecipe = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate("RecipeHome");
  };

  const onSave = () => {
    if (!name.trim()) return Alert.alert("재료명을 입력하세요");

    const finalQty = `${qty}${unit}`;

    if (ingredient) {
      updateIngredient(ingredient.id, { name, qty: finalQty, expiry });
      Alert.alert("수정 완료", `${name} / ${finalQty} / ${expiry}`);
    } else {
      addIngredient({ name, qty: finalQty, expiry });
      Alert.alert("등록 완료", `${name} / ${finalQty} / ${expiry}`);
    }

    closeToRecipe();
  };

  // ✅ 달력 선택 처리
  const handleConfirmDate = (date) => {
    setExpiry(date.toISOString().slice(0, 10)); // YYYY-MM-DD
    setDatePickerVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Pressable onPress={closeToRecipe} hitSlop={8}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>
            {ingredient ? "재료 수정" : "재료 추가"}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* 재료명 */}
        <TextInput
          placeholder="재료명"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor={colors.accent}
        />

        {/* 수량 + 단위 (카드형) */}
        <View style={styles.inputCard}>
          <TextInput
            placeholder="수량"
            value={qty}
            keyboardType="numeric"
            onChangeText={setQty}
            style={styles.qtyInput}
            placeholderTextColor={colors.accent}
          />
          <View style={styles.divider} />
          <Picker
            selectedValue={unit}
            onValueChange={(val) => setUnit(val)}
            style={styles.unitPicker}
            dropdownIconColor={colors.text}
          >
            {UNITS.map((u) => (
              <Picker.Item key={u} label={u} value={u} />
            ))}
          </Picker>
        </View>

        {/* 유통기한 (달력) */}
        <Pressable
          style={[styles.input, { justifyContent: "center" }]}
          onPress={() => setDatePickerVisible(true)}
        >
          <Text style={{ color: expiry ? colors.text : colors.accent }}>
            {expiry || "유통기한 선택"}
          </Text>
        </Pressable>

        {/* Date Picker 모달 */}
        <DateTimePickerModal
          isVisible={datePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisible(false)}
        />

        {/* 버튼 */}
        <Pressable style={styles.addBtn} onPress={onSave}>
          <Text style={styles.addText}>
            {ingredient ? "수정" : "추가"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 16, fontWeight: "800", color: colors.text },
  input: {
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  // ✅ 수량 + 단위 카드형 스타일
  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
    overflow: "hidden",
  },
  qtyInput: {
    flex: 2,
    padding: 14,
    textAlign: "center",
    color: colors.text,
  },
  divider: {
    width: 1,
    backgroundColor: "#E5E7EB",
    height: "100%",
  },
  unitPicker: {
    flex: 1,
    height: 52,
    color: colors.text,
  },
  addBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#22C55E",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 4,
  },
  addText: { color: "#fff", fontWeight: "800" },
});
