import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const getRandomColor = () => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomSize = () => {
  const sizes = [
    "h-24 w-24",
    "h-32 w-32",
    "h-40 w-20",
    "h-20 w-40",
    "h-24 w-48",
    "h-48 w-24",
    "h-36 w-36",
    "h-28 w-28",
  ];
  return sizes[Math.floor(Math.random() * sizes.length)];
};

const Sell = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary-100">
        <ScrollView className=" bg-primary-100 ">
          <View className="flex flex-row flex-wrap justify-center gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <View
                key={index}
                className={`${getRandomSize()} rounded-lg ${getRandomColor()} flex items-center justify-center`}
              >
                <Text className="text-white font-bold">Box {index + 1}</Text>
              </View>
            ))}
          </View>
          <View className="flex flex-row flex-wrap justify-center gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <View
                key={index}
                className={`${getRandomSize()} rounded-lg ${getRandomColor()} flex items-center justify-center`}
              >
                <Text className="text-white font-bold">Box {index + 1}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      {/* <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.5)"]}
        style={{ position: "absolute", bottom: 2, width: "100%", height: 80 }}
      /> */}
    </SafeAreaView>
  );
};

export default Sell;
