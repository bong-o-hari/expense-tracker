import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const fetchCategories = async () => {
  const token = await AsyncStorage.getItem('@auth_token');
  const response = await fetch(`${API_URL}process/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  return response.json();
};

export const submitCategory = async (categoryName: string) => {
  const token = await AsyncStorage.getItem('@auth_token');
  const response = await fetch(`${API_URL}process/category/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      category_name: categoryName,
    }),
  });
  return response.json();
};

export const fetchExpenses = async (selectedMonth: string, selectedYear: string) => {
  const token = await AsyncStorage.getItem('@auth_token');
  const response = await fetch(`${API_URL}process/expenses?year=${selectedYear}&month=${selectedMonth}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export const submitExpense = async (expenseData: { category_id?: number, amount: number, description?: string, expense_date?: string }) => {
  const token = await AsyncStorage.getItem('@auth_token');
  const response = await fetch(`${API_URL}process/expense/new`, {
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
  const response = await fetch(`${API_URL}process/expense?id=${expenseId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  return response.json();
};

export const fetchIncomes = async (selectedMonth: string, selectedYear: string) => {
  const token = await AsyncStorage.getItem('@auth_token');
  const response = await fetch(`${API_URL}process/incomes?year=${selectedYear}&month=${selectedMonth}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export const submitIncome = async (incomeData: { amount: number, income_date?: string, source?: string }) => {
  const token = await AsyncStorage.getItem('@auth_token');
  const response = await fetch(`${API_URL}process/income/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(incomeData)
  });
  return response.json();
};

export const deleteIncome = async (incomeId: string) => {
  const token = await AsyncStorage.getItem('@auth_token');
  const response = await fetch(`${API_URL}process/income?id=${incomeId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};