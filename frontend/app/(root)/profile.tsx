import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import useSellerStore from "@/store/useSellerStore"; // ✅ Zustand Store Import
import { useColorScheme } from "react-native"; // ✅ For Dark Mode Support

const Profile = () => {
  const { seller, logout, isDarkMode, toggleDarkMode } = useSellerStore();
  const colorScheme = useColorScheme();
  const isDark = isDarkMode || colorScheme === "dark";

  if (!seller) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-200">
        <Text className="text-lg font-semibold text-gray-600">Loading...</Text>
      </View>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const maskAccountNumber = (accNumber: string) => {
    return accNumber ? accNumber.slice(0, 2) + "****" + accNumber.slice(-4) : "N/A";
  };

  return (
    <ScrollView
      className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}
    >
      {/* Header Section */}
      <View
        className={`${
          isDark ? "bg-gray-800" : "bg-teal-600"
        } pt-10 pb-8 px-6 rounded-b-3xl shadow-lg`}
      >
        <View className="items-center">
          {/* Profile Photo or Initials */}
          <View className="relative">
            {seller.storeDetails?.storeLogo ? (
              <Image
                source={{ uri: seller.storeDetails.storeLogo }}
                className="w-28 h-28 rounded-full border-4 border-white"
              />
            ) : (
              <View className="w-28 h-28 bg-indigo-300 rounded-full justify-center items-center">
                <Text className="text-4xl text-white font-bold">
                  {getInitials(seller.name)}
                </Text>
              </View>
            )}
          </View>

          <Text className="text-2xl font-bold text-white mt-3">
            {seller.name}
          </Text>
        </View>
      </View>

      {/* Personal Info */}
      <View className="mx-6 mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Personal Information
        </Text>
        <View className="flex-row items-center mb-3">
          <Ionicons name="call-outline" size={20} color="#6B7280" />
          <Text className="ml-4 text-base text-gray-700 dark:text-gray-300">
            {seller.mobile}
          </Text>
        </View>
        <View className="flex-row items-center mb-3">
          <Ionicons name="mail-outline" size={20} color="#6B7280" />
          <Text className="ml-4 text-base text-gray-700 dark:text-gray-300">
            {seller.email}
          </Text>
        </View>
        <View className="flex-row items-center mb-3">
          <Ionicons name="globe-outline" size={20} color="#6B7280" />
          <Text className="ml-4 text-base text-gray-700 dark:text-gray-300">
            {seller.lang || "N/A"}
          </Text>
        </View>
      </View>

      {/* Store Info */}
      {seller.storeDetails && (
        <View className="mx-6 mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Store Details
          </Text>
          <View className="flex-row items-center mb-3">
            <MaterialIcons name="storefront" size={24} color="#6B7280" />
            <Text className="ml-4 text-base text-gray-700 dark:text-gray-300">
              {seller.storeDetails.storeName || "N/A"}
            </Text>
          </View>
          <View className="flex-row items-center mb-3">
            <Ionicons name="location-outline" size={24} color="#6B7280" />
            <Text className="ml-4 text-base text-gray-700 dark:text-gray-300">
              {seller.storeAddress?.district || "No Address Provided"}
            </Text>
          </View>
        </View>
      )}

      {/* Bank Details Section */}
      {seller.bankDetails && (
        <View className="mx-6 mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Bank Details
          </Text>
          <View className="flex-row items-center mb-3">
            <FontAwesome5 name="university" size={20} color="#6B7280" />
            <Text className="ml-4 text-base text-gray-700 dark:text-gray-300">
              {seller.bankDetails.bankName || "N/A"}
            </Text>
          </View>
          <View className="flex-row items-center mb-3">
            <FontAwesome5 name="credit-card" size={20} color="#6B7280" />
            <Text className="ml-4 text-base text-gray-700 dark:text-gray-300">
              {maskAccountNumber(seller.bankDetails.accountNumber)}
            </Text>
          </View>
          <View className="flex-row items-center mb-3">
            <FontAwesome5 name="code" size={20} color="#6B7280" />
            <Text className="ml-4 text-base text-gray-700 dark:text-gray-300">
              {seller.bankDetails.ifscCode || "N/A"}
            </Text>
          </View>
        </View>
      )}

      {/* Settings and Actions */}
      <View className="mx-6 mt-6">
        <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Actions
        </Text>
        <View className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-4">
          <TouchableOpacity
            className="flex-row items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
            onPress={() => Alert.alert("Edit Profile", "Coming Soon!")}
          >
            <MaterialIcons name="edit" size={24} color="#4F46E5" />
            <Text className="ml-4 text-base text-gray-800 dark:text-gray-300">
              Edit Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
            onPress={() => Alert.alert("Settings", "Coming Soon!")}
          >
            <Ionicons name="settings-outline" size={24} color="#4F46E5" />
            <Text className="ml-4 text-base text-gray-800 dark:text-gray-300">
              Settings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
            onPress={() => {
              Alert.alert(
                "Logout",
                "Are you sure you want to logout?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Logout", style: "destructive", onPress: () => logout() },
                ]
              );
            }}
          >
            <Ionicons name="log-out-outline" size={24} color="#DC2626" />
            <Text className="ml-4 text-base text-gray-800 dark:text-gray-300">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
