import { useState } from 'react';
import { useRouter } from 'expo-router';

export type StoryMode = 'full' | 'simple' | null;

export function useStoryCreate() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMode, setSelectedMode] = useState<StoryMode>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    // ここでAI生成APIを呼び出す
    setTimeout(() => {
      setIsGenerating(false);
      // 生成完了後、絵本ビューアー画面に遷移
      router.push('/story-viewer');
    }, 3000);
  };

  const handleBack = () => {
    router.back();
  };

  const handleModeSelect = (mode: 'full' | 'simple') => {
    setSelectedMode(mode);
  };

  const handleStartCreate = (type: string, params?: any) => {
    if (type === '1' && params) {
      // わからないことをえほんにきくの場合、チャット画面へ
      router.push({
        pathname: '/create/chat',
        params: {
          characterId: params.characterId,
          characterName: params.characterName,
          storyStyle: params.storyStyle,
        },
      });
    } else if (type === '3' && params) {
      // 教えたいことをえほんにするの場合、絵本ビューアー画面へ
      // TODO: ここで実際のAI生成処理を実装する
      // 現在は仮のデータで遷移
      router.push({
        pathname: '/story-viewer',
        params: {
          title: `${params.characterName}と学ぶ${params.teachingGoal}`,
          fromTeaching: 'true',
          // 実際にはAIで生成されたページデータをJSONとして渡す
        },
      });
    } else if (selectedMode) {
      router.push(`/create?type=${type}&mode=${selectedMode}`);
    }
  };

  return {
    prompt,
    setPrompt,
    isGenerating,
    selectedMode,
    handleGenerate,
    handleBack,
    handleModeSelect,
    handleStartCreate,
  };
}
