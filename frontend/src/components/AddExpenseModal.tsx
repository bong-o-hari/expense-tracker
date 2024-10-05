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
import DateTimePicker from '@react-native-community/datetimepicker';

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

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  visible,
  onClose,
  onSubmit,
  categories,
}) => {
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date()); // Set to today's date
  const [showDatePicker, setShowDatePicker] = useState(false);

  const convertDateFormat = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // Converts to YYYY-MM-DD
  };

  const handleShowDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpenseDate(selectedDate);
    }
  };

  const handleAddExpense = () => {
    if (categoryId && amount && description) {
      const formattedDate = convertDateFormat(expenseDate);
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
      setExpenseDate(new Date()); // Reset to today's date
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

          {/* Expense Date Picker */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Expense Date:</Text>
            <Pressable style={styles.input} onPress={handleShowDatePicker}>
              <Text style={{ color: 'black' }}>
                {expenseDate ? expenseDate.toLocaleDateString() : 'Select a date'}
              </Text>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={expenseDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
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
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
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
