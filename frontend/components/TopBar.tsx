import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useSellerStore from "../store/useSellerStore"; // ✅ Ensure correct import

const TopBar = () => {
  const router = useRouter();
  
  const { seller, isDarkMode, toggleDarkMode } = useSellerStore() as {
      seller: { name: string, [key: string]: any } | null;
      isDarkMode: boolean;
      toggleDarkMode: () => void;
  };

  useEffect(() => {
    console.log("Seller Data:", seller);
  }, [seller]);

  if (!seller || !seller.name) {
    console.warn("Seller data is missing or invalid:", seller);
    return null; // Avoid crashing due to missing data
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: isDarkMode ? "#1a1a1a" : "#f3f4f6" }}>
      {/* Menu Button */}
      <TouchableOpacity style={{ padding: 8 }}>
        <Ionicons name="menu" size={24} color={isDarkMode ? "#fff" : "#1f2937"} />
      </TouchableOpacity>

      {/* Notification, Dark Mode Toggle, Profile */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Notification Button */}
        <TouchableOpacity style={{ padding: 8 }} onPress={() => console.log("Notification")}>
          <Ionicons name="notifications-outline" size={24} color={isDarkMode ? "#fff" : "#1f2937"} />
        </TouchableOpacity>

        {/* Dark Mode Toggle Button */}
        <TouchableOpacity style={{ padding: 8, marginLeft: 10 }} onPress={toggleDarkMode}>
          <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={24} color={isDarkMode ? "#fff" : "#1f2937"} />
        </TouchableOpacity>

        {/* Profile Button */}
        <TouchableOpacity
          onPress={() => router.push("/(root)/profile")}
          style={{ width: 36, height: 36, backgroundColor: "#c7d2fe", borderRadius: 999, justifyContent: "center", alignItems: "center", marginLeft: 12 }}
        >
          <Text style={{ color: "#4f46e5", fontWeight: "bold", fontSize: 14 }}>
            {getInitials(seller.name)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopBar;
