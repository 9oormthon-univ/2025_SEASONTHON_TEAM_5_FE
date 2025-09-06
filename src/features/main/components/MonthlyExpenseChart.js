import React from "react";
import { View, Text as RNText, StyleSheet, Dimensions, ScrollView } from "react-native";
import { BarChart, XAxis, Grid } from "react-native-svg-charts";
import { Text } from "react-native-svg";
import { colors } from "../../../theme/colors";
import { HEADER_HORIZONTAL_PADDING } from "../../../theme/styles";

// 화면 너비 계산
const screenWidth = Dimensions.get("window").width - HEADER_HORIZONTAL_PADDING * 2;
const chartHeight = 220;

// 더미 데이터: 최근 6개월 지출액
const rawData = [120000, 90000, 150000, 130000, 95000, 110000];
const labels = ["4월", "5월", "6월", "7월", "8월", "9월"];

// 색상 보간 함수
function hexToRgb(hex) {
  const [, r, g, b] = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return { r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16) };
}
function rgbToHex({ r, g, b }) {
  const toHex = n => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
function interpolateColor(start, end, factor) {
  const c1 = hexToRgb(start), c2 = hexToRgb(end);
  return rgbToHex({
    r: Math.round(c1.r + factor * (c2.r - c1.r)),
    g: Math.round(c1.g + factor * (c2.g - c1.g)),
    b: Math.round(c1.b + factor * (c2.b - c1.b)),
  });
}

// 색상 범위
const startColor = '#E8F2ED';
const endColor = '#518F69';

// 최대값 계산
const maxValue = Math.max(...rawData);

// BarChart에 넘길 데이터 배열: 각 항목에 value와 svg 속성 추가
const data = rawData.map(value => ({
  value,
  svg: { fill: interpolateColor(startColor, endColor, value / maxValue) }
}));

// 바 너비/간격 설정
const spacingInner = 0.4;
const barTotalWidth = screenWidth / data.length;
const barWidth = barTotalWidth * (1 - spacingInner);
const contentInsetValue = (barTotalWidth - barWidth) / 2;

// Bar 위에 값 표시
const Labels = ({ x, y, bandwidth, data }) => (
  data.map((item, index) => (
    <Text
      key={index}
      x={x(index) + bandwidth / 2}
      y={y(item.value) - 8}
      fontSize={12}
      fill={colors.text}
      alignmentBaseline="middle"
      textAnchor="middle"
    >
      {item.value.toLocaleString()}
    </Text>
  ))
);

export default function MonthlyExpenseChart() {
  return (
    <View style={styles.container}>
      <RNText style={styles.title}>최근 6개월 지출 현황</RNText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: HEADER_HORIZONTAL_PADDING }}
      >
        <View style={{ width: screenWidth }}>
          <BarChart
            style={{ height: chartHeight, width: screenWidth }}
            data={data}
            yAccessor={({ item }) => item.value}
            contentInset={{ top: 20, bottom: 20, left: contentInsetValue, right: contentInsetValue }}
            spacingInner={spacingInner}
            gridMin={0}
          >
            <Grid />
            <Labels />
          </BarChart>

          <XAxis
            style={{ marginTop: 8, width: screenWidth }}
            data={data}
            formatLabel={(_, index) => labels[index]}
            contentInset={{ left: contentInsetValue, right: contentInsetValue }}
            svg={{ fontSize: 12, fill: colors.sub }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: HEADER_HORIZONTAL_PADDING,
  },
});
