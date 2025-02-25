import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import useProductStore from "@/store/useProductStore";

const categories = [
  "Seeds",
  "Pesticides",
  "Fertilizers",
  "Herbicides",
  "Crops",
  "Tools & Equipment",
];

const returnPolicies = ["7-day return available", "No returns", "15-day return available"];

const AddProduct = () => {
  const { createProduct, isLoading } = useProductStore();
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    category: categories[0],
    subCategory: "",
    brand: "",
    images: [] as string[], // Image URIs stored here
    price: { mrp: "", sellingPrice: "", discountPercentage: "0" },
    stock: { quantity: "", lowStockThreshold: "5" },
    specifications: {
      weight: "",
      composition: "",
      usageInstructions: "",
      expiryDate: "",
      cropSuitability: [] as string[],
      soilType: [] as string[],
      organic: false,
    },
    variants: [] as { variantName: string; options: { name: string; additionalPrice: number }[] }[],
    shipping: {
      weight: "",
      dimensions: { length: "", width: "", height: "" },
      deliveryTimeInDays: "3",
    },
    returnPolicy: returnPolicies[0],
    tags: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false, // Allow only one image
      quality: 1,
    });

    if (!result.canceled) {
      setFormData((prev) => ({
        ...prev,
        images: [result.assets[0].uri], // Store only the first image
      }));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [],
    }));
  };

  const validateForm = () => {
    let newErrors: any = {};
    if (!formData.productName) newErrors.productName = "Product Name is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.price.mrp || isNaN(Number(formData.price.mrp)))
      newErrors.mrp = "Valid MRP is required";
    if (!formData.price.sellingPrice || isNaN(Number(formData.price.sellingPrice)))
      newErrors.sellingPrice = "Valid Selling Price is required";
    if (!formData.stock.quantity || isNaN(Number(formData.stock.quantity)))
      newErrors.stockQuantity = "Valid Stock Quantity is required";
    if (formData.images.length === 0) newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDiscount = () => {
    const mrp = Number(formData.price.mrp);
    const sellingPrice = Number(formData.price.sellingPrice);
    return mrp > sellingPrice ? (((mrp - sellingPrice) / mrp) * 100).toFixed(2) : "0";
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const fileType = formData.images[0]?.split(".").pop() || "jpg"; // Extract file type from the first image URI

    const productData = {
      sellerId: "seller123", // Replace with actual seller ID (e.g., from auth context)
      name: formData.productName,
      description: formData.description,
      category: formData.category,
      subCategory: formData.subCategory,
      brand: formData.brand,
      images: formData.images, // Pass only the first image
      price: {
        mrp: Number(formData.price.mrp),
        sellingPrice: Number(formData.price.sellingPrice),
        discountPercentage: Number(calculateDiscount()),
      },
      stock: {
        quantity: Number(formData.stock.quantity),
        lowStockThreshold: Number(formData.stock.lowStockThreshold),
      },
      specifications: {
        weight: formData.specifications.weight,
        composition: formData.specifications.composition,
        usageInstructions: formData.specifications.usageInstructions,
        expiryDate: formData.specifications.expiryDate,
        cropSuitability: formData.specifications.cropSuitability,
        soilType: formData.specifications.soilType,
        organic: formData.specifications.organic,
      },
      variants: formData.variants,
      shipping: {
        weight: Number(formData.shipping.weight),
        dimensions: {
          length: Number(formData.shipping.dimensions.length),
          width: Number(formData.shipping.dimensions.width),
          height: Number(formData.shipping.dimensions.height),
        },
        deliveryTimeInDays: Number(formData.shipping.deliveryTimeInDays),
      },
      returnPolicy: formData.returnPolicy,
      tags: formData.tags.split(",").map((tag) => tag.trim()), // Convert tags string to array
    };

    try {
      await createProduct(productData, fileType); // Call the store function
      Alert.alert("Success", "Product created successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to create product. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Text style={styles.heading}>Add New Product</Text>

        {/* Product Name */}
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product name"
          value={formData.productName}
          onChangeText={(text) => setFormData({ ...formData, productName: text })}
        />
        {errors.productName && <Text style={styles.errorText}>{errors.productName}</Text>}

        {/* Description */}
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter product description"
          multiline
          numberOfLines={3}
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

        {/* Category */}
        <Text style={styles.label}>Category *</Text>
        <Picker
          selectedValue={formData.category}
          onValueChange={(itemValue) => setFormData({ ...formData, category: itemValue })}
          style={styles.picker}
        >
          {categories.map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>

        {/* Subcategory */}
        <Text style={styles.label}>Subcategory</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter subcategory"
          value={formData.subCategory}
          onChangeText={(text) => setFormData({ ...formData, subCategory: text })}
        />

        {/* Brand */}
        <Text style={styles.label}>Brand</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter brand"
          value={formData.brand}
          onChangeText={(text) => setFormData({ ...formData, brand: text })}
        />

        {/* Upload Product Image */}
        <Text style={styles.label}>Upload Product Image *</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <MaterialIcons name="photo-library" size={24} color="#fff" />
          <Text style={styles.buttonText}>Select Image</Text>
        </TouchableOpacity>
        {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}

        {/* Display Selected Image */}
        {formData.images.length > 0 && (
          <View style={styles.imageContainer}>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: formData.images[0] }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                <MaterialIcons name="cancel" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* MRP */}
        <Text style={styles.label}>MRP (₹) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter MRP"
          keyboardType="numeric"
          value={formData.price.mrp}
          onChangeText={(text) => setFormData({ ...formData, price: { ...formData.price, mrp: text } })}
        />
        {errors.mrp && <Text style={styles.errorText}>{errors.mrp}</Text>}

        {/* Selling Price */}
        <Text style={styles.label}>Selling Price (₹) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Selling Price"
          keyboardType="numeric"
          value={formData.price.sellingPrice}
          onChangeText={(text) =>
            setFormData({ ...formData, price: { ...formData.price, sellingPrice: text } })
          }
        />
        {errors.sellingPrice && <Text style={styles.errorText}>{errors.sellingPrice}</Text>}

        {/* Stock Quantity */}
        <Text style={styles.label}>Stock Quantity *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter stock quantity"
          keyboardType="numeric"
          value={formData.stock.quantity}
          onChangeText={(text) => setFormData({ ...formData, stock: { ...formData.stock, quantity: text } })}
        />
        {errors.stockQuantity && <Text style={styles.errorText}>{errors.stockQuantity}</Text>}

        {/* Specifications */}
        <Text style={styles.label}>Specifications</Text>
        <TextInput
          style={styles.input}
          placeholder="Weight (e.g., 50kg)"
          value={formData.specifications.weight}
          onChangeText={(text) =>
            setFormData({
              ...formData,
              specifications: { ...formData.specifications, weight: text },
            })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Composition (e.g., NPK 20-20-20)"
          value={formData.specifications.composition}
          onChangeText={(text) =>
            setFormData({
              ...formData,
              specifications: { ...formData.specifications, composition: text },
            })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Usage Instructions"
          value={formData.specifications.usageInstructions}
          onChangeText={(text) =>
            setFormData({
              ...formData,
              specifications: { ...formData.specifications, usageInstructions: text },
            })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Expiry Date (YYYY-MM-DD)"
          value={formData.specifications.expiryDate}
          onChangeText={(text) =>
            setFormData({
              ...formData,
              specifications: { ...formData.specifications, expiryDate: text },
            })
          }
        />

        {/* Variants */}
        <Text style={styles.label}>Variants</Text>
        <TextInput
          style={styles.input}
          placeholder="Variant Name (e.g., Size)"
          value={formData.variants[0]?.variantName || ""}
          onChangeText={(text) =>
            setFormData({
              ...formData,
              variants: [{ variantName: text, options: [] }],
            })
          }
        />

        {/* Shipping */}
        <Text style={styles.label}>Shipping</Text>
        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          keyboardType="numeric"
          value={formData.shipping.weight}
          onChangeText={(text) =>
            setFormData({
              ...formData,
              shipping: { ...formData.shipping, weight: text },
            })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Dimensions - Length (cm)"
          keyboardType="numeric"
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
        <TextInput
          style={styles.input}
          placeholder="Dimensions - Width (cm)"
          keyboardType="numeric"
          value={formData.shipping.dimensions.width}
          onChangeText={(text) =>
            setFormData({
              ...formData,
              shipping: {
                ...formData.shipping,
                dimensions: { ...formData.shipping.dimensions, width: text },
              },
            })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Dimensions - Height (cm)"
          keyboardType="numeric"
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

        {/* Return Policy */}
        <Text style={styles.label}>Return Policy</Text>
        <Picker
          selectedValue={formData.returnPolicy}
          onValueChange={(itemValue) => setFormData({ ...formData, returnPolicy: itemValue })}
          style={styles.picker}
        >
          {returnPolicies.map((policy) => (
            <Picker.Item key={policy} label={policy} value={policy} />
          ))}
        </Picker>

        {/* Tags */}
        <Text style={styles.label}>Tags (comma-separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter tags (e.g., organic, eco-friendly)"
          value={formData.tags}
          onChangeText={(text) => setFormData({ ...formData, tags: text })}
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? "Creating Product..." : "Add Product"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: "#007BFF", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  picker: { height: 50, width: "100%", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 10 },
  errorText: { color: "red", marginBottom: 10 },
  textArea: { height: 100, textAlignVertical: "top" },
  uploadButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#007BFF", padding: 12, borderRadius: 8, justifyContent: "center", marginBottom: 10 },
  imageContainer: { flexDirection: "row", marginBottom: 10 },
  imageWrapper: { position: "relative", marginRight: 10 },
  imagePreview: { width: 80, height: 80, borderRadius: 5 },
  removeImageButton: { position: "absolute", top: 2, right: 2, backgroundColor: "#fff", borderRadius: 10, padding: 2 },
});