import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

export default function ChildRegistrationScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [childInfo, setChildInfo] = useState({
    name: '',
    age: '',
    gender: '',
    interests: '',
  });
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!childInfo.name || !childInfo.age) {
      setError('お子様のお名前と年齢は必須項目です');
      return;
    }

    try {
      setError('');
      await register(childInfo.name, childInfo.age);
      setTimeout(() => {
        router.push('/(tabs)');
      }, 1500);
    } catch (err) {
      setError('登録に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>お子様の情報を登録</Text>
            <Text style={styles.subtitle}>
              お子様に合った絵本を作成するために、以下の情報をご登録ください
            </Text>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                お名前 <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="お子様のお名前"
                value={childInfo.name}
                onChangeText={(text) =>
                  setChildInfo({ ...childInfo, name: text })
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                年齢 <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="例: 5"
                value={childInfo.age}
                onChangeText={(text) =>
                  setChildInfo({ ...childInfo, age: text })
                }
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>性別</Text>
              <View style={styles.genderButtonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    childInfo.gender === '男の子' &&
                      styles.selectedGenderButton,
                  ]}
                  onPress={() =>
                    setChildInfo({ ...childInfo, gender: '男の子' })
                  }
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      childInfo.gender === '男の子' &&
                        styles.selectedGenderButtonText,
                    ]}
                  >
                    男の子
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    childInfo.gender === '女の子' &&
                      styles.selectedGenderButton,
                  ]}
                  onPress={() =>
                    setChildInfo({ ...childInfo, gender: '女の子' })
                  }
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      childInfo.gender === '女の子' &&
                        styles.selectedGenderButtonText,
                    ]}
                  >
                    女の子
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>好きなもの・趣味</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="例: 恐竜、宇宙、プリンセス、電車など"
                value={childInfo.interests}
                onChangeText={(text) =>
                  setChildInfo({ ...childInfo, interests: text })
                }
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>登録する</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginText}>
                すでにアカウントをお持ちの方は
              </Text>
              <Link href="/(guest-tabs)/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.loginLink}>ログイン</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorContainer: {
    backgroundColor: '#ffeeee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  errorText: {
    color: '#cc0000',
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  required: {
    color: '#E9785E',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  genderButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  selectedGenderButton: {
    backgroundColor: '#E9785E',
    borderColor: '#E9785E',
  },
  genderButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedGenderButtonText: {
    color: 'white',
  },
  registerButton: {
    backgroundColor: '#E9785E',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#E9785E',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
