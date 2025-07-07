import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useParentalLock } from '../hooks/useParentalLock';

export default function ParentPage() {
  const [selectedChild, setSelectedChild] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('today'); // today, month, total
  const { lockParentalAccess } = useParentalLock();
  
  const StatusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  const handleInterestsPress = () => {
    setTimeout(() => {
      router.push(`/interests-detail?childIndex=${selectedChild}`);
    }, 0);
  };

  const handleCreatePress = () => {
    setTimeout(() => {
      router.push(`/create?type=3`);
    }, 0);
  };

  const childrenData = useMemo(() => [
    {
      name: '第1子の名前',
      stats: {
        today: { usageTime: 45, createdBooks: 1 },
        month: { usageTime: 320, createdBooks: 8 },
        total: { usageTime: 1200, createdBooks: 29 },
      },
      interests: [
        { name: '動物', level: 90, color: '#22c55e' },
        { name: '科学', level: 75, color: '#3b82f6' },
        { name: '冒険', level: 60, color: '#f59e0b' },
        { name: '友達', level: 45, color: '#ec4899' },
      ],
      currentReading: '動物の物語 1部まで進行',
      hasAchievement: false,
    },
    {
      name: '第2子の名前',
      stats: {
        today: { usageTime: 15, createdBooks: 0 },
        month: { usageTime: 85, createdBooks: 2 },
        total: { usageTime: 180, createdBooks: 6 },
      },
      interests: [
        { name: 'ゲーム', level: 85, color: '#8b5cf6' },
        { name: '車', level: 70, color: '#ef4444' },
        { name: '音楽', level: 55, color: '#06b6d4' },
        { name: '食べ物', level: 40, color: '#f97316' },
      ],
      currentReading: 'ロボットの冒険',
      hasAchievement: true,
    },
  ], []);

  const currentChild = childrenData[selectedChild];
  const currentStats = currentChild.stats[selectedPeriod];

  const outingSpots = [
    {
      title: '科学館',
      subtitle: '科学実験が体験できる',
      image: '🔬',
      interests: ['科学', '実験'],
    },
    {
      title: '動物園',
      subtitle: '動物とのふれあい体験',
      image: '🦁',
      interests: ['動物', '自然'],
    },
    {
      title: '水族館',
      subtitle: 'イルカショーとペンギン',
      image: '🐋',
      interests: ['海', '動物'],
    },
  ];

  const periodLabels = {
    today: '今日',
    month: '今月',
    total: '累計',
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" style={{ paddingTop: StatusBarHeight }}>
      {/* Header with Lock Button */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white shadow-sm">
        <Text className="text-lg font-bold text-gray-800">保護者ページ</Text>
        <TouchableOpacity 
          onPress={lockParentalAccess}
          className="bg-gray-100 rounded-full p-2"
        >
          <Ionicons name="lock-closed" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-2">
          {/* Tab Selector */}
          <View className="mb-4 flex-row">
            {childrenData.map((child, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedChild(index)}
                className={`mr-2 flex-1 rounded-2xl px-4 py-3 ${
                  selectedChild === index ? 'bg-primary-500' : 'bg-white shadow-sm'
                }`}>
                <Text
                  className={`text-center font-bold ${
                    selectedChild === index ? 'text-white' : 'text-gray-600'
                  }`}>
                  {child.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Period Selector */}
          <View className="mb-4 flex-row rounded-2xl bg-white p-1">
            {Object.entries(periodLabels).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                onPress={() => setSelectedPeriod(key)}
                className={`flex-1 rounded-xl px-3 py-2 ${
                  selectedPeriod === key ? 'bg-primary-500' : 'bg-transparent'
                }`}>
                <Text
                  className={`text-center font-medium ${
                    selectedPeriod === key ? 'text-white' : 'text-gray-600'
                  }`}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stats Cards */}
          <View className="bg-primary-400">
            <View className="ml-2 mr-2 mt-2  flex-row">
              <View className="mr-2 flex-1">
                <View className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur">
                  <View className="mb-2 flex-row items-center">
                    <Ionicons name="time-outline" size={16} color="white" />
                    <Text className="ml-2 text-sm font-medium text-white">使用時間</Text>
                  </View>
                  <View className="flex-row items-baseline">
                    <Text className="text-2xl font-bold text-white">{currentStats.usageTime}</Text>
                    <Text className="ml-1 text-sm text-white/90">分</Text>
                  </View>
                </View>
              </View>

              <View className="ml-2 flex-1">
                <View className="rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur">
                  <View className="mb-2 flex-row items-center">
                    <Ionicons name="book-outline" size={16} color="white" />
                    <Text className="ml-2 text-sm font-medium text-white">作成絵本</Text>
                  </View>
                  <View className="flex-row items-baseline">
                    <Text className="text-2xl font-bold text-white">
                      {currentStats.createdBooks}
                    </Text>
                    <Text className="ml-1 text-sm text-white/90">冊</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Current Reading */}
            <View className="ml-2 mr-2 mt-2 rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur">
              <View className="mb-2 flex-row items-center">
                <Ionicons name="play-circle-outline" size={16} color="white" />
                <Text className="ml-2 text-sm font-medium text-white">いま読んでいるもの</Text>
              </View>
              <Text className="font-bold text-white">{currentChild.currentReading}</Text>
            </View>

            {/* Interest Analysis */}
            <TouchableOpacity 
              onPress={handleInterestsPress}
              className="m-2 rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur"
            >
              <View className="m-2 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="heart-outline" size={16} color="white" />
                  <Text className="ml-2 text-sm font-medium text-white">今の興味・関心</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="white" />
              </View>
              <View className="space-y-2">
                {currentChild.interests.map((interest, index) => (
                  <View key={index} className="mb-2">
                    <View className="mb-1 flex-row items-center justify-between">
                      <Text className="text-sm font-medium text-white">{interest.name}</Text>
                      <Text className="text-xs text-white/80">{interest.level}%</Text>
                    </View>
                    <View className="h-2 rounded-full bg-white/20">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${interest.level}%`,
                          backgroundColor: interest.color,
                        }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          </View>
          {/* Outing Recommendations */}
          <View className="m-2">
            <View className="mb-4 flex-row items-center">
              <Ionicons name="location" size={24} color="#39c8ba" />
              <Text className="ml-2 text-lg font-bold text-gray-800">おすすめお出かけスポット</Text>
            </View>

            <View className="space-y-3">
              {outingSpots.map((spot, index) => (
                <TouchableOpacity
                  key={index}
                  className="m-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <View className="flex-row items-center">
                    <View className="mr-4 h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                      <Text className="text-2xl">{spot.image}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-bold text-gray-800">{spot.title}</Text>
                      <Text className="mt-1 text-sm text-gray-600">{spot.subtitle}</Text>
                      <View className="mt-2 flex-row">
                        {spot.interests.map((interest, idx) => (
                          <View key={idx} className="bg-primary-100 mr-2 rounded-full px-2 py-1">
                            <Text className="text-primary-700 text-xs font-medium">{interest}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Create Story Button */}
          <TouchableOpacity
            onPress={handleCreatePress}
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
      </ScrollView>
    </SafeAreaView>
  );
}
