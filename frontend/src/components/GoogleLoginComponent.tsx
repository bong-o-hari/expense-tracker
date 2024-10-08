import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { GoogleSignin, statusCodes, SignInResponse } from '@react-native-google-signin/google-signin';
import { API_URL, GOOGLE_CLIENT_ID } from '@env';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Props {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const GoogleLoginButton: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  // Configure Google Signin
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      scopes: ['profile', 'email'],
    });
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Ensure Google Play services are available
      await GoogleSignin.hasPlayServices();

      // Sign in with Google
      const userInfo: SignInResponse = await GoogleSignin.signIn();

      // Get the ID token and user information from Google login
      const idToken = userInfo.data?.idToken; // Directly use idToken from userInfo

      // Send the token to the backend to exchange for a server-side session token
      const response = await fetch(`${API_URL}user/google/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await response.json();
      if (response.ok) {
        // Save token and navigate to Home
        const token = data.token;
        await AsyncStorage.setItem('@auth_token', token);
        navigation.navigate('Home');
      } else {
        Alert.alert('Login Failed!');
      }
    } catch (error) {
      const err = error as { code: string };
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Login cancelled');
      } else if (err.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign in already in progress');
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Google Play Services not available');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleGoogleLogin}
      disabled={loading}
    >
      <View style={styles.buttonContent}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Icon name="google" size={24} />
            <Text style={styles.buttonText}>Use Google</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default GoogleLoginButton;
