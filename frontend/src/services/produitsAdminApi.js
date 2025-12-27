import { apiFetch } from "./apiFetch";

export function adminGetProduits(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/produit${query ? `?${query}` : ""}`);
}

export function adminCreateProduit(data) {
  return apiFetch("/produit", {
    method: "POST",
    body: data,    
  });
}

export function adminUpdateProduit(id, data) {
  return apiFetch(`/produit/${id}`, {
    method: "PUT",
    body: data,     
  });
}

export function adminDeleteProduit(id) {
  return apiFetch(`/produit/${id}`, {
    method: "DELETE",
  });
}