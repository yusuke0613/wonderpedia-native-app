import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type User = {
  id: string;
  email: string;
  isParent: boolean;
};

type Child = {
  id: string;
  name: string;
  age: number;
  avatar: string;
};

type AuthContextType = {
  user: User | null;
  children: Child[];
  selectedChild: Child | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  selectChild: (child: Child) => void;
  addChild: (name: string, age: number, avatar: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// For web, we'll use localStorage instead of SecureStore
const tokenStorage = {
  async getItem(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return await SecureStore.setItemAsync(key, value);
  },
  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return await SecureStore.deleteItemAsync(key);
  }
};

// Mock data for demo
const MOCK_CHILDREN: Child[] = [
  { id: '1', name: 'Mia', age: 5, avatar: 'girl' },
  { id: '2', name: 'Noah', age: 7, avatar: 'boy' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [childProfiles, setChildProfiles] = useState<Child[]>(MOCK_CHILDREN);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on startup
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJSON = await tokenStorage.getItem('user');
        if (userJSON) {
          const parsedUser = JSON.parse(userJSON);
          setUser(parsedUser);
          
          // Load child profiles
          const childJSON = await tokenStorage.getItem('children');
          if (childJSON) {
            setChildProfiles(JSON.parse(childJSON));
          } else {
            // Save mock data
            await tokenStorage.setItem('children', JSON.stringify(MOCK_CHILDREN));
          }
          
          // Set first child as selected by default
          if (childProfiles.length > 0 && !selectedChild) {
            setSelectedChild(childProfiles[0]);
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock API call - in real app, would be a Supabase auth call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock successful login
      const mockUser = { id: '123', email, isParent: true };
      await tokenStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Set first child as selected by default if available
      if (childProfiles.length > 0) {
        setSelectedChild(childProfiles[0]);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock API call - in real app, would be a Supabase auth call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock successful registration
      const mockUser = { id: '123', email, isParent: true };
      await tokenStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await tokenStorage.removeItem('user');
      setUser(null);
      setSelectedChild(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectChild = (child: Child) => {
    setSelectedChild(child);
  };

  const addChild = async (name: string, age: number, avatar: string) => {
    try {
      const newChild: Child = {
        id: Date.now().toString(),
        name,
        age,
        avatar
      };
      
      const updatedChildren = [...childProfiles, newChild];
      setChildProfiles(updatedChildren);
      
      // Save to storage
      await tokenStorage.setItem('children', JSON.stringify(updatedChildren));
      
      // Select the newly created child
      setSelectedChild(newChild);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Add child failed:', error);
      return Promise.reject('Failed to add child');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        children: childProfiles,
        selectedChild,
        isLoading,
        login,
        logout,
        register,
        selectChild,
        addChild
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};