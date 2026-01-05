import { useState, useEffect, useCallback } from 'react';
import { Cross, Search, ShoppingCart, User } from 'lucide-react';
import CartMenu from './CartMenu';
import { getCategories } from '../../services/categoriesApi';

function Header() {
  const [cartAnchor, setCartAnchor] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cartOpen = Boolean(cartAnchor);

  const handleCartClick = (event) => {
    setCartAnchor(event.currentTarget);
  };

  const handleCartClose = () => {
    setCartAnchor(null);
  };

  // Fonction de fetch mémorisée
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getCategories();
      
      // Vérifier que les données sont valides
      if (!Array.isArray(data)) {
        throw new Error('Format de données invalide');
      }

      // Formater les catégories pour correspondre à la structure attendue
      const formattedCategories = data.map((cat) => ({
        id: cat._id || cat.id,
        label: cat.nom?.toUpperCase() || cat.name?.toUpperCase() || 'CATÉGORIE',
        path: `/categories/${cat._id || cat.id}`,
        highlight: false
      }));

      // Ajouter la catégorie "PROMOTION" à la fin
      formattedCategories.push({
        id: 'promotion',
        label: 'PROMOTION',
        path: '/promotions',
        highlight: true
      });

      setCategories(formattedCategories);
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
      setError(err.message);
      
      // Catégories par défaut en cas d'erreur
      setCategories([
        { id: 'all', label: 'TOUS LES PRODUITS', path: '/produits', highlight: false },
        { id: 'promotion', label: 'PROMOTION', path: '/promotions', highlight: true }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
            <button onClick={handleCartClick} className="relative">
              <ShoppingCart className="w-5 h-5 cursor-pointer text-gray-600 hover:text-[#3E5F44] transition-colors" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                0
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Barre de navigation des catégories */}
      <nav className="bg-[#3E5F44] px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            /* Skeleton loader pendant le chargement */
            <ul className="flex items-center gap-4 py-3">
              {[...Array(8)].map((_, index) => (
                <li key={index} className="flex-shrink-0">
                  <div className="h-5 w-24 bg-[#2d4532] rounded animate-pulse"></div>
                </li>
              ))}
            </ul>
          ) : error ? (
            /* Message d'erreur */
            <div className="py-3 text-center">
              <p className="text-yellow-300 text-sm">
                Erreur de chargement des catégories
              </p>
            </div>
          ) : categories.length === 0 ? (
            /* Message si aucune catégorie */
            <div className="py-3 text-center">
              <p className="text-white text-sm">Aucune catégorie disponible</p>
            </div>
          ) : (
            /* Liste des catégories */
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

      {/* CartMenu Component */}
      <CartMenu 
        anchorEl={cartAnchor} 
        open={cartOpen} 
        onClose={handleCartClose} 
      />
    </header>
  );
}

export default Header;