import CustomInput from "@/components/CustomInput";
import useProducts from "@/hooks/useProducts";
import useCart from "@/hooks/useCart";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, View, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

export default function HomeScreen() {
  const { products, getCategories, fetchingProducts } = useProducts();
  const { addToCart, totalItems } = useCart();
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState(products || []);
  const username = "Mike";

  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getCategories();
      if (cats) {
        // Handle both string arrays and object arrays from API
        const categoryList = cats.map((cat: any) => 
          typeof cat === 'string' ? cat : cat.slug || cat.name || cat
        );
        setCategories([{ slug: "all", name: "All Products" }, ...cats]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (products) {
      let filtered = products;
      
      // Filter by category
      if (selectedCategory !== "all") {
        filtered = filtered.filter(product => product.category === selectedCategory);
      }
      
      // Filter by search query
      if (searchQuery.trim()) {
        filtered = filtered.filter(product =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setFilteredProducts(filtered);
    }
  }, [products, selectedCategory, searchQuery]);

  const renderCategoryItem = ({ item }: { item: any }) => {
    const categorySlug = typeof item === 'string' ? item : item.slug;
    const categoryName = typeof item === 'string' ? item : item.name;
    
    return (
      <TouchableOpacity
        onPress={() => setSelectedCategory(categorySlug)}
        className={`px-4 py-2 mr-3 rounded-full ${
          selectedCategory === categorySlug
            ? "bg-blue-500"
            : "bg-gray-100"
        }`}
      >
        <Text
          className={`capitalize font-medium ${
            selectedCategory === categorySlug
              ? "text-white"
              : "text-gray-700"
          }`}
        >
          {categoryName === "all" ? "All Products" : categoryName}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderProductItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => router.push(`/product/${item.id}`)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
    >
      <Image
        source={{ uri: item.thumbnail }}
        className="w-full h-48"
        resizeMode="cover"
      />
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-lg font-semibold text-gray-800 flex-1 mr-2" numberOfLines={2}>
            {item.title}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="star" size={16} color="#FFA500" />
            <Text className="text-sm text-gray-600 ml-1">{item.rating}</Text>
          </View>
        </View>
        
        <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
          {item.description}
        </Text>
        
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Text className="text-xl font-bold text-blue-600">${item.price}</Text>
            {item.discountPercentage > 0 && (
              <View className="ml-2 bg-red-100 px-2 py-1 rounded">
                <Text className="text-xs text-red-600 font-medium">
                  -{item.discountPercentage.toFixed(0)}%
                </Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            onPress={() => addToCart(item, 1)}
            className="bg-blue-500 px-4 py-2 rounded-full flex-row items-center"
          >
            <Ionicons name="add" size={16} color="white" />
            <Text className="text-white font-medium ml-1">Add</Text>
          </TouchableOpacity>
        </View>
        
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-xs text-gray-500 capitalize">
            Category: {item.category}
          </Text>
          <Text className="text-xs text-gray-500">
            Stock: {item.stock}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-3 pb-4 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="storefront" size={28} color="#3B82F6" />
            <Text className="text-2xl font-bold ml-2 text-gray-800">Shop</Text>
          </View>
          {username && (
          <TouchableOpacity 
            onPress={() => router.push('/cart')}
            className="flex-row items-center bg-blue-50 px-4 py-2 rounded-full relative"
          >
            <Ionicons name="person-circle-outline" size={20} color="#3B82F6" />
            <Text className="text-sm font-medium text-blue-600 ml-2">{username}</Text>
            {totalItems > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 justify-center items-center">
                <Text className="text-white text-xs font-bold">{totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
          )}
        </View>

        {/* Search Bar */}
        <View className="mb-4">
          <CustomInput 
            icon={<Ionicons name="search-outline" size={24} color="#9CA3AF" />}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            containerStyle="bg-white border-gray-200 rounded-xl"
            inputStyle="text-gray-800"
          />
        </View>

        {/* Categories */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => typeof item === 'string' ? item : item.slug}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          />
        </View>

        {/* Products Header */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-800">Products</Text>
          <Text className="text-sm text-gray-500">
            {filteredProducts?.length || 0} items
          </Text>
        </View>

        {/* Loading State */}
        {fetchingProducts && (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-500 mt-2">Loading products...</Text>
          </View>
        )}

        {/* Products Grid */}
        {!fetchingProducts && filteredProducts && (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}

        {/* Empty State */}
        {!fetchingProducts && filteredProducts?.length === 0 && (
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="search-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg mt-4">No products found</Text>
            <Text className="text-gray-400 text-center mt-2">
              Try adjusting your search or category filter
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}