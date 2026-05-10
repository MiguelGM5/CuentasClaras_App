<script setup>
defineProps({
  tipoPrestamo: String
})

const emit = defineEmits([
  'update:tipoPrestamo'
])
</script>

<template>
  <div class="loan-types">

    <div
      class="card"
      :class="{ active: tipoPrestamo === 'prestado' }"
      @click="emit('update:tipoPrestamo', 'prestado')"
    >
      <h3>Presté dinero</h3>
      <p>Alguien me debe a mí</p>
    </div>

    <div
      class="card"
      :class="{ active: tipoPrestamo === 'pedido' }"
      @click="emit('update:tipoPrestamo', 'pedido')"
    >
      <h3>Pedí prestado</h3>
      <p>Yo debo dinero</p>
    </div>

  </div>
</template>

<style scoped>
.loan-types {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.card {
  background: white;
  border-radius: 24px;
  padding: 24px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.card h3 {
  margin-bottom: 8px;
}

.card p {
  color: #777;
}

.active {
  border-color: #df5b57;
  background: #fff5f5;
}
</style>