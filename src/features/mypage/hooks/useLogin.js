import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "http://what2eat.duckdns.org:8080";

const saveAuth = async (payload) => {
  try {
    // 다양한 토큰 필드명에 대응
    const token = payload?.access_token || 
                  payload?.accessToken || 
                  payload?.token || 
                  payload?.jwt;
    
    if (token) {
      await AsyncStorage.setItem("auth/accessToken", String(token));
    }
    
    // 전체 응답도 보관(필요 시 복원용)
    await AsyncStorage.setItem("auth/lastResponse", JSON.stringify(payload));
    
    console.log("✅ 인증 정보 저장 완료:", { hasToken: !!token, payload });
  } catch (e) {
    console.warn("❌ 인증 정보 저장 실패:", e);
  }
};

const isEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const postJson = useCallback(async (path, body) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
    if (!res.ok) {
      const msg = data?.message || data?.detail || `HTTP ${res.status}`;
      const err = new Error(msg);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }, []);

  const validate = useCallback(() => {
    if (!isEmail(email)) return "이메일 형식이 올바르지 않습니다.";
    if (!password || password.length < 6) return "비밀번호는 6자 이상 입력하세요.";
    return "";
  }, [email, password]);

  const login = useCallback(async () => {
    const v = validate();
    if (v) { setError(v); return null; }
    setLoading(true);
    setError("");
    try {
      console.log("🔄 로그인 시도:", { email: email.trim() });
      const data = await postJson("/auth/login", { email: email.trim(), password });
      console.log("✅ 로그인 성공:", data);
      await saveAuth(data);
      return data;
    } catch (e) {
      console.error("❌ 로그인 실패:", e);
      const errorMessage = e.data?.message || e.data?.detail || e.message || "로그인 실패";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [email, password, validate, postJson]);

  const register = useCallback(async () => {
    const v = validate();
    if (v) { setError(v); return null; }
    setLoading(true);
    setError("");
    try {
      console.log("🔄 회원가입 시도:", { email: email.trim() });
      const data = await postJson("/auth/register", { email: email.trim(), password });
      console.log("✅ 회원가입 성공:", data);
      // 회원가입 성공 시에도 토큰이 있다면 저장
      if (data) {
        await saveAuth(data);
      }
      return data;
    } catch (e) {
      console.error("❌ 회원가입 실패:", e);
      const errorMessage = e.data?.message || e.data?.detail || e.message || "회원가입 실패";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [email, password, validate, postJson]);

  return {
    // state
    email, setEmail,
    password, setPassword,
    loading, error, setError,
    // actions
    login, register,
    // helpers
    API_BASE,
  };
}
