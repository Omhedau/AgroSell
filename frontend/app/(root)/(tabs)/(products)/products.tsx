import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import axios from 'axios';
import constants from '@/constants/data';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: { sellingPrice: number };
  images: string[];
}

const Products = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await AsyncStorage.getItem("Sellertoken");
        const response = await axios.get<{ products: Product[] }>(
          `${constants.base_url}/api/products`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(response.data.products);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname : '/productdetail', params: { id: item._id } })}
    >
      <Image source={{ uri: item.images[0] }} style={styles.image} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
      <Text style={styles.productPrice}>₹{item.price.sellingPrice}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/addproduct')} style={styles.button}>
        <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.gradient}>
          <Text style={styles.buttonText}>Add Product</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.title}>Your Products</Text>

      {loading ? (
        <Text style={styles.loading}>Loading products...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    alignItems: 'center',
  },
  button: {
    width: '90%',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    position: 'absolute',
    top: 20,
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 80,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 15,
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    color: '#ff7e5f',
    fontWeight: 'bold',
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  loading: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
});
