import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

// @ts-expect-error - expoルーターの型定義エラーを一時的に無視
export default function GuestTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#E9785E',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 60,
          borderTopWidth: 1,
          borderTopColor: '#eee',
        },
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#333',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
          headerTitle: 'Wonderpedia',
        }}
      />
      <Tabs.Screen
        name="pricing"
        options={{
          title: '料金',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <FontAwesome name="yen" color={color} size={size} />
          ),
          headerTitle: '料金プラン',
        }}
      />
      <Tabs.Screen
        name="faq"
        options={{
          title: 'FAQ',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialIcons name="question-answer" color={color} size={size} />
          ),
          headerTitle: 'よくある質問',
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'ログイン',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
