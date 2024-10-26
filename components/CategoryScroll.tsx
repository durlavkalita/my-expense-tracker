import { useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const CategoryScroll = ({
  data,
  currentCategory,
  updateCategorySelect,
}: {
  data: {
    name: string;
    icon: any;
  }[];
  currentCategory: string;
  updateCategorySelect: (name: string) => void;
}) => {
  const [newCategory, setNewCategory] = useState(currentCategory);
  const handleClick = (name: string) => {
    setNewCategory(name);
    updateCategorySelect(name);
  };

  const showCategory = ({
    name,
    icon,
  }: {
    name: string;
    icon: ImageSourcePropType;
  }) => (
    <View
      className={`shadow-lg p-1 w-24 mr-1 ${
        name == newCategory ? "border-2 border-green-400" : ""
      }`}
    >
      <TouchableOpacity
        className="items-center justify-center"
        onPress={() => handleClick(name)}
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
    <FlatList
      horizontal={true}
      data={data}
      keyExtractor={(item) => item.name}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) =>
        showCategory({ name: item.name, icon: item.icon })
      }
    />
  );
};
