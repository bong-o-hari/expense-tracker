import React, { useState, useEffect } from 'react';
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
import { submitCategory } from '../Apis';

interface ExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    category_id?: string;
    description?: string;
    expense_date?: string;
    amount: number;
    source?: string;
    income_date?: string;
  }) => void;
  categories: { id: string; category_name: string }[];
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  visible,
  onClose,
  onSubmit,
  categories,
}) => {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [incomeDate, setIncomeDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showIncomeDatePicker, setShowIncomeDatePicker] = useState(false);
  const [showCustomCategoryModal, setShowCustomCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [allCategories, setAllCategories] = useState(categories);
  const [mode, setMode] = useState<'expense' | 'income'>('expense');

  useEffect(() => {
    setAllCategories(categories);
  }, [categories]);

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

  const handleIncomeDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowIncomeDatePicker(false);
    if (selectedDate) {
      setIncomeDate(selectedDate);
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
      resetFields();
    } else {
      alert('Please fill in all fields for the expense');
    }
  };

  const handleAddIncome = () => {
    if (amount && source) {
      const formattedDate = convertDateFormat(incomeDate);
      onSubmit({
        amount: parseFloat(amount),
        source,
        income_date: formattedDate,
      });
      resetFields();
    } else {
      alert('Please fill in all fields for the income');
    }
  };

  const resetFields = () => {
    setCategoryId(null);
    setAmount('');
    setDescription('');
    setSource('');
    setExpenseDate(new Date());
    setIncomeDate(new Date());
    onClose(); // Close the modal after submission
  };

  const handleAddCustomCategory = async () => {
    if (newCategory.trim()) {
      try {
        const newCategoryFromBackend = await submitCategory(newCategory);
        const newCategoryObj = newCategoryFromBackend.data;

        setAllCategories([...allCategories, newCategoryObj]);
        setCategoryId(newCategoryObj.id);

        setNewCategory('');
        setShowCustomCategoryModal(false);
      } catch (error) {
        alert('Error adding category.');
      }
    } else {
      alert('Please enter a valid category name');
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
          {/* Switch between Add Expense and Add Income */}
          <View style={styles.switchContainer}>
            <Pressable
              style={[styles.switchButton, mode === 'expense' && styles.activeButton]}
              onPress={() => setMode('expense')}
            >
              <Text style={styles.switchText}>Add Expense</Text>
            </Pressable>
            <Pressable
              style={[styles.switchButton, mode === 'income' && styles.activeButton]}
              onPress={() => setMode('income')}
            >
              <Text style={styles.switchText}>Add Income</Text>
            </Pressable>
          </View>

          {mode === 'expense' ? (
            <>
              {/* Category Picker */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Category:</Text>
                <View style={styles.pickerRow}>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={categoryId}
                      onValueChange={(itemValue) => setCategoryId(itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select a category" value={null} />
                      {allCategories.map((category) => (
                        <Picker.Item
                          key={category.id}
                          label={category.category_name}
                          value={category.id}
                        />
                      ))}
                    </Picker>
                  </View>
                  <Pressable
                    style={styles.addButton}
                    onPress={() => setShowCustomCategoryModal(true)}
                  >
                    <Text style={styles.addButtonText}>+ Add</Text>
                  </Pressable>
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
            </>
          ) : (
            <>
              {/* Amount input for Income */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Amount:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter income amount"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={(value) => setAmount(value)}
                />
              </View>

              {/* Source input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Source:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter income source"
                  placeholderTextColor="#888"
                  value={source}
                  onChangeText={(value) => setSource(value)}
                />
              </View>

              {/* Income Date Picker */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Income Date:</Text>
                <Pressable style={styles.input} onPress={() => setShowIncomeDatePicker(true)}>
                  <Text style={{ color: 'black' }}>
                    {incomeDate ? incomeDate.toLocaleDateString() : 'Select a date'}
                  </Text>
                </Pressable>
                {showIncomeDatePicker && (
                  <DateTimePicker
                    value={incomeDate}
                    mode="date"
                    display="default"
                    onChange={handleIncomeDateChange}
                  />
                )}
              </View>
            </>
          )}

          {/* Submit button */}
          <Pressable
            style={styles.submitButton}
            onPress={mode === 'expense' ? handleAddExpense : handleAddIncome}
          >
            <Text style={styles.submitButtonText}>
              {mode === 'expense' ? 'Add Expense' : 'Add Income'}
            </Text>
          </Pressable>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>

      {/* Custom Category Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCustomCategoryModal}
        onRequestClose={() => setShowCustomCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.label}>Add Custom Category:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter category name"
              placeholderTextColor="#888"
              value={newCategory}
              onChangeText={(value) => setNewCategory(value)}
            />
            <Pressable style={styles.submitButton} onPress={handleAddCustomCategory}>
              <Text style={styles.submitButtonText}>Add Category</Text>
            </Pressable>
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowCustomCategoryModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  switchButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  activeButton: {
    backgroundColor: '#2196F3',
  },
  switchText: {
    fontSize: 16,
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 5,
    color: 'black',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    height: 50,
    backgroundColor: '#f2f2f2',
    color: 'grey',
  },
  addButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  customCategoryModalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ExpenseModal;
