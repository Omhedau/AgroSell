import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import useUserStore from "@/store/userStore";

const Profile = () => {
  const { user, logout } = useUserStore() as { user: { name: string; mobile: string; gender: string; role: string; lang: string }, logout: () => void };

  const getInitials = (name: string) => {
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
    return initials;
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Header Section */}
      <View className="bg-indigo-500 pt-10 pb-8 px-6 rounded-b-3xl shadow-lg">
        <View className="items-center">
          {/* Profile Photo */}
          <View className="w-28 h-28 bg-indigo-300 rounded-full justify-center items-center mb-4">
            <Text className="text-4xl text-white font-bold">
              {getInitials(user.name)}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-white">{user.name}</Text>
          <Text className="text-base text-indigo-100">{user.role}</Text>
        </View>
      </View>

      {/* User Info */}
      <View className="mx-6 mt-6 bg-white rounded-lg shadow-md p-4">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Personal Information
        </Text>
        <View className="flex-row items-center mb-3">
          <Ionicons name="call-outline" size={20} color="#6B7280" />
          <Text className="ml-4 text-base text-gray-700">{user.mobile}</Text>
        </View>
        <View className="flex-row items-center mb-3">
          <Ionicons name="language-outline" size={20} color="#6B7280" />
          <Text className="ml-4 text-base text-gray-700">{user.lang}</Text>
        </View>
        <View className="flex-row items-center mb-3">
          <Ionicons name="female-outline" size={20} color="#6B7280" />
          <Text className="ml-4 text-base text-gray-700">{user.gender}</Text>
        </View>
      </View>

      {/* Settings and Actions */}
      <View className="mx-6 mt-6">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Actions
        </Text>
        <View className="bg-white rounded-lg shadow-md p-4 space-y-4">
          <TouchableOpacity
            className="flex-row items-center p-2 bg-gray-100 rounded-lg"
            onPress={() => console.log("Navigating to Edit Profile")}
          >
            <MaterialIcons name="edit" size={24} color="#4F46E5" />
            <Text className="ml-4 text-base text-gray-800">Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center p-2 bg-gray-100 rounded-lg"
            onPress={() => console.log("Navigating to Settings")}
          >
            <Ionicons name="settings-outline" size={24} color="#4F46E5" />
            <Text className="ml-4 text-base text-gray-800">Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center p-2 bg-gray-100 rounded-lg"
            onPress={() => logout()}
          >
            <Ionicons name="log-out-outline" size={24} color="#DC2626" />
            <Text className="ml-4 text-base text-gray-800">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
