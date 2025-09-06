import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Platform,
  Alert,
  StyleSheet as RNStyle,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../theme/colors';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function ReceiptScanScreen() {
  const navigation = useNavigation();
  const cameraRef = useRef(null);

  const [hasPermission, setHasPermission] = useState(null); // null | true | false
  const [capturedUri, setCapturedUri] = useState(null); // 프리뷰 모드
  const [photos, setPhotos] = useState([]); // 누적(최대 4)
  const [type] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const onPickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });
    if (!res.canceled && res.assets?.[0]?.uri) setCapturedUri(res.assets[0].uri);
  };

  const onCapture = async () => {
    if (!hasPermission) {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') return;
      setHasPermission(true);
    }
    try {
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.85,
        skipProcessing: Platform.OS === 'android',
      });
      if (photo?.uri) setCapturedUri(photo.uri);
    } catch (e) {
      console.warn(e);
    }
  };

  const onUse = () => {
    if (!capturedUri) return;
    if (photos.length >= 4) {
      Alert.alert('알림', '최대 4장까지만 추가할 수 있어요.');
      return;
    }
    setPhotos(prev => [...prev, capturedUri]);
    setCapturedUri(null);
  };

  const removeAt = idx => setPhotos(prev => prev.filter((_, i) => i !== idx));

  const goPutIntoFridge = () => {
    if (photos.length === 0) return;
    navigation.navigate('FridgePut', { photos }); // ⬅️ 다음 페이지로 이동
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>영수증 스캔</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* 상단 썸네일 2x2 */}
        <View style={styles.thumbGrid}>
          {Array.from({ length: 4 }).map((_, i) => {
            const uri = photos[i];
            return (
              <Pressable key={i} style={styles.thumb} onLongPress={() => uri && removeAt(i)}>
                {uri ? (
                  <Image source={{ uri }} style={styles.thumbImg} />
                ) : (
                  <View style={styles.thumbEmpty}>
                    <Ionicons name="image-outline" size={18} color={colors.sub} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* 카메라/프리뷰 (3:4 고정) */}
        {hasPermission === null ? (
          <View style={styles.aspectBox}>
            <Text style={styles.permText}>권한 확인 중…</Text>
          </View>
        ) : hasPermission === false && !capturedUri ? (
          <View style={styles.aspectBox}>
            <Text style={styles.permText}>카메라 권한이 필요합니다.</Text>
            <Pressable
              style={styles.permBtn}
              onPress={async () => {
                const { status } = await Camera.requestCameraPermissionsAsync();
                setHasPermission(status === 'granted');
              }}
            >
              <Text style={styles.permBtnText}>권한 허용</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.aspectBox}>
            {capturedUri ? (
              <Image source={{ uri: capturedUri }} style={styles.fill} resizeMode="cover" />
            ) : (
              <Camera
                ref={cameraRef}
                type={type}
                ratio={Platform.OS === 'android' ? '4:3' : undefined}
                style={styles.fill}
              />
            )}
          </View>
        )}

        {/* 하단 액션들 */}
        {capturedUri ? (
          <View style={styles.actionRow}>
            <Pressable style={[styles.actionBtn, styles.gray]} onPress={() => setCapturedUri(null)}>
              <Text style={styles.actionText}>다시 찍기</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, styles.green]} onPress={onUse}>
              <Text style={[styles.actionText, { color: '#fff' }]}>
                사용하기 ({photos.length}/4)
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.iconRow}>
            <Pressable style={styles.circleBtn} onPress={onPickFromGallery}>
              <Ionicons name="image-outline" size={22} color={colors.text} />
            </Pressable>
            <Pressable style={[styles.circleBtn, styles.accentBtn]} onPress={onCapture}>
              <Ionicons name="camera-outline" size={22} color="#fff" />
            </Pressable>
          </View>
        )}

        {/* 냉장고에 넣기 */}
        {photos.length > 0 && (
          <Pressable style={styles.putBtn} onPress={goPutIntoFridge}>
            <Text style={styles.putBtnText}>냉장고에 넣기 ({photos.length}/4)</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const BOX_GAP = 8;

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

  /* 썸네일 2x2 그리드 */
  thumbGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 네 칸 균등 분배
    marginBottom: 12,
  },
  thumb: {
    width: '23.5%', // 4칸 + 좌우 패딩 고려해서 살짝 여유
    aspectRatio: 1, // 정사각형
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  /* RN에서 calc가 안 되므로 row 2개로 구성하는 대안 */
});

// RN에서는 calc가 안 되므로 아래 스타일을 덮어씌움
styles.thumb = {
  width: '23%',
  aspectRatio: 1,
  borderRadius: 10,
  overflow: 'hidden',
  backgroundColor: colors.card,
  borderWidth: 1,
  borderColor: '#E5E7EB',
};

Object.assign(
  styles,
  StyleSheet.create({
    thumbImg: { width: '100%', height: '100%' },
    thumbEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center' },

    /* 3:4 박스 */
    aspectBox: {
      width: '100%',
      aspectRatio: 3 / 4,
      overflow: 'hidden',
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'center',
    },
    fill: { ...RNStyle.absoluteFillObject },

    permText: { color: colors.sub, marginBottom: 10 },
    permBtn: {
      backgroundColor: '#0EA5E9',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 10,
    },
    permBtnText: { color: '#fff', fontWeight: '800' },

    iconRow: { marginTop: 12, flexDirection: 'row', justifyContent: 'center' },
    circleBtn: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#E5E7EB',
      marginHorizontal: 8,
    },
    accentBtn: { backgroundColor: '#10B981', borderColor: '#10B981' },

    actionRow: { marginTop: 16, flexDirection: 'row', gap: 12 },
    actionBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
    gray: { backgroundColor: '#E5E7EB' },
    green: { backgroundColor: '#10B981' },
    actionText: { fontWeight: '800', color: colors.text },

    putBtn: {
      marginTop: 12,
      alignItems: 'center',
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: '#16A34A',
    },
    putBtnText: { color: '#fff', fontWeight: '800' },
  })
);
