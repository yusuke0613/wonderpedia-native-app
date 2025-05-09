import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { LogOut, User, Bell, Volume2, CircleHelp as HelpCircle, Lock, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const { user, logout, selectedChild } = useAuth();
  
  const [notifications, setNotifications] = useState(true);
  const [autoRead, setAutoRead] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [parentMode, setParentMode] = useState(false);
  
  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('Are you sure you want to log out?');
      if (confirmLogout) {
        logout();
        router.replace('/auth/login');
      }
    } else {
      Alert.alert(
        'Confirm Logout',
        'Are you sure you want to log out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Logout', 
            style: 'destructive',
            onPress: () => {
              logout();
              router.replace('/auth/login');
            }
          }
        ]
      );
    }
  };
  
  const testVoice = () => {
    if (Platform.OS === 'web' && !Speech.isAvailableAsync()) {
      alert('Speech is not available in this browser');
      return;
    }
    
    Speech.speak('Hello! This is a test of the text to speech feature.', {
      language: 'en',
      pitch: 1.0,
      rate: 0.8,
    });
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        {selectedChild && (
          <Text style={styles.subtitle}>
            {user?.isParent ? `Managing ${selectedChild.name}'s profile` : 'Your profile'}
          </Text>
        )}
      </View>
      
      <Animated.View entering={FadeIn} style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <User size={20} color={Colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Profile</Text>
            <Text style={styles.settingValue}>{user?.email}</Text>
          </View>
          <ChevronRight size={20} color={Colors.lightGray} />
        </TouchableOpacity>
        
        {user?.isParent && (
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Lock size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Parental Controls</Text>
              <Text style={styles.settingValue}>Manage access and restrictions</Text>
            </View>
            <ChevronRight size={20} color={Colors.lightGray} />
          </TouchableOpacity>
        )}
      </Animated.View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Bell size={20} color={Colors.secondary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingValue}>Receive app notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: Colors.lightGray, true: Colors.primaryLight }}
            thumbColor={notifications ? Colors.primary : Colors.white}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Volume2 size={20} color={Colors.secondary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Auto Read</Text>
            <Text style={styles.settingValue}>Read character messages aloud</Text>
          </View>
          <Switch
            value={autoRead}
            onValueChange={setAutoRead}
            trackColor={{ false: Colors.lightGray, true: Colors.primaryLight }}
            thumbColor={autoRead ? Colors.primary : Colors.white}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={testVoice}
        >
          <View style={styles.settingIcon}>
            <Volume2 size={20} color={Colors.secondary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Test Voice</Text>
            <Text style={styles.settingValue}>Check text-to-speech functionality</Text>
          </View>
          <ChevronRight size={20} color={Colors.lightGray} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help & Support</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <HelpCircle size={20} color={Colors.accent} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Help Center</Text>
            <Text style={styles.settingValue}>FAQs and tutorials</Text>
          </View>
          <ChevronRight size={20} color={Colors.lightGray} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <HelpCircle size={20} color={Colors.accent} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Contact Support</Text>
            <Text style={styles.settingValue}>Get help with issues</Text>
          </View>
          <ChevronRight size={20} color={Colors.lightGray} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <LogOut size={20} color={Colors.white} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 28,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 14,
    color: Colors.darkGray,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBackground,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 2,
  },
  settingValue: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 12,
    color: Colors.darkGray,
  },
  logoutButton: {
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: Colors.error,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoutText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  versionText: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 12,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: 24,
  },
});