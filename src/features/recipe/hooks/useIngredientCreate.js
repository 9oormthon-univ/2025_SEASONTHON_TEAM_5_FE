// src/features/recipe/hooks/useIngredientCreate.js
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const DEFAULT_API_BASE = "http://what2eat.duckdns.org:8080";

// URL 안전 조합 (중복/누락 슬래시 방지)
const joinUrl = (base, path) =>
  `${String(base || "").replace(/\/+$/, "")}/${String(path || "").replace(/^\/+/, "")}`;

// YYYY-MM-DD 또는 Date → ISO8601(Z)
const toISODate = (v) => {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString();
  // 'YYYY-MM-DD' 들어오면 자정 기준 ISO
  return new Date(`${v}T00:00:00`).toISOString();
};

// fetch + 타임아웃 + 로그
async function fetchWithTimeout(url, init = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    console.log("🌐 fetch", url, init?.method || "GET");
    const res = await fetch(url, { ...init, signal: controller.signal });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
    return { res, data, text };
  } finally {
    clearTimeout(timer);
  }
}

// 런타임에서 API_BASE 오버라이드(없으면 DEFAULT 사용)
// AsyncStorage.setItem("debug/API_BASE", "http://<IPv4>:8080") 같은 식으로 교체 가능
async function getApiBase() {
  const override = await AsyncStorage.getItem("debug/API_BASE");
  const base = override || DEFAULT_API_BASE;
  console.log("🔧 API_BASE:", base);
  return base;
}

export function useIngredientCreate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---- 네트워크 경로 점검용 ----
  const probeApi = useCallback(async () => {
    setError("");
    const base = await getApiBase();
    const candidates = ["/", "/health", "/api/health", "/api/ingredient"];
    for (const path of candidates) {
      const url = joinUrl(base, path);
      try {
        const { res } = await fetchWithTimeout(url, { method: "GET" }, 6000);
        console.log("🧭 PROBE", path, "→", res.status);
        // 200~499 가 나오면 '연결은 됨'
        if (res.status) return { ok: true, status: res.status, url };
      } catch (e) {
        console.warn("🧭 PROBE FAIL", path, String(e));
      }
    }
    setError(
      Platform.OS === "android"
        ? "서버 연결 실패(HTTP 차단/방화벽/IPv6/DNS 가능성). Android에선 HTTP(비SSL) 차단에 주의하세요."
        : "서버 연결 실패(HTTP 차단/방화벽/IPv6/DNS 가능성)."
    );
    return { ok: false };
  }, []);

  const createIngredient = useCallback(async ({ name, quantity, unit, expirationDate }) => {
    setLoading(true);
    setError("");

    // --- Validation & 변환 ---
    const qNum = Number(quantity);
    const iso = toISODate(expirationDate);

    if (!name?.trim()) {
      const msg = "재료명을 입력하세요.";
      console.log("🧪 [INGREDIENT] validate fail:", msg);
      setError(msg);
      setLoading(false);
      return null;
    }
    if (!Number.isFinite(qNum) || qNum <= 0) {
      const msg = "수량은 0보다 큰 숫자여야 합니다.";
      console.log("🧪 [INGREDIENT] validate fail:", msg, "quantity:", quantity);
      setError(msg);
      setLoading(false);
      return null;
    }
    if (!unit?.trim()) {
      const msg = "단위를 선택하세요.";
      console.log("🧪 [INGREDIENT] validate fail:", msg);
      setError(msg);
      setLoading(false);
      return null;
    }
    if (!iso) {
      const msg = "유통기한을 선택하세요.";
      console.log("🧪 [INGREDIENT] validate fail:", msg, "expirationDate:", expirationDate);
      setError(msg);
      setLoading(false);
      return null;
    }

    const payload = { name: name.trim(), quantity: qNum, unit: unit.trim(), expirationDate: iso };
    const base = await getApiBase();
    const url = joinUrl(base, "/api/ingredient");

    // 토큰이 있으면 Authorization 추가
    const token = await AsyncStorage.getItem("auth/accessToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    console.log("➡️  [INGREDIENT] POST", url);
    console.log("📦 [INGREDIENT] Request Body:", payload);

    try {
      const { res, data, text } = await fetchWithTimeout(
        url,
        { method: "POST", headers, body: JSON.stringify(payload) },
        10000
      );

      console.log("📨 [INGREDIENT] Response Status:", res.status);
      console.log("📨 [INGREDIENT] Response Body:", data ?? text);

      if (!res.ok) {
        const msg = data?.message || data?.detail || `HTTP ${res.status}`;
        const err = new Error(msg);
        err.status = res.status;
        err.data = data;
        throw err;
      }

      console.log("✅ [INGREDIENT] Create Success");
      return data;
    } catch (e) {
      let msg = e?.message || "재료 등록 실패";
      if (e?.name === "AbortError") msg = "요청 시간 초과(네트워크 지연)";
      if (String(e).includes("Network request failed")) {
        msg =
          Platform.OS === "android"
            ? "네트워크 요청 실패(HTTP 차단/포트차단/DNS/IPv6 가능성)."
            : "네트워크 요청 실패(포트/방화벽/DNS/IPv6 가능성).";
      }
      console.error("❌ [INGREDIENT] Create Failed:", msg, e?.data || "");
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // UI에서 쓰기 편한 헬퍼
  const buildPayloadFromUI = useCallback((name, qtyStr, unit, expiryStrOrDate) => {
    return {
      name,
      quantity: Number(qtyStr),
      unit,
      expirationDate: expiryStrOrDate, // 훅 내부에서 ISO로 변환됨
    };
  }, []);

  return {
    loading,
    error,
    setError,
    createIngredient,
    buildPayloadFromUI,
    probeApi, // ← 진단용
  };
}
