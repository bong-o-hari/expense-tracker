import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ExpenseItem from '../components/ExpenseComponent';
import ExpenseModal from '../components/AddExpenseModal';
import { fetchExpenses, fetchCategories, submitExpense, deleteExpense } from '../Apis';

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
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const months = [
    { label: 'January', value: '1' },
    { label: 'February', value: '2' },
    { label: 'March', value: '3' },
    { label: 'April', value: '4' },
    { label: 'May', value: '5' },
    { label: 'June', value: '6' },
    { label: 'July', value: '7' },
    { label: 'August', value: '8' },
    { label: 'September', value: '9' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
  ];

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { label: year.toString(), value: year.toString() };
  });

  useEffect(() => {
    const loadExpenses = async () => {
      const response = await fetchExpenses(selectedMonth, selectedYear);
      setExpenses(response.data);
    };

    const loadCategories = async () => {
      const response = await fetchCategories();
      setCategories(response.data);
    };

    loadExpenses();
    loadCategories();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const submitExpenseOnChange = async () => {
      if (newExpense.category_id != 0) {
        await submitExpense(newExpense);
        const response = await fetchExpenses(selectedMonth, selectedYear);
        setExpenses(response.data);
      }
    };
    submitExpenseOnChange();
  }, [newExpense]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchExpenses(selectedMonth, selectedYear).then((expenses) => {
      setExpenses(expenses.data);
      setRefreshing(false);
    });
  }, [selectedMonth, selectedYear]);

  const handleAddExpense = async (expense: { category_id: number, amount: number, description: string, expense_date: string }) => {
    try {
      setNewExpense(expense);
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleDeleteExpense = async (expenseId: number) => {
    try {
      await deleteExpense(expenseId);
      const response = await fetchExpenses(selectedMonth, selectedYear);
      setExpenses(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={styles.pickerContainer}>
        {/* Month Dropdown */}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedMonth}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}>
            {months.map(month => (
              <Picker.Item key={month.value} label={month.label} value={month.value} />
            ))}
          </Picker>
        </View>

        {/* Year Dropdown */}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedYear}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}>
            {years.map(year => (
              <Picker.Item key={year.value} label={year.label} value={year.value} />
            ))}
          </Picker>
        </View>

        {/* Add Expense Button */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'gray' }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Expenses List */}
      <FlatList
        data={expenses}
        renderItem={({ item }) => <ExpenseItem expense={item} />}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      {/* Add Expense Modal */}
      <ExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddExpense}
        categories={categories}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  pickerWrapper: {
    borderWidth: 2,
    borderRadius: 5,
    marginRight: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: 150,
    color: 'purple',
    backgroundColor: '#EAEAEA',
  },
});

export default HomeScreen;
