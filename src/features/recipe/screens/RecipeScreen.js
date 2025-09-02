import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  View,
  StyleSheet,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import RecipeHeader from "../components/RecipeHeader";
import ModeSwitch from "../components/ModeSwitch";
import RegisterButtons from "../components/RegisterButtons";
import RecommendCard from "../components/RecommendCard";
import ExpiringIngredients from "../components/ExpiringIngredients";
import MyIngredientsGrid from "../components/MyIngredientsGrid";
import { colors } from "../../../theme/colors";
import { useIngredientsStore } from "../store/ingredientsStore";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function RecipeScreen() {
  const [mode, setMode] = useState("register"); // "register" | "mine"
  const ingredients = useIngredientsStore((s) => s.ingredients);

  const expiringSoon = useMemo(() => {
    const today = new Date();
    const in3 = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    return ingredients.filter((i) => new Date(i.expiry) <= in3).slice(0, 5);
  }, [ingredients]);

  const onChangeMode = (m) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMode(m);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <RecipeHeader />
        <ModeSwitch mode={mode} onChange={onChangeMode} />

        {mode === "register" ? (
          <ScrollView
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <RegisterButtons
              onScan={() => Alert.alert("영수증 스캔", "나중에 OCR/카메라 연결 예정")}
              onManual={() => Alert.alert("직접 입력", "나중에 재료 입력 화면으로 이동")}
            />

            <RecommendCard
              hasIngredients={ingredients.length > 0}
              onRecommend={() => Alert.alert("레시피 추천", "나중에 추천 로직/화면 연결")}
            />

            <ExpiringIngredients
              items={expiringSoon}
              onSeeAll={() => Alert.alert("전체 재료 보기", "나중에 리스트 화면으로 이동")}
            />
          </ScrollView>
        ) : (
          // mine 모드: 그리드로 교체 (FlatList 단독, 스크롤 충돌 없음)
          <MyIngredientsGrid />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8, backgroundColor: "#FFFFFF" },
});
