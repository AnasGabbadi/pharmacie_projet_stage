import { useState, useEffect, useCallback } from 'react';
import produitsApi from '../api/produits';

const DEFAULT_PAGINATION = { page: 1, limite: 20, total: 0, pages: 1 };

export const useProduits = (params = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clé stable : params={} recrée un nouvel objet à chaque rendu, ce qui en
  // dépendance directe de useEffect déclencherait un fetch en boucle infinie.
  const paramsKey = JSON.stringify(params);

  const fetchProduits = useCallback(() => {
    setLoading(true);
    setError(null);
    produitsApi.getProduitsPage(JSON.parse(paramsKey))
      .then(({ produits, pagination }) => {
        setData(produits);
        setPagination(pagination);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [paramsKey]);

  useEffect(() => {
    fetchProduits();
  }, [fetchProduits]);

  return { data, pagination, loading, error, refetch: fetchProduits };
};
