import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "./authContext";

export type CartItem = {
  _id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  imgUrl: string;
  category?: string[];
  quantity: number;
};

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

const getStorageKey = (userId: string) => `dustedbooks-cart-${userId}`;

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setIsLoaded(true);
      return;
    }

    const stored = localStorage.getItem(getStorageKey(user.id));

    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }

    setIsLoaded(true);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(getStorageKey(user.id), JSON.stringify(cartItems));
  }, [cartItems, user]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const exists = prev.some((cartItem) => cartItem._id === item._id);
      if (exists) {
        return prev;
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, addToCart, removeFromCart, clearCart, isLoaded }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
