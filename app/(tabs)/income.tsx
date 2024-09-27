import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { dummyData, icons } from "@/constants";
import { useSQLiteContext } from "expo-sqlite";
import { getCurrentMonthForQuery } from "@/lib/utility";
import { router } from "expo-router";

export default function income() {
  const db = useSQLiteContext();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    fetchDataFromDB();

    setRefreshing(false);
  }, []);

  const fetchDataFromDB = async () => {
    const result = await db.getAllAsync<Income>(
      "SELECT * FROM incomes ORDER BY date DESC"
    );
    setIncomes(result);
  };

  useEffect(() => {
    async function setup() {
      fetchDataFromDB();
    }
    setup();
  }, []);

  const renderSeparator = () => (
    <View className="border-b border-gray-300 my-1" />
  );
  return (
    <View className="mx-6">
      <FlatList
        data={incomes.length > 0 ? incomes : dummyData.incomeData}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <RenderItem item={item}></RenderItem>}
        ItemSeparatorComponent={renderSeparator}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const RenderItem = ({ item }: { item: Income }) => (
  <TouchableOpacity
    onPress={() => {
      router.push(`/income/${item.id}`);
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
  </TouchableOpacity>
);
