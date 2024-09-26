import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTailwind } from "tailwind-rn";
import { Ionicons } from "@expo/vector-icons"; // Icon library for delete icon

const UpdateModal = ({
  visible,
  selectedItem,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const tailwind = useTailwind();
  const [amount, setAmount] = useState(selectedItem?.amount || "");
  const [date, setDate] = useState(selectedItem?.date || "");
  const [category, setCategory] = useState(selectedItem?.category || ""); // For expenses

  const handleUpdate = () => {
    // Perform validation if necessary (e.g., ensure amount is a valid number)
    if (!amount || !date) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }

    // Call the parent `onUpdate` function to handle the update logic
    onUpdate({
      ...selectedItem,
      amount: amount,
      date: date,
      category: category,
    });

    onClose();
  };

  const handleDelete = () => {
    // Confirm before deleting
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            onDelete(selectedItem.id);
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View
        style={tailwind(
          "flex-1 justify-center items-center bg-black bg-opacity-50"
        )}
      >
        <View style={tailwind("bg-white w-11/12 p-6 rounded-lg")}>
          <Text style={tailwind("text-lg font-bold mb-4")}>Update Record</Text>

          <TextInput
            style={tailwind("border border-gray-300 p-2 rounded-lg mb-4")}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
          />
          <TextInput
            style={tailwind("border border-gray-300 p-2 rounded-lg mb-4")}
            value={date}
            onChangeText={setDate}
            placeholder="Enter date (YYYY-MM-DD)"
          />
          <TextInput
            style={tailwind("border border-gray-300 p-2 rounded-lg mb-4")}
            value={category}
            onChangeText={setCategory}
            placeholder="Enter category"
          />

          <View style={tailwind("flex-row justify-between")}>
            <TouchableOpacity
              style={tailwind("bg-green-600 p-3 rounded-lg")}
              onPress={handleUpdate}
            >
              <Text style={tailwind("text-white font-bold")}>Update</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tailwind(
                "bg-red-600 p-3 rounded-lg flex-row items-center"
              )}
              onPress={handleDelete}
            >
              <Ionicons name="trash" size={24} color="white" />
              <Text style={tailwind("text-white font-bold ml-2")}>Delete</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={tailwind("mt-4")} onPress={onClose}>
            <Text style={tailwind("text-blue-600 text-center font-bold")}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default UpdateModal;
