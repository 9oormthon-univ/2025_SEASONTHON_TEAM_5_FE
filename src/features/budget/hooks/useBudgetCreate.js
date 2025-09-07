// src/features/budget/hooks/useBudgetCreate.js
import { useCallback, useState } from "react";
import { useBudgetStore } from "../store/budgetStore";

// Date -> 'YYYY-MM-DD'
const toDateOnly = (d) => {
  if (!d) return null;
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return null;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export function useBudgetCreate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setMonthlyBudget, setBudgetPeriod } = useBudgetStore();

  const createBudget = useCallback(async ({ amount, startAt, endAt }) => {
    setLoading(true);
    setError("");

    // --- 검증 & 변환 ---
    const amt = Number(amount);
    const start = toDateOnly(startAt);
    const end = toDateOnly(endAt);

    if (!Number.isFinite(amt) || amt <= 0) {
      const msg = "예산 금액을 올바르게 입력하세요.";
      console.log("🧪 [BUDGET] validate fail:", msg, "amount:", amount);
      setError(msg);
      setLoading(false);
      return null;
    }
    if (!start || !end) {
      const msg = "시작일과 마감일을 선택하세요.";
      console.log("🧪 [BUDGET] validate fail:", msg, { startAt, endAt });
      setError(msg);
      setLoading(false);
      return null;
    }
    if (new Date(start) > new Date(end)) {
      const msg = "마감일은 시작일 이후여야 합니다.";
      console.log("🧪 [BUDGET] validate fail:", msg, { start, end });
      setError(msg);
      setLoading(false);
      return null;
    }

    try {
      // 로컬 스토어에만 저장 (서버 API 제거)
      setMonthlyBudget(amt);
      setBudgetPeriod({ startAt: start, endAt: end });
      
      console.log("✅ [BUDGET] Local store updated:", { amount: amt, startAt: start, endAt: end });
      
      return { success: true, amount: amt, startAt: start, endAt: end };
    } catch (e) {
      const msg = "예산 설정에 실패했습니다.";
      console.error("❌ [BUDGET] Create Failed:", msg);
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setMonthlyBudget, setBudgetPeriod]);

  // UI → payload 헬퍼
  const buildPayloadFromUI = useCallback((amountStr, startDate, endDate) => {
    const num = Number(String(amountStr || "").replaceAll(",", ""));
    return {
      amount: num,
      startAt: startDate, // 훅에서 YYYY-MM-DD로 변환
      endAt: endDate,
    };
  }, []);

  return { loading, error, setError, createBudget, buildPayloadFromUI };
}
