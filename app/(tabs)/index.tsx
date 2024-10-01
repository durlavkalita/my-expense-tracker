import ProgressBar from "@/components/ProgressBar";
import { icons } from "@/constants";
import {
  getCurrentDate,
  getCurrentMonthForQuery,
  getCurrentMonthYear,
  humanReadableAmount,
} from "@/lib/utility";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const db = useSQLiteContext();
  const [incomes, setIncomes] = useState<Income[]>();
  const [expenses, setExpenses] = useState<Expense[]>();
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    fetchDataFromDB();

    setRefreshing(false);
  }, []);
  const fetchDataFromDB = async () => {
    const result = await db.getAllAsync<Income>(
      `SELECT * FROM incomes WHERE strftime('%m', date) = '${getCurrentMonthForQuery()}' ORDER BY date DESC`
    );
    const result1 = await db.getAllAsync<Expense>(
      `SELECT * FROM expenses WHERE strftime('%m', date) = '${getCurrentMonthForQuery()}' ORDER BY date DESC`
    );
    setIncomes(result);
    setExpenses(result1);
    let totalIncome = 0;
    let totalExpense = 0;
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      totalIncome = totalIncome + Number(element.amount);
    }
    setMonthlyIncome(totalIncome);
    for (let index = 0; index < result1.length; index++) {
      const element = result1[index];
      totalExpense += Number(element.amount);
    }
    setMonthlyExpense(totalExpense);
  };
  useEffect(() => {
    async function setup() {
      fetchDataFromDB();
    }
    setup();
  }, []);
  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="h-60 bg-purple-400 py-2 px-4">
          <Text className="text-white font-semibold text-xl py-2 self-center">{`${getCurrentMonthYear()} budget`}</Text>
          <View className="flex flex-row items-end">
            <Text className="text-white text-5xl font-bold mt-8">
              {`${humanReadableAmount(monthlyIncome - monthlyExpense)}`}
            </Text>
            <Text className="text-white font-bold mb-2 ml-2 text-lg">
              Balance
            </Text>
          </View>
          <ProgressBar income={monthlyIncome} expense={monthlyExpense} />
        </View>
        <View className="px-4 pt-2">
          <View className="flex flex-row justify-between items-center">
            <Text className="font-bold text-lg">Income</Text>
            <Text className="text-lg font-bold">
              {humanReadableAmount(monthlyIncome)}
            </Text>
          </View>
          <View className="">
            {incomes?.slice(0, 3).map((item) => (
              <RenderItemIncome item={item} key={item.id} />
            ))}
          </View>
        </View>
        <View className="px-4 pt-2">
          <View className="flex flex-row justify-between items-center">
            <Text className="font-bold text-lg">Expenses</Text>
            <Text className="text-lg font-bold">
              {humanReadableAmount(monthlyExpense)}
            </Text>
          </View>
          <View className="">
            {expenses?.slice(0, 3).map((item) => (
              <RenderItemExpense item={item} key={item.id} />
            ))}
          </View>
        </View>

        <View className="my-24"></View>
      </ScrollView>
      <View className="absolute bottom-24 right-6">
        <TouchableOpacity
          className="flex-row items-center bg-green-500 p-3 rounded-full shadow-lg"
          onPress={() => {
            router.push("/transaction");
          }}
        >
          <Image
            tintColor="white"
            source={icons.add}
            resizeMode="contain"
            className="w-8 h-8"
            alt="Add Data"
          />
        </TouchableOpacity>
      </View>
      <StatusBar style="light" backgroundColor="#c084fc" />
    </SafeAreaView>
  );
}

const RenderItemIncome = ({ item }: { item: Income }) => (
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

const RenderItemExpense = ({ item }: { item: Expense }) => (
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
);
