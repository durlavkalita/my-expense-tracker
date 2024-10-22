import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { dummyData, icons, iconsMap, images } from "@/constants";
import { useSQLiteContext } from "expo-sqlite";
import {
  formatDateToHumanReadable,
  getCurrentMonthForQuery,
} from "@/lib/utility";
import { router } from "expo-router";

export default function income() {
  const db = useSQLiteContext();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState<"all" | "month" | "week">("week");

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setQuery("week");
    fetchIncomes(query);
    setRefreshing(false);
  }, []);

  async function fetchIncomes(filter: "all" | "month" | "week") {
    let query = "";

    switch (filter) {
      case "month":
        query =
          "SELECT * FROM incomes WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now') ORDER BY date DESC";
        break;
      case "week":
        query =
          "SELECT * FROM incomes WHERE date >= date('now', '-7 days') ORDER BY date DESC";
        break;
      case "all":
      default:
        query = "SELECT * FROM incomes ORDER BY date DESC";
        break;
    }

    const result = await db.getAllAsync<Income>(query);
    return result;
  }

  const handleQueryChange = async (query: "all" | "month" | "week") => {
    setQuery(query);
    const result = await fetchIncomes(query);
    setIncomes(result);
  };

  useEffect(() => {
    async function setup() {
      const result = await fetchIncomes(query);
      setIncomes(result);
    }
    setup();
  }, []);

  const renderSeparator = () => (
    <View className="border-b border-gray-300 my-.5" />
  );
  return (
    <View className="mx-4">
      {incomes.length > 0 ? (
        <View>
          <View className="flex flex-row justify-between items-center my-4">
            <TouchableOpacity
              onPress={() => handleQueryChange("week")}
              className={`px-4 py-2 border-2 rounded-md border-purple-900 ${
                query == "week" ? "bg-purple-300" : ""
              }`}
            >
              <Text>Past Week</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleQueryChange("month")}
              className={`px-4 py-2 border-2 rounded-md border-purple-900 ${
                query == "month" ? "bg-purple-300" : ""
              }`}
            >
              <Text>This Month</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleQueryChange("all")}
              className={`px-4 py-2 border-2 rounded-md border-purple-900 ${
                query == "all" ? "bg-purple-300" : ""
              }`}
            >
              <Text>All Time</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={incomes}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={RenderItem}
            ItemSeparatorComponent={renderSeparator}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      ) : (
        <View className="flex items-center">
          <Image
            source={images.noResult}
            className="w-40 h-40"
            alt="No data found."
            resizeMode="contain"
          />
          <Text className="text-lg font-medium">
            Sorry, No Income Data Found
          </Text>
          <TouchableOpacity
            className="bg-purple-500 px-4 py-2 rounded-md my-4"
            onPress={() => {
              router.push("/transaction");
            }}
          >
            <Text className="font-medium text-white">Add Income</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const RenderItem = ({ item, index }: { item: Income; index: number }) => {
  const bgClass = index % 2 === 0 ? "bg-gray-200" : "bg-white";
  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/income/${item.id}`);
      }}
    >
      <View
        className={`flex flex-row items-center justify-between p-4 ${bgClass}`}
      >
        <View className="flex flex-row items-center">
          <Image
            source={iconsMap[item.source]}
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
          <Text className="text-xs text-gray-500">
            {formatDateToHumanReadable(item.date)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
