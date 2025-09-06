import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import MainHeader from "../components/MainHeader";
import MonthSummary from "../components/MonthSummary";
// import RecentExpenses from "../components/RecentExpenses";
import useMonthlyBudget from "../hooks/useMonthlyBudget";
// import { useNavigation } from "@react-navigation/native";
// import BudgetSetup from "../../budget/components/BudgetSetup";
import MonthlyExpenseChart from "../components/MonthlyExpenseChart";

const { height: screenHeight } = Dimensions.get('window');

export default function MainScreen() {
  //const nav = useNavigation();
  const { monthTotal, remain, recent } = useMonthlyBudget();

  return (
    <View style={styles.container}>
      {/* 배경 그라데이션 */}
      <LinearGradient
        colors={['#F0F8F0', '#E8F5E8', '#F8FAFC']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* 상단 장식용 서클들 */}
      <View style={styles.decorativeCircles}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* 헤더 */}
          <View style={styles.headerWrapper}>
            <MainHeader />
          </View>

          {/* 메인 콘텐츠 */}
          <View style={styles.contentContainer}>
            {/* 월간 요약 카드 */}
            <View style={styles.summaryWrapper}>
              <MonthSummary total={monthTotal} remain={remain} />
            </View>

            {/* 차트 섹션 */}
            <View style={styles.chartWrapper}>
              <MonthlyExpenseChart />
            </View>

            {/* 최근 지출 내역 (주석 처리된 부분) */}
            {/* <RecentExpenses items={recent} /> */}

            {/* 하단 여백 */}
            <View style={styles.bottomSpacing} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: screenHeight,
  },
  decorativeCircles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.1,
  },
  circle1: {
    width: 200,
    height: 200,
    backgroundColor: '#4CAF50',
    top: -100,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    backgroundColor: '#66BB6A',
    top: 50,
    left: -75,
  },
  circle3: {
    width: 100,
    height: 100,
    backgroundColor: '#81C784',
    top: 120,
    right: 30,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  headerWrapper: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 8,
  },
  summaryWrapper: {
    marginBottom: 8,
  },
  chartWrapper: {
    marginBottom: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});