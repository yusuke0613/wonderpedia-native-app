import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PARENTAL_LOCK_KEY = 'parental_lock_status';
const LOCK_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useParentalLock = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);

  useEffect(() => {
    checkLockStatus();
  }, []);

  const checkLockStatus = async () => {
    try {
      const lockData = await AsyncStorage.getItem(PARENTAL_LOCK_KEY);
      if (lockData) {
        const { timestamp } = JSON.parse(lockData);
        const now = Date.now();
        
        // Check if lock has expired (30 minutes)
        if (now - timestamp < LOCK_DURATION) {
          setIsUnlocked(true);
        } else {
          // Lock has expired, remove from storage
          await AsyncStorage.removeItem(PARENTAL_LOCK_KEY);
          setIsUnlocked(false);
        }
      }
    } catch (error) {
      console.error('Error checking parental lock status:', error);
      setIsUnlocked(false);
    }
  };

  const requestAccess = () => {
    if (isUnlocked) {
      return true;
    }
    setShowLockModal(true);
    return false;
  };

  const handleLockSuccess = async () => {
    try {
      const lockData = {
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(PARENTAL_LOCK_KEY, JSON.stringify(lockData));
      setIsUnlocked(true);
      setShowLockModal(false);
    } catch (error) {
      console.error('Error saving parental lock status:', error);
    }
  };

  const handleLockCancel = () => {
    setShowLockModal(false);
  };

  const lockParentalAccess = async () => {
    try {
      await AsyncStorage.removeItem(PARENTAL_LOCK_KEY);
      setIsUnlocked(false);
    } catch (error) {
      console.error('Error locking parental access:', error);
    }
  };

  return {
    isUnlocked,
    showLockModal,
    requestAccess,
    handleLockSuccess,
    handleLockCancel,
    lockParentalAccess,
  };
};