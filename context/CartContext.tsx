
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Alert } from "react-native";

export interface CartItem {
    id: string | number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    color?: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string | number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (item: CartItem) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((i) => i.id === item.id && i.color === item.color);

            if (existingItem) {
                return prevItems.map((i) =>
                    i.id === item.id && i.color === item.color
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            } else {
                return [...prevItems, item];
            }
        });

        // Optional: Show toast or feedback
        // Alert.alert("Success", "Item added to cart");
    };

    const removeFromCart = (id: string | number) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const cartTotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                clearCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
