// services/openaiService.ts
import axios, { AxiosError } from 'axios';
import { OpenAIResponse, ImageGenerationResponse } from '../types';

const OPENAI_API_KEY = 'your-api-key-here';
const API_BASE_URL = 'https://api.openai.com/v1';

interface OpenAIError {
  error: {
    message: string;
    type: string;
    code: string;
  };
}

export class OpenAIService {
  private static headers = {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  };

  static async generateStory(prompt: string): Promise<string> {
    try {
      const response = await axios.post<OpenAIResponse>(
        `${API_BASE_URL}/chat/completions`,
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `子供向けの短い絵本の物語を生成してください。
              以下の形式で出力してください：
              - 全体で4-6ページ
              - 各ページは2-3文程度
              - ページの区切りは空行2つで表現
              - 簡潔で分かりやすい言葉を使用`,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 800,
          temperature: 0.8,
        },
        { headers: this.headers }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      this.handleError(error as AxiosError<OpenAIError>, 'Story generation');
      throw error;
    }
  }

  static async generateImage(description: string): Promise<string> {
    try {
      const response = await axios.post<ImageGenerationResponse>(
        `${API_BASE_URL}/images/generations`,
        {
          model: 'dall-e-3',
          prompt: `子供向け絵本の優しいイラスト、水彩画風: ${description}`,
          size: '1024x1024',
          quality: 'standard',
          n: 1,
          style: 'natural',
        },
        { headers: this.headers }
      );

      return response.data.data[0].url;
    } catch (error) {
      this.handleError(error as AxiosError<OpenAIError>, 'Image generation');
      // エラー時のフォールバックとして、プレースホルダー画像を返す
      return 'https://via.placeholder.com/1024x1024/87CEEB/FFFFFF?text=Image+Generation+Failed';
    }
  }

  static async generateSpeech(
    text: string,
    voice: 'nova' | 'alloy' | 'echo' | 'fable' | 'onyx' | 'shimmer' = 'nova'
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/audio/speech`,
        {
          model: 'gpt-4o-mini-tts',
          voice: 'coral',
          input: '今日も素晴らしい一日になりそうですね！',
          instructions: '明るく元気な声で話してください',
          speed: 0.9, // 少しゆっくりめに読み上げ
        },
        {
          headers: this.headers,
          responseType: 'arraybuffer',
        }
      );

      // 音声データをBase64に変換
      const base64Audio = Buffer.from(response.data).toString('base64');
      return `data:audio/mp3;base64,${base64Audio}`;
    } catch (error) {
      this.handleError(error as AxiosError<OpenAIError>, 'Speech generation');
      throw error;
    }
  }

  private static handleError(error: AxiosError<OpenAIError>, operation: string): void {
    if (error.response) {
      console.error(`${operation} error:`, error.response.data.error);

      // レート制限エラーの場合
      if (error.response.status === 429) {
        throw new Error('API利用制限に達しました。しばらくしてから再度お試しください。');
      }

      // 認証エラーの場合
      if (error.response.status === 401) {
        throw new Error('APIキーが無効です。設定を確認してください。');
      }
    } else {
      console.error(`${operation} network error:`, error.message);
      throw new Error('ネットワークエラーが発生しました。接続を確認してください。');
    }
  }
}
