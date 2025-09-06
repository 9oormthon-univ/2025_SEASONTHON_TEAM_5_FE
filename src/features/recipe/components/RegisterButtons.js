import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../theme/colors';

export default function RegisterButtons() {
  const navigation = useNavigation();

  return (
    <View style={styles.row}>
      <Pressable style={styles.btn} onPress={() => navigation.navigate('ReceiptScan')}>
        <Ionicons name="image-outline" size={18} color={colors.text} />
        <Text style={styles.label}>영수증 스캔</Text>
      </Pressable>

      <Pressable style={styles.btn} onPress={() => navigation.navigate('IngredientAdd')}>
        <Ionicons name="create-outline" size={18} color={colors.text} />
        <Text style={styles.label}>직접 입력</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  label: { fontWeight: '800', color: colors.text, fontSize: 13 },
});
