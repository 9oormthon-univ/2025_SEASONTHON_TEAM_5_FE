import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { colors } from "../../../theme/colors";
import { HEADER_HORIZONTAL_PADDING } from "../../../theme/styles";

const screenWidth = Dimensions.get('window').width - HEADER_HORIZONTAL_PADDING * 2;

// 더미 데이터: 최근 6개월
const data = {
    labels: ['4월', '5월', '6월', '7월', '8월', '9월'],
    datasets: [{
        data: [120000, 90000, 150000, 130000, 95000, 110000],
    }],
};

export default function MonthlyExpenseChart() {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>최근 6개월 지출 현황</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
            data={data}
            width={screenWidth}
            height={220}
            fromZero
            chartConfig={{
                backgroundGradientFrom: colors.background,
                backgroundGradientTo: colors.background,
                decimalPlaces: 0,
                color: (opacity = 1) => `${colors.primary}`,
                labelColor: (opacity = 1) => `${colors.text}`,
                style: { borderRadius: 12 },
                propsForBackgroundLines: { strokeDasharray: '' },
            }}
            style={styles.chartStyle}
            showValuesOnTopOfBars
            withInnerLines={false}
            />
        </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        paddingHorizontal: HEADER_HORIZONTAL_PADDING,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 12,
    },
    chartStyle: {
        borderRadius: 12,
    },
});
