// types/index.ts
export interface Page {
  text: string;
  imageUrl: string;
  audioData: string;
}

export interface StoryTheme {
  id: string;
  title: string;
  prompt: string;
  icon?: string;
}

export interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export interface ImageGenerationResponse {
  data: {
    url: string;
  }[];
}

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}
