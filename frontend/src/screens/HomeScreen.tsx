import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import ExpenseItem from '../components/ExpenseComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

interface Category {
  id: number;
  category_name: string;
}

interface Expense {
  id: number;
  category: Category;
  amount: number;
  expense_date: string;
  description: string;
}

interface ApiResponse {
  data: Expense[];
  message: string;
}

const HomeScreen: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchExpenses = async () => {
    try {
      const token = await AsyncStorage.getItem('@auth_token')
      const response = await fetch(`${API_URL}admin/expenses`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data: ApiResponse = await response.json();
        setExpenses(data.data);
        setLoading(false);
      } else {
        let res = await response.json()
        console.log(res);
        Alert.alert('Error', 'Something went wrong, please try again.');
      }
    } catch (error) {
      console.error('Failed to fetch expenses', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expenses List</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ExpenseItem expense={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'black'
  },
});

export default HomeScreen;
