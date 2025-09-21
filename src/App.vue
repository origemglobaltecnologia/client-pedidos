<script setup>
import { ref, onMounted } from 'vue'
import { listarPedidos, criarPedido, atualizarPedido, deletarPedido } from './services/pedidos.js'

// Estados reativos
const pedidos = ref([])
const loading = ref(false)
const error = ref('')
const form = ref({ id: null, clienteId: '', produtos: [], total: 0 })

// Carregar lista
async function carregarPedidos() {
  loading.value = true
  error.value = ''
  try {
    pedidos.value = await listarPedidos()
  } catch (e) {
    error.value = e?.message || 'Falha ao carregar pedidos'
  } finally {
    loading.value = false
  }
}

// Salvar pedido (criar ou atualizar)
async function salvarPedido() {
  try {
    if (!form.value.clienteId) {
      error.value = 'Cliente é obrigatório'
      return
    }

    if (form.value.id) {
      await atualizarPedido(form.value.id, {
        clienteId: form.value.clienteId,
        produtos: form.value.produtos,
        total: form.value.total
      })
    } else {
      await criarPedido({
        clienteId: form.value.clienteId,
        produtos: form.value.produtos,
        total: form.value.total
      })
    }

    form.value = { id: null, clienteId: '', produtos: [], total: 0 }
    await carregarPedidos()
  } catch (e) {
    error.value = e?.message || 'Erro ao salvar pedido'
  }
}

// Editar pedido
function editarPedido(p) {
  form.value = { ...p }
}

// Deletar pedido
async function removerPedido(id) {
  if (!confirm("Deseja realmente excluir este pedido?")) return
  try {
    await deletarPedido(id)
    await carregarPedidos()
  } catch (e) {
    error.value = e?.message || 'Erro ao excluir pedido'
  }
}

onMounted(carregarPedidos)
</script>

<template>
  <main class="container">
    <header class="header">
      <h1>CRUD de Pedidos</h1>
    </header>

    <p v-if="error" class="message error">{{ error }}</p>
    <p v-if="loading" class="message">Carregando...</p>

    <div class="card">
      <form @submit.prevent="salvarPedido" class="form">
        <h2>{{ form.id ? 'Editar Pedido' : 'Novo Pedido' }}</h2>
        <div class="form-group">
          <label for="cliente">Cliente:</label>
          <input id="cliente" v-model="form.clienteId" required />
        </div>
        <div class="form-group">
          <label for="total">Total:</label>
          <input id="total" v-model.number="form.total" type="number" step="0.01" />
        </div>
        <div class="button-group">
          <button type="submit" class="button primary">
            {{ form.id ? 'Atualizar' : 'Salvar' }}
          </button>
          <button type="button" @click="form = { id: null, clienteId: '', produtos: [], total: 0 }" class="button secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <div class="card">
      <h2>Lista de Pedidos</h2>
      <ul class="pedido-list">
        <li v-for="p in pedidos" :key="p.id" class="pedido-item">
          <div class="pedido-info">
            <strong>Pedido #{{ p.id }}</strong>
            <span> - Cliente: {{ p.clienteId }}</span>
            <span> - Total: R$ {{ p.total }}</span>
          </div>
          <div class="button-group">
            <button @click="editarPedido(p)" class="button small primary">Editar</button>
            <button @click="removerPedido(p.id)" class="button small danger">Excluir</button>
          </div>
        </li>
      </ul>
    </div>
  </main>
</template>

<style>
/* mesmo estilo do de produtos/clientes */
:root {
  --primary-color: #4A90E2;
  --secondary-color: #6C757D;
  --danger-color: #E24A4A;
  --text-color: #333;
  --background-color: #F8F9FA;
  --card-background: #FFFFFF;
  --border-color: #E9ECEF;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.message {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  text-align: center;
}

.message.error {
  background-color: rgba(226, 74, 74, 0.1);
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
}

.card {
  background-color: var(--card-background);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 1rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.button.primary {
  background-color: var(--primary-color);
  color: white;
}

.button.secondary {
  background-color: var(--secondary-color);
  color: white;
}

.button.danger {
  background-color: var(--danger-color);
  color: white;
}

.button.small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.pedido-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pedido-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.pedido-item:last-child {
  border-bottom: none;
}

.pedido-info {
  flex-grow: 1;
}
</style>
