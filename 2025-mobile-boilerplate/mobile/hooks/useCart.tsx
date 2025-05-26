import { useRecoilState, useRecoilValue } from 'recoil';
import { useToast } from 'react-native-toast-notifications';
import { CartItem, cartOriginalPriceSelector, cartSavingsSelector, cartState, cartTotalItemsSelector, cartTotalPriceSelector, favoriteProductsState } from '@/store';
import { Product } from '@/types';

export default function useCarts() {
  const [cart, setCart] = useRecoilState(cartState);
  const [favoriteProducts, setFavoriteProducts] = useRecoilState(favoriteProductsState);
  const totalItems = useRecoilValue(cartTotalItemsSelector);
  const totalPrice = useRecoilValue(cartTotalPriceSelector);
  const originalPrice = useRecoilValue(cartOriginalPriceSelector);
  const totalSavings = useRecoilValue(cartSavingsSelector);
  const toast = useToast();


  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex !== -1) {

        const updatedCart = [...prevCart];
        const newQuantity = updatedCart[existingItemIndex].quantity + quantity;
        
        if (newQuantity > product.stock) {
          toast.show(`Cannot add more than ${product.stock} items`, { type: "warning" });
          return prevCart;
        }
        
        updatedCart[existingItemIndex].quantity = newQuantity;
        toast.show(`Updated ${product.title} quantity`, { type: "success" });
        return updatedCart;
      } else {
        if (quantity > product.stock) {
          toast.show(`Cannot add more than ${product.stock} items`, { type: "warning" });
          return prevCart;
        }
        
        const newItem: CartItem = {
          product,
          quantity,
          addedAt: new Date()
        };
        
        toast.show(`${product.title} added to cart`, { type: "success" });
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item.product.id !== productId);
      toast.show("Item removed from cart", { type: "normal" });
      return updatedCart;
    });
  };


  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.product.id === productId) {
          if (newQuantity > item.product.stock) {
            toast.show(`Cannot exceed stock limit of ${item.product.stock}`, { type: "warning" });
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return updatedCart;
    });
  };


  const increaseQuantity = (productId: number) => {
    const item = cart.find(item => item.product.id === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };


  const decreaseQuantity = (productId: number) => {
    const item = cart.find(item => item.product.id === productId);
    if (item) {
      updateQuantity(productId, item.quantity - 1);
    }
  };


  const clearCart = () => {
    setCart([]);
    toast.show("Cart cleared", { type: "normal" });
  };


  const getItemQuantity = (productId: number): number => {
    const item = cart.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId: number): boolean => {
    return cart.some(item => item.product.id === productId);
  };


  const getCartItem = (productId: number): CartItem | undefined => {
    return cart.find(item => item.product.id === productId);
  };


  const addToFavorites = (product: Product) => {
    setFavoriteProducts(prev => {
      if (prev.some(p => p.id === product.id)) {
        toast.show("Already in favorites", { type: "normal" });
        return prev;
      }
      toast.show("Added to favorites", { type: "success" });
      return [...prev, product];
    });
  };

  const removeFromFavorites = (productId: number) => {
    setFavoriteProducts(prev => {
      const updated = prev.filter(p => p.id !== productId);
      toast.show("Removed from favorites", { type: "normal" });
      return updated;
    });
  };

  const isFavorite = (productId: number): boolean => {
    return favoriteProducts.some(p => p.id === productId);
  };

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };


  const getCartSummary = () => ({
    totalItems,
    totalPrice: parseFloat(totalPrice.toFixed(2)),
    originalPrice: parseFloat(originalPrice.toFixed(2)),
    totalSavings: parseFloat(totalSavings.toFixed(2)),
    discountPercentage: originalPrice > 0 ? ((totalSavings / originalPrice) * 100) : 0
  });

  const getSortedCartItems = (sortBy: 'name' | 'price' | 'date' = 'date') => {
    const sortedCart = [...cart];
    
    switch (sortBy) {
      case 'name':
        return sortedCart.sort((a, b) => a.product.title.localeCompare(b.product.title));
      case 'price':
        return sortedCart.sort((a, b) => b.product.price - a.product.price);
      case 'date':
        return sortedCart.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
      default:
        return sortedCart;
    }
  };

  return {
    cart,
    totalItems,
    totalPrice,
    originalPrice,
    totalSavings,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
    getCartItem,
    getCartSummary,
    getSortedCartItems,
    favoriteProducts,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };
}