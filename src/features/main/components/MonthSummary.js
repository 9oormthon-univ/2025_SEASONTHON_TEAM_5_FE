// src/features/main/components/MonthSummary.js
import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../theme/colors";
import { formatKRW } from "../../../utils/format";
import { useBudgetStore } from "../../budget/store/budgetStore";
import { useExpenseStore } from "../store/expenseStore";
import BudgetSetup from "../../budget/components/BudgetSetup";

export default function MonthSummary() {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const { monthlyBudget, budgetPeriod } = useBudgetStore();

  // 스토어에서 직접 데이터 구독 (함수 호출이 아닌 상태 구독)
  const expenses = useExpenseStore((s) => s.expenses);
  
  // 월별 지출 계산
  const { monthTotal, remain } = useMemo(() => {
    const now = new Date();
    const monthItems = expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });

    const total = monthItems.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const remainAmount = Math.max((Number(monthlyBudget) || 0) - total, 0);

    return { monthTotal: total, remain: remainAmount };
  }, [expenses, monthlyBudget]);

  // 예산 기간 내 지출 계산
  const { periodTotal } = useMemo(() => {
    if (!budgetPeriod?.startAt || !budgetPeriod?.endAt) {
      return { periodTotal: monthTotal };
    }

    const startDate = new Date(budgetPeriod.startAt);
    const endDate = new Date(budgetPeriod.endAt);
    
    const periodItems = expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    const total = periodItems.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    return { periodTotal: total };
  }, [expenses, budgetPeriod, monthTotal]);

  // budgetStore의 예산을 사용하여 남은 예산 계산
  const remainToShow = useMemo(() => {
    if (monthlyBudget > 0) {
      // 예산 기간이 설정되어 있으면 해당 기간 내 지출로 계산
      if (budgetPeriod.startAt && budgetPeriod.endAt) {
        const now = new Date();
        const startDate = new Date(budgetPeriod.startAt);
        const endDate = new Date(budgetPeriod.endAt);
        
        // 현재 날짜가 예산 기간 내에 있는지 확인
        if (now >= startDate && now <= endDate) {
          return Math.max(monthlyBudget - periodTotal, 0);
        }
      }
      // 예산 기간이 없거나 현재 날짜가 기간 밖이면 월별 지출로 계산
      return Math.max(monthlyBudget - monthTotal, 0);
    }
    return remain;
  }, [monthlyBudget, budgetPeriod, periodTotal, monthTotal, remain]);

  return (
    <View>
      <Text style={styles.sectionTitle}>이번 달 지출</Text>

      <View style={styles.cardsContainer}>
        {/* 총 지출 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>총 지출</Text>
          </View>
          <Text style={styles.amount}>{formatKRW(monthTotal)}</Text>

          <Pressable
            style={styles.fullBtn}
            onPress={() =>
              navigation.navigate("메인화면", {
                screen: "AddExpense",
                params: { category: "식사" },
              })
            }
          >
            <Text style={styles.fullBtnText}>+ 지출 내역 추가</Text>
          </Pressable>
        </View>

        {/* 남은 예산 */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>남은 예산</Text>
          <Text style={styles.amount}>
            {remainToShow === null || remainToShow === undefined
              ? "-"
              : formatKRW(remainToShow)}
          </Text>
        </View>

        {/* 예산 설정 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>예산 설정</Text>
            <Pressable onPress={() => setModalVisible(true)} style={styles.plusBtn}>
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            </Pressable>
          </View>
          <Text style={styles.setupText}>
            {monthlyBudget > 0
              ? `${formatKRW(monthlyBudget)} 설정됨`
              : "버튼을 눌러 예산을 설정하세요"}
          </Text>
        </View>
      </View>

      {/* 예산 설정 모달 */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>취소</Text>
              </Pressable>
            </View>
            <BudgetSetup onClose={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: colors.text,
  },
  cardsContainer: { flexDirection: "column" },
  card: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  plusBtn: { padding: 4 },
  cardLabel: { fontSize: 12, color: colors.sub, marginBottom: 6 },
  amount: { fontSize: 20, fontWeight: "800", color: colors.text, marginBottom: 12 },
  fullBtn: {
    width: "100%",
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  fullBtnText: { color: "#ffffff", fontWeight: "800", fontSize: 14 },
  setupText: { fontSize: 14, color: colors.sub },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center" },
  modalContent: { margin: 20, backgroundColor: colors.card, borderRadius: 12, padding: 16 },
  modalHeader: { flexDirection: "row", justifyContent: "flex-end" },
  cancelBtn: { padding: 4 },
  cancelText: { fontSize: 14, color: colors.primary },
});
