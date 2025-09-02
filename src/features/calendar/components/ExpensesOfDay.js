import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import ExpenseItem from "./ExpenseItem";
import { colors } from "../../../theme/colors";

export default function ExpensesOfDay({ dateString, items }) {
  const title = formatKDate(dateString);

  return (
    <View style={{ marginTop: 12 }}>
      <Text style={styles.sectionTitle}>{title} 지출 내역</Text>

      {(!items || items.length === 0) ? (
        <View style={styles.empty}>
          <Text style={{ color: colors.sub }}>해당 날짜의 지출이 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={({ item }) => <ExpenseItem item={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ paddingBottom: 16 }}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

function formatKDate(yyyyMMdd) {
  const [y, m, d] = yyyyMMdd.split("-").map(Number);
  return `${m}/${d}`;
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontWeight: "800", color: colors.text, marginBottom: 10 },
  empty: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
});
