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

      // 레시피에 필요한 재료 차감
      consumeIngredients: (neededList) => {
        // neededList: [{ name: string, qty: "200g"|"1개"... }, ...]
        set((s) => {
          const updated = s.ingredients.map((ing) => {
            const need = neededList.find((n) => n.name === ing.name);
            if (!need) return ing;
            // 숫자만 비교
            const haveNum = parseInt(ing.qty, 10);
            const needNum = parseInt(need.qty, 10);
            const remain = Math.max(haveNum - needNum, 0);
            const unit = ing.qty.replace(/[0-9]/g, "");
            return { ...ing, qty: `${remain}${unit}` };
          });
          return { ingredients: updated };
        });
      },
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
