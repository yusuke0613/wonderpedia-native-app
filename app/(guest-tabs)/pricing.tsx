import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// 料金プランのカードコンポーネント
interface PlanCardProps {
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  color: string;
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  price,
  features,
  isPopular,
  color,
}) => (
  <View style={[styles.planCard, { borderColor: color }]}>
    {isPopular && (
      <View style={[styles.popularBadge, { backgroundColor: color }]}>
        <Text style={styles.popularText}>人気</Text>
      </View>
    )}
    <Text style={styles.planTitle}>{title}</Text>
    <View style={[styles.priceBadge, { backgroundColor: color }]}>
      <Text style={styles.priceText}>{price}</Text>
    </View>
    <View style={styles.featuresContainer}>
      {features.map((feature, index) => (
        <View key={index} style={styles.featureRow}>
          <Ionicons name="checkmark-circle" size={20} color={color} />
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}
    </View>
    <TouchableOpacity style={[styles.signupButton, { backgroundColor: color }]}>
      <Link href="/auth/register" asChild>
        <Text style={styles.signupButtonText}>登録する</Text>
      </Link>
    </TouchableOpacity>
  </View>
);

export default function PricingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>料金プラン</Text>
        <Text style={styles.subHeaderText}>
          お子様の成長に合わせたプランをご用意しています
        </Text>

        {/* ベーシックプラン */}
        <PlanCard
          title="ベーシックプラン"
          price="¥980/月"
          features={[
            '月に5冊まで絵本作成可能',
            '基本的なキャラクター',
            '基本テーマ',
            'テキスト読み上げ機能',
          ]}
          color="#4A90E2"
        />

        {/* スタンダードプラン - 人気プラン */}
        <PlanCard
          title="スタンダードプラン"
          price="¥1,980/月"
          features={[
            '月に15冊まで絵本作成可能',
            'すべてのキャラクター',
            '拡張テーマ',
            'テキスト読み上げ機能',
            'ストーリー保存機能',
          ]}
          isPopular={true}
          color="#E9785E"
        />

        {/* プレミアムプラン */}
        <PlanCard
          title="プレミアムプラン"
          price="¥2,980/月"
          features={[
            '無制限の絵本作成',
            'すべてのキャラクター',
            'すべてのテーマ',
            'プレミアム音声機能',
            '印刷用高解像度出力',
            '優先サポート',
          ]}
          color="#7B61FF"
        />

        <Text style={styles.noteText}>
          ※
          すべてのプランは14日間の無料トライアル付き。いつでもキャンセル可能です。
        </Text>

        <View style={styles.contactContainer}>
          <Text style={styles.contactText}>
            プランについてご質問がありますか？
          </Text>
          <TouchableOpacity style={styles.contactButton}>
            <Link href="mailto:support@wonderpedia.com" asChild>
              <Text style={styles.contactButtonText}>お問い合わせ</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  popularText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  planTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  priceBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 25,
    marginBottom: 20,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  signupButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  contactContainer: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  contactButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
