import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
// @ts-expect-error - expoルーターの型定義エラーを一時的に無視
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import {
  LogOut,
  User,
  Bell,
  Volume2,
  CircleHelp as HelpCircle,
  Lock,
  ChevronRight,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { user, logout, selectedChild } = useAuth();

  const [notifications, setNotifications] = useState(true);
  const [autoRead, setAutoRead] = useState(true);

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('ログアウトしますか？');
      if (confirmLogout) {
        logout();
        router.replace('/auth/login');
      }
    } else {
      Alert.alert('ログアウト確認', 'ログアウトしますか？', [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'ログアウト',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(guest-tabs)/home');
          },
        },
      ]);
    }
  };

  const testVoice = () => {
    try {
      Speech.speak('こんにちは！これは読み上げ機能のテストです。', {
        language: 'ja-JP',
        pitch: 1.0,
        rate: 0.8,
        onError: () => alert('音声機能の利用中にエラーが発生しました'),
      });
    } catch (error) {
      alert('音声機能が利用できません');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>設定</Text>
        {selectedChild && (
          <Text style={styles.subtitle}>
            {user?.isParent
              ? `${selectedChild.name}のプロフィール管理`
              : 'あなたのプロフィール'}
          </Text>
        )}
      </View>

      <Animated.View entering={FadeIn} style={styles.section}>
        <Text style={styles.sectionTitle}>アカウント</Text>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <User size={20} color={Colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>プロフィール</Text>
            <Text style={styles.settingValue}>{user?.email}</Text>
          </View>
          <ChevronRight size={20} color={Colors.lightGray} />
        </TouchableOpacity>

        {user?.isParent && (
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Lock size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>保護者設定</Text>
              <Text style={styles.settingValue}>アクセス制限を管理する</Text>
            </View>
            <ChevronRight size={20} color={Colors.lightGray} />
          </TouchableOpacity>
        )}
      </Animated.View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>サポート</Text>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <HelpCircle size={20} color={Colors.accent} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>ヘルプセンター</Text>
            <Text style={styles.settingValue}>よくある質問と使い方</Text>
          </View>
          <ChevronRight size={20} color={Colors.lightGray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <HelpCircle size={20} color={Colors.accent} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>お問い合わせ</Text>
            <Text style={styles.settingValue}>不具合の報告・ご意見</Text>
          </View>
          <ChevronRight size={20} color={Colors.lightGray} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color={Colors.white} />
        <Text style={styles.logoutText}>ログアウト</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>バージョン 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 28,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 14,
    color: Colors.darkGray,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBackground,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 2,
  },
  settingValue: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 12,
    color: Colors.darkGray,
  },
  logoutButton: {
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: Colors.error,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoutText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  versionText: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 12,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: 24,
  },
});
