import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import CharacterChatScreen from '../components/create/CharacterChatScreen';
import MiniGameScreen from '../components/create/MiniGameScreen';

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [pendingMessages, setPendingMessages] = useState<any[]>([]);

  // パラメータから情報を取得
  const characterId = params.characterId as string;
  const characterName = params.characterName as string;
  const storyStyle = params.storyStyle as string;

  // キャラクター画像を取得
  const characterImages: Record<string, any> = {
    bear: require('../../assets/images/create/bear.png'),
    cat: require('../../assets/images/create/cat.png'),
    dog: require('../../assets/images/create/dog.png'),
  };

  const characterImage = characterImages[characterId];

  const handleBack = () => {
    router.back();
  };

  const handleGenerateStory = (messages: any[]) => {
    // メッセージを保存してミニゲームを表示
    setPendingMessages(messages);
    setShowMiniGame(true);
  };

  const handleMiniGameComplete = () => {
    // ミニゲーム完了後、絵本生成画面へ遷移
    router.replace({
      pathname: '/story-viewer',
      params: {
        messages: JSON.stringify(pendingMessages),
        characterId,
        characterName,
        storyStyle,
        fromMiniGame: 'false',
      },
    });
  };

  if (showMiniGame) {
    return (
      <MiniGameScreen
        character={characterId as 'bear' | 'cat' | 'dog'}
        onComplete={handleMiniGameComplete}
      />
    );
  }

  return (
    <CharacterChatScreen
      characterId={characterId}
      characterImage={characterImage}
      characterName={characterName}
      storyStyle={storyStyle}
      onBack={handleBack}
      onGenerateStory={handleGenerateStory}
    />
  );
}
