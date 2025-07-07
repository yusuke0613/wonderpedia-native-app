import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { wonderSkyStory } from './data/stories/wonder-sky';
import { sleepBearBook } from './data/stories/sleep-bear';
import type { StoryPage } from './data/stories/wonder-sky';

const { width: screenWidth } = Dimensions.get('window');

interface Book {
  id: string;
  title: string;
  coverImage: any;
  readTime: number;
  createdAt: string;
  lastRead?: string;
  pages?: StoryPage[];
}

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'ワンダーの空',
    coverImage: require('../assets/images/sample_01/sample_01_01.png'),
    readTime: 5,
    createdAt: '2024-01-15',
    lastRead: '2024-01-20',
    pages: wonderSkyStory,
  },
  {
    id: 'sleep-bear',
    title: 'おやすみ、くまくん！ ねむねむパワーで だいへんしん！',
    coverImage: require('../assets/images/sample_02/sample_02_01.png'),
    readTime: 5,
    createdAt: new Date().toISOString(),
    pages: sleepBearBook.pages,
  },
];

export default function LibraryScreen() {
  const router = useRouter();
  const [filterType, setFilterType] = useState<'all' | 'recent' | 'favorite'>('all');

  const filters = [
    { key: 'all', label: 'すべて', icon: 'apps' },
    { key: 'recent', label: '最近読んだ', icon: 'time' },
    { key: 'favorite', label: 'お気に入り', icon: 'heart' },
  ];

  return (
    <SafeAreaView className="bg-primary-50 flex-1">
      <View className="border-b border-gray-200 bg-white px-5 py-4">
        <View className="mb-4 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-primary-800 text-xl font-bold">絵本棚</Text>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setFilterType(filter.key as any)}
              className={`mr-3 flex-row items-center rounded-full px-4 py-2 ${
                filterType === filter.key ? 'bg-primary-600' : 'bg-primary-200'
              }`}>
              <Ionicons
                name={filter.icon as any}
                size={16}
                color={filterType === filter.key ? 'white' : '#6B7280'}
              />
              <Text
                className={`ml-2 font-semibold ${
                  filterType === filter.key ? 'text-white' : 'text-primary-700'
                }`}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-5 py-4">
        <View className="flex-row flex-wrap justify-between">
          {mockBooks.map((book) => (
            <TouchableOpacity
              key={book.id}
              className="mb-6"
              style={{ width: (screenWidth - 60) / 2 }}
              onPress={() => {
                router.push({
                  pathname: '/story-viewer',
                  params: {
                    bookId: book.id,
                    title: book.title,
                    pages: JSON.stringify(book.pages),
                  },
                });
              }}>
              <Image
                source={book.coverImage}
                className="mb-3 h-64 w-full rounded-2xl"
                resizeMode="cover"
              />
              <Text className="text-primary-800 mb-1 text-lg font-bold">{book.title}</Text>
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={14} color="#6B7280" />
                <Text className="text-primary-500 ml-1 text-xs">{book.readTime}分</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {mockBooks.length === 0 && (
          <View className="flex-1 items-center justify-center pt-20">
            <Ionicons name="book-outline" size={80} color="#D1D5DB" />
            <Text className="text-primary-400 mt-4 text-xl font-bold">まだ絵本がありません</Text>
            <Text className="text-primary-400 mt-2">新しい物語を作ってみましょう！</Text>
            <TouchableOpacity
              className="bg-primary-600 mt-6 rounded-full px-6 py-3"
              onPress={() => router.push('/(tabs)/Home')}>
              <Text className="font-semibold text-white">ホームに戻る</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
