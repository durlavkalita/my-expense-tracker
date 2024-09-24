import { View, Text, FlatList, Image } from "react-native";
import React from "react";
import { dummyData, icons } from "@/constants";

export default function income() {
  const renderSeparator = () => (
    <View className="border-b border-gray-300 my-1" />
  );
  return (
    <View className="mx-6">
      {/* Table Headers */}
      {/* <View className="flex-row justify-between bg-blue-600 p-3">
        <Text className="text-white font-bold text-lg">Category</Text>
        <Text className="text-white font-bold text-lg">Amount</Text>
        <Text className="text-white font-bold text-lg">Date</Text>
      </View> */}
      {/* Expense List */}
      <FlatList
        data={dummyData.incomeData}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <RenderItem item={item}></RenderItem>}
        ItemSeparatorComponent={renderSeparator}
      />
    </View>
  );
}

const RenderItem = ({ item }: { item: Income }) => (
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
        <Text className="text-gray-500 text-sm">{item.source}</Text>
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
);
