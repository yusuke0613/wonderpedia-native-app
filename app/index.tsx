import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import '../global.css';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // 2秒後に自動的に遷移
    const timer = setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-primary-100 p-5">
      <Text className="mb-2.5 text-4xl font-bold text-primary-800">Wonderpedia</Text>
      <Text className="mb-8 text-lg text-secondary-600">子供の疑問を解消する絵本生成</Text>
      <ActivityIndicator size="large" color="#007AFF" className="mt-5" />
    </View>
  );
}
