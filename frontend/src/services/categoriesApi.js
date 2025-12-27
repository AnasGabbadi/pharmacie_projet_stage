import { apiFetch } from "./apiFetch";

export function getCategories() {
  return apiFetch("/categorie");
}