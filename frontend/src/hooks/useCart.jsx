import { useState, useEffect, useCallback } from "react";
import cartApi from "../api/cart"; 
import { useAuth } from "./useAuth";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const useCart = () => {
  const getToken = () => {
    return localStorage.getItem("token") || 
           (typeof window !== 'undefined' && sessionStorage.getItem("token"));
  };

  const getGuestId = () => {
    let guestId = localStorage.getItem('guestCartId');
    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('guestCartId', guestId);
      console.log("🆔 Nouveau guestId:", guestId);
    }
    return guestId;
  };

  const { token: authToken } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ fetchCart UNIQUE - Guest + Client
  const fetchCart = useCallback(async () => {
    const token = getToken();
    const guestId = getGuestId();
    
    try {
      setLoading(true);
      setError(null);
      
      // ✅ Backend direct avec X-Guest-Id
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      if (guestId && !token) headers['X-Guest-Id'] = guestId;
      
      console.log("🔍 fetchCart - guestId:", guestId, "token:", !!token);
      
      const response = await fetch(`${API_BASE}/cart`, { 
        method: 'GET', 
        headers 
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log("🛒 Panier RAW:", data);
      
      setCart(data.data || { items: [] });
    } catch (err) {
      console.error("❌ fetchCart erreur:", err);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ addItem - Envoie X-Guest-Id
  const addItem = async ({ productId, quantity = 1 }) => {
    const token = getToken();
    const guestId = getGuestId();   
    
    if (!productId) {
      throw new Error("❌ ID produit manquant");
    }

    console.log("🛒 Ajout:", { productId, quantity, token: token?.substring(0,20)+"..", guestId });

    try {
      // ✅ DIRECT fetch avec X-Guest-Id (ignore cartApi)
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;
      if (guestId) headers['X-Guest-Id'] = guestId;

      const response = await fetch(`${API_BASE}/cart/items`, {
        method: "POST",
        headers,
        body: JSON.stringify({ productId, quantity }),
      });

      const result = await response.json();
      console.log("✅ Backend direct:", result);
      
      if (result.success) {
        await fetchCart();
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        return { success: true };
      }
      return { success: false, message: result.message };
    } catch (err) {
      console.error("❌ Erreur:", err);
      return { success: false, message: err.message };
    }
  };

  const updateItem = async (productId, quantity) => {
    const token = getToken();
    const guestId = getGuestId();
    try {
      const response = await cartApi.updateItem(productId, quantity, token, guestId);
      if (response.success) {
        await fetchCart();
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const removeItem = async (productId) => {
    const token = getToken();
    const guestId = getGuestId();
    try {
      const response = await cartApi.deleteItem(productId, token, guestId);
      if (response.success) {
        await fetchCart();
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const clearCart = async () => {
    const token = getToken();
    const guestId = getGuestId();
    try {
      const response = await cartApi.clearCart(token, guestId);
      if (response.success) {
        localStorage.removeItem('guestCartId');
        setCart(null);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const checkout = async (payload) => {
    const token = getToken();
    if (!token) throw new Error("Authentification requise");

    try {
      // payload contient: { adresseLivraison, telephone, modePaiement, montantTotal }
      const response = await cartApi.checkout(payload, token);
      if (response.success) {
        localStorage.removeItem('guestCartId');
        await fetchCart();
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // 📡 Auto-refresh
  useEffect(() => {
    fetchCart();
    const interval = setInterval(fetchCart, 30000);
    return () => clearInterval(interval);
  }, [fetchCart]);

  const itemCount = cart?.items?.reduce((sum, item) => sum + (item.quantity || item.quantite || 0), 0) || 0;

  return {
    cart,
    loading,
    error,
    itemCount,
    addItem, 
    updateItem, 
    removeItem, 
    clearCart,
    checkout, 
    refetch: fetchCart,
  };
};