import {
  View,
  Text,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
  Image,
  ImageSourcePropType,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { getCurrentDate } from "@/lib/utility";
import { expenseCategory, incomeSource } from "@/constants";
import { router } from "expo-router";

export default function Transaction() {
  const db = useSQLiteContext();
  const [transactionType, setTransactionType] = useState("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const date = getCurrentDate();

  function handleAmountChanged(text: any) {
    const numericValue = text.replace(/[^0-9]/g, "");
    setAmount(numericValue);
  }

  function handleCategorySelect(name: string) {
    setCategory(name);
  }

  async function handleSave() {
    // console.log(transactionType, category, amount, date, description);
    if (category == "") {
      Alert.alert("Select a category or source.");
      return;
    }
    if (amount == "" || amount == "0") {
      Alert.alert("Enter amount >= 1.");
      return;
    }
    if (description == "") {
      Alert.alert("Provide a description.");
      return;
    }
    try {
      if (transactionType == "expense") {
        const r = await db.runAsync(
          "INSERT INTO expenses (category, amount, date, description) VALUES (?, ?, ?, ?)",
          category,
          amount,
          date,
          description
        );
        console.log(r);
        router.back();
      } else {
        const r = await db.runAsync(
          "INSERT INTO incomes (source, amount, date, description) VALUES (?, ?, ?, ?)",
          category,
          amount,
          date,
          description
        );
        console.log(r);
        router.back();
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error in storing.");
      router.push("/(tabs)/");
    }
  }

  const showCategory = ({
    name,
    icon,
  }: {
    name: string;
    icon: ImageSourcePropType;
  }) => (
    <View
      className={`shadow-lg p-1 w-24 mr-1 ${
        name == category ? "border-2 border-green-400" : ""
      }`}
    >
      <TouchableOpacity
        className="items-center justify-center"
        onPress={() => handleCategorySelect(name)}
      >
        <Image
          source={icon}
          alt={name}
          resizeMode="contain"
          className="w-8 h-8"
        />
        <Text className="text-gray-700 text-xs mt-1">{name}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView className="my-8">
      <View className="flex flex-row justify-around items-center">
        <TouchableOpacity onPress={() => setTransactionType("expense")}>
          <Text
            className={`px-4 py-2 rounded-md font-semibold text-lg ${
              transactionType == "expense"
                ? "bg-green-400 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            Expense
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTransactionType("income")}>
          <Text
            className={`px-4 py-2 rounded-md font-semibold text-lg ${
              transactionType == "income"
                ? "bg-green-400 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            Income
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="mt-4 mx-4">
          <Text className={`text-lg mb-1`}>Amount</Text>
          <TextInput
            keyboardType="numeric"
            className={`rounded-full p-4 text-[15px] w-full text-left border-gray-300 border-2`}
            onChangeText={handleAmountChanged}
            value={amount}
          />
        </View>
      </KeyboardAvoidingView>
      <View className="mx-4 mt-4">
        <Text className="text-lg mb-2">
          {transactionType == "expense" ? "Category" : "Source"}
        </Text>
        <FlatList
          horizontal={true}
          data={transactionType == "expense" ? expenseCategory : incomeSource}
          keyExtractor={(item) => item.name}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
            showCategory({ name: item.name, icon: item.icon })
          }
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="mt-4 mx-4">
          <Text className={`text-lg mb-1`}>Description</Text>
          <TextInput
            className={`rounded-full p-4 text-[15px] w-full text-left border-gray-300 border-2`}
            onChangeText={(value) => {
              setDescription(value);
            }}
            value={description}
          />
        </View>
      </KeyboardAvoidingView>
      <TouchableOpacity
        className="bg-green-400 rounded-full mx-4 p-2 items-center mt-24"
        onPress={handleSave}
      >
        <Text className="text-white font-bold text-2xl">Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
