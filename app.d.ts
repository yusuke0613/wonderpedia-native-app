/// <reference types="expo-router/types" />

// expo-routerの型定義を拡張
declare module 'expo-router' {
  export interface StaticRoutes {
    '/(tabs)': undefined;
    '/(guest-tabs)': undefined;
    '/(auth)': undefined;
  }
}
