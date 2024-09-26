import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { dummyData, icons } from "@/constants";
import { useSQLiteContext } from "expo-sqlite";
import { router } from "expo-router";

export default function expense() {
  const db = useSQLiteContext();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<Expense>("SELECT * FROM expenses");
      setExpenses(result);
    }
    setup();
  }, []);
  const renderSeparator = () => (
    <View className="border-b border-gray-300 my-1" />
  );
  return (
    <View className="mx-6">
      <FlatList
        data={expenses.length > 0 ? expenses : dummyData.expenseData}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <RenderItem item={item}></RenderItem>}
        ItemSeparatorComponent={renderSeparator}
      />
    </View>
  );
}

const RenderItem = ({ item }: { item: Expense }) => (
  <TouchableOpacity
    onPress={() => {
      router.push(`/expense/${item.id}`);
    }}
  >
    <View className="flex flex-row items-center justify-between py-4">
      <View className="flex flex-row items-center">
        <Image
          source={icons.grocery}
          className="w-8 h-8"
          alt={item.description}
          resizeMode="contain"
        />
        <View className="flex ml-4">
          <Text className="">
            {item.description.length < 25
              ? item.description
              : `${item.description.slice(0, 25)}...`}
          </Text>
          <Text className="text-gray-500 text-sm">{item.category}</Text>
        </View>
      </View>
      <View className="flex items-end">
        <View className="flex flex-row items-center">
          <Image
            source={icons.rupee}
            className="w-2 h-2"
            alt="grocery"
            resizeMode="contain"
          />
          <Text className="">{item.amount}</Text>
        </View>
        <Text className="text-xs text-gray-500">{item.date}</Text>
      </View>
    </View>
  </TouchableOpacity>
);
