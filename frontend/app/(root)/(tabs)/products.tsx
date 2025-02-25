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
    images: [] as string[], // Image URIs stored here
    price: { mrp: "", sellingPrice: "", discountPercentage: "0" },
    stock: { quantity: "", lowStockThreshold: "5" },
    tags: "",
    returnPolicy: returnPolicies[0],
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
      returnPolicy: formData.returnPolicy,
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

        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product name"
          value={formData.productName}
          onChangeText={(text) => setFormData({ ...formData, productName: text })}
        />
        {errors.productName && <Text style={styles.errorText}>{errors.productName}</Text>}

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

        <Text style={styles.label}>Upload Product Image *</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <MaterialIcons name="photo-library" size={24} color="#fff" />
          <Text style={styles.buttonText}>Select Image</Text>
        </TouchableOpacity>
        {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}

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

        <Text style={styles.label}>MRP (₹) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter MRP"
          keyboardType="numeric"
          value={formData.price.mrp}
          onChangeText={(text) => setFormData({ ...formData, price: { ...formData.price, mrp: text } })}
        />
        {errors.mrp && <Text style={styles.errorText}>{errors.mrp}</Text>}

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

        <Text style={styles.label}>Stock Quantity *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter stock quantity"
          keyboardType="numeric"
          value={formData.stock.quantity}
          onChangeText={(text) => setFormData({ ...formData, stock: { ...formData.stock, quantity: text } })}
        />
        {errors.stockQuantity && <Text style={styles.errorText}>{errors.stockQuantity}</Text>}

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