import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ParentalLockModalProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ParentalLockModal({ visible, onSuccess, onCancel }: ParentalLockModalProps) {
  const [answer, setAnswer] = useState('');
  const [mathProblem, setMathProblem] = useState({ question: '', correctAnswer: 0 });
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  const generateMathProblem = () => {
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2, correctAnswer, question;
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        correctAnswer = num1 + num2;
        question = `${num1} + ${num2}`;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * num1) + 1;
        correctAnswer = num1 - num2;
        question = `${num1} - ${num2}`;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 9) + 1;
        num2 = Math.floor(Math.random() * 9) + 1;
        correctAnswer = num1 * num2;
        question = `${num1} × ${num2}`;
        break;
      default:
        num1 = 5;
        num2 = 3;
        correctAnswer = 8;
        question = '5 + 3';
    }
    
    setMathProblem({ question, correctAnswer });
  };

  useEffect(() => {
    if (visible) {
      generateMathProblem();
      setAnswer('');
      setAttempts(0);
    }
  }, [visible]);

  const handleSubmit = () => {
    const userAnswer = parseInt(answer);
    
    if (isNaN(userAnswer)) {
      Alert.alert('エラー', '数字を入力してください');
      return;
    }
    
    if (userAnswer === mathProblem.correctAnswer) {
      setAnswer('');
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= maxAttempts) {
        Alert.alert(
          '制限に達しました',
          '間違いが多すぎます。しばらく待ってから再度お試しください。',
          [{ text: 'OK', onPress: onCancel }]
        );
      } else {
        Alert.alert(
          '不正解',
          `もう一度お試しください。残り${maxAttempts - newAttempts}回`,
          [{ text: 'OK', onPress: generateMathProblem }]
        );
        setAnswer('');
      }
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setAnswer(prev => prev.slice(0, -1));
    } else if (key === 'submit') {
      handleSubmit();
    } else if (!isNaN(parseInt(key))) {
      setAnswer(prev => prev + key);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
          {/* Header */}
          <View className="items-center mb-6">
            <View className="bg-primary-100 rounded-full p-4 mb-4">
              <Ionicons name="lock-closed" size={32} color="#39c8ba" />
            </View>
            <Text className="text-xl font-bold text-gray-800 text-center">
              保護者確認
            </Text>
            <Text className="text-sm text-gray-600 text-center mt-2">
              簡単な計算問題に答えて続行してください
            </Text>
          </View>

          {/* Math Problem */}
          <View className="bg-gray-50 rounded-2xl p-6 mb-6">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-4">
              {mathProblem.question} = ?
            </Text>
            
            {/* Answer Display */}
            <View className="bg-white rounded-xl border-2 border-gray-200 p-4 mb-4 min-h-[60]">
              <Text className="text-2xl font-bold text-center text-gray-800">
                {answer || ' '}
              </Text>
            </View>

            {/* Custom Keypad */}
            <View className="space-y-2">
              <View className="flex-row justify-center space-x-2">
                {[1, 2, 3].map(num => (
                  <TouchableOpacity
                    key={num}
                    onPress={() => handleKeyPress(num.toString())}
                    className="bg-gray-100 rounded-xl p-4 flex-1 items-center"
                  >
                    <Text className="text-xl font-bold text-gray-800">{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View className="flex-row justify-center space-x-2">
                {[4, 5, 6].map(num => (
                  <TouchableOpacity
                    key={num}
                    onPress={() => handleKeyPress(num.toString())}
                    className="bg-gray-100 rounded-xl p-4 flex-1 items-center"
                  >
                    <Text className="text-xl font-bold text-gray-800">{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View className="flex-row justify-center space-x-2">
                {[7, 8, 9].map(num => (
                  <TouchableOpacity
                    key={num}
                    onPress={() => handleKeyPress(num.toString())}
                    className="bg-gray-100 rounded-xl p-4 flex-1 items-center"
                  >
                    <Text className="text-xl font-bold text-gray-800">{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View className="flex-row justify-center space-x-2">
                <TouchableOpacity
                  onPress={() => handleKeyPress('backspace')}
                  className="bg-gray-100 rounded-xl p-4 flex-1 items-center"
                >
                  <Ionicons name="backspace" size={24} color="#374151" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleKeyPress('0')}
                  className="bg-gray-100 rounded-xl p-4 flex-1 items-center"
                >
                  <Text className="text-xl font-bold text-gray-800">0</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleKeyPress('submit')}
                  className="bg-primary-500 rounded-xl p-4 flex-1 items-center"
                >
                  <Ionicons name="checkmark" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Buttons */}
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 bg-gray-200 rounded-xl py-3 px-4"
            >
              <Text className="text-gray-700 font-bold text-center">キャンセル</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleSubmit}
              className="flex-1 bg-primary-500 rounded-xl py-3 px-4"
            >
              <Text className="text-white font-bold text-center">確認</Text>
            </TouchableOpacity>
          </View>

          {/* Attempts Counter */}
          {attempts > 0 && (
            <Text className="text-red-500 text-sm text-center mt-3">
              残り試行回数: {maxAttempts - attempts}回
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}