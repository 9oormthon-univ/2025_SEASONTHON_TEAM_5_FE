// src/features/recipe/hooks/useIngredientList.js
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const DEFAULT_API_BASE = "http://what2eat.duckdns.org:8080";

// URL 안전 조합 (중복/누락 슬래시 방지)
const joinUrl = (base, path) =>
  `${String(base || "").replace(/\/+$/, "")}/${String(path || "").replace(/^\/+/, "")}`;

// fetch + 타임아웃 + 로그 (타임아웃 시간 증가)
async function fetchWithTimeout(url, init = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    console.log("🌐 fetch", url, init?.method || "GET", `(timeout: ${timeoutMs}ms)`);
    const res = await fetch(url, { ...init, signal: controller.signal });
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text };
    }
    return { res, data, text };
  } finally {
    clearTimeout(timer);
  }
}

// 런타임에서 API_BASE 오버라이드(없으면 DEFAULT 사용)
async function getApiBase() {
  const override = await AsyncStorage.getItem("debug/API_BASE");
  const base = override || DEFAULT_API_BASE;
  console.log("🔧 API_BASE:", base);
  return base;
}

// ✅ named export (default 아님!)
export function useIngredientList() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // 서버에서 재료 목록 조회 (재시도 기능 포함)
  const fetchIngredients = useCallback(async (retryAttempt = 0) => {
    setLoading(true);
    setError("");
    setRetryCount(retryAttempt);

    const base = await getApiBase();
    const url = joinUrl(base, "/api/ingredient");

    // 토큰이 있으면 Authorization 추가
    const token = await AsyncStorage.getItem("auth/accessToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    console.log("➡️  [INGREDIENT] GET", url);

    try {
      const { res, data, text } = await fetchWithTimeout(
        url,
        { method: "GET", headers },
        30000 // 30초로 증가
      );

      console.log("📨 [INGREDIENT] Response Status:", res.status);
      console.log("📨 [INGREDIENT] Response Body:", data ?? text);

      if (!res.ok) {
        let msg = data?.message || data?.detail || `HTTP ${res.status}`;

        if (res.status === 500) {
          msg = "서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
        } else if (res.status === 401) {
          msg = "로그인이 필요합니다.";
        } else if (res.status === 403) {
          msg = "접근 권한이 없습니다.";
        } else if (res.status === 404) {
          msg = "요청한 데이터를 찾을 수 없습니다.";
        } else if (res.status >= 400 && res.status < 500) {
          msg = "요청에 문제가 있습니다. 입력을 확인해주세요.";
        } else if (res.status >= 500) {
          msg = "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
        }

        const err = new Error(msg);
        err.status = res.status;
        err.data = data;
        throw err;
      }

      // 서버 응답을 로컬 스토어 형태로 변환
      const transformedIngredients = (data || []).map((item, index) => ({
        id: item.id || `server_${Date.now()}_${index}`,
        name: item.name || "",
        qty: `${item.quantity || 0}${item.unit || ""}`,
        expiry: item.expirationDate || null,
      }));

      console.log("✅ [INGREDIENT] Fetch Success:", transformedIngredients.length, "items");
      return transformedIngredients;
    } catch (e) {
      let msg = e?.message || "재료 목록 조회 실패";
      if (e?.name === "AbortError") {
        msg = "서버 응답이 지연되고 있습니다. 네트워크 상태를 확인하고 다시 시도해주세요.";
      }
      if (String(e).includes("Network request failed")) {
        msg =
          Platform.OS === "android"
            ? "네트워크 연결을 확인해주세요. (WiFi/모바일 데이터 상태 확인)"
            : "네트워크 연결을 확인해주세요. (WiFi/모바일 데이터 상태 확인)";
      }

      if (retryAttempt < 2 && (e?.status >= 500 || e?.name === "AbortError")) {
        console.log(`🔄 [INGREDIENT] Retry attempt ${retryAttempt + 1}/2`);
        setTimeout(() => {
          fetchIngredients(retryAttempt + 1);
        }, 1000 * (retryAttempt + 1));
        return [];
      }

      console.error("❌ [INGREDIENT] Fetch Failed:", msg, e?.data || "");
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const syncWithServer = useCallback(
    async (ingredientsStore) => {
      try {
        const serverIngredients = await fetchIngredients();
        if (serverIngredients.length > 0) {
          ingredientsStore.clearAll();
          serverIngredients.forEach((ingredient) => {
            ingredientsStore.addIngredient(ingredient);
          });
          console.log("🔄 [INGREDIENT] Sync completed:", serverIngredients.length, "items");
        }
        return serverIngredients;
      } catch (e) {
        console.error("❌ [INGREDIENT] Sync failed:", e);
        return [];
      }
    },
    [fetchIngredients]
  );

  const retry = useCallback(() => {
    setError("");
    fetchIngredients(0);
  }, [fetchIngredients]);

  return {
    loading,
    error,
    retryCount,
    setError,
    fetchIngredients,
    syncWithServer,
    retry,
  };
}
