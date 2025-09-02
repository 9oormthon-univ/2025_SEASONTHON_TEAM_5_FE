import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { colors } from "../../../theme/colors";

export default function ExpenseItem({ item }) {
  return (
    <View style={styles.row}>
      <Image
        source={{ uri: item.imageUri || "https://picsum.photos/seed/food/80" }}
        style={styles.thumb}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.sub}>{item.category || "기타"}</Text>
      </View>
      <Text style={styles.amount}>₩{Number(item.amount).toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  thumb: { width: 44, height: 44, borderRadius: 10, backgroundColor: "#eee" },
  title: { fontWeight: "800", color: colors.text },
  sub: { color: colors.sub, fontSize: 12, marginTop: 2 },
  amount: { fontWeight: "800", color: colors.text },
});
