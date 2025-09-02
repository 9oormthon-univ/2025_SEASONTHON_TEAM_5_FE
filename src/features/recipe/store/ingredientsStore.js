import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useIngredientsStore = create(
  persist(
    (set, get) => ({
      ingredients: [], // { id, name, expiry }  expiry: ISO(YYYY-MM-DD)
      addIngredient: (payload) =>
        set((s) => ({
          ingredients: [{ id: Date.now().toString(), ...payload }, ...s.ingredients],
        })),
      removeIngredient: (id) =>
        set((s) => ({ ingredients: s.ingredients.filter((x) => x.id !== id) })),
      clear: () => set({ ingredients: [] }),
    }),
    {
      name: "ingredients_store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
