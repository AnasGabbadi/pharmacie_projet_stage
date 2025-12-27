const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("admin_token");
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("admin_token");
    window.dispatchEvent(new Event("admin-unauthorized"));
    window.location.href = "/admin/login";
    throw new Error("Non authentifié");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur API: ${response.status} - ${errorText}`);
  }

  try {
    return await response.json();
  } catch (err) {
    console.warn("⚠️ Réponse non JSON");
    return {};
  }
}