import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.0.2.2:8000'; // Django 서버 URL
const OAUTH_LOGIN_API = `${BASE_URL}/accounts/api/oauth-login/`;
const OAUTH_REGISTER_API = `${BASE_URL}/accounts/api/oauth-register/`;

export const handleOAuthLogin = async (email, provider, nickname, navigation) => {
  try {
    // ✅ 로그인 시도
    const loginResponse = await axios.post(OAUTH_LOGIN_API, { email, provider });

    if (loginResponse.data.status === 'success') {
      // ✅ 로그인 성공 -> 토큰 저장 후 이동
      await AsyncStorage.setItem('authToken', loginResponse.data.token);
      navigation.navigate('ProfileScreen');
    } else {
      // ❌ 회원가입 필요 -> 회원가입 API 호출
      const registerResponse = await axios.post(OAUTH_REGISTER_API, { email, provider, nickname });

      if (registerResponse.data.status === 'success') {
        await AsyncStorage.setItem('authToken', registerResponse.data.token);
        navigation.navigate('ProfileScreen');
      }
    }
  } catch (error) {
    console.error('❌ OAuth 로그인 실패:', error);
  }
};
