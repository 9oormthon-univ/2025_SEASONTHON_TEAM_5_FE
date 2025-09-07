import React from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Alert } from "react-native";
import { colors } from "../../../theme/colors";
import { formatKRW } from "../../../utils/format";
import { useExpenseStore } from "../store/expenseStore";
import Ionicons from "@expo/vector-icons/Ionicons";

// 카테고리별 아이콘과 색상 매핑
const categoryStyles = {
  '식사': { icon: 'restaurant', color: '#FF7043', background: '#FFF3E0' },
  '교통': { icon: 'car', color: '#42A5F5', background: '#E3F2FD' },
  '쇼핑': { icon: 'bag', color: '#AB47BC', background: '#F3E5F5' },
  '문화': { icon: 'musical-notes', color: '#26A69A', background: '#E0F2F1' },
  '의료': { icon: 'medical', color: '#EF5350', background: '#FFEBEE' },
  '기타': { icon: 'ellipsis-horizontal', color: '#78909C', background: '#ECEFF1' },
};

export default function RecentExpenses({ items }) {
  const removeExpense = useExpenseStore((s) => s.removeExpense);

  // 삭제 확인창
  const confirmDelete = (id) => {
    Alert.alert(
      "삭제 확인",
      "정말 이 지출 내역을 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        { text: "삭제", style: "destructive", onPress: () => removeExpense(id) },
      ]
    );
  };

  const renderExpenseItem = ({ item, index }) => {
    const categoryStyle = categoryStyles[item.category] || categoryStyles['기타'];
    
    return (
      <View style={[styles.itemContainer, { 
        transform: [{ scale: 1 - (index * 0.02) }] // 약간의 깊이감 효과
      }]}>
        {/* 카테고리 아이콘 */}
        <View style={[styles.iconContainer, { backgroundColor: categoryStyle.background }]}>
          <Ionicons 
            name={categoryStyle.icon} 
            size={20} 
            color={categoryStyle.color} 
          />
        </View>

        {/* 내용 */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.categoryRow}>
            <Text style={[styles.categoryText, { color: categoryStyle.color }]}>
              {item.category}
            </Text>
            <View style={styles.dateDot} />
            <Text style={styles.dateText}>오늘</Text>
          </View>
        </View>

        {/* 금액 및 액션 */}
        <View style={styles.rightContainer}>
          <Text style={styles.amount}>{formatKRW(item.amount)}</Text>
          <Pressable 
            onPress={() => confirmDelete(item.id)} 
            style={styles.deleteBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={16} color="#FF5722" />
          </Pressable>
        </View>

        {/* 하단 그라데이션 라인 */}
        <View style={[styles.bottomLine, { backgroundColor: categoryStyle.color }]} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>최근 지출 내역</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{items.length}건</Text>
        </View>
      </View>
      
      <View style={styles.listContainer}>
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          renderItem={renderExpenseItem}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={48} color="#B0BEB0" />
              <Text style={styles.emptyText}>아직 지출 내역이 없어요</Text>
              <Text style={styles.emptySubText}>첫 번째 지출을 추가해보세요</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: '#2D5A3D',
  },
  countBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D5A3D',
  },
  listContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(232, 245, 232, 0.6)',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    position: 'relative',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(232, 245, 232, 0.3)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: '#2D5A3D',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#B0BEB0',
  },
  dateText: {
    fontSize: 12,
    color: '#78909C',
    fontWeight: '500',
  },
  rightContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: "800",
    color: '#2D5A3D',
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 87, 34, 0.1)',
  },
  bottomLine: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    borderRadius: 1,
    opacity: 0.3,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#78909C',
  },
  emptySubText: {
    fontSize: 14,
    color: '#B0BEB0',
  },
});