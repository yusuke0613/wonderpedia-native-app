import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
// @ts-expect-error - expoルーターの型定義エラーを一時的に無視
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('メールアドレスとパスワードを入力してください');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);

      // ログイン成功後にメインタブに遷移
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('ログインエラー:', error);
      alert('ログインに失敗しました。情報を確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.loginFormContainer}>
      <View style={styles.inputContainer}>
        <Ionicons
          name="mail-outline"
          size={20}
          color="#999"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.textInput}
          placeholder="メールアドレス"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#999"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.textInput}
          placeholder="パスワード"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#333" size="small" />
        ) : (
          <Text style={styles.loginButtonText}>ログイン</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.forgotPasswordButton}
        onPress={() => router.push('/auth/forgot-password')}
      >
        <Text style={styles.forgotPasswordText}>
          パスワードをお忘れですか？
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // ログインフォーム
  loginFormContainer: {
    width: '100%',
    marginBottom: 20,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 45,
    color: '#333',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#E9D949',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#E9785E',
    fontSize: 12,
  },
});

export default Login;
