import { apiFetch } from "./apiFetch";

export function getProduits(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/produit${query ? `?${query}` : ""}`);
}

export function getProduitById(id) {
  return apiFetch(`produit/${id}`);
}