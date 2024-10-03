import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import ExpenseItem from '../components/ExpenseComponent';
import ExpenseModal from '../components/AddExpenseModal';
import { fetchExpenses, fetchCategories, submitExpense } from '../Apis';

interface Expense {
  id: number;
  amount: number;
  description: string;
  expense_date: string;
  category: {
    id: number;
    category_name: string;
  };
}

interface Category {
  id: number;
  category_name: string;
}

const HomeScreen: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newExpense, setNewExpense] = useState({ category_id: 0, amount: 0, description: '', expense_date: '' });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadExpenses = async () => {
      const response = await fetchExpenses();
      setExpenses(response.data);
    };

    const loadCategories = async () => {
      const response = await fetchCategories();
      setCategories(response.data);
    };

    loadExpenses();
    loadCategories();
  }, []);

  useEffect(() => {
    const submitExpenseOnChange = async () => {
      if (newExpense.category_id != 0) {
        await submitExpense(newExpense);
        // Reload expenses after submission
        const response = await fetchExpenses();
        setExpenses(response.data);
      }
    }
    submitExpenseOnChange();
  }, [newExpense]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchExpenses().then((expenses) => {
      setExpenses(expenses.data);
      setRefreshing(false);
    });
  }, []);

  const handleAddExpense = async (expense: { category_id: number, amount: number, description: string, expense_date: string }) => {
    try {
      setNewExpense(expense);
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Header with "+" button */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>Expenses List</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'gray' }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Expenses List */}
      <FlatList
        data={expenses}
        renderItem={({ item }) => <ExpenseItem expense={item} />}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <ExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddExpense}
        categories={categories}
      />
    </View>
  );
};

export default HomeScreen;
