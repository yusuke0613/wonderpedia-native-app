import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Book } from 'lucide-react-native';
// @ts-expect-error - expo-routerの型定義エラーを一時的に無視
import { router } from 'expo-router';

import Colors from '@/constants/Colors';

export const EmptyLibrary: React.FC = () => {
  const handleCreatePress = () => {
    router.navigate('/(tabs)');
  };

  return (
    <View style={styles.emptyContainer}>
      <Book size={80} color={Colors.lightGray} />
      <Text style={styles.emptyText}>まだ絵本がありません</Text>
      <Text style={styles.emptySubtext}>
        「作成」タブから最初の絵本を作ってみましょう
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreatePress}
        activeOpacity={0.8}
      >
        <Text style={styles.createButtonText}>絵本を作成する</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: 'center',
    marginTop: 8,
  },
  createButton: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  createButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: 'bold',
  },
});
