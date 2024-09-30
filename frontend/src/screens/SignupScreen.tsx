import React, { useState } from 'react';
import { Button, Alert, View, TextInput, StyleSheet } from 'react-native';
import { API_URL } from '@env';

interface Props {
    navigation: {
        navigate: (screen: string) => void;
    };
};

const SignupScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

const handleSignup = async () => {
    if (!username || !password || !email) {
      Alert.alert('Error', 'Username, Email and Password are required');
      return;
    }
    
    try {
        const response = await fetch(`${API_URL}user/register`, {
            method : 'POST',
            headers : {'Content-Type': 'application/json'},
            body : JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        console.log(response);
        if (response.ok) {
            Alert.alert(`${data.status}`, `Token: ${data.token}`);
            navigation.navigate('Login');
        } else {
            Alert.alert('Signup Failed!', data.error)
        }
    } catch (err) {
        console.log(err);
        Alert.alert('Error', 'Something went wrong, please try again.');
    }
};

return (
  <View style={styles.container}>
  <TextInput
    style={styles.input}
    placeholder="Username"
    placeholderTextColor="#6B7280"
    value={username}
    onChangeText={setUsername}
  />
  <TextInput
    style={styles.input}
    placeholder="Email"
    placeholderTextColor="#6B7280"
    value={email}
    onChangeText={setEmail}
    keyboardType="email-address"
  />
  <TextInput
    style={styles.input}
    placeholder="Password"
    placeholderTextColor="#6B7280"
    value={password}
    onChangeText={setPassword}
    secureTextEntry
  />
  <Button title="Sign Up" onPress={handleSignup} />
</View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,                 
    justifyContent: 'center', 
    alignItems: 'center',     
    padding: 16,               
    backgroundColor: '#f3f4f6', 
  },
  input: {
    borderWidth: 1,           
    borderColor: '#d1d5db',   
    borderRadius: 4,          
    padding: 8,               
    marginBottom: 12,         
    width: 256,               
    color: '#374151'
  },
});

export default SignupScreen;