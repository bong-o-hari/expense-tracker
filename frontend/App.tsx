import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from '../frontend/src/screens/SignupScreen'; // Import the SignupScreen
// import LoginScreen from './frontend/screens/LoginScreen';   // Import LoginScreen (assuming you have it)

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signup">
        <Stack.Screen name="Signup" component={SignupScreen} />
        {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
