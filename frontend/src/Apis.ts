import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchExpenses = async () => {
  const token = await AsyncStorage.getItem('@auth_token');
  const response = await fetch(`${API_URL}admin/expenses`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export const fetchCategories = async () => {
  const token = await AsyncStorage.getItem('@auth_token');
  const response = await fetch(`${API_URL}admin/categories`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export const submitExpense = async (expenseData: { category_id: number, amount: number, description: string, expense_date: string }) => {
  const token = await AsyncStorage.getItem('@auth_token');
  const response = await fetch(`${API_URL}admin/expense/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(expenseData)
  });
  return response.json();
};
