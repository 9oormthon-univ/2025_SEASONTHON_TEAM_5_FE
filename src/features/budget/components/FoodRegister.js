import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../theme/colors";

export default function FoodRegister() {
  const navigation = useNavigation();
  return (
    <View style={{ marginBottom: 20 }}>
      <View style={styles.row}>
        <Text style={styles.title}>식비 등록</Text>
        <Pressable
          style={styles.btn}
          onPress={() => navigation.navigate("메인화면", { screen: "AddExpense", params: { category: "식사" } })}
        >
          <Text style={styles.btnText}>등록하기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 16, fontWeight: "800", color: "#111827" },
  btn: { backgroundColor: "#10B981", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  btnText: { color: "#fff", fontWeight: "800" },
});
