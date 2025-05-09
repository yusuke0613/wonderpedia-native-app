import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import { useStory, Story } from '@/context/StoryContext';
import Colors from '@/constants/Colors';
import { Book, Star, ChartPie as PieChart, Lightbulb, ArrowRight, Clock } from 'lucide-react-native';

interface Interest {
  name: string;
  count: number;
  percentage: number;
}

interface Activity {
  title: string;
  description: string;
  type: 'outdoor' | 'book' | 'craft' | 'museum';
  imageUrl: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);
const { width } = Dimensions.get('window');

// Mock data for interests
const mockInterests: Interest[] = [
  { name: 'Space', count: 5, percentage: 28 },
  { name: 'Animals', count: 4, percentage: 22 },
  { name: 'Science', count: 3, percentage: 17 },
  { name: 'Dinosaurs', count: 3, percentage: 17 },
  { name: 'Oceans', count: 2, percentage: 11 },
  { name: 'Fantasy', count: 1, percentage: 5 },
];

// Mock data for recommended activities
const mockActivities: Activity[] = [
  {
    title: 'Visit a Planetarium',
    description: 'Explore the stars and planets at your local planetarium',
    type: 'museum',
    imageUrl: 'https://images.pexels.com/photos/1434608/pexels-photo-1434608.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Read "The Magic School Bus"',
    description: 'A fun book series about science adventures',
    type: 'book',
    imageUrl: 'https://images.pexels.com/photos/3696663/pexels-photo-3696663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Nature Scavenger Hunt',
    description: 'Find and identify different plants and animals',
    type: 'outdoor',
    imageUrl: 'https://images.pexels.com/photos/6936382/pexels-photo-6936382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Make a Volcano',
    description: 'Create a baking soda and vinegar volcano eruption',
    type: 'craft',
    imageUrl: 'https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
];

// Mock data for recent activity
const getRecentActivity = (stories: Story[]) => {
  if (stories.length === 0) return [];
  
  // Sort by date (newest first)
  const sortedStories = [...stories].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return sortedStories.slice(0, 3);
};

export default function ParentDashboardScreen() {
  const { user, children, selectedChild } = useAuth();
  const { stories } = useStory();
  const [activeTab, setActiveTab] = useState<'insights' | 'activities'>('insights');
  
  if (!user?.isParent) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Parent access only</Text>
      </View>
    );
  }
  
  if (!selectedChild) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please select a child profile first</Text>
      </View>
    );
  }
  
  const childStories = stories.filter(story => story.childId === selectedChild.id);
  const recentActivity = getRecentActivity(childStories);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {selectedChild.name}'s Dashboard
        </Text>
        <Text style={styles.subGreeting}>
          Track your child's progress and interests
        </Text>
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'insights' && styles.activeTab]}
          onPress={() => setActiveTab('insights')}
        >
          <PieChart size={16} color={activeTab === 'insights' ? Colors.primary : Colors.darkGray} />
          <Text style={[styles.tabText, activeTab === 'insights' && styles.activeTabText]}>
            Insights
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'activities' && styles.activeTab]}
          onPress={() => setActiveTab('activities')}
        >
          <Lightbulb size={16} color={activeTab === 'activities' ? Colors.primary : Colors.darkGray} />
          <Text style={[styles.tabText, activeTab === 'activities' && styles.activeTabText]}>
            Recommended
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {activeTab === 'insights' ? (
          <>
            {/* Recent Activity Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              
              {recentActivity.length > 0 ? (
                recentActivity.map((story, index) => (
                  <AnimatedView
                    key={story.id}
                    entering={FadeInDown.delay(100 * index).springify()}
                    style={styles.activityItem}
                  >
                    <Image
                      source={{ uri: story.character.imageUrl }}
                      style={styles.activityImage}
                    />
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityTitle}>{story.title}</Text>
                      <Text style={styles.activityMeta}>
                        {story.theme} • {story.style}
                      </Text>
                      <View style={styles.activityDate}>
                        <Clock size={12} color={Colors.darkGray} />
                        <Text style={styles.dateText}>
                          {formatDate(story.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </AnimatedView>
                ))
              ) : (
                <Text style={styles.emptyText}>No recent activity</Text>
              )}
            </View>
            
            {/* Interests Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Top Interests</Text>
              
              {mockInterests.map((interest, index) => (
                <AnimatedView
                  key={interest.name}
                  entering={FadeInRight.delay(100 * index).springify()}
                  style={styles.interestItem}
                >
                  <View style={styles.interestInfo}>
                    <Text style={styles.interestName}>{interest.name}</Text>
                    <Text style={styles.interestCount}>
                      {interest.count} {interest.count === 1 ? 'story' : 'stories'}
                    </Text>
                  </View>
                  
                  <View style={styles.interestBarContainer}>
                    <View 
                      style={[
                        styles.interestBar,
                        { width: `${interest.percentage}%` }
                      ]}
                    />
                    <Text style={styles.interestPercentage}>
                      {interest.percentage}%
                    </Text>
                  </View>
                </AnimatedView>
              ))}
            </View>
            
            {/* Usage Stats Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Usage Stats</Text>
              
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Book size={24} color={Colors.primary} />
                  <Text style={styles.statValue}>{childStories.length}</Text>
                  <Text style={styles.statLabel}>Stories Created</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Star size={24} color={Colors.secondary} />
                  <Text style={styles.statValue}>
                    {childStories.reduce((total, story) => total + story.pages.length, 0)}
                  </Text>
                  <Text style={styles.statLabel}>Pages Created</Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommended Activities</Text>
            
            {mockActivities.map((activity, index) => (
              <AnimatedView
                key={activity.title}
                entering={FadeInDown.delay(100 * index).springify()}
                style={styles.recommendedItem}
              >
                <Image
                  source={{ uri: activity.imageUrl }}
                  style={styles.recommendedImage}
                />
                
                <View style={styles.recommendedContent}>
                  <View style={styles.recommendedHeader}>
                    <Text style={styles.recommendedTitle}>{activity.title}</Text>
                    <View style={[
                      styles.recommendedType,
                      activity.type === 'outdoor' && styles.typeOutdoor,
                      activity.type === 'book' && styles.typeBook,
                      activity.type === 'craft' && styles.typeCraft,
                      activity.type === 'museum' && styles.typeMuseum,
                    ]}>
                      <Text style={styles.recommendedTypeText}>
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.recommendedDescription}>
                    {activity.description}
                  </Text>
                  
                  <TouchableOpacity style={styles.recommendedAction}>
                    <Text style={styles.recommendedActionText}>Learn More</Text>
                    <ArrowRight size={14} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </AnimatedView>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  message: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontFamily: 'Nunito-Bold',
    fontSize: 24,
    color: Colors.text,
  },
  subGreeting: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: Colors.darkGray,
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  activeTab: {
    backgroundColor: Colors.primaryLight,
  },
  tabText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: Colors.darkGray,
    marginLeft: 6,
  },
  activeTabText: {
    color: Colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    marginBottom: 12,
  },
  emptyText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: Colors.darkGray,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  activityImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
  },
  activityMeta: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 2,
  },
  activityDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  dateText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: Colors.darkGray,
    marginLeft: 4,
  },
  interestItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  interestInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  interestName: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
  },
  interestCount: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: Colors.darkGray,
  },
  interestBarContainer: {
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  interestBar: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 4,
  },
  interestPercentage: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 10,
    color: Colors.darkGray,
    position: 'absolute',
    right: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: width * 0.43,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Nunito-Bold',
    fontSize: 28,
    marginVertical: 8,
  },
  statLabel: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: Colors.darkGray,
  },
  recommendedItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  recommendedImage: {
    width: '100%',
    height: 140,
  },
  recommendedContent: {
    padding: 12,
  },
  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendedTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    flex: 1,
    marginRight: 8,
  },
  recommendedType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
  },
  typeOutdoor: {
    backgroundColor: '#E3F9E5',
  },
  typeBook: {
    backgroundColor: '#E0F2FE',
  },
  typeCraft: {
    backgroundColor: '#FFE2D9',
  },
  typeMuseum: {
    backgroundColor: '#F3E8FF',
  },
  recommendedTypeText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: Colors.primary,
  },
  recommendedDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 12,
  },
  recommendedAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedActionText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: Colors.primary,
    marginRight: 4,
  },
});