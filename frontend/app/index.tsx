import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect, useRouter } from "expo-router";
import useSellerStore from "@/store/useSellerStore"; // Importing Zustand store
import AsyncStorage from "@react-native-async-storage/async-storage";

const Page = () => {
  const { getSeller, logout } = useSellerStore(); // Get logout function
  const [isSignedIn, setIsSignedIn] = React.useState<boolean | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Checking token:", token);

        if (!token) {
          console.log("No token found, logging out...");
          await logout(); // Ensure the user is logged out
          setIsSignedIn(false);
          return;
        }

        console.log("Token found, fetching seller details...");
        await getSeller(); // Fetch seller details
        setIsSignedIn(true);
      } catch (error) {
        console.error("Error during token check:", error);
        await logout(); // Logout on error to prevent issues
        setIsSignedIn(false);
      }
    };

    checkToken();
  }, []);

  if (isSignedIn === null) {
    return (
      <View className="flex-1 justify-center items-center bg-primary-100">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return isSignedIn ? <Redirect href="/(root)/(tabs)/home" /> : <Redirect href="/(auth)/sign-in" />;
};

export default Page;
