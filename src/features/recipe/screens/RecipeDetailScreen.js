import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    StyleSheet,
    Pressable
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "../../../theme/colors";

export default function RecipeDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { recipe } = route.params;

    return (
        <SafeAreaView style={styles.safe}>
        {/* 헤더 */}
        <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
            </Pressable>
            <Text style={styles.headerTitle}>레시피 상세</Text>
            <View style={{ width: 24 }} />
        </View>

        {/* 콘텐츠 */}
        <View style={styles.container}>
            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.desc}>{recipe.description}</Text>
            <Text style={styles.time}>조리시간: {recipe.time}</Text>

            {/* TODO: 단계별 조리 순서, 재료 목록 등 추가 구현 */}
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff",
    },
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
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "800",
        color: colors.text,
        marginBottom: 8,
    },
    desc: {
        fontSize: 14,
        color: colors.sub,
        marginBottom: 12,
    },
    time: {
        fontSize: 12,
        color: colors.sub,
    },
});
