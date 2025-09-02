import React, { useMemo } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { useIngredientsStore } from "../store/ingredientsStore";
import IngredientCard from "./IngredientCard";
import { colors } from "../../../theme/colors";

export default function MyIngredientsGrid() {
  const ingredients = useIngredientsStore((s) => s.ingredients);

  const sorted = useMemo(
    () => ingredients.slice().sort((a, b) => new Date(a.expiry) - new Date(b.expiry)),
    [ingredients]
  );

  if (sorted.length === 0) {
    return (
      <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
        <Text style={{ color: colors.sub }}>등록된 재료가 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sorted}
        keyExtractor={(it) => it.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 10 }}
        contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
        renderItem={({ item }) => <IngredientCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 8 },
});
