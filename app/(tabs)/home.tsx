import { View, Text, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import '../../global.css';

export default function HomeWithIcons() {
  const router = useRouter();

  return (
    <View className="from-primary-200 via-secondary-100 to-key-100 flex-1 bg-gradient-to-br">
      {/* 背景の装飾 */}
      <View className="absolute inset-0">
        <View className="bg-secondary-300 absolute -left-10 top-20 h-40 w-40 rounded-full opacity-30" />
        <View className="bg-primary-300 absolute -right-20 top-40 h-60 w-60 rounded-full opacity-25" />
        <View className="h-50 w-50 bg-key-300 absolute -left-20 bottom-20 rounded-full opacity-30" />
        <View className="bg-primary-300 absolute bottom-40 right-10 h-32 w-32 rounded-full opacity-25" />
      </View>

      <SafeAreaView className="flex-1">
        <View className="flex-1 px-5 py-3">
          {/* えほんだなボタン（ヘッダー） */}
          <TouchableOpacity
            onPress={() => router.push('/library')}
            className="bg-secondary-400 mb-4 mt-24 overflow-hidden rounded-2xl  p-5"
            style={{
              shadowColor: '#EC4899',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
            }}>
            <View className="flex-row items-center justify-center">
              <Text className="text-3xl">📚</Text>
              <Text className="ml-3 text-2xl font-black text-white">えほんだな</Text>
              <Text className="ml-3 text-3xl">✨</Text>
            </View>
          </TouchableOpacity>

          {/* えほんをつくるセクション */}
          <View
            className="bg-primary-400 mb-4 flex-1 overflow-hidden rounded-2xl p-5"
            style={{
              shadowColor: '#F59E0B',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
            }}>
            <View className="mb-4 flex-row items-center justify-center">
              <Text className="text-2xl">🎨</Text>
              <Text className="m-3 mb-6 font-black text-white selection:text-2xl">
                えほんをつくる
              </Text>
              <Text className="text-2xl">🌟</Text>
            </View>

            {/* わかないことをえほんにきくボタン */}
            <TouchableOpacity
              onPress={() => router.push(`/create?type=1`)}
              className="mb-6 overflow-hidden rounded-2xl bg-white p-5"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 5,
              }}>
              <View className="flex-row items-center">
                <Text className="text-3xl">❓</Text>
                <View className="ml-3 flex-1 ">
                  <Text className="text-primary-800 text-center text-lg font-black">
                    わかないことを
                  </Text>
                  <Text className="text-primary-800 text-center text-lg font-black">
                    えほんにきく
                  </Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={24} color="#6B7280" />
              </View>
            </TouchableOpacity>

            {/* おはなしをかんがえてつくるボタン */}
            <TouchableOpacity
              onPress={() => router.push(`/create?type=2`)}
              className="mb-6 overflow-hidden rounded-2xl bg-white p-5"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 5,
              }}>
              <View className="flex-row items-center">
                <Text className="text-center text-3xl">💭</Text>
                <View className="ml-3 flex-1">
                  <Text className="text-primary-800 text-center text-lg font-black">
                    おはなしをかんがえて
                  </Text>
                  <Text className="text-primary-800 text-center text-lg font-black">つくる</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={24} color="#6B7280" />
              </View>
            </TouchableOpacity>

            {/* 教えたいことをえほんにするボタン（保護者メニュー） */}
            <TouchableOpacity
              onPress={() => router.push(`/create?type=3`)}
              className="bg-primary-100 overflow-hidden rounded-2xl p-5"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 5,
              }}>
              <View className="flex-row items-center">
                <Text className="text-3xl">👨‍👩‍👧‍👦</Text>
                <View className="ml-3 flex-1">
                  <Text className="text-primary-800 text-center text-lg font-black">
                    教えたいことを
                  </Text>
                  <Text className="text-primary-800 text-center text-lg font-black">
                    えほんにする
                  </Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={24} color="#9333EA" />
              </View>
            </TouchableOpacity>
          </View>

          {/* 下部ボタン */}
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => console.log('Points button pressed')}
              className="mr-2 flex-1 overflow-hidden rounded-2xl bg-white p-4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 5,
              }}>
              <View className="flex-row items-center justify-center">
                <Text className="text-2xl">🏆</Text>
                <Text className="text-key-600 ml-2 text-lg font-black">ポイント</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => console.log('Community button pressed')}
              className="bg-key-300 ml-2 flex-1 overflow-hidden rounded-2xl p-4"
              style={{
                shadowColor: '#F97316',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 8,
              }}>
              <View className="flex-row items-center justify-center">
                <Text className="text-2xl">🌈</Text>
                <Text className="ml-2 text-lg font-black text-white">みんなのえほん</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
