import { apiFetch } from "./apiFetch";

export function adminGetCategories() {
  return apiFetch("/categorie");
}

export function adminCreateCategorie(data) {
  return apiFetch("/categorie", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function adminUpdateCategorie(id, data) {
  return apiFetch(`/categorie/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function adminDeleteCategorie(id) {
  return apiFetch(`/categorie/${id}`, {
    method: "DELETE",
  });
}
