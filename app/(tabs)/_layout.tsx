import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Book, MessageCircle, Rocket, Settings, User as User2, Chrome as Home } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import ChildSwitcher from '@/components/ChildSwitcher';

export default function TabLayout() {
  const { user, selectedChild } = useAuth();
  
  if (!user) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
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
        headerTitle: props => <ChildSwitcher {...props} />,
        headerTitleAlign: 'center',
      }}>
      
      <Tabs.Screen
        name="home"
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'つくる',
          tabBarIcon: ({ color, size }) => (
            <Rocket size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="chat"
        options={{
          title: 'はなす',
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="library"
        options={{
          title: 'ほんだな',
          tabBarIcon: ({ color, size }) => (
            <Book size={size} color={color} />
          ),
        }}
      />
      
      {user.isParent && (
        <Tabs.Screen
          name="parent-dashboard"
          options={{
            title: 'おやこ',
            tabBarIcon: ({ color, size }) => (
              <User2 size={size} color={color} />
            ),
          }}
        />
      )}
      
      <Tabs.Screen
        name="settings"
        options={{
          title: 'せってい',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}