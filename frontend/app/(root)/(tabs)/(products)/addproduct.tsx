import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { MaterialIcons } from "@expo/vector-icons";
import images from "@/constants/images";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import constants from "@/constants/data";

const categories = [
  "Seeds",
  "Pesticides",
  "Fertilizers",
  "Herbicides",
  "Crops",
  "Tools & Equipment",
];

const returnPolicies = [
  "7-day return available",
  "No returns",
  "15-day return available",
];

const AddProduct = () => {
  const [fileType, setFileType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    brand: "",
    images: [] as string[],
    price: {
      mrp: "",
      sellingPrice: "",
      discountPercentage: 0,
    },
    stock: {
      quantity: "",
      lowStockThreshold: "5",
    },
    specifications: {
      weight: "",
      composition: "",
      usageInstructions: "",
      expiryDate: "",
      cropSuitability: "",
      soilType: [] as string[],
      organic: false as boolean,
    },
    shipping: {
      weight: "",
      dimensions: {
        length: "",
        width: "",
        height: "",
      },
      deliveryTimeInDays: "3",
    },
    tags: "",
    returnPolicy: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    category: "",
    images: "",
    mrp: "",
    sellingPrice: "",
    quantity: "",
  });

  const pickImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*", // Allow all image types
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setFileType(file.name.split(".").pop() || ""); // Get file extension or default to empty string

        setFormData((prevFormData) => ({
          ...prevFormData,
          images: [file.uri], // Store the image URI
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const removeImage = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: [], // Clear the images array
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      description: "",
      category: "",
      images: "",
      mrp: "",
      sellingPrice: "",
      quantity: "",
    };

    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.description)
      newErrors.description = "Product description is required";
    if (!formData.category) newErrors.category = "Product category is required";
    if (formData.images.length === 0)
      newErrors.images = "Product image is required";
    if (!formData.price.mrp) newErrors.mrp = "MRP is required";
    if (!formData.price.sellingPrice)
      newErrors.sellingPrice = "Selling price is required";
    if (!formData.stock.quantity)
      newErrors.quantity = "Stock quantity is required";

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

 const createProduct = async (formData: any, fileType: string) => {
   try {
     // Retrieve the authentication token
     const token = await AsyncStorage.getItem("Sellertoken");

     if (!token) {
       Alert.alert("Error", "Authentication token missing. Please sign in.");
       router.replace("/(auth)/sign-in");
       return;
     }

     let uploadedImageUrl: string | null = null;

     // Upload the product image if available
     if (formData.images?.length > 0) {
       try {
         const imageUri = formData.images[0];
         const fileName = `product-images/${Date.now()}.${fileType}`;

         // Get the pre-signed upload URL
         const uploadResponse = await axios.post(
           `${constants.base_url}/api/image/upload`,
           { key: fileName, contentType: `image/${fileType}` }
         );

         if (!uploadResponse.data.uploadUrl) {
           throw new Error("Failed to retrieve pre-signed upload URL");
         }

         const { uploadUrl } = uploadResponse.data;

         // Fetch the image file and convert it to a blob
         const response = await fetch(imageUri);
         const blob = await response.blob();

         // Upload the image to the pre-signed URL
         const imageResponse = await fetch(uploadUrl, {
           method: "PUT",
           headers: { "Content-Type": `image/${fileType}` },
           body: blob,
         });

         if (!imageResponse.ok) {
           throw new Error(
             `Failed to upload image: ${imageResponse.statusText}`
           );
         }

         // Extract the uploaded image URL
         uploadedImageUrl = uploadUrl.split("?")[0];
         console.log("Uploaded image URL:", uploadedImageUrl);
       } catch (uploadError) {
         console.error("Error uploading product image:", uploadError);
         throw new Error("Product image upload failed");
       }
     }

     // Parse MRP and selling price as numbers
     const mrp = parseFloat(formData.price.mrp) || 0;
     const sellingPrice = parseFloat(formData.price.sellingPrice) || 0;

     // Calculate discount percentage
     const discountPercentage =
       mrp > 0
         ? parseFloat((((mrp - sellingPrice) / mrp) * 100).toFixed(2))
         : 0;

     // Convert tags and cropSuitability to arrays
     const tagsArray =
       typeof formData.tags === "string"
         ? formData.tags
             .split(",")
             .map((tag: string) => tag.trim())
             .filter((tag: string) => tag !== "")
         : Array.isArray(formData.tags)
         ? formData.tags
         : [];

     const cropSuitabilityArray =
       typeof formData.specifications.cropSuitability === "string"
         ? formData.specifications.cropSuitability
             .split(",")
             .map((item: string) => item.trim())
             .filter((item: string) => item !== "")
         : Array.isArray(formData.specifications.cropSuitability)
         ? formData.specifications.cropSuitability
         : [];

     // Prepare the product data for submission
     const productData = {
       ...formData, // Include other form data
       images: uploadedImageUrl ? [uploadedImageUrl] : [], // Use the uploaded image URL if available
       price: {
         mrp: mrp,
         sellingPrice: sellingPrice,
         discountPercentage: discountPercentage,
       },
       stock: {
         quantity: parseInt(formData.stock.quantity),
         lowStockThreshold: parseInt(formData.stock.lowStockThreshold),
       },
       specifications: {
         ...formData.specifications,
         expiryDate: new Date(formData.specifications.expiryDate), // Convert to Date object
         cropSuitability: cropSuitabilityArray, // Ensure cropSuitability is an array
         soilType: formData.specifications.soilType, // Already an array
       },
       shipping: {
         weight: parseFloat(formData.shipping.weight),
         dimensions: {
           length: parseFloat(formData.shipping.dimensions.length),
           width: parseFloat(formData.shipping.dimensions.width),
           height: parseFloat(formData.shipping.dimensions.height),
         },
         deliveryTimeInDays: parseInt(formData.shipping.deliveryTimeInDays),
       },
       tags: tagsArray, // Ensure tags is an array
     };

     console.log("Product data being sent:", productData);

     // Send the product data to the backend
     const response = await axios.post(
       `${constants.base_url}/api/products`,
       productData,
       { headers: { Authorization: `Bearer ${token}` } }
     );

     // Handle the response
     if (response.status === 201) {
       Alert.alert("Success", "Product created successfully.");
       router.replace("/(root)/(tabs)/home");
     } else {
       Alert.alert("Error", "Failed to create product.");
     }
   } catch (error) {
     console.error("Error creating product:", error);
     Alert.alert("Error", "An error occurred while creating the product.");
   }
 };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form data:", formData);
      createProduct(formData, fileType);
    } else {
      Alert.alert("Error", "Please fill all the required fields.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 bg-white px-6 py-10">
        <View>
          <Text className="text-center text-primary-500 font-rubik text-3xl mb-4">
            Add New Product
          </Text>

          <Text className="text-gray-700 font-rubik text-xl mb-4">
            Product Information
          </Text>

          {/* Product Name */}
          <Text className="text-gray-700 font-rubik mb-2">
            Product Name<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter your product name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          {errors.name ? (
            <Text style={styles.errorText}>{errors.name}</Text>
          ) : null}

          {/* Product Description */}
          <Text className="text-gray-700 font-rubik mb-2">
            Product Description<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter your product description"
            multiline
            numberOfLines={3}
            style={{ height: 100, textAlignVertical: "top" }}
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
          />
          {errors.description ? (
            <Text style={styles.errorText}>{errors.description}</Text>
          ) : null}

          {/* Product Category */}
          <Text className="text-gray-700 font-rubik mb-2">
            Product Category<Text style={styles.requiredStar}>*</Text>
          </Text>
          <View
            className="border border-gray-300 rounded-lg mb-4 overflow-hidden"
            style={styles.pickerContainer}
          >
            <Picker
              selectedValue={formData.category}
              onValueChange={(itemValue) =>
                setFormData({
                  ...formData,
                  category: itemValue as string,
                })
              }
              style={styles.picker}
              dropdownIconColor="#4A5568"
              mode="dropdown"
            >
              <Picker.Item
                style={{ color: "#A0AEC0" }}
                label="Select Product Category"
                value=""
              />
              {categories.map((category) => (
                <Picker.Item
                  key={category}
                  label={category}
                  value={category}
                  color={formData.category === category ? "green" : "black"}
                />
              ))}
            </Picker>
            <View style={styles.dropdownIcon}>
              <MaterialIcons name="arrow-drop-down" size={24} color="#4A5568" />
            </View>
          </View>
          {errors.category ? (
            <Text style={styles.errorText}>{errors.category}</Text>
          ) : null}

          {/* Subcategory */}
          <Text className="text-gray-700 font-rubik mb-2">Subcategory</Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter your product subcategory"
            value={formData.subCategory}
            onChangeText={(text) =>
              setFormData({ ...formData, subCategory: text })
            }
          />

          {/* Product Brand */}
          <Text className="text-gray-700 font-rubik mb-2">Product Brand</Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter your product brand"
            value={formData.brand}
            onChangeText={(text) => setFormData({ ...formData, brand: text })}
          />

          {/* Product Images */}
          <View>
            <Text className="text-gray-700 font-rubik mb-2">
              Product Images<Text style={styles.requiredStar}>*</Text>
            </Text>
            <View className="flex-row items-center mb-4">
              <TouchableOpacity
                onPress={pickImage}
                className="flex-row items-center"
              >
                {formData.images.length > 0 ? (
                  <Image
                    source={{ uri: formData.images[0] }}
                    className="w-16 h-16 mr-2 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require("@/assets/images/upload.png")}
                    className="w-8 h-8 mr-2"
                    resizeMode="contain"
                  />
                )}
                <Text className="text-gray-700 font-rubik">Upload Image</Text>
              </TouchableOpacity>

              {/* Remove Image Button */}
              {formData.images.length > 0 && (
                <TouchableOpacity
                  onPress={removeImage}
                  className="ml-4 bg-red-500 w-6 h-6 rounded-full flex items-center justify-center"
                >
                  <Text className="text-white text-sm font-bold">X</Text>
                </TouchableOpacity>
              )}
            </View>
            {errors.images ? (
              <Text style={styles.errorText}>{errors.images}</Text>
            ) : null}
          </View>

          {/* Separator */}
          <View className="border-b border-green-300 mb-6"></View>

          {/* Product Price */}
          <Text className="text-gray-700 font-rubik text-xl mb-4">
            Pricing & Stock
          </Text>

          {/* MRP */}
          <Text className="text-gray-700 font-rubik mb-2">
            MRP<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter MRP"
            keyboardType="number-pad"
            value={formData.price.mrp}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                price: { ...formData.price, mrp: text },
              })
            }
          />
          {errors.mrp ? (
            <Text style={styles.errorText}>{errors.mrp}</Text>
          ) : null}

          {/* Selling Price */}
          <Text className="text-gray-700 font-rubik mb-2">
            Selling Price<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter selling price"
            keyboardType="number-pad"
            value={formData.price.sellingPrice}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                price: { ...formData.price, sellingPrice: text },
              })
            }
          />
          {errors.sellingPrice ? (
            <Text style={styles.errorText}>{errors.sellingPrice}</Text>
          ) : null}

          {/* Discount Percentage */}
          <Text className="text-gray-700 font-rubik mb-2">
            Discount Percentage:{" "}
            {formData.price.mrp && formData.price.sellingPrice
              ? (
                  ((parseFloat(formData.price.mrp) -
                    parseFloat(formData.price.sellingPrice)) /
                    parseFloat(formData.price.mrp)) *
                  100
                ).toFixed(2)
              : "0"}
            %
          </Text>

          {/* Stock Quantity */}
          <Text className="text-gray-700 font-rubik mb-2">
            Stock Quantity<Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter stock quantity"
            keyboardType="number-pad"
            value={formData.stock.quantity}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                stock: { ...formData.stock, quantity: text },
              })
            }
          />
          {errors.quantity ? (
            <Text style={styles.errorText}>{errors.quantity}</Text>
          ) : null}

          {/* Low Stock Threshold */}
          <Text className="text-gray-700 font-rubik mb-2">
            Notify When Stock is less or equal
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter low stock threshold"
            keyboardType="number-pad"
            value={formData.stock.lowStockThreshold}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                stock: { ...formData.stock, lowStockThreshold: text },
              })
            }
          />

          {/* Separator */}
          <View className="border-b border-green-300 mb-6"></View>

          {/* Product Specifications */}
          <Text className="text-gray-700 font-rubik text-xl mb-4">
            Product Specifications
          </Text>

          {/* Weight */}
          <Text className="text-gray-700 font-rubik mb-2">Product Weight</Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter product weight"
            value={formData.specifications.weight}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                specifications: { ...formData.specifications, weight: text },
              })
            }
          />

          {/* Composition */}
          <Text className="text-gray-700 font-rubik mb-2">
            Product Composition
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Composition (e.g., NPK 20-20-20)"
            value={formData.specifications.composition}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                specifications: {
                  ...formData.specifications,
                  composition: text,
                },
              })
            }
          />

          {/* Usage Instructions */}
          <Text className="text-gray-700 font-rubik mb-2">
            Usage Instructions
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter usage instructions"
            multiline
            numberOfLines={3}
            style={{ height: 100, textAlignVertical: "top" }}
            value={formData.specifications.usageInstructions}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                specifications: {
                  ...formData.specifications,
                  usageInstructions: text,
                },
              })
            }
          />

          {/* Expiry Date */}
          <Text className="text-gray-700 font-rubik mb-2">Expiry Date</Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="yyyy-mm-dd"
            value={formData.specifications.expiryDate || ""}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                specifications: {
                  ...formData.specifications,
                  expiryDate: text,
                },
              })
            }
          />

          {/* Crop Suitability */}
          <Text className="text-gray-700 font-rubik mb-2">
            Crop Suitability
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="comma separated values eg. Wheat, Rice, etc."
            value={formData.specifications.cropSuitability}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                specifications: {
                  ...formData.specifications,
                  cropSuitability: text,
                },
              })
            }
          />

          {/* Soil Type */}
          <Text className="text-gray-700 font-rubik mb-2">Soil Type</Text>
          {/* as soil multiselect soiltypes so make checkboxes to select soild type ok */}
          <View className="flex-row flex-wrap mb-4">
            {["Black", "Red", "Sandy", "Loamy", "Clayey"].map((soilType) => (
              <View key={soilType} className="flex-row items-center mr-4 mb-2">
                <TouchableOpacity
                  onPress={() => {
                    const isSelected =
                      formData.specifications.soilType.includes(soilType);
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      specifications: {
                        ...prevFormData.specifications,
                        soilType: isSelected
                          ? prevFormData.specifications.soilType.filter(
                              (type) => type !== soilType
                            )
                          : [...prevFormData.specifications.soilType, soilType],
                      },
                    }));
                  }}
                  className="flex-row items-center"
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: "#4A5568",
                      backgroundColor:
                        formData.specifications.soilType.includes(soilType)
                          ? "green"
                          : "transparent",
                      marginRight: 8,
                    }}
                  />
                  <Text className="text-gray-700 font-rubik">{soilType}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Organic */}
          <TouchableOpacity
            onPress={() =>
              setFormData({
                ...formData,
                specifications: {
                  ...formData.specifications,
                  organic: !formData.specifications.organic,
                },
              })
            }
            className="flex-row items-center mb-4"
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: "#4A5568",
                backgroundColor: formData.specifications.organic
                  ? "green"
                  : "transparent",
                marginRight: 8,
              }}
            />
            <Text className="text-gray-700 font-rubik">Organic</Text>
          </TouchableOpacity>

          {/* Separator */}
          <View className="border-b border-green-300 mb-6"></View>

          {/* Product Shipping */}
          <Text className="text-gray-700 font-rubik text-xl mb-4">
            Shipping Information
          </Text>

          {/* Weight */}
          <Text className="text-gray-700 font-rubik mb-2">Product Weight</Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter product weight"
            value={formData.shipping.weight}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                shipping: { ...formData.shipping, weight: text },
              })
            }
          />

          {/* Dimensions */}
          <Text className="text-gray-700 font-rubik mb-2">
            Product Dimensions
          </Text>

          {/* Length */}
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Length in cm"
            keyboardType="number-pad"
            value={formData.shipping.dimensions.length}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                shipping: {
                  ...formData.shipping,
                  dimensions: { ...formData.shipping.dimensions, length: text },
                },
              })
            }
          />

          {/* Breadth */}
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Breadth in cm"
            keyboardType="number-pad"
            value={formData.shipping.dimensions.width}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                shipping: {
                  ...formData.shipping,
                  dimensions: {
                    ...formData.shipping.dimensions,
                    width: text,
                  },
                },
              })
            }
          />

          {/* Height */}
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Height in cm"
            keyboardType="number-pad"
            value={formData.shipping.dimensions.height}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                shipping: {
                  ...formData.shipping,
                  dimensions: { ...formData.shipping.dimensions, height: text },
                },
              })
            }
          />

          {/* Delivery Time in Days */}
          <Text className="text-gray-700 font-rubik mb-2">
            Delivery Time in Days
          </Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter delivery time in days"
            keyboardType="number-pad"
            value={formData.shipping.deliveryTimeInDays}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                shipping: { ...formData.shipping, deliveryTimeInDays: text },
              })
            }
          />

          {/* tags */}
          <Text className="text-gray-700 font-rubik mb-2">Tags</Text>
          <TextInput
            className="border font-rubik border-gray-300 rounded-lg px-4 py-3 mb-2 text-gray-800"
            placeholder="Enter tags separated by commas"
            value={formData.tags}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                tags: text,
              })
            }
          />

          {/* returnPolicy */}
          <Text className="text-gray-700 font-rubik mb-2">Return Policy</Text>
          <View
            className="border border-gray-300 rounded-lg mb-4 overflow-hidden"
            style={styles.pickerContainer}
          >
            <Picker
              selectedValue={formData.returnPolicy}
              onValueChange={(itemValue) =>
                setFormData({ ...formData, returnPolicy: itemValue as string })
              }
              style={styles.picker}
              dropdownIconColor="#4A5568"
              mode="dropdown"
            >
              <Picker.Item
                style={{ color: "#A0AEC0" }}
                label="Select Return Policy"
                value=""
              />
              {returnPolicies.map((policy) => (
                <Picker.Item
                  key={policy}
                  label={policy}
                  value={policy}
                  color={formData.returnPolicy === policy ? "green" : "black"}
                />
              ))}
            </Picker>
            <View style={styles.dropdownIcon}>
              <MaterialIcons name="arrow-drop-down" size={24} color="#4A5568" />
            </View>
          </View>

          {/* submit button */}

          <TouchableOpacity
            className="bg-primary-500 py-3 rounded-full mt-6 mx-20"
            onPress={handleSubmit}
          >
            <Text className="text-white text-center font-rubik">
              Add Product
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    position: "relative",
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
  },
  picker: {
    width: "100%",
    height: 50,
    color: "#1A202C",
  },
  dropdownIcon: {
    position: "absolute",
    right: 10,
    top: 12,
    pointerEvents: "none",
  },
  requiredStar: {
    color: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
});

export default AddProduct;
