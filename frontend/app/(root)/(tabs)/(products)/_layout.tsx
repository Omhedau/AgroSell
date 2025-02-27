import {  StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

const ProductsLayout = () => {
  return (
    <Stack initialRouteName="products">
      <Stack.Screen name="products" options={{ headerShown: false }} />
      <Stack.Screen name="addproduct" options={{ headerShown: false }} />
     
    </Stack>
  )
}

export default ProductsLayout

const styles = StyleSheet.create({})



