import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ExpenseItemProps {
  expense: {
    id: number;
    category: {
      id: number;
      category_name: string;
    };
    amount: number;
    expense_date: string;
    description: string;
  };
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense }) => {
  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <Text style={styles.category}>Category: {expense.category.category_name}</Text>
        <Text style={styles.description}>Description: {expense.description}</Text>
      </View>
      <View style={styles.amountDate}>
        <Text style={styles.amount}>₹{expense.amount}</Text>
        <Text style={styles.date}>{new Date(expense.expense_date).toDateString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  details: {
    flex: 1,
  },
  amountDate: {
    alignItems: 'flex-end',
  },
  category: {
    fontWeight: 'bold',
    color: 'orange'
  },
  description: {
    color: 'red',
    marginTop: 2,
  },
  amount: {
    color: 'green',
    fontWeight: 'bold',
  },
  date: {
    color: '#888',
    fontSize: 12,
  },
});

export default ExpenseItem;
