import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existItem = prev.find((x) => x.product === product._id);
      if (existItem) {
        const newQty = Math.min(existItem.qty + qty, product.stock);
        return prev.map((x) =>
          x.product === product._id ? { ...x, qty: newQty } : x
        );
      } else {
        return [
          ...prev,
          {
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.pricePerKg,
            stock: product.stock,
            qty: Math.min(qty, product.stock),
          },
        ];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((x) => x.product !== id));
  };

  const updateCartQty = (id, qty) => {
    setCartItems((prev) =>
      prev.map((x) => (x.product === id ? { ...x, qty: Number(qty) } : x))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalWeight = cartItems.reduce((acc, item) => acc + (Number(item.qty) || 0), 0);
  const itemsPrice = cartItems.reduce((acc, item) => acc + (Number(item.qty) || 0) * (Number(item.price) || 0), 0);
  const isMinOrderMet = totalWeight >= 2000;
  const weightShortfall = Math.max(0, 2000 - totalWeight);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        totalWeight,
        itemsPrice,
        isMinOrderMet,
        weightShortfall,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
