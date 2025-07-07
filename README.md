# Wonderpedia - 子ども向け教育アプリ

Wonderpediaは、AI対話を通じてインタラクティブな絵本を作成する子ども向け教育アプリケーションです。

## 機能

- 🎨 AIとの対話で絵本を作成
- 🎤 音声入力機能（Webブラウザのみ）
- 📚 作成した絵本の保存と再生
- 👶 子ども向けの優しいUI/UX
- 🔊 テキスト読み上げ機能

## 開発環境のセットアップ

### 必要な環境
- Node.js 18以上
- npm または yarn
- Expo CLI

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 音声入力機能について

### Webブラウザでの使用
音声入力機能は以下のブラウザで利用可能です：
- Chrome
- Safari
- Edge

### Expo Goでの制限
Expo Goでは音声入力機能はサポートされていません。音声入力を使用するには：
1. Webブラウザで開く（推奨）
2. または開発ビルドを作成する

### 開発ビルドの作成
```bash
# iOSの開発ビルド
npx expo run:ios

# Androidの開発ビルド
npx expo run:android
```

## プラットフォーム別の注意事項

### iOS
- iOS 10以上が必要
- マイクとスピーチ認識の権限が必要

### Android
- Android 5.0（API level 21）以上が必要
- RECORD_AUDIO権限が必要

### Web
- モダンブラウザが必要
- HTTPS接続が必要（音声認識API使用のため）

## トラブルシューティング

### "Uncaught Error: Your JavaScript code tried to access a native module that doesn't exist"
このエラーはExpo Goで音声認識モジュールを使用しようとした際に発生します。
- 解決方法1: Webブラウザで開く
- 解決方法2: 開発ビルドを作成する

### 音声入力が動作しない
1. マイクの権限を確認
2. インターネット接続を確認
3. 対応ブラウザを使用しているか確認

## ライセンス

MIT