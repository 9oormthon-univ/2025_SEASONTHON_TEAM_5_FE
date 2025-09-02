import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useBudgetStore = create(
  persist(
    (set) => ({
      monthlyBudget: 0,   // 이번 달 예산 (기본 0)
      periodDays: 30,     // 예산 사용 기한(일수) – UI에서 조정
      setMonthlyBudget: (v) => set({ monthlyBudget: Number(v) || 0 }),
      setPeriodDays: (d) => set({ periodDays: Number(d) || 30 }),
      resetBudget: () => set({ monthlyBudget: 0, periodDays: 30 }),
    }),
    {
      name: "what_to_eat_today_budget",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
