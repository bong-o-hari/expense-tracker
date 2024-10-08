import React, { useState } from 'react';
import { Button, Alert, View, TextInput, StyleSheet, Text } from 'react-native';
import GoogleLoginButton from '../components/GoogleLoginComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

interface Props {
	navigation: {
		navigate: (screen: string) => void;
	};
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const handleLogin = async () => {
		if (!password || !email) {
			Alert.alert('Error', 'Email and Password are required');
			return;
		}

		try {
			const response = await fetch(`${API_URL}user/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});
			const data = await response.json();
			if (response.ok) {
				const token = data.token;
				// Save the token in AsyncStorage
				await AsyncStorage.setItem('@auth_token', token);
				navigation.navigate('Home');
			} else {
				Alert.alert('Login Failed!', data.error)
			}
		} catch (err) {
			Alert.alert('Error', 'Something went wrong, please try again.');
		}
	};

	return (
		<View style={styles.container}>
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
			<Button title="Log In" onPress={handleLogin} />
			<Text style={styles.text} onPress={() => navigation.navigate('Signup')}>New here? Go to Signup</Text>
			<GoogleLoginButton navigation={navigation} />
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
	text: {
		marginTop: 20,
		color: "gray"
	},
});

export default LoginScreen