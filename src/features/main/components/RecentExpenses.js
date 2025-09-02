import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";
import { formatKRW } from "../../../utils/format";

export default function RecentExpenses({ items }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>최근 지출 내역</Text>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.sub}>{item.category}</Text>
            </View>
            <Text style={styles.amount}>{formatKRW(item.amount)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: colors.text },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8, paddingHorizontal: 4 },
  title: { fontSize: 14, fontWeight: "700", color: colors.text },
  sub: { fontSize: 12, color: colors.accent, marginTop: 2 },
  amount: { fontSize: 14, fontWeight: "700", color: colors.text },
});
