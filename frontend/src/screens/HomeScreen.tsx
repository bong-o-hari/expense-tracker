import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ExpenseModal from '../components/AddExpenseModal';
import { fetchExpenses, fetchCategories, fetchIncomes, submitIncome, submitExpense } from '../Apis';

interface Expense {
  id: string;
  amount: number;
  description: string;
  expense_date: string; // Date format should be adjusted as necessary
  category_id: number; // Corresponds to category ID
}

interface Income {
  id: string;
  amount: number;
  source: string;
  income_date: string; // Date format should be adjusted as necessary
}

interface Category {
  id: string;
  category_name: string;
}

// Type guard to check if the item is an Income
const isIncome = (item: Expense | Income): item is Income => {
  return (item as Income).source !== undefined;
};

const HomeScreen: React.FC = () => {
  const [transactions, setTransactions] = useState<(Expense | Income)[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
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

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', { weekday: 'short', day: '2-digit', year: 'numeric' }).format(date);
  };


  useEffect(() => {
    const loadTransactions = async () => {
      const expensesResponse = await fetchExpenses(selectedMonth, selectedYear);
      const incomesResponse = await fetchIncomes(selectedMonth, selectedYear);

      // Handle potential null values
      const sumExpense = expensesResponse.total_expense;
      const expensesData = expensesResponse.data ?? [];
      const sumIncome = incomesResponse.total_income;
      const incomesData = incomesResponse.data ?? [];

      setTotalExpense(sumExpense)
      setTotalIncome(sumIncome)
      setTransactions([...expensesData, ...incomesData]);
    };

    const loadCategories = async () => {
      const response = await fetchCategories();
      setCategories(response.data);
    };

    loadTransactions();
    loadCategories();
  }, [selectedMonth, selectedYear]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Fetch expenses and incomes
    Promise.all([
      fetchExpenses(selectedMonth, selectedYear),
      fetchIncomes(selectedMonth, selectedYear),
    ])
      .then(([expensesResponse, incomesResponse]) => {
        // Handle potential null values
        const sumExpense = expensesResponse.total_expense;
        const expensesData = expensesResponse.data ?? [];
        const sumIncome = incomesResponse.total_income;
        const incomesData = incomesResponse.data ?? [];

        setTotalExpense(sumExpense)
        setTotalIncome(sumIncome)
        setTransactions([...expensesData, ...incomesData]);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  }, [selectedMonth, selectedYear]);

  const handleSubmit = async (data: {
    amount: number;
    description?: string; // Only for expenses
    categoryId?: string; // Only for expenses
    expense_date?: string;
    source?: string; // Only for incomes
    income_date?: string; // Only for incomes
  }) => {
    if (data.source) {
      // Handle income submission
      const response = await submitIncome(data);
    } else {
      // Handle expense submission
      const response = await submitExpense(data);
    }
    setModalVisible(false);
    onRefresh(); // Refresh after submission
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
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryTitle}>EXPENSE</Text>
          <Text style={styles.expenseAmount}>{totalExpense}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryTitle}>INCOME</Text>
          <Text style={styles.incomeAmount}>{totalIncome}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryTitle}>TOTAL</Text>
          <Text
            style={[
              styles.totalAmount,
              { color: (totalIncome - totalExpense) >= 0 ? 'green' : 'red' }
            ]}
          >
            {totalIncome - totalExpense}
          </Text>
        </View>
      </View>

      <FlatList
        data={transactions}
        ListHeaderComponent={() => (
          <Text style={styles.sectionTitle}>Transactions</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.rowContainer}>
              <View style={styles.leftColumn}>
                {isIncome(item) ? (
                  <>
                    <Text style={styles.itemText}>Received from {item.source}</Text>
                    <Text style={styles.dateText}>{formatDate(item.income_date)}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.itemText}>Spent on {item.description}</Text>
                    <Text style={styles.dateText}>{formatDate(item.expense_date)}</Text>
                  </>
                )}
              </View>

              <View style={styles.rightColumn}>
                <Text style={isIncome(item) ? styles.incomeAmount : styles.expenseAmount}>
                  {isIncome(item) ? `+${item.amount}` : `-${item.amount}`}
                </Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />


      {/* Add Expense/Income Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add Expense/Income</Text>
      </TouchableOpacity>

      {/* Add Expense/Income Modal */}
      <ExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'black',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  incomeAmount: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 18,
  },
  expenseAmount: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,
  },
  totalAmount: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 18,
  },
  addButton: {
    backgroundColor: 'purple',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});

export default HomeScreen;
