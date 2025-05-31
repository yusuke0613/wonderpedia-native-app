import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface StoryPage {
  content: string;
  imageUrl: any;
}

interface StoryPageViewProps {
  page: StoryPage;
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const StoryPageView: React.FC<StoryPageViewProps> = ({
  page,
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) => {
  return (
    <View style={styles.pageContainer}>
      <View style={styles.fullImageContainer}>
        <Image
          source={page.imageUrl}
          style={styles.fullPageImage}
          resizeMode="contain"
        />

        <View style={styles.overlayTextContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.overlayPageText}>{page.content || ''}</Text>
          </ScrollView>
        </View>

        <View style={styles.navigationOverlayContainer}>
          <TouchableOpacity
            style={[
              styles.overlayNavButton,
              currentPage === 0 && styles.navButtonDisabled,
            ]}
            onPress={onPrevious}
            disabled={currentPage === 0}
            activeOpacity={0.7}
          >
            <ChevronLeft
              size={24}
              color={currentPage === 0 ? '#aaa' : '#fff'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.overlayNavButton,
              currentPage === totalPages - 1 && styles.navButtonDisabled,
            ]}
            onPress={onNext}
            disabled={currentPage === totalPages - 1}
            activeOpacity={0.7}
          >
            <ChevronRight
              size={24}
              color={currentPage === totalPages - 1 ? '#aaa' : '#fff'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  fullImageContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
  },
  fullPageImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  overlayTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  overlayPageText: {
    fontSize: 17,
    lineHeight: 26,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  navigationOverlayContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  overlayNavButton: {
    padding: 12,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
});
