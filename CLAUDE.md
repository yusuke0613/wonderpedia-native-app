# 子供向け AI 絵本生成アプリ開発ガイド

## プロジェクト概要

このプロジェクトは、生成 AI を活用して子供向けの絵本を作成する React Native アプリケーションです。

### 技術スタック

- **フレームワーク**: React Native + Expo
- **ルーティング**: Expo Router v2
- **スタイリング**: NativeWind (Tailwind CSS for React Native)
- **状態管理**: Zustand
- **API 通信**: Axios + React Query
- **テスト**: Jest + React Native Testing Library + Detox
- **型チェック**: TypeScript

## プロジェクト構造

```
picture-book-ai/
├── app/                    # Expo Router v2のディレクトリベースルーティング
├── src/                    # ソースコード
├── __tests__/              # テストコード
├── e2e/                    # E2Eテスト
├── assets/                 # 静的アセット
└── [設定ファイル]
```

## 開発規約

### コーディング規約

1. **TypeScript**

   - strict mode を有効化
   - any 型の使用は原則禁止
   - 型定義は必須

2. **命名規則**

   - コンポーネント: PascalCase（例: `BookCard.tsx`）
   - フック: camelCase で`use`プレフィックス（例: `useAuth.ts`）
   - 定数: UPPER_SNAKE_CASE（例: `MAX_BOOK_PAGES`）
   - ファイル名: kebab-case（例: `story-input.tsx`）

3. **コンポーネント設計**
   - 関数コンポーネントのみ使用
   - カスタムフックで状態管理ロジックを分離
   - 単一責任の原則を遵守

### ディレクトリ構造の詳細

#### `/app` - ルーティング

- Expo Router v2 のファイルベースルーティング
- `(auth)`グループ: 認証が必要な画面
- `(public)`グループ: 認証不要な画面

#### `/src/components` - コンポーネント

- `ui/`: 汎用 UI コンポーネント（Button, Card, Input 等）
- `book/`: 絵本関連コンポーネント
- `creation/`: 絵本作成関連コンポーネント
- `common/`: アプリ全体で使用する共通コンポーネント

#### `/src/features` - 機能モジュール

各機能は以下の構造を持つ：

```
feature-name/
├── hooks/      # カスタムフック
├── services/   # APIサービス
└── types/      # 型定義
```

#### `/src/styles` - スタイリング

- NativeWind（Tailwind CSS）の設定とテーマ管理
- カラーパレットとタイポグラフィの定義

### 状態管理

Zustand を使用した状態管理：

```typescript
// stores/bookStore.ts
interface BookStore {
  books: Book[];
  currentBook: Book | null;
  setCurrentBook: (book: Book) => void;
  addBook: (book: Book) => void;
}
```

### API 設計

```typescript
// services/api/endpoints.ts
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
  },
  books: {
    list: '/books',
    create: '/books/create',
    detail: (id: string) => `/books/${id}`,
  },
  generation: {
    story: '/ai/generate-story',
    illustration: '/ai/generate-illustration',
  },
};
```

## 主要機能の実装ガイド

### 1. 認証フロー

```typescript
// features/auth/hooks/useAuth.ts
export const useAuth = () => {
  const { user, setUser } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    // 実装
  };

  const logout = async () => {
    // 実装
  };

  return { user, login, logout };
};
```

### 2. 絵本生成フロー

```typescript
// features/book-generation/hooks/useGenerateStory.ts
export const useGenerateStory = () => {
  const generateStory = async (prompt: StoryPrompt) => {
    // OpenAI APIを使用してストーリー生成
  };

  const generateIllustration = async (scene: string) => {
    // DALL-E APIを使用してイラスト生成
  };

  return { generateStory, generateIllustration };
};
```

### 3. 絵本リーダー

```typescript
// components/book/PageViewer.tsx
interface PageViewerProps {
  pages: BookPage[];
  currentPage: number;
  onPageChange: (page: number) => void;
}
```

## テスト戦略

### ユニットテスト

- コンポーネント、フック、サービスを個別にテスト
- カバレッジ目標: 80%以上

### 統合テスト

- 主要なユーザーフローをテスト
- API モックを使用

### E2E テスト

- Detox で実機テスト
- 主要な機能フローを網羅

## パフォーマンス最適化

1. **画像最適化**

   - 適切なサイズにリサイズ
   - 遅延読み込みの実装
   - キャッシュ戦略

2. **レンダリング最適化**

   - React.memo の適切な使用
   - useMemo と useCallback の活用
   - FlatList の最適化

3. **バンドルサイズ**
   - 動的インポートの活用
   - 不要な依存関係の削除

## セキュリティ考慮事項

1. **API 通信**

   - HTTPS の使用
   - 認証トークンの適切な管理
   - API キーの環境変数管理

2. **子供の安全性**

   - 年齢確認機能
   - ペアレンタルコントロール
   - 不適切なコンテンツのフィルタリング

3. **データ保護**
   - 個人情報の暗号化
   - GDPR と COPPA への準拠

## デプロイメント

### 開発環境

```bash
npm install
npm run start
```

### ビルド

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

### 環境変数

```env
OPENAI_API_KEY=your_api_key
DALLE_API_KEY=your_api_key
API_BASE_URL=https://api.example.com
```

## トラブルシューティング

### よくある問題

1. **NativeWind が動作しない**

   - `tailwind.config.js`の設定を確認
   - Metro 設定の確認

2. **Expo Router のエラー**

   - ファイル名とルート名の一致を確認
   - \_layout.tsx ファイルの存在確認

3. **テストの失敗**
   - モックの設定確認
   - 非同期処理の待機処理確認

## 今後の拡張計画

1. **機能追加**

   - 音声読み上げ機能
   - アニメーション効果
   - 共有機能

2. **AI 機能の強化**

   - より高度なストーリー生成
   - キャラクターの一貫性保持
   - 多言語対応

3. **収益化**
   - サブスクリプションモデル
   - アプリ内課金
   - 広告表示（子供向けに配慮）

## リソース

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
