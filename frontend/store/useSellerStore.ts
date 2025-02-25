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
  mobile: string;
  email : string;
  gender?: string;
  lang?: string;
  isActive?: boolean;
  createdAt?: string;
  storeDetails?: {
    storeName: string;
    storeLogo: string;
    description: string;
    gstNumber: string;
    businessLicense: string;
    verificationStatus: string;
  };
  storeAddress?: {
    street: string;
    district: string;
    taluka: string;
    village: string;
    pincode: string;
    latitude?: number | null;
    longitude?: number | null;
  };
  bankDetails?: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    upiId?: string;
  };
  salesStatistics?: {
    totalOrders: number;
    totalRevenue: number;
    averageRating: number;
  };
}

// Define the Zustand store type
interface SellerStore {
  seller: Seller | null;
  isLoading: boolean;
  isDarkMode: boolean;
  verifyOtp: (mobile: string, otp: string) => Promise<void>;
  signUp: (formData: any, filetype: string) => Promise<void>;
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
          console.log("Seller details:", response.data.token);
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

  signUp: async (formData: any, fileType: string): Promise<void> => {
    try {
      console.log("Form data:", formData);
      let storeLogoUrl: string | null = null;

      if (formData.storeDetails.storeLogo) {
        try {
          const fileName = `store-logos/${Date.now()}.${fileType}`;
          const uploadResponse = await axios.post(
            `${constants.base_url}/api/image/upload`,
            {
              key: fileName,
              contentType: `image/${fileType}`,
            }
          );

          if (!uploadResponse.data.uploadUrl) {
            throw new Error("Failed to retrieve pre-signed upload URL");
          }

          const { uploadUrl } = uploadResponse.data;

          const response = await fetch(formData.storeDetails.storeLogo);
          const blob = await response.blob();

          const imageResponse = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": `image/${fileType}` },
            body: blob,
          });

          if (!imageResponse.ok) {
            throw new Error(
              `Failed to upload store logo: ${imageResponse.statusText}`
            );
          }

          storeLogoUrl = uploadUrl.split("?")[0];
          console.log("Store logo URL:", storeLogoUrl);
        } catch (uploadError) {
          console.error("Error uploading store logo:", uploadError);
          throw new Error("Store logo upload failed");
        }
      }

      const sellerData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        mobile: formData.mobile,
        email: formData.email,
        gender: formData.gender,
        lang: formData.lang,
        storeDetails: {
          ...formData.storeDetails,
          storeLogo: storeLogoUrl || "default-logo.png",
        },
        storeAddress: formData.storeAddress || {},
        bankDetails: formData.bankDetails || {},
      };

      console.log("Seller data:", sellerData);

      const createSellerResponse = await axios.post(
        `${constants.base_url}/api/seller`,
        sellerData
      );

      if (createSellerResponse.status === 201) {
        Alert.alert("Success", "You have successfully signed up!");

        if (
          createSellerResponse.data.seller &&
          createSellerResponse.data.token
        ) {
          await AsyncStorage.setItem("token", createSellerResponse.data.token);
        }
        console.log(
          "Seller created successfully:",
          createSellerResponse.data.token
        );

        router.replace("/(root)/(tabs)/home");
      } else {
        throw new Error("Failed to sign up as a seller");
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      Alert.alert("Error", "An error occurred while signing up. Try again.");
    }
  },

  signIn: async (mobile: string) => {
    try {
      console.log("Mobile number:", mobile);
      const response = await axios.post(
        `${constants.base_url}/api/seller/otp`,
        { mobile }
      );

      if (response.status === 200) {
        router.push({
          pathname: "/(auth)/otp-verfication",
          params: { mobile },
        });
      } else {
        Alert.alert("Error", "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP request:", error);
      Alert.alert("Error", "An error occurred while sending OTP. Try again.");
    }
  },

  getSeller: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token found in AsyncStorage:", token);

      if (!token) {
        Alert.alert("Error", "Authentication token is missing. Please sign in again.");
        console.error("No token found, logging out user.");
        set({ seller: null });
        router.replace("/(auth)/sign-in");
        return;
      }

      const response = await axios.get(`${constants.base_url}/api/seller`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Seller bobobo details response:", response);

      if (response.status === 200) {
        const sellerData: Seller = {
          id: response.data.seller._id,
          name: response.data.seller.name,
          mobile: response.data.seller.mobile,
          gender: response.data.seller.gender,
          email : response.data.seller.email,
          lang: response.data.seller.lang,
          isActive: response.data.seller.isActive,
          createdAt: response.data.seller.createdAt,
          storeDetails: response.data.seller.storeDetails,
          storeAddress: response.data.seller.storeAddress,
          bankDetails: response.data.seller.bankDetails,
          salesStatistics: response.data.seller.salesStatistics,
        };
        

        set({ seller: sellerData });
        console.log("Seller details fetched successfully:", sellerData);
      } else {
        Alert.alert("Error", "Failed to retrieve seller details.");
      }
    } catch (error: any) {
      console.error("Error while fetching seller details:", error);

      if (error.response?.status === 401) {
        Alert.alert("Session Expired", "Please sign in again.");
        await AsyncStorage.removeItem("token");
        set({ seller: null });
        router.replace("/(auth)/sign-in");
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
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
