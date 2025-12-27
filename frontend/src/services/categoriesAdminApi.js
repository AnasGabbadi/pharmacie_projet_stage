import { apiFetch } from "./apiFetch";

export function adminGetCategories(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/categorie${query ? `?${query}` : ""}`);
}

export function adminCreateCategorie(data) {
  return apiFetch("/categorie", {
    method: "POST",
    body: data,
  });
}

export function adminUpdateCategorie(id, data) {
  return apiFetch(`/categorie/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function adminDeleteCategorie(id) {
  return apiFetch(`/categorie/${id}`, {
    method: "DELETE",
  });
}