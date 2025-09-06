import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useIngredientsStore = create(
  persist(
    (set) => ({
      ingredients: [],

      // ✅ 재료 추가
      addIngredient: (ingredient) =>
        set((s) => ({
          ingredients: [
            {
              id: Date.now().toString(), // 고유 ID
              name: ingredient.name,      // 재료명
              qty: ingredient.qty,        // 수량
              expiry: ingredient.expiry,  // ✅ 필드명 통일
            },
            ...s.ingredients,
          ],
        })),

      // ✅ 재료 수정
      updateIngredient: (id, patch) =>
        set((s) => ({
          ingredients: s.ingredients.map((ing) =>
            ing.id === id ? { ...ing, ...patch } : ing
          ),
        })),

      // ✅ 재료 삭제
      removeIngredient: (id) =>
        set((s) => ({
          ingredients: s.ingredients.filter((ing) => ing.id !== id),
        })),

      // ✅ 전체 삭제
      clearAll: () => set({ ingredients: [] }),
    }),
    {
      name: "ingredients_store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);


// export const useIngredientsStore = create(
//   persist(
//     (set) => ({
//       ingredients: [],

//       // ✅ 재료 추가
//       addIngredient: (ingredient) =>
//         set((s) => ({
//           ingredients: [
//             {
//               id: Date.now().toString(), // 고유 ID
//               name: ingredient.name,      // 재료명
//               qty: ingredient.qty,        // 수량
//               expiry: ingredient.expiry,  // ✅ 필드명 통일 (MyIngredientsGrid에서 사용)
//             },
//             ...s.ingredients,
//           ],
//         })),

//       // ✅ 재료 삭제
//       removeIngredient: (id) =>
//         set((s) => ({
//           ingredients: s.ingredients.filter((ing) => ing.id !== id),
//         })),

//       // ✅ 전체 삭제
//       clearAll: () => set({ ingredients: [] }),
//     }),
//     {
//       name: "ingredients_store",
//       storage: createJSONStorage(() => AsyncStorage),
//     }
//   )
// );
