import { apiFetch } from "./apiFetch";

export function getProfilAdmin() {
  return apiFetch("/utilisateur/profil");
}

export function updateProfilAdmin(data) {
  return apiFetch("/utilisateur/profil", {
    method: "PUT",
    body: data,
  });
}

export function updatePasswordAdmin(data) {
  return apiFetch("/utilisateur/password", {
    method: "PUT",
    body: data,
  });
}