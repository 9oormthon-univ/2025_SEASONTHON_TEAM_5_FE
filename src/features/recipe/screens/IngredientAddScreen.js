// 📂 src/features/recipe/screens/IngredientAddScreen.js
import React, { useState, useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../../theme/colors";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // iOS용 모달 래퍼
import RNDateTimePicker from "@react-native-community/datetimepicker"; // Android 네이티브
import ModalSelector from "react-native-modal-selector";
import { useIngredientCreate } from "../hooks/useIngredientCreate";
import { useIngredientList } from "../hooks/useIngredientList";
import { useIngredientsStore } from "../store/ingredientsStore";

// 단위 리스트
const UNITS = ["개", "통", "봉지", "g", "kg", "ml", "L"];

export default function IngredientAddScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { ingredient } = route.params || {};

  // 서버 등록 훅
  const {
    loading,
    error,
    setError,
    createIngredient,
    buildPayloadFromUI,
  } = useIngredientCreate();

  // 재료 목록 갱신 훅
  const { fetchIngredients } = useIngredientList();
  const { loadFromServer } = useIngredientsStore();

  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("개");
  const [expiry, setExpiry] = useState(""); // UI 표시는 YYYY-MM-DD
  const [datePickerVisible, setDatePickerVisible] = useState(false); // iOS 모달용
  const [androidPickerVisible, setAndroidPickerVisible] = useState(false); // Android 네이티브용

  useEffect(() => {
    if (ingredient) {
      setName(ingredient.name ?? "");
      const numberPart = ingredient.qty?.match(/[0-9]+/)?.[0] || "";
      let unitPart = ingredient.qty?.replace(/[0-9]/g, "").trim();
      if (!unitPart || !UNITS.includes(unitPart)) unitPart = "개";
      setQty(numberPart);
      setUnit(unitPart);
      setExpiry(ingredient.expiry ?? "");
    }
  }, [ingredient]);

  const closeToRecipe = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate("RecipeHome");
  };

  const goToMain = () => {
    navigation.navigate("메인화면", { screen: "MainHome" });
  };

  // expiry(YYYY-MM-DD or ISO) → Date
  const initialDate = useMemo(() => {
    if (!expiry) return new Date();
    const d =
      expiry.length > 10 ? new Date(expiry) : new Date(`${expiry}T00:00:00`);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [expiry]);

  const openDatePicker = () => {
    console.log("🗓️ openDatePicker() Platform:", Platform.OS);
    if (Platform.OS === "android") {
      setAndroidPickerVisible(true); // Android는 네이티브 다이얼로그
    } else {
      setDatePickerVisible(true); // iOS는 모달 래퍼
    }
  };
  const closeDatePicker = () => {
    console.log("🗓️ closeDatePicker()");
    setDatePickerVisible(false);
    setAndroidPickerVisible(false);
  };

  const handleConfirmDate = (date) => {
    const iso = date?.toISOString?.();
    console.log("✅ onConfirm date ISO:", iso);
    // 화면엔 YYYY-MM-DD로 보이게 저장 (전송은 훅에서 ISO로 변환됨)
    setExpiry(iso?.slice(0, 10) ?? "");
    closeDatePicker();
  };

  const onSave = async () => {
    if (!name.trim()) return Alert.alert("재료명을 입력하세요");
    setError("");

    const payload = buildPayloadFromUI(name, qty, unit, expiry);
    console.log("🧾 [UI] Build payload from inputs:", payload);

    const result = await createIngredient(payload);
    if (result === null || result === undefined) {
      // createIngredient가 실패한 경우에만 에러 메시지 표시
      console.log("❌ [UI] Create failed, showing error:", error);
      return Alert.alert("등록 실패", error || "다시 시도해주세요.");
    }

    console.log("✅ [UI] Create result:", result);

    // 성공 시 에러 상태 초기화
    setError("");
    console.log("✅ [UI] Create success, clearing error state");

    // 재료 추가 성공 시 목록 갱신
    try {
      const serverIngredients = await fetchIngredients();
      if (serverIngredients.length > 0) {
        loadFromServer(serverIngredients);
        console.log("🔄 [INGREDIENT] List refreshed after create");
      }
    } catch (e) {
      console.warn("재료 목록 갱신 실패:", e);
    }

    // 성공 알림 후 메인 화면으로 이동
    Alert.alert(
      "등록 완료", 
      "재료가 성공적으로 추가되었습니다.",
      [
        {
          text: "확인",
          onPress: goToMain
        }
      ]
    );
  };

  // ModalSelector가 배열 스타일 미허용 → flatten으로 객체 전달
  const selectorTextStyle = StyleSheet.flatten([
    styles.unitText,
    styles.leftText,
    { color: colors.text },
  ]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Pressable onPress={closeToRecipe} hitSlop={8}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>
            {ingredient ? "재료 추가(미리채움)" : "재료 추가"}
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
              initValueTextStyle={selectorTextStyle}
              selectTextStyle={selectorTextStyle}
            />
          </View>
        </View>

        {/* 유통기한 */}
        <Pressable
          style={[styles.input, { justifyContent: "center" }]}
          onPress={openDatePicker}
        >
          <Text style={[styles.leftText, { color: expiry ? colors.text : colors.accent }]}>
            {(expiry && expiry.length > 10) ? expiry.slice(0, 10) : (expiry || "유통기한 선택")}
          </Text>
        </Pressable>

        {/* iOS: 모달 래퍼 */}
        {Platform.OS === "ios" && (
          <DateTimePickerModal
            isVisible={datePickerVisible}
            date={initialDate}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={closeDatePicker}
          />
        )}

        {/* Android: 네이티브 다이얼로그 */}
        {Platform.OS === "android" && androidPickerVisible && (
          <RNDateTimePicker
            mode="date"
            value={initialDate}
            display="calendar" // 필요하면 'spinner'로 변경
            onChange={(event, selectedDate) => {
              console.log("📲 Android onChange:", event?.type, selectedDate?.toISOString?.());
              // event.type === 'set' 이면 확인, 'dismissed'면 취소
              if (event?.type === "set" && selectedDate) {
                handleConfirmDate(selectedDate);
              } else {
                closeDatePicker();
              }
            }}
          />
        )}

        {/* 저장 버튼 */}
        <Pressable
          style={[styles.addBtn, loading && { opacity: 0.7 }]}
          onPress={onSave}
          disabled={loading}
        >
          <Text style={styles.addText}>
            {loading ? "등록 중..." : "추가"}
          </Text>
        </Pressable>

        {!!error && <Text style={{ color: "#ef4444", marginTop: 8 }}>{error}</Text>}
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
