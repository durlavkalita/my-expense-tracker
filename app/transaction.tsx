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
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "upi" | "credit_purchase" | "credit_payment"
  >("cash");

  function handleAmountChanged(text: any) {
    const numericValue = text.replace(/[^0-9]/g, "");
    setAmount(numericValue);
  }

  function getCurrentDateTimeISO() {
    const now = new Date();
    return now.toISOString().slice(0, 19); // 'YYYY-MM-DDTHH:MM:SS'
  }

  async function handleSave() {
    console.log(
      transactionType,
      paymentMethod,
      category,
      amount,
      getCurrentDateTimeISO(),
      description
    );
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
          "INSERT INTO expenses (category, amount, date, description, payment_method) VALUES (?, ?, ?, ?, ?)",
          category,
          amount,
          getCurrentDateTimeISO(),
          description,
          paymentMethod
        );
        console.log(r);
        router.back();
      } else {
        const r = await db.runAsync(
          "INSERT INTO incomes (source, amount, date, description) VALUES (?, ?, ?, ?)",
          category,
          amount,
          getCurrentDateTimeISO(),
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
        onPress={() => {
          setCategory(name);
          setDescription(name);
        }}
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
    <ScrollView className="mx-2 mt-4">
      {/* expense or income */}
      <View className="flex flex-row justify-around items-center mb-4">
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
      {/* payment medium */}
      {transactionType == "expense" ? (
        <View className="mx-4 mt-4">
          <Text className="text-lg mb-2">Method</Text>
          <View className="flex flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => {
                setPaymentMethod("cash");
              }}
              className="flex flex-row items-center"
            >
              <View
                className={`rounded-full p-2 border-2 ${
                  paymentMethod == "cash"
                    ? "bg-green-500 border-green-500"
                    : "border-green-900"
                }`}
              ></View>
              <Text className="text-gray-700 text-lg ml-1">Cash</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setPaymentMethod("upi");
              }}
              className="flex flex-row items-center"
            >
              <View
                className={`rounded-full p-2 border-2 ${
                  paymentMethod == "upi"
                    ? "bg-green-500 border-green-500"
                    : "border-green-900"
                }`}
              ></View>
              <Text className="text-gray-700 text-lg ml-1">UPI</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setPaymentMethod("credit_purchase");
              }}
              className="flex flex-row items-center"
            >
              <View
                className={`rounded-full p-2 border-2 ${
                  paymentMethod == "credit_purchase"
                    ? "bg-green-500 border-green-500"
                    : "border-green-900"
                }`}
              ></View>
              <View className="ml-1">
                <Text className="text-gray-700 font-medium text-sm">
                  Credit
                </Text>
                <Text className="text-gray-700 font-medium text-sm">
                  Purchase
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setPaymentMethod("credit_payment");
              }}
              className="flex flex-row items-center"
            >
              <View
                className={`rounded-full p-2 border-2 ${
                  paymentMethod == "credit_payment"
                    ? "bg-green-500 border-green-500"
                    : "border-green-900"
                }`}
              ></View>
              <View className="ml-1">
                <Text className="text-gray-700 font-medium text-sm">
                  Credit
                </Text>
                <Text className="text-gray-700 font-medium text-sm">
                  Payment
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        ""
      )}
      {/* amount */}
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
      {/* categories */}
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
      {/* description */}
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
      {/* save */}
      <TouchableOpacity
        className="bg-green-400 rounded-full mx-4 p-2 items-center mt-16"
        onPress={handleSave}
      >
        <Text className="text-white font-bold text-2xl">Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
