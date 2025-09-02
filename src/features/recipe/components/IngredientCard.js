import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { colors } from "../../../theme/colors";

export default function IngredientCard({ item, onPress }) {
  // item: { id, name, qty, unit, expiry, imageUri? }
  const dday = useMemo(() => {
    const left = Math.ceil((new Date(item.expiry) - new Date()) / 86400000);
    return left >= 0 ? `D-${left}` : `D+${Math.abs(left)}`;
  }, [item.expiry]);

  return (
    <Pressable style={styles.card} onPress={() => onPress?.(item)}>
      {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, { backgroundColor: colors.card }]} />
      )}

      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.meta}>{item.qty ?? ""}{item.unit ?? ""}</Text>
      <Text style={styles.dday}>{dday}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, borderRadius: 14, overflow: "hidden", backgroundColor: "#fff", padding: 10, gap: 6, borderWidth: 1, borderColor: "#E5E7EB" },
  image: { width: "100%", height: 110, borderRadius: 10 },
  name: { fontWeight: "800", color: colors.text },
  meta: { fontSize: 12, color: colors.sub },
  dday: { fontSize: 12, color: colors.sub },
});
