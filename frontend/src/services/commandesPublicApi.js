import { apiFetch } from "./apiFetch";

export function creerCommande(payload) {
  return apiFetch("/commande", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}