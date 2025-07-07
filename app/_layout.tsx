// app/_layout.tsx（または RootLayout 相当の最上位ファイル）
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import '../global.css';

// スプラッシュを手動で閉じる準備
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // ❶ ここでフォントを読み込む
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    ...MaterialIcons.font,
  });

  // ❷ 読み込み完了後にスプラッシュを閉じる
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // ❸ 読み込みが終わるまでは何も描画しない
  if (!fontsLoaded) return null;

  // ❹ 通常のレイアウトを返す
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="library" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="create/chat" options={{ headerShown: false }} />
      <Stack.Screen name="story-viewer" options={{ headerShown: false }} />
      <Stack.Screen name="interests-detail" options={{ headerShown: false }} />
    </Stack>
  );
}
