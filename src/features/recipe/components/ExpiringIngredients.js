import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { colors } from "../../../theme/colors";

export default function ExpiringIngredients({ items, onSeeAll }) {
  const empty = !items || items.length === 0;

  return (
    <View style={{ marginTop: 16 }}>
      <Text style={styles.sectionTitle}>유통기한 임박 재료</Text>

      {empty ? (
        <View style={styles.emptyCard}>
          <View style={styles.image} />
          <Text style={styles.title}>유통기한 임박 재료가 없어요</Text>
          <Text style={styles.desc}>모든 재료가 신선해요. 나중에 다시 확인해 주세요.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(it) => it.id}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDate}>{item.expiry}</Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            scrollEnabled={false}
          />
          <Pressable style={styles.seeAll} onPress={onSeeAll}>
            <Text style={styles.seeAllText}>전체 재료 보기</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontWeight: "800", marginBottom: 10, color: colors.text },
  emptyCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, gap: 8, borderWidth: 1, borderColor: "#E5E7EB" },
  image: { height: 110, borderRadius: 12, backgroundColor: colors.card },
  title: { fontSize: 14, fontWeight: "800", color: colors.text },
  desc: { fontSize: 12, color: colors.sub },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 6, backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#E5E7EB" },
  itemName: { fontSize: 14, fontWeight: "700", color: colors.text },
  itemDate: { fontSize: 12, color: colors.sub },
  seeAll: { marginTop: 10, alignSelf: "flex-start", borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  seeAllText: { fontWeight: "800", color: colors.text, fontSize: 12 },
});