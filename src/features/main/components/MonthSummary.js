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

  // 진행률 계산 (예: 예산 대비 사용률)
  const totalBudget = total + remain;
  const progressPercentage = totalBudget > 0 ? (total / totalBudget) * 100 : 0;

  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>이번 달 지출</Text>
        <View style={styles.monthBadge}>
          <Text style={styles.monthBadgeText}>9월</Text>
        </View>
      </View>
      
      <View style={styles.cardsContainer}>
        {/* 메인 지출 카드 - 강조된 디자인 */}
        <View style={styles.mainCard}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.mainCardLabel}>총 지출</Text>
              {/* <View style={styles.trendIndicator}>
                <Ionicons name="trending-down" size={16} color="#2D5A3D" />
                <Text style={styles.trendText}>-15%</Text>
              </View> */}
            </View>
            
            <Text style={styles.mainAmount}>{formatKRW(total)}</Text>
            
            {/* 프로그레스 바 */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${Math.min(progressPercentage, 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                예산 대비 {progressPercentage.toFixed(0)}% 사용
              </Text>
            </View>
            
            {/* 지출 추가 버튼 */}
            <Pressable
              style={styles.addExpenseBtn}
              onPress={() => navigation.navigate("메인화면", { 
                screen: "AddExpense", 
                params: { category: "식사" } 
              })}
            >
              <Ionicons name="add" size={18} color="white" />
              <Text style={styles.addExpenseBtnText}>지출 내역 추가</Text>
            </Pressable>
          </View>
        </View>

        {/* 서브 카드들 */}
        <View style={styles.subCardsRow}>
          {/* 남은 예산 카드 */}
          <View style={styles.subCard}>
            <View style={styles.subCardIcon}>
              <Ionicons name="wallet-outline" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.subCardLabel}>남은 예산</Text>
            <Text style={styles.subAmount}>{formatKRW(remain)}</Text>
          </View>

          {/* 예산 설정 카드 */}
          <View style={styles.subCard}>
            <View style={styles.subCardHeader}>
              <View style={styles.subCardIcon}>
                <Ionicons name="settings-outline" size={20} color="#4CAF50" />
              </View>
              <Pressable onPress={() => setModalVisible(true)} style={styles.settingsBtn}>
                <Ionicons name="add-circle" size={20} color="#4CAF50" />
              </Pressable>
            </View>
            <Text style={styles.subCardLabel}>예산 설정</Text>
            <Text style={styles.setupText}>탭하여 설정</Text>
          </View>
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
              <Text style={styles.modalTitle}>예산 설정</Text>
              <Pressable onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Ionicons name="close" size={24} color="#666" />
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: '#2D5A3D',
  },
  monthBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C1ECC1',
  },
  monthBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D5A3D',
  },
  cardsContainer: {
    gap: 16,
  },
  mainCard: {
    backgroundColor: 'linear-gradient(135deg, #E8F5E8 0%, #F0F8F0 100%)',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.1)',
  },
  cardContent: {
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainCardLabel: {
    fontSize: 14,
    color: '#5A7A5A',
    fontWeight: '600',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    color: '#2D5A3D',
    fontWeight: '600',
  },
  mainAmount: {
    fontSize: 32,
    fontWeight: "900",
    color: '#2D5A3D',
  },
  progressContainer: {
    gap: 8,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#E8F5E8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'linear-gradient(90deg, #81C784, #4CAF50)',
    backgroundColor: '#66BB6A',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#5A7A5A',
    fontWeight: '500',
  },
  addExpenseBtn: {
    flexDirection: 'row',
    backgroundColor: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  addExpenseBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  subCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  subCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(232, 245, 232, 0.8)',
  },
  subCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subCardIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#E8F5E8',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  settingsBtn: {
    padding: 4,
  },
  subCardLabel: {
    fontSize: 12,
    color: '#5A7A5A',
    marginBottom: 8,
    fontWeight: '600',
  },
  subAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: '#2D5A3D',
  },
  setupText: {
    fontSize: 14,
    color: '#81C784',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
  },
  modalContent: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D5A3D',
  },
  cancelBtn: {
    padding: 4,
  },
});