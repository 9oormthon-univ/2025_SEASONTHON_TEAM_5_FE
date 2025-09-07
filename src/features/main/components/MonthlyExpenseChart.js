// src/features/main/components/MonthlyExpenseChart.js
import React from "react";
import { View, Text as RNText, StyleSheet, Dimensions, ScrollView } from "react-native";
import Svg, { Rect, Text as SvgText, Line } from "react-native-svg";
import { colors } from "../../../theme/colors";
import { HEADER_HORIZONTAL_PADDING } from "../../../theme/styles";

const screenWidth = Dimensions.get("window").width - HEADER_HORIZONTAL_PADDING * 2 + 30; // 30px 추가

// 더미 데이터: 최근 6개월 지출액
const rawData = [120000, 90000, 150000, 130000, 95000, 110000];
const labels = ["4월", "5월", "6월", "7월", "8월", "9월"];

// 색상 보간 유틸
function hexToRgb(hex) {
  const [, r, g, b] = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return { r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16) };
}
function rgbToHex({ r, g, b }) {
  const toHex = (n) => n.toString(16).padStart(2, "0");
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
const startColor = "#E8F2ED";
const endColor = "#518F69";

// 최대값
const maxValue = Math.max(...rawData);

// 바 너비/간격 설정
const spacingInner = 0.4; // 0~1 (값이 클수록 바 사이 간격 커짐)
const barTotalWidth = screenWidth / rawData.length;
const barWidth = barTotalWidth * (1 - spacingInner);
const sidePad = (barTotalWidth - barWidth) / 2;

// 차트 높이 설정
const chartHeight = 240;

// 차트 패딩(상단/하단)
const padTop = 20;
const padBottom = 28;
const innerHeight = chartHeight - padTop - padBottom;

export default function MonthlyExpenseChart() {
  return (
    <View style={styles.container}>
      <RNText style={styles.title}>최근 6개월 지출 현황</RNText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: HEADER_HORIZONTAL_PADDING }}
      >
        <Svg width={screenWidth} height={chartHeight}>
          {/* 그리드 라인 */}
          {Array.from({ length: 5 }).map((_, i) => {
            const y = padTop + (innerHeight * i) / 4;
            return (
              <Line
                key={`grid-${i}`}
                x1={0}
                x2={screenWidth}
                y1={y}
                y2={y}
                stroke={colors.border ?? "#e6e6e6"}
                strokeWidth={1}
              />
            );
          })}

          {/* 막대 + 값 라벨 */}
          {rawData.map((value, index) => {
            const factor = value / maxValue;
            const barH = Math.max(2, innerHeight * factor);
            const x = index * barTotalWidth + sidePad;
            const y = padTop + innerHeight - barH;
            const fill = interpolateColor(startColor, endColor, Math.min(1, factor));

            return (
              <React.Fragment key={`bar-${index}`}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx={6}
                  ry={6}
                  fill={fill}
                />
                {/* 값 라벨 */}
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 6}
                  fontSize={12}
                  fill={colors.text}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                >
                  {value.toLocaleString()}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* X축 라벨 */}
          {labels.map((label, index) => {
            const x = index * barTotalWidth + sidePad + barWidth / 2;
            const y = chartHeight - padBottom + 14;
            return (
              <SvgText
                key={`xlabel-${index}`}
                x={x}
                y={y}
                fontSize={12}
                fill={colors.sub}
                alignmentBaseline="middle"
                textAnchor="middle"
              >
                {label}
              </SvgText>
            );
          })}
        </Svg>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    backgroundColor: '#ffffff',
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
    color: '#1f2937',
    marginBottom: 16,
  },
});