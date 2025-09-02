import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";
import { formatKRW } from "../../../utils/format";

export default function MonthSummary({ total, remain }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>이번 달 지출</Text>
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>총 지출</Text>
          <Text style={styles.amount}>{formatKRW(total)}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>남은 예산</Text>
          <Text style={styles.amount}>{formatKRW(remain)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: colors.text },
  row: { flexDirection: "row", gap: 12, marginBottom: 16 },
  card: { flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 16 },
  cardLabel: { fontSize: 12, color: colors.sub, marginBottom: 6 },
  amount: { fontSize: 20, fontWeight: "800", color: colors.text },
});
