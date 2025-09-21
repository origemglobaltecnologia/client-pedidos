<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">📦 Pedidos</h1>

    <!-- Formulário para criar pedido -->
    <form @submit.prevent="criarPedido" class="mb-6">
      <input
        v-model="novoPedido.clienteId"
        type="text"
        placeholder="ID do Cliente"
        class="border p-2 mr-2"
      />
      <input
        v-model="novoPedido.produtoId"
        type="text"
        placeholder="ID do Produto"
        class="border p-2 mr-2"
      />
      <input
        v-model="novoPedido.quantidade"
        type="number"
        placeholder="Quantidade"
        class="border p-2 mr-2 w-24"
      />
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
        Criar Pedido
      </button>
    </form>

    <!-- Lista de pedidos -->
    <div v-if="pedidos.length">
      <h2 class="text-xl font-semibold mb-2">Lista de Pedidos</h2>
      <ul class="space-y-2">
        <li
          v-for="pedido in pedidos"
          :key="pedido.id"
          class="border p-3 rounded bg-gray-100"
        >
          <strong>ID:</strong> {{ pedido.id }} <br />
          <strong>Cliente:</strong> {{ pedido.cliente?.nome }} <br />
          <strong>Produtos:</strong>
          <ul>
            <li v-for="produto in pedido.produtos" :key="produto.id">
              {{ produto.nome }} (x{{ produto.quantidade }})
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <p v-else>Nenhum pedido encontrado.</p>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "PedidosView",
  data() {
    return {
      pedidos: [],
      novoPedido: {
        clienteId: "",
        produtoId: "",
        quantidade: 1,
      },
    };
  },
  methods: {
    async carregarPedidos() {
      try {
        const response = await api.get("/pedidos");
        this.pedidos = response.data;
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
      }
    },
    async criarPedido() {
      try {
        const response = await api.post("/pedidos", {
          clienteId: this.novoPedido.clienteId,
          produtos: [
            {
              id: this.novoPedido.produtoId,
              quantidade: this.novoPedido.quantidade,
            },
          ],
        });
        this.pedidos.push(response.data);
        this.novoPedido = { clienteId: "", produtoId: "", quantidade: 1 };
      } catch (error) {
        console.error("Erro ao criar pedido:", error);
      }
    },
  },
  mounted() {
    this.carregarPedidos();
  },
};
</script>

<style>
body {
  font-family: sans-serif;
}
</style>
