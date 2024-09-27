import {
  View,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
  TextInput,
  FlatList,
  ImageSourcePropType,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { router, useLocalSearchParams } from "expo-router";
import { incomeSource } from "@/constants";

export default function SingleExpense() {
  const { id } = useLocalSearchParams();
  const uid = typeof id == "object" ? id[0] : id;
  const db = useSQLiteContext();
  const [income, setIncome] = useState<Income[]>([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<Income>(
        `SELECT * FROM incomes WHERE id = ${uid}`
      );
      setIncome(result);
      setCategory(result[0].source);
      setAmount(result[0].amount);
      setDescription(result[0].description);
    }
    setup();
  }, []);
  async function handleDelete() {
    const r = await db.runAsync(`DELETE FROM incomes WHERE id = ${uid}`);
    console.log(r);
    router.push("/(tabs)/income");
  }
  async function handleUpdate() {
    if (category == "") {
      Alert.alert("Select a source.");
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
    const r = await db.runAsync(
      "UPDATE incomes SET amount = ?, source = ?, description = ? WHERE id = ?",
      amount,
      category,
      description,
      uid
    );
    console.log(r);
    router.push("/(tabs)/income");
  }
  function handleAmountChanged(text: any) {
    const numericValue = text.replace(/[^0-9]/g, "");
    setAmount(numericValue);
  }

  function handleCategorySelect(name: string) {
    setCategory(name);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView className="my-8">
        <TouchableOpacity onPress={Keyboard.dismiss}>
          <View className="mt-4 mx-4">
            <Text className={`text-lg mb-1`}>Amount</Text>
            <TextInput
              keyboardType="numeric"
              className={`rounded-full p-4 text-[15px] w-full text-left border-gray-300 border-2`}
              onChangeText={handleAmountChanged}
              value={amount}
            />
          </View>
        </TouchableOpacity>

        <View className="mx-4 mt-4">
          <Text className="text-lg mb-2">Category</Text>
          <FlatList
            horizontal={true}
            data={incomeSource}
            keyExtractor={(item) => item.name}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) =>
              showCategory({ name: item.name, icon: item.icon })
            }
          />
        </View>

        <TouchableOpacity onPress={Keyboard.dismiss}>
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
        </TouchableOpacity>
        <View className="flex flex-row justify-between mx-4 mt-24">
          <TouchableOpacity
            className="bg-red-400 rounded-full p-2 items-center w-1/2"
            onPress={handleDelete}
          >
            <Text className="text-white font-bold text-2xl">Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-green-400 rounded-full p-2 items-center w-1/2"
            onPress={handleUpdate}
          >
            <Text className="text-white font-bold text-2xl">Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
