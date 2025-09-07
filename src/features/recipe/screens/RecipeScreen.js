import React, { useMemo, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  View,
  StyleSheet,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import RecipeHeader from "../components/RecipeHeader";
import ModeSwitch from "../components/ModeSwitch";
import RegisterButtons from "../components/RegisterButtons";
import RecommendCard from "../components/RecommendCard";
import ExpiringIngredients from "../components/ExpiringIngredients";
import MyIngredientsGrid from "../components/MyIngredientsGrid";
import { useIngredientsStore } from "../store/ingredientsStore";
import { useIngredientList } from "../hooks/useIngredientList";
import { colors } from "../../../theme/colors";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function RecipeScreen() {
  const navigation = useNavigation();
  const [mode, setMode] = useState("register");
  const ingredients = useIngredientsStore((s) => s.ingredients);
  const { fetchIngredients, loading, error, retry } = useIngredientList();
  const { loadFromServer } = useIngredientsStore();

  // 컴포넌트 마운트 시 한 번만 서버에서 재료 목록 동기화
  useEffect(() => {
    const syncData = async () => {
      try {
        const serverIngredients = await fetchIngredients();
        if (serverIngredients.length > 0) {
          loadFromServer(serverIngredients);
        }
      } catch (e) {
        console.warn("재료 목록 동기화 실패:", e);
      }
    };
    syncData();
  }, []); // 빈 의존성 배열로 한 번만 실행

  const expiringSoon = useMemo(() => {
    const today = new Date();
    const in2Days = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
    return ingredients
      .filter((i) => {
        const expiry = new Date(i.expiry);
        return expiry <= in2Days && expiry >= today; // 오늘부터 이틀 후까지
      })
      .slice(0, 5);
  }, [ingredients]);

  const onChangeMode = (m) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMode(m);
  };

  // 에러 표시 컴포넌트
  const ErrorBanner = () => {
    if (!error) return null;
    
    return (
      <View style={styles.errorBanner}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retry}>
          <Text style={styles.retryText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 1) 그라데이션 배경 */}
      <LinearGradient
        colors={['#E8F5E9', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* 2) 원 패턴 */}
      <View style={styles.backgroundPattern}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
        <View style={[styles.circle, styles.circle4]} />
        <View style={[styles.circle, styles.circle5]} />
        <View style={[styles.circle, styles.circle6]} />
      </View>

      {/* 3) 기존 콘텐츠 */}
      <View style={styles.container}>
        <RecipeHeader />
        <ErrorBanner />
        <ModeSwitch mode={mode} onChange={onChangeMode} />
        {mode === "register" ? (
          <ScrollView
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <RegisterButtons
              onScan={() =>
                Alert.alert("영수증 스캔", "나중에 OCR/카메라 연결 예정")
              }
              onManual={() =>
                Alert.alert("직접 입력", "나중에 재료 입력 화면으로 이동")
              }
            />
            <RecommendCard
              hasIngredients={ingredients.length > 0}
              onRecommend={() => navigation.navigate("RecommendRecipes")}
            />
            <ExpiringIngredients
              items={expiringSoon}
              onSeeAll={() => onChangeMode("mine")}
            />
          </ScrollView>
        ) : (
          <MyIngredientsGrid />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backgroundPattern: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  circle: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "rgba(76, 175, 80, 0.08)",
  },
  circle1: { width: 200, height: 200, top: -50, right: -80 },
  circle2: { width: 150, height: 150, top: 100, left: -60 },
  circle3: { width: 120, height: 120, top: 300, right: -40 },
  circle4: { width: 180, height: 180, bottom: 200, left: -70 },
  circle5: { width: 100, height: 100, bottom: 100, right: -30 },
  circle6: { width: 160, height: 160, bottom: -50, right: 20 },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  errorBanner: {
    backgroundColor: "#FFE6E6",
    borderColor: "#FF6B6B",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorText: {
    color: "#D63031",
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  retryButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
});
