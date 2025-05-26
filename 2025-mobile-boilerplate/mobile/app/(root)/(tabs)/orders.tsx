import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useOrders from '@/hooks/useOrders';

const Orders = () => {
  const { orders } = useOrders();

  const renderOrder = ({ item }: { item: typeof orders[0] }) => (
    <TouchableOpacity className="bg-white p-4 rounded-lg shadow mb-3">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-lg font-bold text-gray-800">#{item.id}</Text>
          <Text className="text-sm text-gray-500">
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-sm font-semibold text-green-600">Delivered</Text>
          <Text className="text-base font-bold text-gray-800">${item.total.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-4">
      <View className="mt-6 mb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-800">My Orders</Text>
        <Ionicons name="cart-outline" size={24} color="gray" />
      </View>

      {orders.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="clipboard-outline" size={64} color="#9CA3AF" />
          <Text className="text-lg text-gray-500 mt-4">No orders yet</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrder}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
};

export default Orders;
