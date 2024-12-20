import { ExpenseItem } from "@/components/ExpenseItem";
import { images } from "@/constants";
import { fetchExpenses } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function expense() {
  const db = useSQLiteContext();
  const [refreshing, setRefreshing] = useState(false);
  const [filterOption, setFilterOption] = useState<"all" | "month" | "week">(
    "month"
  );

  const query = useQuery({
    queryKey: ["expenses", filterOption],
    queryFn: () => fetchExpenses(db, filterOption),
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setFilterOption("month");
    setRefreshing(false);
  }, [refreshing]);

  if (query.isPending) {
    return (
      <View className="flex items-center justify-center">
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (query.isError) {
    return (
      <View className="flex items-center">
        <Image
          source={images.noResult}
          className="w-40 h-40"
          alt="No data found."
          resizeMode="contain"
        />
        <Text className="text-lg font-medium">
          Sorry, No Expense Data Found
        </Text>
        <TouchableOpacity
          className="bg-purple-500 px-4 py-2 rounded-md my-4"
          onPress={() => {
            router.push("/transaction");
          }}
        >
          <Text className="font-medium text-white">Add Expense</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="mx-4">
      {query.data!.length > 0 ? (
        <View>
          <View className="flex flex-row justify-between items-center my-4">
            <TouchableOpacity
              onPress={() => setFilterOption("week")}
              className={`px-4 py-2 border-2 rounded-md border-purple-900 ${
                filterOption == "week" ? "bg-purple-300" : ""
              }`}
            >
              <Text>Past Week</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFilterOption("month")}
              className={`px-4 py-2 border-2 rounded-md border-purple-900 ${
                filterOption == "month" ? "bg-purple-300" : ""
              }`}
            >
              <Text>This Month</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFilterOption("all")}
              className={`px-4 py-2 border-2 rounded-md border-purple-900 ${
                filterOption == "all" ? "bg-purple-300" : ""
              }`}
            >
              <Text>All Time</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={query.data}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <ExpenseItem item={item} index={index} />
            )}
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
            Sorry, No Expense Data Found
          </Text>
          <TouchableOpacity
            className="bg-purple-500 px-4 py-2 rounded-md my-4"
            onPress={() => {
              router.push("/transaction");
            }}
          >
            <Text className="font-medium text-white">Add Expense</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
