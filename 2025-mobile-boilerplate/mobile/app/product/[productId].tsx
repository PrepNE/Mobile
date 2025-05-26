import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import useProducts from "@/hooks/useProducts";
import useCarts from "@/hooks/useCart";
import { router, usePathname, useRouter } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import { Product } from "@/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

const ProductDetails = () => {
  const { getProductById } = useProducts();
  const { addToCart, totalItems, toggleFavorite, isFavorite } = useCarts();
  const router = useRouter();
  const toast = useToast();
  const pathname = usePathname();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const productId = useMemo(() => {
    return parseInt(pathname.split("/")[2]);
  }, [pathname]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const productData = await getProductById(productId);
        if (productData) {
          setProduct(productData);
        } else {
          toast.show("Product not found", { type: "error" });
          router.back();
        }
      } catch (error) {
        toast.show("Failed to load product", { type: "error" });
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const adjustQuantity = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-500 mt-4">Loading product details...</Text>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-red-500 text-lg mt-4">Product not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-500 px-6 py-3 rounded-full mt-4"
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const renderImageItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity>
        <Image
          source={{ uri: item }}
          className="w-16 h-16"
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  const discountedPrice =
    product.price - (product.price * product.discountPercentage) / 100;
  const isProductFavorite = product ? isFavorite(product.id) : false;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-gray-100"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-gray-800">
          Product Details
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/cart")}
          className="p-2 rounded-full bg-gray-100 relative"
        >
          <Ionicons name="cart" size={24} color="#374151" />
          {totalItems > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 justify-center items-center">
              <Text className="text-white text-xs font-bold">{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-gray-50">
          <Image
            source={{
              uri: product.images?.[selectedImageIndex] || product.thumbnail,
            }}
            style={{ width: width, height: width * 0.8 }}
            resizeMode="contain"
          />
        </View>

        {product.images && product.images.length > 1 && (
          <View className="px-4 py-3 bg-gray-50">
            <FlatList
              data={product.images}
              renderItem={renderImageItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        <View className="px-4 py-6">
          <View className="mb-4">
            <View className="flex-row justify-between items-start">
              <View className="flex mr-4">
                <Text className="text-2xl font-bold text-gray-800 mb-2">
                  {product.title}
                </Text>
                <Text className="text-lg text-blue-600 font-medium">
                  {product.brand}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleFavorite(product)}
                className="p-2 rounded-full"
              >
                <Ionicons
                  name={isProductFavorite ? "heart" : "heart-outline"}
                  size={28}
                  color={isProductFavorite ? "#EF4444" : "#9CA3AF"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Ionicons name="star" size={20} color="#FFA500" />
              <Text className="text-lg font-medium text-gray-700 ml-1">
                {product.rating}
              </Text>
              <Text className="text-gray-500 ml-1">rating</Text>
            </View>
            <View className="bg-gray-100 px-3 py-1 rounded-full">
              <Text className="text-sm capitalize text-gray-600">
                {product.category}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-6">
            <Text className="text-3xl font-bold text-green-600">
              RWF{discountedPrice.toFixed(2)}
            </Text>
            {product.discountPercentage > 0 && (
              <View className="ml-3">
                <Text className="text-lg text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </Text>
                <View className="bg-red-100 px-2 py-1 rounded mt-1">
                  <Text className="text-xs text-red-600 font-bold">
                    -{product.discountPercentage.toFixed(0)}% OFF
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View className="flex-row items-center mb-6">
            <Ionicons
              name={
                product.stock > 10
                  ? "checkmark-circle"
                  : product.stock > 0
                  ? "warning"
                  : "close-circle"
              }
              size={20}
              color={
                product.stock > 10
                  ? "#10B981"
                  : product.stock > 0
                  ? "#F59E0B"
                  : "#EF4444"
              }
            />
            <Text
              className={`ml-2 font-medium ${
                product.stock > 10
                  ? "text-green-600"
                  : product.stock > 0
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {product.stock > 10
                ? "In Stock"
                : product.stock > 0
                ? `Only ${product.stock} left`
                : "Out of Stock"}
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Description
            </Text>
            <Text className="text-gray-600 leading-6">
              {product.description}
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Quantity
            </Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => adjustQuantity(-1)}
                disabled={quantity <= 1}
                className={`w-12 h-12 rounded-full justify-center items-center border-2 ${
                  quantity <= 1
                    ? "border-gray-200 bg-gray-100"
                    : "border-blue-500 bg-blue-50"
                }`}
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color={quantity <= 1 ? "#9CA3AF" : "#3B82F6"}
                />
              </TouchableOpacity>

              <Text className="text-xl font-bold text-gray-800 mx-6 min-w-[40px] text-center">
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={() => adjustQuantity(1)}
                disabled={quantity >= product.stock}
                className={`w-12 h-12 rounded-full justify-center items-center border-2 ${
                  quantity >= product.stock
                    ? "border-gray-200 bg-gray-100"
                    : "border-blue-500 bg-blue-50"
                }`}
              >
                <Ionicons
                  name="add"
                  size={20}
                  color={quantity >= product.stock ? "#9CA3AF" : "#3B82F6"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-4 py-4 border-t border-gray-100 bg-white">
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 py-4 rounded-xl flex-row justify-center items-center ${
              product.stock === 0 ? "bg-gray-300" : "bg-blue-500"
            }`}
          >
            <Ionicons name="cart" size={20} color="white" />
            <Text className="text-white font-bold text-lg ml-2">
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => product && toggleFavorite(product)}
            className="bg-red-500 px-6 py-4 rounded-xl justify-center items-center"
          >
            <Ionicons
              name={isProductFavorite ? "heart" : "heart-outline"}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <Text className="text-center text-gray-500 text-sm mt-3">
          Total: ${(discountedPrice * quantity).toFixed(2)}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetails;
