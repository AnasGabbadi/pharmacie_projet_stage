import { useState, useEffect } from 'react';
import produitsApi from '../api/produits';
import { useAuth } from './useAuth';

export const useProduits = (params = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    produitsApi.getProduits(params)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [params]);

  return { data, loading, error };
};