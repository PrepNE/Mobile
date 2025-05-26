import { atom, selector } from "recoil";
import { Order, Product } from "./types";

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

const isDev = __DEV__;
let keyCounter = 0;

const createKey = (name: string): string => {
  if (isDev) {
    return `${name}_${++keyCounter}_${Date.now()}`;
  }
  return name;
};

export const ordersState = atom<Order[]>({
  key: createKey('ordersState'),
  default: [],
});
export const saveProductState = atom<Product | null>({
  key: createKey('saveProductState'),
  default: null
});

export const cartState = atom<CartItem[]>({
  key: createKey('cartState'),
  default: []
});

export const favoriteProductsState = atom<Product[]>({
  key: createKey('favoriteProductsState'),
  default: []
});

export const cartTotalItemsSelector = selector({
  key: createKey('cartTotalItemsSelector'),
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
});

export const cartTotalPriceSelector = selector({
  key: createKey('cartTotalPriceSelector'),
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.reduce((total, item) => {
      const discountedPrice = item.product.price - (item.product.price * item.product.discountPercentage / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);
  }
});

export const cartOriginalPriceSelector = selector({
  key: createKey('cartOriginalPriceSelector'),
  get: ({ get }) => {
    const cart = get(cartState);
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }
});

export const cartSavingsSelector = selector({
  key: createKey('cartSavingsSelector'),
  get: ({ get }) => {
    const originalPrice = get(cartOriginalPriceSelector);
    const totalPrice = get(cartTotalPriceSelector);
    return originalPrice - totalPrice;
  }
});