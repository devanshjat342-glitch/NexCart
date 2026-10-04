import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// =====================================================
// CART CONTEXT
// =====================================================

export const CartContext = createContext(null);

// =====================================================
// CART PROVIDER
// =====================================================

function CartProvider({ children }) {
  // ===================================================
  // LOAD CART FROM LOCAL STORAGE
  // ===================================================

  const [cart, setCart] = useState(() => {
    try {
      const savedCart =
        localStorage.getItem("nexcart_cart");

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      return Array.isArray(parsedCart)
        ? parsedCart
        : [];
    } catch (error) {
      console.error(
        "Cart loading error:",
        error
      );

      return [];
    }
  });

  // ===================================================
  // SAVE CART TO LOCAL STORAGE
  // ===================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        "nexcart_cart",
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error(
        "Cart saving error:",
        error
      );
    }
  }, [cart]);

  // ===================================================
  // ADD TO CART
  // ===================================================

  const addToCart = (
    product,
    quantity = 1
  ) => {
    if (!product || !product.id) {
      console.error(
        "Invalid product:",
        product
      );

      return;
    }

    const stock = Number(
      product.stock || 999999
    );

    const requestedQuantity =
      Number(quantity) || 1;

    setCart((previousCart) => {
      const existingProduct =
        previousCart.find(
          (item) =>
            item.id === product.id
        );

      // Product already exists
      if (existingProduct) {
        return previousCart.map(
          (item) => {
            if (
              item.id !== product.id
            ) {
              return item;
            }

            const currentQuantity =
              Number(
                item.quantity || 1
              );

            const newQuantity =
              Math.min(
                currentQuantity +
                  requestedQuantity,
                stock
              );

            return {
              ...item,
              quantity: newQuantity,
            };
          }
        );
      }

      // New product
      return [
        ...previousCart,
        {
          ...product,
          quantity: Math.min(
            requestedQuantity,
            stock
          ),
        },
      ];
    });
  };

  // ===================================================
  // REMOVE FROM CART
  // ===================================================

  const removeFromCart = (
    productId
  ) => {
    setCart((previousCart) =>
      previousCart.filter(
        (item) =>
          item.id !== productId
      )
    );
  };

  // ===================================================
  // UPDATE QUANTITY
  // ===================================================

  const updateQuantity = (
    productId,
    quantity
  ) => {
    const newQuantity =
      Number(quantity);

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((previousCart) =>
      previousCart.map((item) => {
        if (
          item.id !== productId
        ) {
          return item;
        }

        const stock = Number(
          item.stock || 999999
        );

        return {
          ...item,
          quantity: Math.min(
            newQuantity,
            stock
          ),
        };
      })
    );
  };

  // ===================================================
  // INCREASE QUANTITY
  // ===================================================

  const increaseQuantity = (
    productId
  ) => {
    setCart((previousCart) =>
      previousCart.map((item) => {
        if (
          item.id !== productId
        ) {
          return item;
        }

        const currentQuantity =
          Number(
            item.quantity || 1
          );

        const stock = Number(
          item.stock || 999999
        );

        if (
          currentQuantity >=
          stock
        ) {
          return item;
        }

        return {
          ...item,
          quantity:
            currentQuantity + 1,
        };
      })
    );
  };

  // ===================================================
  // DECREASE QUANTITY
  // ===================================================

  const decreaseQuantity = (
    productId
  ) => {
    setCart((previousCart) =>
      previousCart
        .map((item) => {
          if (
            item.id !== productId
          ) {
            return item;
          }

          const currentQuantity =
            Number(
              item.quantity || 1
            );

          return {
            ...item,
            quantity:
              currentQuantity - 1,
          };
        })
        .filter(
          (item) =>
            Number(
              item.quantity || 0
            ) > 0
        )
    );
  };

  // ===================================================
  // CLEAR CART
  // ===================================================

  const clearCart = () => {
    setCart([]);
  };

  // ===================================================
  // CART COUNT
  // ===================================================

  const cartCount = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(
          item.quantity || 1
        ),
      0
    );
  }, [cart]);

  // ===================================================
  // TOTAL PRICE
  // ===================================================

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (total, item) => {
        const price = Number(
          item.price || 0
        );

        const quantity = Number(
          item.quantity || 1
        );

        return (
          total +
          price * quantity
        );
      },
      0
    );
  }, [cart]);

  // ===================================================
  // TOTAL ITEMS
  // ===================================================

  const totalItems = cartCount;

  // ===================================================
  // CART ITEMS ALIAS
  // ===================================================

  const cartItems = cart;

  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const value = {
    // Cart
    cart,
    cartItems,

    // Add / Remove
    addToCart,
    removeFromCart,

    // Quantity
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,

    // Clear
    clearCart,

    // Count
    cartCount,
    totalItems,

    // Price
    totalPrice,
  };

  // ===================================================
  // PROVIDER
  // ===================================================

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

// =====================================================
// useCart HOOK
// =====================================================

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}

// =====================================================
// DEFAULT EXPORT
// IMPORTANT FOR main.jsx
// =====================================================

export default CartProvider;