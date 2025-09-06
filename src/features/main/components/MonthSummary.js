import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../theme/colors";
import { formatKRW } from "../../../utils/format";
import BudgetSetup from "../../budget/components/BudgetSetup";

export default function MonthSummary({ total, remain }) {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <View>
      <Text style={styles.sectionTitle}>이번 달 지출</Text>
      <View style={styles.cardsContainer}>

        {/* 총 지출 카드 (지출 추가 버튼 포함) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>총 지출</Text>
          </View>
          <Text style={styles.amount}>{formatKRW(total)}</Text>
          {/* + 지출 내역 추가 버튼 */}
          <Pressable
            style={styles.fullBtn}
            onPress={() => navigation.navigate("메인화면", { screen: "AddExpense", params: { category: "식사" } })}
          >
            <Text style={styles.fullBtnText}>+ 지출 내역 추가</Text>
          </Pressable>
        </View>

        {/* 남은 예산 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>남은 예산</Text>
          <Text style={styles.amount}>{formatKRW(remain)}</Text>
        </View>

        {/* 예산 설정 카드 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>예산 설정</Text>
            <Pressable onPress={() => setModalVisible(true)} style={styles.plusBtn}>
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            </Pressable>
          </View>
          <Text style={styles.setupText}>버튼을 눌러 예산을 설정하세요</Text>
        </View>
      </View>

      {/* 예산 설정 모달 */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
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
  cardsContainer: {
    flexDirection: "column",
  },
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
  cardLabel: {
    fontSize: 12,
    color: colors.sub,
    marginBottom: 6,
  },
  amount: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 12,
  },
  fullBtn: {
    width: "100%",
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  fullBtnText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 14,
  },
  setupText: {
    fontSize: 14,
    color: colors.sub,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalContent: {
    margin: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelBtn: { padding: 4 },
  cancelText: {
    fontSize: 14,
    color: colors.primary,
  },
});
