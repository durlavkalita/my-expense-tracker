import { ExpenseItem } from "@/components/ExpenseItem";
import { IncomeItem } from "@/components/IncomeItem";
import ProgressBar from "@/components/ProgressBar";
import { icons } from "@/constants";
import { fetchExpenses, fetchIncomes } from "@/lib/queries";
import { getCurrentMonthYear, humanReadableAmount } from "@/lib/utility";
import { useQueries } from "@tanstack/react-query";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const db = useSQLiteContext();
  const [refreshing, setRefreshing] = useState(false);

  const [expensesQuery, incomesQuery] = useQueries({
    queries: [
      {
        queryKey: ["expenses"],
        queryFn: () => fetchExpenses(db),
      },
      {
        queryKey: ["incomes"],
        queryFn: () => fetchIncomes(db),
      },
    ],
  });

  const monthlyExpense = useMemo(() => {
    if (!expensesQuery.isSuccess) return 0;
    return expensesQuery.data.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );
  }, [expensesQuery.data]);

  const monthlyIncome = useMemo(() => {
    if (!incomesQuery.isSuccess) return 0;
    return incomesQuery.data.reduce(
      (sum, income) => sum + Number(income.amount),
      0
    );
  }, [incomesQuery.data]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([expensesQuery.refetch(), incomesQuery.refetch()]);
    setRefreshing(false);
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
            <Text className="font-bold text-lg">Expenses</Text>
            <Text className="text-lg font-bold">
              {humanReadableAmount(monthlyExpense)}
            </Text>
          </View>
          <View className="">
            {expensesQuery.data?.slice(0, 3).map((item, index) => (
              <ExpenseItem item={item} index={index} key={index} />
            ))}
          </View>
        </View>
        <View className="px-4 pt-2">
          <View className="flex flex-row justify-between items-center">
            <Text className="font-bold text-lg">Income</Text>
            <Text className="text-lg font-bold">
              {humanReadableAmount(monthlyIncome)}
            </Text>
          </View>
          <View className="">
            {incomesQuery.data?.slice(0, 3).map((item, index) => (
              <IncomeItem item={item} index={index} key={index} />
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
