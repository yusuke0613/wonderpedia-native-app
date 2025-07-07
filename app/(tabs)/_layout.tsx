import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useParentalLock } from '../hooks/useParentalLock';
import ParentalLockModal from '../components/ParentalLockModal';

export default function TabLayout() {
  const {
    isUnlocked,
    showLockModal,
    requestAccess,
    handleLockSuccess,
    handleLockCancel,
  } = useParentalLock();

  const handleParentTabPress = () => {
    if (!requestAccess()) {
      // Access denied, modal will be shown
      return false;
    }
    return true;
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#39c8ba',
          tabBarInactiveTintColor: '#6B7280',
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'ホーム',
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="parent"
          options={{
            title: '保護者',
            tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />,
          }}
          listeners={{
            tabPress: (e) => {
              if (!isUnlocked) {
                e.preventDefault();
                requestAccess();
              }
            },
          }}
        />
      </Tabs>
      
      <ParentalLockModal
        visible={showLockModal}
        onSuccess={handleLockSuccess}
        onCancel={handleLockCancel}
      />
    </>
  );
}
