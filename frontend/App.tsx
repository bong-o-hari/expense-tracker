import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from '../frontend/src/screens/SignupScreen';
import LoginScreen from '../frontend/src/screens/LoginScreen';
import HomeScreen from '../frontend/src/screens/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const App: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setInitialRoute('Home'); // If token exists, navigate to Home
        } else {
          setInitialRoute('Login'); // Otherwise, navigate to Login
        }
      } catch (error) {
        console.error('Error reading token from AsyncStorage:', error);
      } finally {
        setLoading(false); // Ensure loading state is set to false
      }
    };

    checkToken();
  }, []);

  if (loading) {
    // Render a loading screen or activity indicator while determining the initial route
    return null; // or <ActivityIndicator size="large" color="#0000ff" />
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute || 'Login'}>
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;
