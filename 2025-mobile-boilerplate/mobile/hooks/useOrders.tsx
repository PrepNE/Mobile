import { useRecoilState } from "recoil";
import { ordersState, cartState } from "@/store";
import { Alert } from "react-native";
import { useToast } from "react-native-toast-notifications";

const useOrders = () => {
  const [orders, setOrders] = useRecoilState(ordersState);
  const [cart, setCart] = useRecoilState(cartState);
  const toast = useToast();

  const getCartSummary = () => {
    const originalPrice = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const totalPrice = cart.reduce((sum, item) => {
      const discountedPrice =
        item.product.price * (1 - item.product.discountPercentage / 100);
      return sum + discountedPrice * item.quantity;
    }, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalSavings = originalPrice - totalPrice;

    return {
      originalPrice,
      totalPrice,
      totalItems,
      totalSavings,
      discountPercentage: originalPrice
        ? (totalSavings / originalPrice) * 100
        : 0,
    };
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      Alert.alert("Cart is empty");
      return;
    }

    const summary = getCartSummary();

    const newOrder = {
      id: Date.now(),
      items: cart,
      total: summary.totalPrice,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    toast.show("Order Placed successfully!", { type: "success" });
  };

  return {
    orders,
    placeOrder,
    getCartSummary,
  };
};

export default useOrders;
