// 📂 src/features/recipe/screens/IngredientAddScreen.js
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
import ModalSelector from "react-native-modal-selector";

// 단위 리스트
const UNITS = ["개", "통", "봉지", "g", "kg", "ml", "L"];

export default function IngredientAddScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { ingredient } = route.params || {};

  const addIngredient = useIngredientsStore((s) => s.addIngredient);
  const updateIngredient = useIngredientsStore((s) => s.updateIngredient);

  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("개");
  const [expiry, setExpiry] = useState("");
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    if (ingredient) {
      setName(ingredient.name);
      const numberPart = ingredient.qty?.match(/[0-9]+/)?.[0] || "";
      let unitPart = ingredient.qty?.replace(/[0-9]/g, "").trim();
      if (!unitPart || !UNITS.includes(unitPart)) unitPart = "개";
      setQty(numberPart);
      setUnit(unitPart);
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

  const handleConfirmDate = (date) => {
    setExpiry(date.toISOString().slice(0, 10));
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
          style={[styles.input, styles.leftText]}
          placeholderTextColor={colors.accent}
        />

        {/* 수량 + 단위 */}
        <View style={styles.inputCard}>
          <TextInput
            placeholder="수량"
            value={qty}
            keyboardType="numeric"
            onChangeText={setQty}
            style={[styles.qtyInput, styles.leftText]}
            placeholderTextColor={colors.accent}
          />
          <View style={styles.divider} />

          <View style={{ flex: 1 }}>
            <ModalSelector
              data={UNITS.map((u, idx) => ({ key: idx, label: u }))}
              onChange={(option) => setUnit(option.label)}
              cancelText="취소"
              initValue={unit}
              style={{ flex: 1 }}
              selectStyle={styles.unitSelect}
              //selectTextStyle={[styles.unitText, styles.leftText]}
              selectTextStyle={StyleSheet.flatten([styles.unitText, styles.leftText])}
            />
          </View>
        </View>

        {/* 유통기한 */}
        <Pressable
          style={[styles.input, { justifyContent: "center" }]}
          onPress={() => setDatePickerVisible(true)}
        >
          <Text style={[styles.leftText, { color: expiry ? colors.text : colors.accent }]}>
            {expiry || "유통기한 선택"}
          </Text>
        </Pressable>
        <DateTimePickerModal
          isVisible={datePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisible(false)}
        />

        {/* 저장 버튼 */}
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
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },

  input: {
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  // 왼쪽 정렬 공통
  leftText: {
    textAlign: "left",
    color: colors.text,
  },

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
    color: colors.text,
  },
  divider: {
    width: 1,
    backgroundColor: "#E5E7EB",
    height: "100%",
  },

  unitSelect: {
    borderWidth: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    justifyContent: "center",
    height: 45,
  },
  unitText: {
    fontSize: 14,
  },

  addBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#22C55E",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 4,
  },
  addText: {
    color: "#fff",
    fontWeight: "800",
  },
});
