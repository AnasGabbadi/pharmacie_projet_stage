import { useState, useEffect, useCallback } from "react";
import { Cross, Search, ShoppingCart, User } from 'lucide-react';
import CartMenu from './CartMenu';
import categoriesApi from '../../api/categories';
import { useAuth } from '../../hooks/useAuth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ✅ Fonctions utilitaires EN DEHORS du composant (pas de hooks)
const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");
const getGuestId = () => localStorage.getItem('guestCartId');

function Header() {
  const { token } = useAuth();
  const [cartAnchor, setCartAnchor] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cartOpen = Boolean(cartAnchor);

  const updateCartCount = useCallback(async () => {
    try {
      const token = getToken();
      const guestId = getGuestId();

      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      if (guestId && !token) headers['X-Guest-Id'] = guestId;

      const response = await fetch(`${API_BASE}/cart`, { method: 'GET', headers });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const items = data.data?.items || [];
      const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(count);
    } catch (err) {
      console.error("❌ Header erreur:", err);
      setCartCount(0);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesApi.getCategories();
      if (!Array.isArray(data)) throw new Error('Format invalide');

      const formattedCategories = data.map((cat) => ({
        id: cat._id || cat.id,
        label: cat.nom?.toUpperCase() || cat.name?.toUpperCase() || 'CATÉGORIE',
        path: `/categories/${cat._id || cat.id}`,
        highlight: false,
      }));
      formattedCategories.push({ id: 'promotion', label: 'PROMOTION', path: '/promotions', highlight: true });
      setCategories(formattedCategories);
    } catch (err) {
      setError(err.message);
      setCategories([
        { id: 'all', label: 'TOUS LES PRODUITS', path: '/produits', highlight: false },
        { id: 'promotion', label: 'PROMOTION', path: '/promotions', highlight: true },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    updateCartCount();
    const interval = setInterval(updateCartCount, 30000);
    return () => clearInterval(interval);
  }, [fetchCategories, updateCartCount]);

  useEffect(() => {
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, [updateCartCount]);

  useEffect(() => {
    window.addEventListener('focus', updateCartCount);
    return () => window.removeEventListener('focus', updateCartCount);
  }, [updateCartCount]);

  // ✅ Handlers panier — manquaient dans la version précédente
  const handleCartClick = (event) => {
    setCartAnchor(event.currentTarget);
  };

  const handleCartClose = () => {
    setCartAnchor(null);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Header principal */}
      <div className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <Cross className="w-5 h-5 text-[#3E5F44]"/>
            <span className="font-semibold text-2xl text-[#3E5F44]">ParaVital</span>
          </a>

          {/* Barre de recherche */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des produits..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E5F44] focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <a href="/admin/login" target="_blank" rel="noopener noreferrer">
              <User className="w-5 h-5 cursor-pointer text-gray-600 hover:text-[#3E5F44] transition-colors" />
            </a>
            <button
              onClick={handleCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Panier"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-[#3E5F44]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold shadow-lg">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Barre catégories */}
      <nav className="bg-[#3E5F44] px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <ul className="flex items-center gap-4 py-3">
              {[...Array(8)].map((_, index) => (
                <li key={index} className="flex-shrink-0">
                  <div className="h-5 w-24 bg-[#2d4532] rounded animate-pulse"></div>
                </li>
              ))}
            </ul>
          ) : error ? (
            <div className="py-3 text-center">
              <p className="text-yellow-300 text-sm">Erreur catégories</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="py-3 text-center">
              <p className="text-white text-sm">Aucune catégorie</p>
            </div>
          ) : (
            <ul className="flex items-center justify-between overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <li key={category.id} className="flex-shrink-0">
                  <a
                    href={category.path}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveCategory(category.id);
                      window.location.href = category.path;
                    }}
                    className={`
                      block px-4 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap
                      ${category.highlight
                        ? 'text-yellow-400 hover:text-yellow-300'
                        : 'text-white hover:text-gray-200'
                      }
                      ${activeCategory === category.id
                        ? 'bg-[#2d4532] border-b-2 border-white'
                        : 'hover:bg-[#2d4532]'
                      }
                    `}
                  >
                    {category.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      {/* CartMenu */}
      <CartMenu
        anchorEl={cartAnchor}
        open={cartOpen}
        onClose={handleCartClose}
      />
    </header>
  );
}

export default Header;