import { useState, useEffect } from 'react';
import categoriesApi from '../api/categories';

export const useCategories = (params = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    categoriesApi.getCategories(params)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [params]);

  return { categories: data, loading, error };
};

export const useAdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    categoriesApi.getCategories({ actif: null })
      .then((res) => setCategories(res.items || res.data || res || []))
      .catch((err) => {
        console.error("Erreur catégories:", err);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
};