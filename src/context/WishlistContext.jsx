import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// =====================================================
// WISHLIST CONTEXT
// =====================================================

export const WishlistContext =
  createContext(null);

// =====================================================
// WISHLIST PROVIDER
// =====================================================

function WishlistProvider({ children }) {
  // ===================================================
  // LOAD WISHLIST
  // ===================================================

  const [wishlist, setWishlist] =
    useState(() => {
      try {
        const savedWishlist =
          localStorage.getItem(
            "nexcart_wishlist"
          );

        if (!savedWishlist) {
          return [];
        }

        const parsedWishlist =
          JSON.parse(savedWishlist);

        return Array.isArray(
          parsedWishlist
        )
          ? parsedWishlist
          : [];
      } catch (error) {
        console.error(
          "Wishlist loading error:",
          error
        );

        return [];
      }
    });

  // ===================================================
  // SAVE WISHLIST
  // ===================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        "nexcart_wishlist",
        JSON.stringify(wishlist)
      );
    } catch (error) {
      console.error(
        "Wishlist saving error:",
        error
      );
    }
  }, [wishlist]);

  // ===================================================
  // ADD TO WISHLIST
  // ===================================================

  const addToWishlist = (product) => {
    if (!product || !product.id) {
      return;
    }

    setWishlist((previousWishlist) => {
      const alreadyExists =
        previousWishlist.some(
          (item) =>
            item.id === product.id
        );

      if (alreadyExists) {
        return previousWishlist;
      }

      return [
        ...previousWishlist,
        product,
      ];
    });
  };

  // ===================================================
  // REMOVE FROM WISHLIST
  // ===================================================

  const removeFromWishlist = (
    productId
  ) => {
    setWishlist((previousWishlist) =>
      previousWishlist.filter(
        (item) =>
          item.id !== productId
      )
    );
  };

  // ===================================================
  // TOGGLE WISHLIST
  // ===================================================

  const toggleWishlist = (product) => {
    if (!product || !product.id) {
      return;
    }

    setWishlist((previousWishlist) => {
      const exists =
        previousWishlist.some(
          (item) =>
            item.id === product.id
        );

      if (exists) {
        return previousWishlist.filter(
          (item) =>
            item.id !== product.id
        );
      }

      return [
        ...previousWishlist,
        product,
      ];
    });
  };

  // ===================================================
  // CHECK WISHLIST
  // ===================================================

  const isInWishlist = (productId) => {
    return wishlist.some(
      (item) =>
        item.id === productId
    );
  };

  // ===================================================
  // CLEAR WISHLIST
  // ===================================================

  const clearWishlist = () => {
    setWishlist([]);
  };

  // ===================================================
  // COUNT
  // ===================================================

  const wishlistCount =
    wishlist.length;

  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const value = {
    wishlist,

    addToWishlist,
    removeFromWishlist,

    toggleWishlist,
    isInWishlist,

    clearWishlist,

    wishlistCount,
  };

  // ===================================================
  // PROVIDER
  // ===================================================

  return (
    <WishlistContext.Provider
      value={value}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// =====================================================
// useWishlist HOOK
// =====================================================

export function useWishlist() {
  const context =
    useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default WishlistProvider;