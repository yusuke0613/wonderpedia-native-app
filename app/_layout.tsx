import React from 'react';
import { Stack as ExpoStack } from 'expo-router/stack';
import { AuthProvider } from '../context/AuthContext';
import { StoryProvider } from '@/context/StoryContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StoryProvider>
        <ExpoStack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
        >
          <ExpoStack.Screen
            name="(auth)"
            options={{
              animation: 'fade',
            }}
          />
          <ExpoStack.Screen
            name="(tabs)"
            options={{
              animation: 'fade',
            }}
          />
          <ExpoStack.Screen
            name="(guest-tabs)"
            options={{
              animation: 'fade',
            }}
          />
          <ExpoStack.Screen
            name="index"
            options={{
              animation: 'none',
            }}
          />
          <ExpoStack.Screen
            name="create"
            options={{
              headerShown: true,
              headerTitle: 'プロフィール',
              animation: 'fade',
            }}
          />
        </ExpoStack>
      </StoryProvider>
    </AuthProvider>
  );
}
