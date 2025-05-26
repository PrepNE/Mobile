import { CartItem } from '@/store';
import { TextInputProps } from 'react-native';

export interface InputFieldProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface CartProduct {
  id: number;           
  title: string;
  price: number;
  quantity: number;
  total: number;         
  discountPercentage: number;
  discountedPrice: number;
}

export interface Cart {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'rating' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface Order {
  id: number;
  items: CartItem[];
  total: number;
  createdAt: string;
}