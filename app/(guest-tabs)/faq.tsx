import React, { useState } from 'react';
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

// FAQアイテムのデータ型
interface FAQItem {
  question: string;
  answer: string;
}

// アコーディオンコンポーネント
const AccordionItem: React.FC<
  FAQItem & { isExpanded: boolean; toggleExpand: () => void }
> = ({ question, answer, isExpanded, toggleExpand }) => {
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        style={styles.questionContainer}
        activeOpacity={0.7}
        onPress={toggleExpand}
      >
        <Text style={styles.questionText}>{question}</Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#333"
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

export default function FAQScreen() {
  // FAQ項目のデータ
  const faqData: FAQItem[] = [
    {
      question: 'Wonderpediaとはどのようなサービスですか？',
      answer:
        'Wonderpediaは、お子様一人ひとりに合わせたオリジナルの絵本を作成するAIサービスです。お子様の年齢、興味、好みに合わせて、パーソナライズされた魅力的なストーリーを生成します。',
    },
    {
      question: '何歳のお子様から利用できますか？',
      answer:
        '2歳から12歳までのお子様を対象としていますが、年齢に合わせてストーリーの内容や難易度を調整しています。保護者の方と一緒に楽しむことをお勧めします。',
    },
    {
      question: '無料で利用できますか？',
      answer:
        '14日間の無料トライアル期間がございます。この期間中はベーシックプランの機能をお試しいただけます。トライアル期間終了後は、選択したプランに応じた料金が発生します。',
    },
    {
      question: 'どのようにして絵本を作成するのですか？',
      answer:
        'まずお子様の情報（年齢、興味、好きなキャラクターなど）を登録します。次に、テーマを選択し、AIとの会話を通じてストーリーを発展させていきます。最後に、完成した絵本を保存・共有・閲覧できます。',
    },
    {
      question: '作成した絵本は保存できますか？',
      answer:
        'はい、スタンダードプランとプレミアムプランでは、作成した絵本をクラウドに保存して、いつでも閲覧できます。プレミアムプランでは高解像度でのダウンロードも可能です。',
    },
    {
      question: 'キャンセルはいつでもできますか？',
      answer:
        'はい、いつでもサブスクリプションをキャンセルできます。キャンセル後も、課金期間の終了までサービスをご利用いただけます。',
    },
    {
      question: '複数のお子様を登録できますか？',
      answer:
        'はい、一つのアカウントで複数のお子様プロフィールを作成できます。それぞれのお子様に合わせた絵本を作成できます。',
    },
    {
      question: '作成した絵本は印刷できますか？',
      answer:
        'プレミアムプランでは、高解像度のPDFとして絵本をダウンロードでき、ご家庭のプリンターで印刷したり、印刷サービスに出したりすることができます。',
    },
  ];

  // 展開状態を管理する状態
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // アコーディオンの開閉を切り替える関数
  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>よくある質問</Text>
        <Text style={styles.subHeaderText}>
          Wonderpediaに関する一般的な質問
        </Text>

        {/* FAQアイテムをマップして表示 */}
        {faqData.map((item, index) => (
          <AccordionItem
            key={index}
            question={item.question}
            answer={item.answer}
            isExpanded={expandedIndex === index}
            toggleExpand={() => toggleExpand(index)}
          />
        ))}

        <View style={styles.contactSection}>
          <Text style={styles.contactText}>
            質問がリストにない場合は、お気軽にお問い合わせください
          </Text>
          <TouchableOpacity style={styles.contactButton}>
            <Link href="mailto:support@wonderpedia.com" asChild>
              <Text style={styles.contactButtonText}>サポートに連絡する</Text>
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
  accordionContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    paddingRight: 10,
  },
  answerContainer: {
    padding: 15,
    paddingTop: 0,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  answerText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  contactSection: {
    backgroundColor: '#e9f5ff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  contactButton: {
    backgroundColor: '#E9785E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
