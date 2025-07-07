import { StoryViewer } from './components/story/StoryViewer';
import { wonderSkyStory } from './data/stories/wonder-sky';
import { sleepBearStory } from './data/stories/sleep-bear';
import { useLocalSearchParams } from 'expo-router';
import type { StoryPage } from './data/stories/wonder-sky';

export default function StoryViewerScreen() {
  const params = useLocalSearchParams();
  const { title, pages: pagesParam, fromMiniGame, fromTeaching } = params;

  // Parse pages from params if available
  let pages: StoryPage[] = wonderSkyStory;
  let storyTitle = 'ワンダーの空';

  // 絵本生成フロー（ミニゲームまたは教えたいことから来た場合）はsleep-bearストーリーを使用
  if (fromMiniGame === 'true' || fromTeaching === 'true') {
    pages = sleepBearStory;
    storyTitle = 'おやすみ、くまくん！ ねむねむパワーで だいへんしん！';
  } else if (pagesParam && typeof pagesParam === 'string') {
    try {
      pages = JSON.parse(pagesParam);
    } catch (e) {
      console.error('Failed to parse pages:', e);
    }
  }

  if (title && typeof title === 'string') {
    storyTitle = title;
  }

  return <StoryViewer pages={pages} title={storyTitle} fromMiniGame={fromMiniGame === 'true' || fromTeaching === 'true'} />;
}
