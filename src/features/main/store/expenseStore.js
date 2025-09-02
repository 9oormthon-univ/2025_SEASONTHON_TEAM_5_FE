import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useExpenseStore = create(
  persist(
    (set, get) => ({
      budget: 2000000,          // 이번 달 예산(필요 시 변경 화면 추가)
      expenses: [],             // {id, title, category, amount, date, method, memo}

      addExpense: (payload) =>
        set((s) => ({
          expenses: [
            { id: Date.now().toString(), ...payload },
            ...s.expenses,
          ],
        })),
      updateExpense: (id, patch) =>
        set((s) => ({
          expenses: s.expenses.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),
      removeExpense: (id) =>
        set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

      setBudget: (v) => set({ budget: v }),
      clearAll: () => set({ expenses: [] }),
    }),
    {
      name: "what_to_eat_today_store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
