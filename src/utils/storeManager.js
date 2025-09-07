// src/utils/storeManager.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useExpenseStore } from "../features/main/store/expenseStore";
import { useBudgetStore } from "../features/budget/store/budgetStore";
import { useIngredientsStore } from "../features/recipe/store/ingredientsStore";

/**
 * 모든 스토어를 초기화하는 함수
 * - expenseStore: 지출 내역과 예산 초기화
 * - budgetStore: 예산 설정 초기화
 * - ingredientsStore: 재료 목록 초기화
 * - AsyncStorage: 모든 저장된 데이터 삭제
 */
export const clearAllStores = async () => {
  try {
    console.log("🧹 [STORE] Starting complete store reset...");

    // 1. 각 스토어의 clearAll 함수 호출
    useExpenseStore.getState().clearAll();
    useBudgetStore.getState().clearAll();
    useIngredientsStore.getState().clearAll();

    // 2. AsyncStorage에서 모든 앱 데이터 삭제
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter(key => 
      key.includes("what_to_eat_today") || 
      key.includes("ingredients_store") ||
      key.includes("budget_store") ||
      key.includes("auth/") ||
      key.includes("debug/")
    );

    if (appKeys.length > 0) {
      await AsyncStorage.multiRemove(appKeys);
      console.log("🧹 [STORE] Removed AsyncStorage keys:", appKeys);
    }

    console.log("✅ [STORE] All stores and cache cleared successfully");
    return { success: true, message: "모든 데이터가 초기화되었습니다." };
  } catch (error) {
    console.error("❌ [STORE] Failed to clear stores:", error);
    return { success: false, message: "초기화 중 오류가 발생했습니다." };
  }
};

/**
 * 특정 스토어만 초기화하는 함수들
 */
export const clearExpenseStore = () => {
  useExpenseStore.getState().clearAll();
  console.log("🧹 [STORE] Expense store cleared");
};

export const clearBudgetStore = () => {
  useBudgetStore.getState().clearAll();
  console.log("🧹 [STORE] Budget store cleared");
};

export const clearIngredientsStore = () => {
  useIngredientsStore.getState().clearAll();
  console.log("🧹 [STORE] Ingredients store cleared");
};

/**
 * AsyncStorage만 초기화하는 함수
 */
export const clearAsyncStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter(key => 
      key.includes("what_to_eat_today") || 
      key.includes("ingredients_store") ||
      key.includes("budget_store") ||
      key.includes("auth/") ||
      key.includes("debug/")
    );

    if (appKeys.length > 0) {
      await AsyncStorage.multiRemove(appKeys);
      console.log("🧹 [STORE] AsyncStorage cleared:", appKeys);
    }
    return { success: true };
  } catch (error) {
    console.error("❌ [STORE] Failed to clear AsyncStorage:", error);
    return { success: false };
  }
};
