// src/features/recipe/hooks/useIngredientDelete.js
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const DEFAULT_API_BASE = "http://what2eat.duckdns.org:8080";

// URL 안전 조합
const joinUrl = (base, path) =>
  `${base.replace(/\/+$/, "")}/${String(path || "").replace(/^\/+/, "")}`;

// fetch + 타임아웃 + 로그
async function fetchWithTimeout(url, init = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    console.log("🌐 fetch", url, init?.method || "GET", `(timeout: ${timeoutMs}ms)`);
    const res = await fetch(url, { ...init, signal: controller.signal });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
    return { res, data, text };
  } finally {
    clearTimeout(timer);
  }
}

// 런타임에서 API_BASE 오버라이드
async function getApiBase() {
  const override = await AsyncStorage.getItem("debug/API_BASE");
  const base = override || DEFAULT_API_BASE;
  console.log("🔧 API_BASE:", base);
  return base;
}

export function useIngredientDelete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deleteIngredient = useCallback(async (ingredientId) => {
    setLoading(true);
    setError("");

    if (!ingredientId) {
      const msg = "재료 ID가 필요합니다.";
      console.log("🧪 [INGREDIENT] validate fail:", msg, "ingredientId:", ingredientId);
      setError(msg);
      setLoading(false);
      return null;
    }

    const base = await getApiBase();
    const url = joinUrl(base, `/api/ingredient/${ingredientId}`);

    // 토큰이 있으면 Authorization 추가
    const token = await AsyncStorage.getItem("auth/accessToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    console.log("➡️  [INGREDIENT] DELETE", url);

    try {
      const { res, data, text } = await fetchWithTimeout(
        url,
        { method: "DELETE", headers },
        30000
      );

      console.log("📨 [INGREDIENT] Response Status:", res.status);
      console.log("📨 [INGREDIENT] Response Body:", data ?? text);

      if (!res.ok) {
        let msg = data?.message || data?.detail || `HTTP ${res.status}`;
        
        // 서버 에러에 대한 사용자 친화적 메시지
        if (res.status === 500) {
          msg = "서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
        } else if (res.status === 401) {
          msg = "로그인이 필요합니다.";
        } else if (res.status === 403) {
          msg = "접근 권한이 없습니다.";
        } else if (res.status === 404) {
          msg = "삭제할 재료를 찾을 수 없습니다.";
        } else if (res.status >= 400 && res.status < 500) {
          msg = "요청에 문제가 있습니다. 다시 시도해주세요.";
        } else if (res.status >= 500) {
          msg = "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
        }
        
        const err = new Error(msg);
        err.status = res.status;
        err.data = data;
        throw err;
      }

      console.log("✅ [INGREDIENT] Delete Success");
      // 서버 응답이 비어있어도 성공으로 처리
      return data || { success: true };
    } catch (e) {
      let msg = e?.message || "재료 삭제 실패";
      if (e?.name === "AbortError") {
        msg = "서버 응답이 지연되고 있습니다. 네트워크 상태를 확인하고 다시 시도해주세요.";
      }
      if (String(e).includes("Network request failed")) {
        msg =
          Platform.OS === "android"
            ? "네트워크 연결을 확인해주세요. (WiFi/모바일 데이터 상태 확인)"
            : "네트워크 연결을 확인해주세요. (WiFi/모바일 데이터 상태 확인)";
      }
      console.error("❌ [INGREDIENT] Delete Failed:", msg, e?.data || "");
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    setError,
    deleteIngredient,
  };
}
