import axios from "axios";
import { create } from "zustand";
import constants from "@/constants/data";
import { router } from "expo-router";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the Seller type
interface Seller {
  id: string;
  name: string;
  email: string;
  mobile: string;
  [key: string]: any; // Extendable for additional fields
}

// Define the Zustand store type
interface SellerStore {
  seller: Seller | null;
  isLoading: boolean;
  isDarkMode: boolean;
  verifyOtp: (mobile: string, otp: string) => Promise<void>;
  signUp: (sellerDetails: any) => Promise<void>;
  signIn: (mobile: string) => Promise<void>;
  getSeller: () => Promise<void>;
  logout: () => Promise<void>;
  toggleDarkMode: () => void;
}

const useSellerStore = create<SellerStore>((set) => ({
  seller: null,
  isLoading: false,
  isDarkMode: false,
  
  verifyOtp: async (mobile: string, otp: string) => {
    try {
      const response = await axios.post(
        `${constants.base_url}/api/seller/verify`, 
        { mobile, otp }
      );

      if (response.status === 200) {
        console.log("OTP verified successfully");

        if (response.data.seller && response.data.token) {
          set({ seller: response.data.seller });
          await AsyncStorage.setItem("token", response.data.token);

          router.replace("/(root)/(tabs)/home");
        } else {
          router.push({
            pathname: "/(auth)/sign-up",
            params: { mobile },
          });
        }
      } else {
        Alert.alert("Error", "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to verify OTP. Please try again.");
    }
  },

  signUp: async (sellerDetails: any) => {
    try {
      const response = await axios.post(
        `${constants.base_url}/api/seller`, 
        sellerDetails
      );

      if (response.status === 201) {
        Alert.alert("Success", "You have successfully signed up!");
        if (response.data.seller && response.data.token) {
          set({ seller: response.data.seller });
          await AsyncStorage.setItem("token", response.data.token);
        }
        router.push("/home");
      } else {
        Alert.alert("Error", "Failed to sign up. Please try again.");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      Alert.alert("Error", "An error occurred while signing up. Try again.");
    }
  },

  signIn: async (mobile: string) => {
    try {
      console.log("Mobile number:", mobile);
      const response = await axios.post(`${constants.base_url}/api/seller/otp`, { mobile });

      if (response.status === 200) {
        router.push({
          pathname: "/(auth)/otp-verfication",
          params: { mobile },
        });
      } else {
        Alert.alert(
          "Error",
          "Failed to send OTP. Please check your number or try again later."
        );
      }
    } catch (error) {
      console.error("Error during OTP request:", error);
      Alert.alert("Error", "An error occurred while sending OTP. Try again.");
    }
  },

  getSeller: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token:", token);
      if (token) {
        const response = await axios.get(`${constants.base_url}/api/seller`, { 
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          set({ seller: response.data.seller });
        } else {
          Alert.alert("Error", "Failed to fetch seller details.");
          console.error("Failed to fetch seller details");
        }
      } else {
        Alert.alert("Error", "No token found.");
        console.error("No token found");
      }
    } catch (error) {
      console.error("Error during fetching seller:", error);
      Alert.alert("Error", "An error occurred while fetching seller details.");
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem("token");
      set({ seller: null });
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "An error occurred while logging out.");
    }
  },

  toggleDarkMode: () => {
    set((state) => ({ isDarkMode: !state.isDarkMode }));
  },
}));

export default useSellerStore;
