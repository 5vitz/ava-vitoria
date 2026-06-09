"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;        // ID do Produto
  variantId: string; // ID da Variante (stock_variants)
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Carregar o carrinho do localStorage apenas após a hidratação no cliente
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("ava_vitoria_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho do localStorage:", error);
    }
    setIsHydrated(true);
  }, []);

  // 2. Persistir alterações do carrinho no localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("ava_vitoria_cart", JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  const addToCart = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.variantId === newItem.variantId
      );

      if (existingItemIndex > -1) {
        // Se o item com a mesma variante já existe, incrementar quantidade
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += newItem.quantity || 1;
        return updatedCart;
      }

      // Adicionar novo item
      return [...prevCart, { ...newItem, quantity: newItem.quantity || 1 }];
    });
    setIsOpen(true); // Abre o Drawer da Sacola no momento em que adiciona um item
  };

  const removeFromCart = (variantId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };

  const setCartOpen = (open: boolean) => {
    setIsOpen(open);
  };

  // Métricas calculadas em tempo real
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.quantity * item.price, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        setCartOpen,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}
