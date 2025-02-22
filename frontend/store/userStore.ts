import axios from "axios";
import { create } from "zustand";
import constants from "@/constants/data";
import { router } from "expo-router";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useUserStore = create((set) => ({
  user: null,
  isLoading: false,
  isDarkMode: false,
  
  verifyOtp: async (mobile: string, otp: string) => {
    try {
      const response = await axios.post(
        `${constants.base_url}/api/user/verify`,
        {
          mobile,
          otp,
        }
      );

      if (response.status === 200) {
        console.log("OTP verified successfully");

        if (response.data.user && response.data.token) {
          set({ user: response.data.user });
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

  signUp: async (userDetails: any) => {
    try {
      const response = await axios.post(
        `${constants.base_url}/api/user`,
        userDetails
      );

      if (response.status === 201) {
        Alert.alert("Success", "You have successfully signed up!");
        if (response.data.user && response.data.token) {
          set({ user: response.data.user });
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
      const response = await axios.post(`${constants.base_url}/api/user/otp`, {
        mobile,
      });

      if (response.status === 200) {
        // Navigate to the OTP verification screen with the mobile number
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

  getUser: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token:", token);
      if (token) {
        const response = await axios.get(`${constants.base_url}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          set({ user: response.data.user });
        } else {
          Alert.alert("Error", "Failed to fetch user details.");
          console.error("Failed to fetch user details");
        }
      } else {
        Alert.alert("Error", "No token found.");
        console.error("No token found");
      }
    } catch (error) {
      console.error("Error during fetching user:", error);
      Alert.alert("Error", "An error occurred while fetching user details.");
    }
  },

  logout : async () => {
    try {
      await AsyncStorage.removeItem("token");
      set({ user: null });
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "An error occurred while logging out.");
    }
  },

  toggleDarkMode: () => {
    set((state: { isDarkMode: boolean }) => ({ isDarkMode: !state.isDarkMode }));
  }
  
}));

export default useUserStore;
