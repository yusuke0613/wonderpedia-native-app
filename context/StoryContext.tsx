import React, { createContext, useState, useContext } from 'react';

export type StoryTheme = 'space' | 'ocean' | 'forest' | 'castle' | 'safari';
export type StoryStyle =
  | 'adventure'
  | 'mystery'
  | 'comedy'
  | 'fantasy'
  | 'educational';
export type Character = {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  description: string;
};

export type Story = {
  id: string;
  title: string;
  theme: StoryTheme;
  style: StoryStyle;
  character: Character;
  pages: StoryPage[];
  createdAt: string;
  childId: string;
};

export type StoryPage = {
  id: string;
  content: string;
  imageUrl: any;
  choices?: string[];
};

type StoryContextType = {
  stories: Story[];
  currentStory: Story | null;
  createStory: (
    title: string,
    theme: StoryTheme,
    style: StoryStyle,
    character: Character,
    childId: string
  ) => void;
  loadStory: (storyId: string) => Story | null;
  updateStory: (story: Story) => void;
  deleteStory: (storyId: string) => void;
  addPage: (
    storyId: string,
    content: string,
    imageUrl: string,
    choices?: string[]
  ) => void;
};

// Sample character data
export const CHARACTERS: Character[] = [
  {
    id: '1',
    name: 'Astro',
    type: 'astronaut',
    imageUrl:
      'https://images.pexels.com/photos/2156/sky-earth-space-working.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'A brave astronaut who explores the universe',
  },
  {
    id: '2',
    name: 'Luna',
    type: 'fairy',
    imageUrl:
      'https://images.pexels.com/photos/3617453/pexels-photo-3617453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'A magical fairy with sparkling powers',
  },
  {
    id: '3',
    name: 'Rex',
    type: 'dinosaur',
    imageUrl:
      'https://images.pexels.com/photos/65894/dinosaur-dino-prehistoric-times-prehistoric-65894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'A friendly dinosaur who loves adventures',
  },
  {
    id: '4',
    name: 'Bubbles',
    type: 'mermaid',
    imageUrl:
      'https://images.pexels.com/photos/1233414/pexels-photo-1233414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'A curious mermaid exploring the ocean depths',
  },
  {
    id: '5',
    name: 'Paws',
    type: 'cat',
    imageUrl:
      'https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description: 'A clever cat with a sense of adventure',
  },
];

// Sample themes with their associated images
export const THEMES: { [key in StoryTheme]: string } = {
  space:
    'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  ocean:
    'https://images.pexels.com/photos/616846/pexels-photo-616846.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  forest:
    'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  castle:
    'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  safari:
    'https://images.pexels.com/photos/60692/wild-animals-africa-wildlife-nature-60692.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
};

// Sample styles with their descriptions
export const STYLES: { [key in StoryStyle]: string } = {
  adventure: 'Exciting journeys and discovery',
  mystery: 'Solve puzzles and find hidden secrets',
  comedy: 'Funny situations and silly jokes',
  fantasy: 'Magic and extraordinary worlds',
  educational: 'Learn new things about the world',
};

const StoryContext = createContext<StoryContextType | undefined>(undefined);

// Mock data for demo
const MOCK_STORIES: Story[] = [
  {
    id: '1',
    title: 'そらは どうして あおいの？',
    theme: 'space',
    style: 'adventure',
    character: CHARACTERS[0],
    pages: [
      {
        id: '1',
        content: 'そらは どうして あおいの？',
        imageUrl: require('../assets/images/sample_01/ワンダーの空_01.png'),
      },
      {
        id: '2',
        content:
          'おはよう。ソラ は そら を みあげた。あおい ね。なぜ あおい の？',
        imageUrl: require('../assets/images/sample_01/ワンダーの空_02.png'),
      },
      {
        id: '3',
        content:
          'ふわふわ くも の フワ が あらわれた。「れっしゃ に のろう」 と ささやく。ソラ は わくわく。',
        imageUrl: require('../assets/images/sample_01/ワンダーの空_03.png'),
      },
      {
        id: '4',
        content:
          'れっしゃ ごーっ！まど が きらきら。あか・みどり・あお の ひかり が くるくる。',
        imageUrl: require('../assets/images/sample_01/ワンダーの空_04.png'),
      },
      {
        id: '5',
        content:
          'フワ が いう。「あおい ひかり は とおく まで とべるよ」だから そら は あおいんだね！ソラ にこにこ。',
        imageUrl: require('../assets/images/sample_01/ワンダーの空_05.png'),
      },
      {
        id: '6',
        content:
          'ゆうやけ そら が まっかっか。ソラ は きょとん。「どうして こんど は あかい の？」',
        imageUrl: require('../assets/images/sample_01/ワンダーの空_06.png'),
      },
      {
        id: '7',
        content: 'つぎ は きみ の「なぜ？」 を さがそう！',
        imageUrl: require('../assets/images/sample_01/ワンダーの空_07.png'),
      },
    ],
    createdAt: new Date().toISOString(),
    childId: '1',
  },
  {
    id: '2',
    title: 'Ocean Mystery',
    theme: 'ocean',
    style: 'mystery',
    character: CHARACTERS[3],
    pages: [
      {
        id: '1',
        content:
          'Bubbles found a mysterious treasure chest at the bottom of the sea.',
        imageUrl: require('../assets/images/sample_01/ワンダーの空_02.png'),
      },
    ],
    createdAt: new Date().toISOString(),
    childId: '1',
  },
];

export const StoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);

  const createStory = (
    title: string,
    theme: StoryTheme,
    style: StoryStyle,
    character: Character,
    childId: string
  ) => {
    const newStory: Story = {
      id: Date.now().toString(),
      title,
      theme,
      style,
      character,
      pages: [],
      createdAt: new Date().toISOString(),
      childId,
    };

    setStories([...stories, newStory]);
    setCurrentStory(newStory);
  };

  const loadStory = (storyId: string) => {
    const story = stories.find((s) => s.id === storyId) || null;
    setCurrentStory(story);
    return story;
  };

  const updateStory = (updatedStory: Story) => {
    setStories(
      stories.map((story) =>
        story.id === updatedStory.id ? updatedStory : story
      )
    );

    if (currentStory?.id === updatedStory.id) {
      setCurrentStory(updatedStory);
    }
  };

  const deleteStory = (storyId: string) => {
    setStories(stories.filter((story) => story.id !== storyId));

    if (currentStory?.id === storyId) {
      setCurrentStory(null);
    }
  };

  const addPage = (
    storyId: string,
    content: string,
    imageUrl: string,
    choices?: string[]
  ) => {
    const story = stories.find((s) => s.id === storyId);

    if (story) {
      const newPage: StoryPage = {
        id: Date.now().toString(),
        content,
        imageUrl,
        choices,
      };

      const updatedStory = {
        ...story,
        pages: [...story.pages, newPage],
      };

      updateStory(updatedStory);
    }
  };

  return (
    <StoryContext.Provider
      value={{
        stories,
        currentStory,
        createStory,
        loadStory,
        updateStory,
        deleteStory,
        addPage,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = (): StoryContextType => {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};
