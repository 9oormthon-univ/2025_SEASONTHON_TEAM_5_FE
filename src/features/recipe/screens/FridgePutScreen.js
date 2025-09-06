import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../../theme/colors';

export default function FridgePutScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const photos = params?.photos ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>냉장고에 넣기</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          <Text style={styles.desc}>받은 이미지 {photos.length}장</Text>
          <View style={styles.grid}>
            {photos.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.tile} />
            ))}
          </View>
        </ScrollView>

        <Pressable
          style={styles.saveBtn}
          onPress={() => {
            // TODO: 실제 저장/파싱 로직 연결
            navigation.navigate('RecipeHome');
          }}
        >
          <Text style={styles.saveText}>저장 완료</Text>
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
  desc: { color: colors.sub, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: { width: '48%', aspectRatio: 1, borderRadius: 10 },
  saveBtn: {
    marginTop: 'auto',
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveText: { color: '#fff', fontWeight: '800' },
});
