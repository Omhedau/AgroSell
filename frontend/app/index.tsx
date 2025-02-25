import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect, useRouter } from "expo-router";
import useSellerStore from "@/store/useSellerStore"; // Assuming you have a seller store
import AsyncStorage from "@react-native-async-storage/async-storage";

const Seller = () => {
  const { getSeller } = useSellerStore() as { getSeller: () => void };

  const [isSignedIn, setIsSignedIn] = React.useState<boolean | null>(null); // null = loading state
  const router = useRouter();

  React.useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("sellerToken"); // Use "sellerToken" for differentiation
        if (token) {
          getSeller(); // Fetch seller details from the store
          setIsSignedIn(true);
          console.log("Seller token found");
        } else {
          setIsSignedIn(false);
          console.log("Seller token not found");
        }
      } catch (error) {
        console.error("Error checking seller token:", error);
        setIsSignedIn(false); // Default to sign-in on error
      }
    };

    checkToken();
    console.log("Checking seller token");
  }, [getSeller]);

  if (isSignedIn === null) {
    // Show a loader while checking the token
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (isSignedIn) {
    console.log("Redirecting seller to dashboard");
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  console.log("Redirecting seller to sign-in");
  return <Redirect href="/(auth)/sign-in" />;
};

export default Seller;
