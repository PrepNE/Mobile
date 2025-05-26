import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useCarts from '@/hooks/useCart';
import { useRouter } from 'expo-router';
import useOrders from '@/hooks/useOrders';

const Cart = () => {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getCartSummary
  } = useCarts();
  const { placeOrder } = useOrders();

  const { totalItems, totalPrice, originalPrice, totalSavings, discountPercentage } = getCartSummary();

  const renderItem = ({ item }: {item: any}) => {
    const { product, quantity } = item;
    const discountedPrice = product.price - (product.price * product.discountPercentage / 100);

    return (
      <View className="flex-row items-center bg-white rounded-lg shadow-sm mb-4 mx-4 p-3">
        <Image
          source={{ uri: product.thumbnail }}
          className="w-20 h-20 rounded-md"
          resizeMode="cover"
        />
        <View className="flex-1 ml-4">
          <Text className="text-lg font-semibold text-gray-800">{product.title}</Text>
          <Text className="text-sm text-gray-500">{product.brand}</Text>
          <View className="flex-row items-center mt-2">
            <Text className="text-green-600 font-bold text-lg">${discountedPrice.toFixed(2)}</Text>
            {product.discountPercentage > 0 && (
              <Text className="text-gray-400 ml-2 line-through text-sm">
                ${product.price.toFixed(2)}
              </Text>
            )}
          </View>

          {/* Quantity Controls */}
          <View className="flex-row items-center mt-2">
            <TouchableOpacity onPress={() => decreaseQuantity(product.id)} className="p-1 bg-gray-200 rounded">
              <Ionicons name="remove" size={20} color="#4B5563" />
            </TouchableOpacity>
            <Text className="mx-3 text-base">{quantity}</Text>
            <TouchableOpacity onPress={() => increaseQuantity(product.id)} className="p-1 bg-gray-200 rounded">
              <Ionicons name="add" size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => removeFromCart(product.id)}>
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
    );
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Ionicons name="cart-outline" size={64} color="#9CA3AF" />
        <Text className="text-xl text-gray-500 mt-4">Your cart is empty</Text>
        <TouchableOpacity
          className="mt-6 bg-blue-500 px-6 py-3 rounded-full"
          onPress={() => router.push('/home')}
        >
          <Text className="text-white font-medium">Shop Now</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-4 bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-gray-100">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Your Cart</Text>
        <View className="w-8" />
      </View>

      {/* Cart List */}
      <FlatList
        data={cart}
        keyExtractor={(item) => item.product.id.toString()}
        renderItem={renderItem}
        className="mt-4"
      />

      {/* Summary Footer */}
      <View className="bg-white p-4 border-t border-gray-200">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500">Original Price:</Text>
          <Text className="text-gray-500">${originalPrice.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500">Savings:</Text>
          <Text className="text-green-600">- ${totalSavings.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between mb-4">
          <Text className="text-base font-semibold">Total:</Text>
          <Text className="text-base font-semibold text-green-600">${totalPrice.toFixed(2)}</Text>
        </View>
       <TouchableOpacity
  className="bg-blue-600 py-3 rounded-lg items-center"
  onPress={placeOrder}
>
  <Text className="text-white font-semibold text-base">Place Order</Text>
</TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Cart;
