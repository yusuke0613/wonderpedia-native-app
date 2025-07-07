import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function InterestsDetailPage() {
  const StatusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
  const params = useLocalSearchParams();
  const childIndex = parseInt(params.childIndex as string) || 0;

  const childrenData = [
    {
      name: '第1子の名前',
      interests: [
        { name: '動物', level: 90, color: '#ff6b6b', size: 120 },
        { name: '天気', level: 85, color: '#4ecdc4', size: 140 },
        { name: '宇宙', level: 80, color: '#45b7d1', size: 110 },
        { name: '車', level: 70, color: '#f9ca24', size: 80 },
        { name: '飛行機', level: 65, color: '#f0932b', size: 90 },
        { name: '山', level: 60, color: '#6c5ce7', size: 100 },
        { name: '国', level: 55, color: '#a29bfe', size: 70 },
      ],
      currentWeek: [
        { name: '恐竜', trend: 'up', change: '+15%' },
        { name: '海', trend: 'up', change: '+12%' },
        { name: '電車', trend: 'down', change: '-8%' },
        { name: '料理', trend: 'new', change: 'NEW' },
      ]
    },
    {
      name: '第2子の名前',
      interests: [
        { name: 'ゲーム', level: 85, color: '#8b5cf6', size: 130 },
        { name: '車', level: 70, color: '#ef4444', size: 110 },
        { name: '音楽', level: 55, color: '#06b6d4', size: 90 },
        { name: '食べ物', level: 40, color: '#f97316', size: 70 },
        { name: 'ロボット', level: 65, color: '#10b981', size: 100 },
        { name: 'スポーツ', level: 50, color: '#f59e0b', size: 80 },
      ],
      currentWeek: [
        { name: 'サッカー', trend: 'up', change: '+20%' },
        { name: 'プログラミング', trend: 'up', change: '+18%' },
        { name: 'ピアノ', trend: 'down', change: '-5%' },
        { name: '絵画', trend: 'new', change: 'NEW' },
      ]
    }
  ];

  const currentChild = childrenData[childIndex];

  const getBubblePosition = (index: number, total: number) => {
    const centerX = width * 0.5;
    const centerY = height * 0.35;
    const radius = Math.min(width, height) * 0.25;
    
    if (index === 0) return { x: centerX - 60, y: centerY - 20 };
    if (index === 1) return { x: centerX + 20, y: centerY - 60 };
    if (index === 2) return { x: centerX + 40, y: centerY + 40 };
    if (index === 3) return { x: centerX - 80, y: centerY + 60 };
    if (index === 4) return { x: centerX - 20, y: centerY + 80 };
    if (index === 5) return { x: centerX + 80, y: centerY - 10 };
    
    const angle = (index * 2 * Math.PI) / total;
    return {
      x: centerX + radius * Math.cos(angle) - 40,
      y: centerY + radius * Math.sin(angle) - 40,
    };
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" style={{ paddingTop: StatusBarHeight }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">いま興味があること</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Bubble Chart */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          className="mx-4 mt-4 rounded-3xl overflow-hidden"
          style={{ height: height * 0.5 }}
        >
          <View className="flex-1 relative">
            <View className="absolute top-4 left-4 right-4">
              <Text className="text-white text-center text-lg font-bold">
                {currentChild.name}の興味マップ
              </Text>
            </View>
            
            {currentChild.interests.map((interest, index) => {
              const position = getBubblePosition(index, currentChild.interests.length);
              return (
                <TouchableOpacity
                  key={index}
                  className="absolute rounded-full items-center justify-center"
                  style={{
                    left: position.x,
                    top: position.y,
                    width: interest.size,
                    height: interest.size,
                    backgroundColor: interest.color,
                    opacity: 0.9,
                  }}
                >
                  <Text className="text-white font-bold text-center text-sm">
                    {interest.name}
                  </Text>
                  <Text className="text-white/80 text-xs">
                    {interest.level}%
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          
          <View className="p-4">
            <Text className="text-white/80 text-sm text-center">
              だんだんと興味が「{currentChild.interests[0].name}」から「{currentChild.interests[1].name}」に変わってきて
            </Text>
            <Text className="text-white/80 text-sm text-center mt-1">
              います。
            </Text>
          </View>
        </LinearGradient>

        {/* Weekly Trends */}
        <View className="mx-4 mt-6">
          <Text className="text-gray-800 text-lg font-bold mb-4">今週の変化</Text>
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            {currentChild.currentWeek.map((item, index) => (
              <View key={index} className="flex-row items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <View className="flex-row items-center flex-1">
                  <View className={`w-3 h-3 rounded-full mr-3 ${
                    item.trend === 'up' ? 'bg-green-500' :
                    item.trend === 'down' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <Text className="text-gray-800 font-medium">{item.name}</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className={`text-sm font-bold mr-2 ${
                    item.trend === 'up' ? 'text-green-600' :
                    item.trend === 'down' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {item.change}
                  </Text>
                  <Ionicons 
                    name={
                      item.trend === 'up' ? 'trending-up' :
                      item.trend === 'down' ? 'trending-down' : 'add-circle'
                    } 
                    size={20} 
                    color={
                      item.trend === 'up' ? '#22c55e' :
                      item.trend === 'down' ? '#ef4444' : '#3b82f6'
                    } 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Interest Analysis */}
        <View className="mx-4 mt-6 mb-6">
          <Text className="text-gray-800 text-lg font-bold mb-4">詳細分析</Text>
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <Text className="text-gray-700 text-sm leading-6">
              最近は「天気」や「宇宙」に興味を持ち、毎日の天気予報のお話を
              聞きたがるようになりました。
            </Text>
            <Text className="text-gray-700 text-sm leading-6 mt-3">
              新しい発見を好み、毎日の大気の変化について学びを深めて
              いるようです。
            </Text>
            <Text className="text-gray-700 text-sm leading-6 mt-3">
              また、飛行機の運航や山について興味を示しており、「天気」を軸に学習を進めていくとより良いかもしれません。
            </Text>
          </View>
        </View>

        {/* AI Recommendations */}
        <View className="mx-4 mb-8">
          <View className="bg-primary-50 rounded-2xl p-4 border border-primary-200">
            <View className="flex-row items-center mb-3">
              <Ionicons name="bulb" size={20} color="#39c8ba" />
              <Text className="text-primary-800 font-bold ml-2">AIからの提案</Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/create?type=weather')}
              className="bg-primary-500 rounded-xl p-3 flex-row items-center justify-center"
            >
              <Ionicons name="create" size={20} color="white" />
              <Text className="text-white font-bold ml-2">天気の絵本を作る</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}