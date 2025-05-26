import { Product } from "@/types";
import axios from "@/lib/axios.config";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useToast } from "react-native-toast-notifications";
import useSWR from "swr";




export default function useProducts(){
    const router = useRouter();
    const toast = useToast()

    const [addingProduct, setAddingProduct] = useState(false);
    const [deletingProduct , setDeletingProduct] = useState(false);

    const { data: products , mutate: mutateProducts , error: errorFetchingProducts} = useSWR<Product[]>("/products?limit=50", async(url: string) => {
        const { data } = await axios.get(url);
        return data.products;
    })

    const getCategories  = async() => {
        try{
            const { data } = await axios.get("/products/categories");
            return data;
        }catch(error: any){
            console.error("Failed to retrieve all categories")
        }
    }


    const getProductById = async(productId: number) => {
        try{
            const { data } = await axios.get(`/products/${productId}`);
            return data;
        }catch(error: any){
            console.error("Error while retrieving product detail: ", error?.message)
        }
    } 
     const searchProducts = async (query: string) => {
    try {
      const { data } = await axios.get(`/products/search?q=${encodeURIComponent(query)}`);
      return data.products;
    } catch (error: any) {
      console.error("Failed to search products:", error.message);
      toast.show("Search failed", { type: "error" });
      return [];
    }
  };

  const getProductsByCategory = async (category: string) => {
    try {
      const { data } = await axios.get(`/products/category/${category}`);
      return data.products;
    } catch (error: any) {
      console.error("Failed to retrieve products by category:", error.message);
      toast.show("Failed to load category products", { type: "error" });
      return [];
    }
  };

 

    return {
        products,
        deletingProduct,
        addingProduct,
        mutateProducts,
        fetchingProducts: !products && !errorFetchingProducts,
        getCategories,
        getProductById,
        searchProducts,
        getProductsByCategory
    }
}