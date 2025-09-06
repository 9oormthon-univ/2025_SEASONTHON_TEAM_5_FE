// 📂 src/features/recipe/screens/RecommendRecipesScreen.js
import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    StyleSheet,
    FlatList,
    Pressable,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../../theme/colors";
import { useIngredientsStore } from "../store/ingredientsStore";
import { useNavigation } from "@react-navigation/native";

const DUMMY_RECIPES = [
    { id: "1", title: "김치볶음밥", description: "조리방법 ~~~~~ 블라블라", time: "30분" },
    { id: "2", title: "크림 파스타", description: "조리방법 ~~~~~ 블라블라", time: "45분" },
    { id: "3", title: "간장 불고기", description: "조리방법 ~~~~~ 블라블라", time: "50분" },
    { id: "4", title: "제육볶음",   description: "조리방법 ~~~~~ 블라블라", time: "60분" },
];

export default function RecommendRecipesScreen() {
    const [query, setQuery] = useState("");
    const navigation = useNavigation();
    const consume = useIngredientsStore((s) => s.consumeIngredients);

    const filtered = DUMMY_RECIPES.filter((r) =>
        r.title.includes(query)
    );

    return (
        <SafeAreaView style={styles.safe}>
        {/* ── 헤더 ── */}
        <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
            </Pressable>
            <Text style={styles.headerTitle}>레시피 추천</Text>
            <View style={{ width: 24 }} />
        </View>

        {/* ── 검색창 ── */}
        <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.accent} />
            <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="레시피 검색"
            placeholderTextColor={colors.accent}
            style={styles.searchInput}
            />
        </View>

        {/* ── 레시피 리스트 ── */}
        <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
            <View style={styles.row}>
                <View style={styles.texts}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.time}>조리시간: {item.time}</Text>
                </View>
                <Pressable
                style={styles.button}
                onPress={() => {
                    // 1) 내 재료 차감
                    const needed = []; // TODO: 실제 레시피별 필요 재료 리스트로 교체
                    consume(needed);
                    // 2) 상세페이지로 이동
                    navigation.navigate("RecipeDetail", { recipe: item });
                }}
                >
                <Text style={styles.buttonText}>선택하기</Text>
                </Pressable>
            </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#E5E7EB",
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: colors.text,
    },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.card,
        borderRadius: 12,
        margin: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        color: colors.text,
        textAlign: "left",
    },

    list: {
        paddingHorizontal: 16,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
    },
    texts: {
        flex: 1,
        paddingRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "800",
        color: colors.text,
    },
    desc: {
        fontSize: 12,
        color: colors.sub,
        marginTop: 4,
    },
    time: {
        fontSize: 12,
        color: colors.sub,
        marginTop: 2,
    },
    button: {
        backgroundColor: "#ECFDF5",
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    buttonText: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.text,
    },
    separator: {
        height: 1,
        backgroundColor: "#F3F4F6",
    },
});
