import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchExpenses = async (selectedMonth: string, selectedYear: string) => {
  const token = await AsyncStorage.getItem('@auth_token');
  const response = await fetch(`${API_URL}admin/expenses?year=${selectedYear}&month=${selectedMonth}`, {
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
  console.log(expenseData)
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

export const deleteExpense = async (expenseId: number) => {
  const token = await AsyncStorage.getItem('@auth_token');
  const response = await fetch(`${API_URL}admin/expense?id=${expenseId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  return response.json();
};
