import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../../theme/colors';

export default function IngredientAddScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [expire, setExpire] = useState(''); // YYYY-MM-DD 권장

  const closeToRecipe = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('RecipeHome');
  };

  const onAdd = () => {
    if (!name.trim()) return Alert.alert('재료명을 입력하세요');
    // TODO: 스토어 연결 예정
    Alert.alert('등록 완료', `${name} / ${qty} / ${expire}`);
    closeToRecipe();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* 헤더 (X 버튼) */}
        <View style={styles.header}>
          <Pressable onPress={closeToRecipe} hitSlop={8}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>재료 추가</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* 입력 */}
        <TextInput
          placeholder="재료명"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor={colors.accent}
        />
        <TextInput
          placeholder="수량"
          value={qty}
          onChangeText={setQty}
          style={styles.input}
          placeholderTextColor={colors.accent}
        />
        <TextInput
          placeholder="유통기한 (YYYY-MM-DD)"
          value={expire}
          onChangeText={setExpire}
          style={styles.input}
          placeholderTextColor={colors.accent}
        />

        <Pressable style={styles.addBtn} onPress={onAdd}>
          <Text style={styles.addText}>추가</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  input: {
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#22C55E',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 4,
  },
  addText: { color: '#fff', fontWeight: '800' },
});
