import { icons, iconsMap } from "@/constants";
import { formatDateToHumanReadable } from "@/lib/utility";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export const ExpenseItem = ({
  item,
  index,
}: {
  item: Expense;
  index: number;
}) => {
  const bgClass = index % 2 === 0 ? "bg-gray-200" : "bg-white";
  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/expense/${item.id}`);
      }}
    >
      <View
        className={`flex flex-row items-center justify-between p-4 ${bgClass}`}
      >
        <View className="flex flex-row items-center">
          <Image
            source={iconsMap[item.category]}
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
          <Text className="text-xs text-gray-500">
            {formatDateToHumanReadable(item.date)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
