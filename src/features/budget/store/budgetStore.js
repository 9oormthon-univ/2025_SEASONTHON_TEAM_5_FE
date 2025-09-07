import { create } from "zustand";

export const useBudgetStore = create((set, get) => ({
  // 상태
  monthlyBudget: 0,             // 현재 달 예산(클라이언트 표시용)
  budgetPeriod: {               // 예산 기간
    startAt: null,
    endAt: null,
  },
  budgetId: null,               // 서버에서 발급된 예산 ID (사용하지 않음)
  remainingBudgetServer: null,  // 서버가 계산한 남은 예산 (사용하지 않음)
  totalBudgetServer: null,      // 서버가 가진 총 예산 (사용하지 않음)

  // ----- 하위호환/일반 액션 -----
  // 기존 컴포넌트들이 호출하는 함수(누락돼 에러났던 부분)
  setMonthlyBudget: (amount) =>
    set({ monthlyBudget: Number(amount) || 0 }),

  setBudgetPeriod: ({ startAt, endAt }) =>
    set({ budgetPeriod: { startAt, endAt } }),

  setBudgetId: (id) =>
    set({ budgetId: id ?? null }),

  // ----- 초기화 액션 -----
  clearAll: () =>
    set({
      monthlyBudget: 0,
      budgetPeriod: { startAt: null, endAt: null },
      budgetId: null,
      remainingBudgetServer: null,
      totalBudgetServer: null,
    }),

  // ----- 서버 동기화용 액션 -----
  // 서버 응답으로 예산 정보를 한 번에 반영
  setServerBudget: ({ id, amount }) =>
    set({
      budgetId: id ?? null,
      monthlyBudget: Number(amount) || 0,
    }),

  // 서버의 남은예산/총예산 값을 반영
  setRemainingFromServer: ({ remainingBudget, totalBudget }) =>
    set({
      remainingBudgetServer:
        remainingBudget !== undefined && remainingBudget !== null
          ? Number(remainingBudget)
          : null,
      totalBudgetServer:
        totalBudget !== undefined && totalBudget !== null
          ? Number(totalBudget)
          : null,
    }),

  // 서버/클라이언트 예산값 초기화
  clearServerBudget: () =>
    set({
      budgetId: null,
      monthlyBudget: 0,
      remainingBudgetServer: null,
      totalBudgetServer: null,
    }),
}));
