'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

export interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string;
  original_price: number;
  promo_price: number | null;
  price: string | number;
  stock_quantity: number;
  image_url: string;
  is_best_seller?: boolean;
  category_name?: string;
  main_type?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  checked: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  cartLoading: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  toggleCheck: (productId: number) => void;
  clearCart: () => void;
  clearCheckedItems: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // true while fetching cart from DB — hides "empty cart" flash during load
  const [cartLoading, setCartLoading] = useState(true);

  const currentUserIdRef = useRef<number | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Helpers ───────────────────────────────────────────────────────────────

  /**
   * Save cart to DB (debounced 400 ms).
   * Called ONLY from user-action handlers — never from loadCartFromDB,
   * so there is no risk of wiping the DB during a load.
   */
  const saveCartToDB = useCallback((userId: number, items: CartItem[]) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const bodyItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, items: bodyItems }),
      }).catch((err) => console.error('Failed to sync cart to DB:', err));
    }, 400);
  }, []);

  /**
   * Fetch cart from DB and set state.
   * Does NOT call saveCartToDB — no race condition possible.
   */
  const loadCartFromDB = useCallback(async (userId: number) => {
    setCartLoading(true);
    try {
      const res = await fetch(`/api/cart?user_id=${userId}`);
      const result = await res.json();
      setCartItems(result.success && result.data ? result.data : []);
    } catch (e) {
      console.error('Failed to load cart from DB:', e);
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  }, []);

  // ── User login / logout detection ─────────────────────────────────────────
  useEffect(() => {
    const syncUser = async () => {
      const storedUser = localStorage.getItem('user');
      let userId: number | null = null;
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed?.id) userId = parsed.id;
        } catch {}
      }

      if (userId !== currentUserIdRef.current) {
        currentUserIdRef.current = userId;
        if (userId) {
          // Logged in: load this user's cart from DB
          await loadCartFromDB(userId);
        } else {
          // Logged out: clear cart in memory (no DB write needed)
          setCartItems([]);
          setCartLoading(false);
        }
      } else if (!userId && cartLoading) {
        // First run with no user: stop loading spinner
        setCartLoading(false);
      }
    };

    // Check immediately on mount
    syncUser();

    // Detect cross-tab login/logout via storage event
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'user') syncUser();
    };
    window.addEventListener('storage', handleStorage);

    // Poll every 1 s to catch same-tab login/logout
    // (storage event does NOT fire for changes made in the same tab)
    const interval = setInterval(syncUser, 1000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadCartFromDB]);

  // ── Cart action handlers (each saves to DB after mutating state) ──────────

  const addToCart = (product: Product) => {
    const userId = currentUserIdRef.current;
    if (!userId) return; // Guest — blocked
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const newItems = existing
        ? prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { product, quantity: 1, checked: true }];
      saveCartToDB(userId, newItems);
      return newItems;
    });
  };

  const removeFromCart = (productId: number) => {
    const userId = currentUserIdRef.current;
    if (!userId) return;
    setCartItems((prev) => {
      const newItems = prev.filter((item) => item.product.id !== productId);
      saveCartToDB(userId, newItems);
      return newItems;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const userId = currentUserIdRef.current;
    if (quantity < 1 || !userId) return;
    setCartItems((prev) => {
      const newItems = prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      saveCartToDB(userId, newItems);
      return newItems;
    });
  };

  /**
   * toggleCheck is UI-only (checked state is never persisted to DB).
   * It only determines which items are included in checkout.
   */
  const toggleCheck = (productId: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const clearCart = () => {
    const userId = currentUserIdRef.current;
    if (!userId) return;
    setCartItems([]);
    saveCartToDB(userId, []);
  };

  const clearCheckedItems = () => {
    const userId = currentUserIdRef.current;
    if (!userId) return;
    setCartItems((prev) => {
      const newItems = prev.filter((item) => !item.checked);
      saveCartToDB(userId, newItems);
      return newItems;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleCheck,
        clearCart,
        clearCheckedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
