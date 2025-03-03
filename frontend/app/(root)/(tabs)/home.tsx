import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import useSellerStore from "@/store/useSellerStore";
import { useRouter } from "expo-router";

// Define the type for the user object in the store
const Home: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary-100">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
        className="bg-primary-100 mb-20"
      >
        <Text className="text-green-400">Om Hedau is Your Boss</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
