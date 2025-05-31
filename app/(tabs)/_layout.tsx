import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import {
  Book,
  MessageCircle,
  Rocket,
  Settings,
  User as User2,
  Home,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import ChildSwitcher from '@/components/ChildSwitcher';

export default function AuthenticatedTabsLayout() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#8A8A8A',
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 65,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'ComicNeue-Bold',
          fontSize: 11,
          marginTop: -5,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
        headerStyle: {
          backgroundColor: Colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontFamily: 'ComicNeue-Bold',
          fontSize: 18,
        },
        headerShadowVisible: false,
        headerShown: true,
        headerTitle: () => <ChildSwitcher />,
        headerTitleAlign: 'center',
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color, size }) => (
            <Home size={size - 2} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: 'つくる',
          headerTitle: 'えほんをつくる',
          tabBarIcon: ({ color, size }) => (
            <Rocket size={size - 2} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: 'はなす',
          headerShown: false, // チャット画面では独自のヘッダーを使用
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={size - 2} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          title: 'ほんだな',
          headerTitle: 'えほんだな',
          tabBarIcon: ({ color, size }) => (
            <Book size={size - 2} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="parent-dashboard"
        options={{
          title: 'おやこ',
          headerTitle: 'おやこ設定',
          tabBarIcon: ({ color, size }) => (
            <User2 size={size - 2} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'せってい',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size - 2} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
