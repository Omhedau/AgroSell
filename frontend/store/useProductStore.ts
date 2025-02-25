import axios from "axios";
import { create } from "zustand";
import { router } from "expo-router";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import constants from "@/constants/data";

// Define Product Type (Updated to match schema)
interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  category: string;
  subCategory?: string;
  brand?: string;
  images: string[]; // Array of image URLs (but only one image will be uploaded)
  price: {
    mrp: number;
    sellingPrice: number;
    discountPercentage?: number;
  };
  stock: {
    quantity: number;
    lowStockThreshold?: number;
  };
  specifications?: {
    weight?: string;
    composition?: string;
    usageInstructions?: string;
    expiryDate?: string;
    cropSuitability?: string[];
    soilType?: string[];
    organic?: boolean;
  };
  variants?: {
    variantName: string;
    options: { name: string; additionalPrice: number }[];
  }[];
  shipping?: {
    weight?: number;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
    };
    deliveryTimeInDays?: number;
  };
  returnPolicy?: string;
  isActive?: boolean;
  createdAt?: string;
}

// Define Zustand Store Type
interface ProductStore {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  createProduct: (formData: any, fileType: string) => Promise<void>;
}

// Zustand Store
const useProductStore = create<ProductStore>((set) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,

  // ✅ Create a new product
  createProduct: async (formData: any, fileType: string) => {
    try {
      set({ isLoading: true });
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "Authentication token missing. Please sign in.");
        router.replace("/(auth)/sign-in");
        return;
      }

      let uploadedImageUrl: string | null = null;

      // ✅ Upload product image if available (only the first image)
      if (formData.images.length > 0) {
        try {
          const imageUri = formData.images[0]; // Use only the first image
          const fileName = `product-images/${Date.now()}.${fileType}`;
          const uploadResponse = await axios.post(
            `${constants.base_url}/api/image/upload`,
            { key: fileName, contentType: `image/${fileType}` }
          );

          if (!uploadResponse.data.uploadUrl) {
            throw new Error("Failed to retrieve pre-signed upload URL");
          }

          const { uploadUrl } = uploadResponse.data;
          const response = await fetch(imageUri);
          const blob = await response.blob();

          const imageResponse = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": `image/${fileType}` },
            body: blob,
          });

          if (!imageResponse.ok) {
            throw new Error(`Failed to upload image: ${imageResponse.statusText}`);
          }

          uploadedImageUrl = uploadUrl.split("?")[0]; // Store the uploaded image URL
        } catch (error) {
          console.error("Image upload error:", error);
          Alert.alert("Error", "Failed to upload product image.");
          return;
        }
      }

      // ✅ Construct Product Data
      const productData: Product = {
        id: "",
        sellerId: formData.sellerId,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        subCategory: formData.subCategory,
        brand: formData.brand,
        images: uploadedImageUrl ? [uploadedImageUrl] : [], // Use the uploaded image URL
        price: {
          mrp: formData.price.mrp,
          sellingPrice: formData.price.sellingPrice,
          discountPercentage: formData.price.discountPercentage || 0,
        },
        stock: {
          quantity: formData.stock.quantity,
          lowStockThreshold: formData.stock.lowStockThreshold || 5,
        },
        specifications: {
          weight: formData.specifications?.weight,
          composition: formData.specifications?.composition,
          usageInstructions: formData.specifications?.usageInstructions,
          expiryDate: formData.specifications?.expiryDate,
          cropSuitability: formData.specifications?.cropSuitability || [],
          soilType: formData.specifications?.soilType || [],
          organic: formData.specifications?.organic || false,
        },
        variants: formData.variants || [],
        shipping: {
          weight: formData.shipping?.weight,
          dimensions: formData.shipping?.dimensions,
          deliveryTimeInDays: formData.shipping?.deliveryTimeInDays || 3,
        },
        returnPolicy: formData.returnPolicy || "7-day return available",
        isActive: formData.isActive ?? true,
      };

      // ✅ Send request to create product
      const response = await axios.post(
        `${constants.base_url}/api/products`,
        productData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Product created successfully!");
        set((state) => ({
          products: [...state.products, { ...productData, id: response.data.product.id }],
        }));
        router.replace("/(root)/(tabs)/products");
      } else {
        Alert.alert("Error", "Failed to create product.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useProductStore;