// src/features/budget/hooks/useBudgetCreate.js
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "http://what2eat.duckdns.org:8080";

// URL 안전 조합
const joinUrl = (base, path) =>
  `${base.replace(/\/+$/, "")}/${String(path || "").replace(/^\/+/, "")}`;

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

    const payload = { amount: amt, startAt: start, endAt: end };
    const url = joinUrl(API_BASE, "/api/budgets");

    // 토큰 헤더
    const token = await AsyncStorage.getItem("auth/accessToken");
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log("🔐 [BUDGET] Auth header set:", {
        hasToken: true,
        len: token.length,
        preview: token.slice(0, 10) + "...",
      });
    } else {
      console.log("🔐 [BUDGET] Auth header set: no token");
    }

    console.log("➡️  [BUDGET] POST", url);
    console.log("📦 [BUDGET] Request Body:", payload);

    // 타임아웃 10초
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const text = await res.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }

      console.log("📨 [BUDGET] Response Status:", res.status);
      console.log("📨 [BUDGET] Response Body:", data);

      if (!res.ok) {
        const msg = data?.message || data?.detail || `HTTP ${res.status}`;
        const err = new Error(msg);
        err.status = res.status;
        err.data = data;
        throw err;
      }

      console.log("✅ [BUDGET] Create Success");
      return data;
    } catch (e) {
      const isAbort = e?.name === "AbortError";
      const msg = isAbort
        ? "요청 시간 초과(네트워크 지연)"
        : String(e?.message || e) || "예산 등록 실패";
      console.error("❌ [BUDGET] Create Failed:", msg, e?.data || "");
      setError(msg);
      return null;
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  }, []);

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
