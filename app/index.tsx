// 認証状態に基づいてリダイレクト

import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { StoryProvider } from '@/context/StoryContext';
import React from 'react';

export default function Index() {
  const { user, isLoading } = useAuth();

  // ローディング中の表示
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E9785E" />
      </View>
    );
  }

  // ログイン状態に応じてリダイレクト
  if (user) {
    // ログイン済みユーザー向けタブへ
    return <Redirect href="/(tabs)/home" />;
  } else {
    // 未ログインユーザー向けタブへ
    return <Redirect href="/(guest-tabs)/home" />;
  }
}
