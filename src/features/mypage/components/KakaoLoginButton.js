import React, { useEffect } from 'react';
import { TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { login, me } from '@react-native-kakao/user';
import { handleOAuthLogin } from '../hooks/handleOAuthLogin';
import KakaoLoginImg from '../../../assets/KakaoLogin.png';
import { KAKAO_NATIVE_APP_KEY } from '@env';
const KakaoLoginButton = () => {
  const navigation = useNavigation();
  console.log('KAKAO_NATIVE_APP_KEY:', KAKAO_NATIVE_APP_KEY); // 앞 4글자만 보고 싶으면 slice(0,4)

  useEffect(() => {
    initializeKakaoSDK(KAKAO_NATIVE_APP_KEY);
  }, []);

  const handleKakaoLogin = async () => {
    try {
      console.log('🟡 카카오 로그인 시도 중...');

      // ✅ 로그인
      await login();

      // ✅ 사용자 정보 가져오기 (공식 권장 방식)
      const userInfo = await me();
      console.log('👤 카카오 사용자 정보:', userInfo);

      const email = userInfo.email;
      const nickname = userInfo.nickname || userInfo.name || '카카오유저';

      if (!email) {
        throw new Error('카카오 계정에서 이메일을 가져올 수 없습니다.');
      }

      // ✅ 통합 로그인 처리
      await handleOAuthLogin(email, 'kakao', nickname, navigation);
    } catch (error) {
      console.error('❌ 카카오 로그인 실패:', error);
      Alert.alert('로그인 실패', '다시 시도해주세요.');
    }
  };

  return (
    <TouchableOpacity onPress={handleKakaoLogin}>
      <Image source={KakaoLoginImg} style={styles.loginButton} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    width: 300,
    height: 50,
    resizeMode: 'contain',
    marginVertical: 8,
  },
});

export default KakaoLoginButton;
