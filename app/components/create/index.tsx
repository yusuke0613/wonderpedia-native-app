import { useLocalSearchParams } from 'expo-router';
import StoryModeSelector from './StoryModeSelector';
import StoryInputScreen from './StoryInputScreen';
import QuestionCreationScreen from './QuestionCreationScreen';
import TeachingCreationScreen from './TeachingCreationScreen';
import { createTypes } from '../../constants/createTypes';
import { useStoryCreate } from '../../hooks/useStoryCreate';

export default function CreateScreen() {
  const { type, mode } = useLocalSearchParams();
  const {
    prompt,
    setPrompt,
    isGenerating,
    selectedMode,
    handleGenerate,
    handleBack,
    handleModeSelect,
    handleStartCreate,
  } = useStoryCreate();

  const createType = createTypes[type as string] || createTypes['1'];

  // type=1の場合、質問作成画面を表示
  if (type === '1') {
    return (
      <QuestionCreationScreen
        onBack={handleBack}
        onStartCreate={(params) => handleStartCreate(type as string, params)}
      />
    );
  }

  // type=2かつmodeが未選択の場合、モード選択画面を表示
  if (type === '2' && !mode) {
    return (
      <StoryModeSelector
        onBack={handleBack}
        selectedMode={selectedMode}
        onModeSelect={handleModeSelect}
        onStartCreate={() => handleStartCreate(type as string)}
      />
    );
  }

  // type=3の場合、教育作成画面を表示
  if (type === '3') {
    return (
      <TeachingCreationScreen
        onBack={handleBack}
        onStartCreate={(params) => handleStartCreate(type as string, params)}
      />
    );
  }

  // 通常の入力画面
  return (
    <StoryInputScreen
      createType={createType}
      prompt={prompt}
      onPromptChange={setPrompt}
      isGenerating={isGenerating}
      onGenerate={handleGenerate}
      onBack={handleBack}
    />
  );
}
