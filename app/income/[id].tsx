import { CategoryScroll } from "@/components/CategoryScroll";
import { incomeSource } from "@/constants";
import {
  deleteIncomeById,
  fetchIncomeById,
  updateIncomeById,
} from "@/lib/queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SingleExpense() {
  const { id } = useLocalSearchParams();
  const uid = typeof id == "object" ? id[0] : id;
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const incomeQuery = useQuery({
    queryKey: ["incomes", uid],
    queryFn: () => fetchIncome(uid),
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      return handleUpdate();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      return handleDelete();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  async function fetchIncome(id: string) {
    const result = await fetchIncomeById(db, id);
    setCategory(result!.source);
    setAmount(result!.amount);
    setDescription(result!.description);
    return result;
  }
  async function handleDelete() {
    await deleteIncomeById(db, uid);
    router.push("/(tabs)/income");
  }
  async function handleUpdate() {
    if (category == "") {
      Alert.alert("Select a category.");
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
    updateIncomeById(db, amount, category, description, uid);
    router.push("/(tabs)/income");
  }
  function handleAmountChanged(text: any) {
    const numericValue = text.replace(/[^0-9]/g, "");
    setAmount(numericValue);
  }
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
          <Text className="text-lg mb-2">Source</Text>
          <CategoryScroll
            data={incomeSource}
            currentCategory={incomeQuery.data?.source!}
            updateCategorySelect={setCategory}
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
            onPress={() => {
              deleteMutation.mutate();
            }}
          >
            <Text className="text-white font-bold text-2xl">Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-green-400 rounded-full p-2 items-center w-1/2"
            onPress={() => {
              updateMutation.mutate();
            }}
          >
            <Text className="text-white font-bold text-2xl">Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
