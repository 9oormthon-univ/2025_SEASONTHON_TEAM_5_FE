import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { colors } from "../../../theme/colors";
import { HEADER_HORIZONTAL_PADDING } from "../../../theme/styles";

const screenWidth = Dimensions.get("window").width - HEADER_HORIZONTAL_PADDING * 2 + 30; // 30px 추가

const data = {
  labels: ["4월", "5월", "6월", "7월", "8월", "9월"],
  datasets: [{ data: [120000, 90000, 150000, 130000, 95000, 110000] }],
};

export default function MonthlyExpenseChart() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>최근 6개월 지출 현황</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={data}
          width={screenWidth}
          height={240}
          fromZero
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            backgroundGradientFromOpacity: 1,
            backgroundGradientToOpacity: 1,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // 파란색 바
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // 검은색 라벨
            style: { 
              borderRadius: 12,
            },
            propsForBackgroundLines: { 
              strokeDasharray: "",
              stroke: '#e5e7eb',
              strokeWidth: 1
            },
            propsForVerticalLabels: {
              fontSize: 12,
              fill: '#374151'
            },
            propsForHorizontalLabels: {
              fontSize: 12,
              fill: '#374151'
            }
          }}
          style={styles.chartStyle}
          showValuesOnTopOfBars
          withInnerLines={false}
          withHorizontalLabels={false}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    backgroundColor: '#ffffff', // 명시적으로 흰색 배경
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: '#1f2937', // 명시적으로 어두운 회색
    marginBottom: 16,
  },
  chartStyle: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    // 왼쪽 여백 제거
    marginLeft: -70,
  },
});