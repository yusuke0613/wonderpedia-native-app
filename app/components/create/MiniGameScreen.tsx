import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Image } from 'react-native';

interface MiniGameScreenProps {
  character?: 'bear' | 'cat' | 'dog';
  onComplete?: () => void;
  duration?: number; // ゲーム表示時間（ミリ秒）
}

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MiniGameScreen({
  character = 'bear',
  onComplete,
  duration = 10000,
}: MiniGameScreenProps) {
  const emojis = ['🌟', '🎈', '🌈', '🦄', '🎨', '📚'];

  // キャラクター画像の設定
  const characterImages = {
    bear: require('../../../assets/images/create/bear.png'),
    cat: require('../../../assets/images/create/cat.png'),
    dog: require('../../../assets/images/create/dog.png'),
  };

  const characterNames = {
    bear: 'くまさん',
    cat: 'ねこさん',
    dog: 'いぬさん',
  };
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(duration / 1000);
  const [progress, setProgress] = useState(1);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const flipAnims = useRef<Animated.Value[]>([]);
  const progressAnim = useRef(new Animated.Value(1)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // カードの初期化
    const shuffledCards: Card[] = [];
    emojis.forEach((emoji, index) => {
      shuffledCards.push({ id: index * 2, emoji, isFlipped: false, isMatched: false });
      shuffledCards.push({ id: index * 2 + 1, emoji, isFlipped: false, isMatched: false });
    });

    // シャッフル
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }

    setCards(shuffledCards);

    // フリップアニメーションの初期化
    flipAnims.current = shuffledCards.map(() => new Animated.Value(0));

    // フェードインアニメーション
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // キラキラアニメーション
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // プログレスバーアニメーション
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: duration,
      useNativeDriver: false,
    }).start();

    // タイマー設定
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        setProgress(newTime / (duration / 1000));
        if (newTime <= 0) {
          clearInterval(timer);
          // onCompleteを非同期で実行
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 0);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flipCard = (index: number) => {
    Animated.timing(flipAnims.current[index], {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const unflipCard = (index: number) => {
    Animated.timing(flipAnims.current[index], {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleCardPress = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || selectedCards.length === 2) {
      return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    flipCard(index);

    const newSelectedCards = [...selectedCards, index];
    setSelectedCards(newSelectedCards);

    if (newSelectedCards.length === 2) {
      const [first, second] = newSelectedCards;
      if (cards[first].emoji === cards[second].emoji) {
        // マッチした場合
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setMatches(matches + 1);
          setSelectedCards([]);

          // 全てマッチしても自動遷移しない
        }, 500);
      } else {
        // マッチしなかった場合
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          unflipCard(first);
          unflipCard(second);
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <Animated.View
      className="flex-1 items-center justify-center px-4"
      style={{
        opacity: fadeAnim,
        backgroundColor: '#f0f4ff',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
      {/* 背景のキラキラ */}
      <View className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <Animated.View
            key={i}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: sparkleAnim,
              transform: [
                {
                  scale: sparkleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1.5],
                  }),
                },
              ],
            }}>
            <Text className="text-key-300 text-2xl">✨</Text>
          </Animated.View>
        ))}
      </View>

      {/* ヘッダー */}
      <View className="mb-6 items-center">
        {/* キャラクター画像 */}
        <Animated.View
          className="mb-4"
          style={{
            transform: [
              {
                scale: sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.1],
                }),
              },
            ],
          }}>
          <Image
            source={characterImages[character]}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          className="from-primary-500 to-secondary-500 mb-4 rounded-full bg-gradient-to-r px-8 py-4"
          style={{
            transform: [
              {
                scale: sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.05],
                }),
              },
            ],
          }}>
          <Text className="text-center text-3xl font-bold text-white">
            {characterNames[character]}が絵本を作っています！
          </Text>
        </Animated.View>
        <Text className="text-primary-700 text-center text-xl font-semibold">
          同じ絵を見つけてね！
        </Text>
      </View>

      {/* プログレスバー */}
      <View className="mb-6 w-full max-w-xs">
        <View className="h-6 overflow-hidden rounded-full bg-white shadow-lg">
          <Animated.View
            className="h-full rounded-full"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: progress > 0.3 ? '#10b981' : progress > 0.1 ? '#f59e0b' : '#ef4444',
            }}
          />
        </View>
        <Text className="text-primary-800 mt-2 text-center font-bold">あと {timeRemaining} 秒</Text>
      </View>

      {/* スコア表示 */}
      <View className="mb-6 rounded-3xl bg-white px-8 py-4 shadow-xl">
        <Text className="text-primary-800 text-center text-2xl font-bold">
          マッチ: {matches}/{emojis.length}
        </Text>
        <View className="mt-2 flex-row justify-center">
          {[...Array(emojis.length)].map((_, i) => (
            <Text key={i} className="mx-1 text-2xl">
              {i < matches ? '⭐' : '☆'}
            </Text>
          ))}
        </View>
      </View>

      {/* ゲームボード */}
      <View className="from-primary-200 to-secondary-200 rounded-3xl bg-gradient-to-br p-6 shadow-2xl">
        <View className="flex-row flex-wrap justify-center" style={{ width: 320 }}>
          {cards.map((card, index) => {
            const frontInterpolate = flipAnims.current[index]?.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '180deg'],
            });

            const backInterpolate = flipAnims.current[index]?.interpolate({
              inputRange: [0, 1],
              outputRange: ['180deg', '360deg'],
            });

            const frontOpacity = flipAnims.current[index]?.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [1, 0, 0],
            });

            const backOpacity = flipAnims.current[index]?.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0, 1],
            });

            return (
              <TouchableOpacity
                key={card.id}
                onPress={() => handleCardPress(index)}
                activeOpacity={0.8}
                className="m-1">
                <View style={{ width: 70, height: 70 }}>
                  {/* カードの裏面 */}
                  <Animated.View
                    className="absolute h-full w-full items-center justify-center rounded-xl shadow-lg"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: [{ rotateY: frontInterpolate || '0deg' }],
                      opacity: card.isMatched ? 0.3 : frontOpacity || 1,
                      backgroundColor: '#8b5cf6',
                      borderWidth: 2,
                      borderColor: '#7c3aed',
                    }}>
                    <Text className="text-4xl font-bold text-white">?</Text>
                  </Animated.View>

                  {/* カードの表面 */}
                  <Animated.View
                    className="absolute h-full w-full items-center justify-center rounded-xl shadow-lg"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: [{ rotateY: backInterpolate || '180deg' }],
                      opacity: card.isMatched ? 0.3 : backOpacity || 0,
                      backgroundColor: '#ffffff',
                      borderWidth: 2,
                      borderColor: '#fbbf24',
                    }}>
                    <Text className="text-4xl">{card.emoji}</Text>
                  </Animated.View>

                  {/* マッチ時のエフェクト */}
                  {card.isMatched && (
                    <Animated.View
                      className="absolute h-full w-full items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.2)',
                        transform: [
                          {
                            scale: sparkleAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 1.1],
                            }),
                          },
                        ],
                      }}>
                      <Text className="text-2xl">✨</Text>
                    </Animated.View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ローディング表示 */}
      <View className="absolute bottom-10 items-center">
        <View className="rounded-full bg-white px-6 py-3 shadow-lg">
          <View className="flex-row items-center">
            <Animated.View
              className="bg-primary-500 mx-1 h-4 w-4 rounded-full"
              style={{
                opacity: sparkleAnim,
                transform: [
                  {
                    scale: sparkleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.2],
                    }),
                  },
                ],
              }}
            />
            <Animated.View
              className="bg-secondary-500 mx-1 h-4 w-4 rounded-full"
              style={{
                opacity: sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.3],
                }),
                transform: [
                  {
                    scale: sparkleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1.2, 0.5],
                    }),
                  },
                ],
              }}
            />
            <Animated.View
              className="bg-primary-500 mx-1 h-4 w-4 rounded-full"
              style={{
                opacity: sparkleAnim,
                transform: [
                  {
                    scale: sparkleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.2],
                    }),
                  },
                ],
              }}
            />
          </View>
          <Text className="text-primary-800 mt-2 text-center font-bold">絵本を作成中...</Text>
        </View>
      </View>
    </Animated.View>
  );
}
