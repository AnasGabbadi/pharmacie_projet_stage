import { apiFetch } from "./apiFetch";

export function adminGetCommandes() {
  return apiFetch("/commande/admin");
}

export function adminGetCommandeById(id) {
  return apiFetch(`/commande/admin/${id}`);
}

export function adminUpdateStatutCommande(id, statut) {
  return apiFetch(`/commande/admin/${id}/statut`, {
    method: "PATCH",
    body: JSON.stringify({ statut }),
  });   
}