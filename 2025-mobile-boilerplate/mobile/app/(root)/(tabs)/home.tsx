import CustomInput from "@/components/CustomInput";
import useProducts from "@/hooks/useProducts";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { products, getCategories, fetchingProducts } = useProducts();
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState(products || []);
  const username = "Mike";

  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getCategories();
      if (cats) {
        const categoryList = cats.map((cat: any) =>
          typeof cat === "string" ? cat : cat.slug || cat.name || cat
        );
        setCategories([{ slug: "all", name: "All Products" }, ...cats]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (products) {
      let filtered = products;

      if (selectedCategory !== "all") {
        filtered = products.filter(
          (product: any) => product.category === selectedCategory
        );
      }

      if (searchQuery.trim()) {
        filtered = products.filter(
          (product: any) =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
      }

      setFilteredProducts(filtered);
    }
  }, [products, filteredProducts, searchQuery]);

  const renderCategoryItem = ({ item }: { item: any }) => {
    const categorySlug = typeof item === "string" ? item : item.slug;
    const categoryName = typeof item === "string" ? item : item.name;

    return (
      <TouchableOpacity
        onPress={() => setSelectedCategory(categorySlug)}
        className={`px-4 py-2 mr-4 rounded-full ${
          selectedCategory === categorySlug ? "bg-blue-500" : "bg-gray-100"
        }`}
      >
        <Text
          className={`capitalize font-medium ${
            selectedCategory === categorySlug ? "text-white" : "text-gray-700"
          }`}
        >
          {categoryName === "all" ? "All Products" : categoryName}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderProductItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/product/[productId]",
            params: { productId: item.id.toString() },
          })
        }
        className="bg-white rounded-xl shadow-sm mb-4 border border-gray-100 overflow-hidden"
      >
        <Image
          source={{ uri: item.thumbnail }}
          className="w-full h-48"
          resizeMode="cover"
        />

        <View className="p-4">
          <View className="flex-row justify-between items-start mb-2">
            <Text
              className="text-lg font-semibold text-gray-800 flex-1 mr-2"
              numberOfLines={2}
            >
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
              <Text className="text-xl font-bold text-blue-600">
                RWF{item.price}
              </Text>
              {item.discountPercentage > 0 && (
                <View className="ml-2 bg-red-100 px-2 rounded">
                  <Text className="text-xs text-red-600 font-medium">
                    -{item.discountPercentage.toFixed(0)}%
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full flex-row items-center">
              <Ionicons name="add" size={16} color="white" />
              <Text className="text-white font-medium ml-1">Add</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-xs text-gray-500">
              Category: {item.category}
            </Text>
            <Text className="text-xs text-gray-500">Stock: {item.stock}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView className="flex-1 px-4 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="pt-3 pb-1 border-gray-100 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="cart" size={24} color="#3B82F6" />
            <Text className="text-xl font-bold ml-2 text-gray-800">Shop</Text>
          </View>
          {username && (
            <View className="flex-row items-center bg-blue-50 px-3 py-1 rounded-full">
              <Ionicons
                name="person-circle-outline"
                size={16}
                color="#3B82F6"
              />
              <Text className="text-sm font-medium text-blue-600 ml-1">
                {username}
              </Text>
            </View>
          )}
        </View>

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

        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Categories
          </Text>
          <FlatList
            data={categories}
            horizontal
            keyExtractor={(item) =>
              typeof item === "string" ? item : item.slug
            }
            renderItem={renderCategoryItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          />
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-800">Products</Text>
          <Text className="text-sm text-gray-500">
            {filteredProducts?.length || 0} items
          </Text>
        </View>

        {fetchingProducts && (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-500 mt-2">Loading products...</Text>
          </View>
        )}

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
            <Text className="text-gray-500 text-lg mt-4">
              No products found
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              Try adjusting your search or category filter
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
