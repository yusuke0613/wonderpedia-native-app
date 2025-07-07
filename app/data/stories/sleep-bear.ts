export interface StoryPage {
  id: number;
  text: string;
  image: any;
}

export const sleepBearStory: StoryPage[] = [
  {
    id: 1,
    text: 'おやすみ、くまくん！ ねむねむパワーで だいへんしん！',
    image: require('../../../assets/images/sample_02/sample_02_01.png'),
  },
  {
    id: 2,
    text: '夜になっても、くまくんはお気に入りの木の実やどんぐりで遊んでいます。「まだ ねむくないもん！」と言って、お部屋にはおもちゃが散らかっています。',
    image: require('../../../assets/images/sample_02/sample_02_02.png'),
  },
  {
    id: 3,
    text: 'すると、ポワーンと優しい光とともに、ふわふわの羊の「ねむねむ博士」が現れます。くまくんはびっくりして博士を見ています。',
    image: require('../../../assets/images/sample_02/sample_02_03.png'),
  },
  {
    id: 4,
    text: '博士が魔法のステッキを振ると、くまくんの体は小さくなって、自分の頭の中に吸い込まれていきます。頭の中は、キラキラした道がたくさん走っている不思議な世界です。',
    image: require('../../../assets/images/sample_02/sample_02_04.png'),
  },
  {
    id: 5,
    text: '頭の中では、小さな「おそうじロボット」たちが、昼間のうちにたまった頭のゴミ（黒いモヤモヤ）を一生懸命お掃除しています。',
    image: require('../../../assets/images/sample_02/sample_02_05.png'),
  },
  {
    id: 6,
    text: '次にやってきたのは体の筋肉の中。くたくたに疲れた筋肉に、「げんきチャージ隊」がキラキラのエネルギーをどんどん注いでいます。',
    image: require('../../../assets/images/sample_02/sample_02_06.png'),
  },
  {
    id: 7,
    text: 'そして これが、おおきくなーれパワー！ねている あいだに、からだも こころも、ぐんぐん せいちょう してます',
    image: require('../../../assets/images/sample_02/sample_02_07.png'),
  },
  {
    id: 8,
    text: '博士の話を聞いて、くまくんは納得した表情。「そうか！寝るのって、すごいことなんだね！」と、くまくんと博士がにっこり笑いあっています。',
    image: require('../../../assets/images/sample_02/sample_02_08.png'),
  },
  {
    id: 9,
    text: 'くまくんは自分からベッドに入り、にこにこしながら目を閉じています。枕元では、小さくなったねむねむ博士が優しく見守っています。',
    image: require('../../../assets/images/sample_02/sample_02_09.png'),
  },
  {
    id: 10,
    text: 'おやすみなさい、くまくん。いい ゆめ みてね。',
    image: require('../../../assets/images/sample_02/sample_02_10.png'),
  },
];

export const sleepBearBook = {
  id: 'sleep-bear',
  title: 'おやすみ、くまくん！ ねむねむパワーで だいへんしん！',
  coverImage: require('../../../assets/images/sample_02/sample_02_01.png'),
  pages: sleepBearStory,
  createdAt: new Date().toISOString(),
};
