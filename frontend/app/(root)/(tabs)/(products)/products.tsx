import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import axios from 'axios';
import constants from '@/constants/data';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Products = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(
            `${constants.base_url}/api/products`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const renderProduct = ({ item }: { item: { _id: string; images: string[]; name: string; description: string, price: { sellingPrice: number } } }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.images[0] }} style={styles.image} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.productPrice}>₹{item.price.sellingPrice}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/addproduct')} style={styles.button}>
        <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.gradient}>
          <Text style={styles.buttonText}>Add Product</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.title}>Your Products</Text>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
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
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    color: '#ff7e5f',
    fontWeight: 'bold',
    marginTop: 5,
  },
  description:{
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  }
});
