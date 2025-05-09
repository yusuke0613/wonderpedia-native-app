import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { Link } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    try {
      setError('');
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.logoContainer}>
        <Image
          source={{ 
            uri: 'https://images.pexels.com/photos/6936382/pexels-photo-6936382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          }}
          style={styles.backgroundImage}
        />
        <View style={styles.overlay} />
        <Animated.Image
          entering={FadeInDown.delay(200).springify()}
          source={{ 
            uri: 'https://images.pexels.com/photos/1139613/pexels-photo-1139613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' 
          }}
          style={styles.logo}
        />
        <Animated.Text
          entering={FadeInDown.delay(400).springify()}
          style={styles.appName}
        >
          StoryPals
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(600).springify()}
          style={styles.appTagline}
        >
          Where imagination comes to life
        </Animated.Text>
      </View>

      <Animated.View
        entering={FadeInDown.delay(800).springify()}
        style={styles.formContainer}
      >
        <Text style={styles.title}>Welcome Back</Text>
        
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.loginButtonText}>Log In</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/auth/register" asChild>
            <TouchableOpacity>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  logoContainer: {
    height: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 16,
  },
  appName: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 36,
    color: Colors.white,
    textAlign: 'center',
  },
  appTagline: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 16,
    color: Colors.white,
    marginTop: 8,
  },
  formContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'ComicNeue-Regular',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    fontFamily: 'ComicNeue-Bold',
    color: Colors.white,
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 14,
  },
  registerLink: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 14,
    color: Colors.primary,
  },
});