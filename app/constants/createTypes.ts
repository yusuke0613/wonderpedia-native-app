export interface CreateType {
  id: string;
  title: string;
  subtitle: string;
  placeholder: string;
  icon: string;
  iconFamily: 'ionicons' | 'material' | 'fontawesome';
  colors: [string, string];
  bgColors: [string, string, string];
  emoji: string;
}

export const createTypes: Record<string, CreateType> = {
  '1': {
    id: '1',
    title: 'なぜ？なに？',
    subtitle: 'ふしぎに おもったことを きいてみよう！',
    placeholder: 'どうして そらは あおいの？\nなんで あめが ふるの？',
    icon: 'help-circle',
    iconFamily: 'ionicons',
    colors: ['#C084FC', '#A855F7'],
    bgColors: ['#EDE9FE', '#DDD6FE', '#C4B5FD'],
    emoji: '❓',
  },
  '2': {
    id: '2',
    title: 'おはなしつくる',
    subtitle: 'すきな おはなしを かんがえよう！',
    placeholder: 'まほうの もりで ぼうけん！\nそらとぶ ねこの おはなし',
    icon: 'star-magic',
    iconFamily: 'material',
    colors: ['#F472B6', '#EC4899'],
    bgColors: ['#FCE7F3', '#FBCFE8', '#F9A8D4'],
    emoji: '✨',
  },
  '3': {
    id: '3',
    title: '教えたいことをえほんにする',
    subtitle: 'たいせつなことを えほんに しよう！',
    placeholder: 'はみがきの たいせつさ\nともだちと なかよくする ほうほう',
    icon: 'graduation-cap',
    iconFamily: 'fontawesome',
    colors: ['#9333EA', '#7C3AED'],
    bgColors: ['#EDE9FE', '#DDD6FE', '#C4B5FD'],
    emoji: '👨‍👩‍👧‍👦',
  },
};
