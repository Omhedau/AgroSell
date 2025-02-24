import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect, useRouter } from "expo-router";
import useSellerStore from "@/store/useSellerStore"; // Updated store import
import AsyncStorage from "@react-native-async-storage/async-storage";

const Page = () => {
  const { getSeller } = useSellerStore() as { getSeller: () => void };

  const [isSignedIn, setIsSignedIn] = React.useState<boolean | null>(null); // null indicates loading state
  const router = useRouter();

  React.useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          getSeller(); // Fetch seller details from the store
          setIsSignedIn(true); // Seller is signed in
          console.log("Token found");
        } else {
          setIsSignedIn(false); // No token found
          console.log("Token not found");
        }
      } catch (error) {
        console.error("Error checking token:", error);
        setIsSignedIn(false); // Default to sign-in on error
      }
    };

    checkToken();
    console.log("Checking token");
  }, [getSeller]);

  if (isSignedIn === null) {
    // Show a loader while checking the token
    return (
      <View className="flex-1 justify-center items-center bg-primary-100">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (isSignedIn) {
    console.log("Redirecting to seller dashboard");
    return <Redirect href="/(root)/(tabs)/home" />; // Seller home page
  }

  console.log("Redirecting to seller sign-in");
  return <Redirect href="/(auth)/sign-in" />; // Seller sign-in page
};

export default Page;
