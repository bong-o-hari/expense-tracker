import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface ExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (expense: {
    category_id: number;
    amount: number;
    description: string;
    expense_date: string;
  }) => void;
  categories: { id: number; category_name: string }[];
}

const monthSmall = [4, 6, 9, 11]

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  visible,
  onClose,
  onSubmit,
  categories,
}) => {
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState('');

  const convertDateFormat = (date: string) => {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`; // Converts to YYYY-MM-DD
  };

  const handleAutoFormatDate = (date: string) => {
    if (date.length == 1) {
      // date cannot start with bigger than 3
      if (Number(date) > 3) {
        date = '3';
      }
      setExpenseDate(date);
    }
    if (date.length == 2) {
      // date cannot be greater than 31
      if (Number(date) > 31) {
        date = '31';
      }
      date += '-';
      setExpenseDate(date);
    }
    if (date.length == 4) {
      let [day, month] = date.split('-')
      // month cannot start with greater than 1
      if (Number(month) > 1) {
        month = '1';
        date = day + '-' + month
      }
      setExpenseDate(date);
    }
    if (date.length == 5) {
      let [day, month] = date.split('-')
      if (Number(month) > 12) {
        month = '12';
        date = day + '-' + month
      }
      if (monthSmall.includes(Number(month)) && Number(day) > 30) {
        date = '30-' + month
      }
      if (Number(month) == 2 && Number(day) > 28) {
        date = '28-' + month
      }
      date += '-'
    }
    setExpenseDate(date);
  };

  const handleBackspace = (text: string) => {
    // Check if the last character was a hyphen
    if (text.endsWith('-')) {
      setExpenseDate(expenseDate.slice(0, -1)); // Remove the last character if it's a hyphen
    } else {
      setExpenseDate(expenseDate.slice(0, -1)); // Remove the last character
    }
  };

  const handleAddExpense = () => {
    if (categoryId && amount && description && expenseDate) {
      const formattedDate = convertDateFormat(expenseDate)
      onSubmit({
        category_id: categoryId,
        amount: parseFloat(amount),
        description,
        expense_date: formattedDate,
      });
      // Reset the fields after submission
      setCategoryId(null);
      setAmount('');
      setDescription('');
      setExpenseDate('');
      onClose(); // Close the modal
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Expense</Text>

          {/* Category Picker */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={categoryId}
                onValueChange={(itemValue) => setCategoryId(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select a category" value={null} />
                {categories.map((category) => (
                  <Picker.Item
                    key={category.id}
                    label={category.category_name}
                    value={category.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Amount input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={amount}
              onChangeText={(value) => setAmount(value)}
            />
          </View>

          {/* Description input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter description"
              placeholderTextColor="#888"
              value={description}
              onChangeText={(value) => setDescription(value)}
            />
          </View>

          {/* Expense Date input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Expense Date:</Text>
            <TextInput
              style={styles.input}
              placeholder="Date (DD-MM-YYYY)"
              placeholderTextColor="#888"
              value={expenseDate}
              onChangeText={(text) => {
                if (text.length < expenseDate.length) {
                  handleBackspace(text);
                } else {
                  handleAutoFormatDate(text);
                }
              }}
              keyboardType='numeric'
              maxLength={10}
            />
          </View>

          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.submitButton} onPress={handleAddExpense}>
              <Text style={styles.buttonText}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black'
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'gray'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    color: 'black'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden'
  },
  picker: {
    height: 60,
    width: '100%',
    color: 'black'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ExpenseModal;
