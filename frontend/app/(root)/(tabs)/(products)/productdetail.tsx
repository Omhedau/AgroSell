import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import constants from '@/constants/data';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  _id: string;
  name: string;
  category: string;
  subCategory: string;
  price: { sellingPrice: number; mrp: number; discountPercentage: number };
  description: string;
  images: string[];
  stock: { quantity: number; lowStockThreshold: number };
  specifications: {
    weight: string;
    composition: string;
    usageInstructions: string;
    expiryDate: { $date: string };
    cropSuitability: string[];
    soilType: string[];
    organic: boolean;
  };
  variants: any[];
  shipping: { weight: number; dimensions: { length: number; width: number; height: number }; deliveryTimeInDays: number };
  returnPolicy: string;
  tags: string[];
  brand: string;
}

const ProductDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get<{ product: Product }>(
          `${constants.base_url}/api/products/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProduct(response.data.product);
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff7e5f" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.images[0] }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.category}>{product.category} - {product.subCategory}</Text>
        <Text style={styles.price}>₹{product.price.sellingPrice}</Text>
        <Text style={styles.mrp}>MRP: ₹{product.price.mrp}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <Text style={styles.sectionTitle}>Specifications</Text>
        <Text style={styles.text}>Weight: {product.specifications.weight} kg</Text>
        <Text style={styles.text}>Composition: {product.specifications.composition}</Text>
        <Text style={styles.text}>Usage Instructions: {product.specifications.usageInstructions}</Text>
        <Text style={styles.text}>Expiry Date: {new Date(product.specifications.expiryDate.$date).toLocaleDateString()}</Text>
        <Text style={styles.text}>Crop Suitability: {product.specifications.cropSuitability.join(', ')}</Text>
        <Text style={styles.text}>Soil Type: {product.specifications.soilType.join(', ')}</Text>
        <Text style={styles.text}>Organic: {product.specifications.organic ? 'Yes' : 'No'}</Text>

        <Text style={styles.sectionTitle}>Shipping Details</Text>
        <Text style={styles.text}>Weight: {product.shipping.weight} kg</Text>
        <Text style={styles.text}>Dimensions: {product.shipping.dimensions.length}cm x {product.shipping.dimensions.width}cm x {product.shipping.dimensions.height}cm</Text>
        <Text style={styles.text}>Delivery Time: {product.shipping.deliveryTimeInDays} days</Text>

        <Text style={styles.sectionTitle}>Stock</Text>
        <Text style={styles.text}>Available Quantity: {product.stock.quantity}</Text>
        <Text style={styles.text}>Low Stock Threshold: {product.stock.lowStockThreshold}</Text>

        <Text style={styles.sectionTitle}>Return Policy</Text>
        <Text style={styles.text}>{product.returnPolicy}</Text>

        <Text style={styles.sectionTitle}>Tags</Text>
        <Text style={styles.text}>{product.tags.join(', ')}</Text>

        <Text style={styles.sectionTitle}>Brand</Text>
        <Text style={styles.text}>{product.brand}</Text>
      </View>
    </ScrollView>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    error: { color: 'red', fontSize: 16 },
    image: { width: '100%', height: 300, resizeMode: 'cover' },
    content: {
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30, // Add this for symmetry
      backgroundColor: '#fff', // Add a background color to make the radius visible
      padding: 20,
      marginTop: -20, // Adjust this to overlap the image slightly
      shadowColor: '#000', // Optional: Add a shadow for a lifted effect
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3, // For Android shadow
    },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    category: { fontSize: 16, color: '#777', marginVertical: 5 },
    price: { fontSize: 20, fontWeight: 'bold', color: '#ff7e5f', marginVertical: 10 },
    mrp: { fontSize: 16, color: '#999', textDecorationLine: 'line-through' },
    description: { fontSize: 16, color: '#444', marginTop: 10 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 15 },
    text: { fontSize: 16, color: '#555', marginTop: 5 },
  });