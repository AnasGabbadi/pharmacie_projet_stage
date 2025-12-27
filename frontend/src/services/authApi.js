import { apiFetch } from "./apiFetch";

export function registerAdmin({ nom, email, motDePasse }) {
  return apiFetch("/utilisateur/register", {
    method: "POST",
    body: { nom, email, motDePasse },
  });
}

export function loginAdmin({ email, motDePasse }) {
  return apiFetch("/utilisateur/login", {
    method: "POST",
    body: { email, motDePasse },
  });
}