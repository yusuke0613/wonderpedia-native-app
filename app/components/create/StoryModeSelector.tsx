import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../ui/BackButton';
import SelectableCard from '../ui/SelectableCard';
import GradientButton from '../ui/GradientButton';
import { StoryMode } from '../../hooks/useStoryCreate';

interface StoryModeSelectorProps {
  onBack: () => void;
  selectedMode: StoryMode;
  onModeSelect: (mode: 'full' | 'simple') => void;
  onStartCreate: () => void;
}

export default function StoryModeSelector({
  onBack,
  selectedMode,
  onModeSelect,
  onStartCreate,
}: StoryModeSelectorProps) {
  return (
    <View className="flex-1 bg-key-300">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6">
          {/* ヘッダー */}
          <View className="py-4">
            <BackButton onPress={onBack} style={{ left: 0 }} />

            <Text className="mt-12 text-center text-2xl font-black text-primary-800">
              おはなしをかんがえてつくる
            </Text>
          </View>

          {/* 質問テキスト */}
          <View className="mb-8 mt-8">
            <Text className="text-center text-xl font-bold text-primary-800">作りたいお話しを</Text>
            <Text className="text-center text-xl font-bold text-primary-800">どの方法でつくる？</Text>
          </View>

          {/* 選択ボタン */}
          <View className="flex-1 justify-center pb-32">
            {/* おはなしをぜんぶかんがえる */}
            <View className="mb-6">
              <SelectableCard
                onPress={() => onModeSelect('full')}
                selected={selectedMode === 'full'}>
                <View>
                  <Text className="text-center text-xl font-black text-primary-800">おはなしを</Text>
                  <Text className="text-center text-xl font-black text-primary-800">
                    ぜんぶかんがえる
                  </Text>
                </View>
              </SelectableCard>
            </View>

            {/* かんたんにつくる */}
            <SelectableCard
              onPress={() => onModeSelect('simple')}
              selected={selectedMode === 'simple'}>
              <View>
                <Text className="text-center text-xl font-black text-primary-800">かんたんに</Text>
                <Text className="text-center text-xl font-black text-primary-800">つくる</Text>
              </View>
            </SelectableCard>
          </View>

          {/* はじめるボタン */}
          <View className="pb-8">
            <GradientButton
              onPress={onStartCreate}
              disabled={!selectedMode}
              colors={['#F97316', '#DC2626']}
              style={
                selectedMode
                  ? {
                      shadowColor: '#F97316',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 6,
                      elevation: 8,
                    }
                  : {}
              }>
              はじめる
            </GradientButton>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
