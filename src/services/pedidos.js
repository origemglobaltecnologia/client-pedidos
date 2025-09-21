// src/services/pedidos.js

const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";

/**
 * Função interna para requisições
 */
async function request(path, options = {}) {
  const url = `${base}/${path.replace(/^\/+/, "")}`;

  const res = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${text || res.statusText}`);
  }

  return res.status !== 204 ? res.json() : null;
}

/**
 * CRUD de pedidos
 */
export function listarPedidos() {
  return request("pedidos", { method: "GET" });
}

export function buscarPedido(id) {
  return request(`pedidos/${id}`, { method: "GET" });
}

export function criarPedido(data) {
  return request("pedidos", { method: "POST", body: JSON.stringify(data) });
}

export function atualizarPedido(id, data) {
  return request(`pedidos/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deletarPedido(id) {
  return request(`pedidos/${id}`, { method: "DELETE" });
}
