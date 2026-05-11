<script setup>
const props = defineProps({
  monto: Number
})

const emit = defineEmits(['update:monto'])

const setMonto = (valor) => {
  emit('update:monto', valor)
}
</script>

<template>
  <div class="amount-card">
    <span class="label">¿CUÁNTO?</span>

    <div class="amount">
      <span>$</span>
      <h1>{{ monto.toLocaleString() }}</h1>
    </div>

    <p>{{ monto }} pesos mexicanos</p>

    <div class="buttons">
      <button @click="setMonto(200)">$200</button>
      <button @click="setMonto(500)">$500</button>
      <button @click="setMonto(1000)">$1,000</button>
      <button @click="setMonto(2000)">$2,000</button>
      <button @click="setMonto(5000)">$5,000</button>
    </div>
  </div>
</template>

<style scoped>
.amount-card {
  background: white;
  border-radius: 28px;
  padding: 40px;
}

.label {
  color: gray;
  font-size: 13px;
}

.amount {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  gap: 10px;
}

.amount h1 {
  font-size: 72px;
}

.amount span {
  font-size: 40px;
  color: gray;
}

p {
  text-align: center;
  color: #0f8d6c;
  margin-bottom: 25px;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

button {
  border: 1px solid #ddd;
  background: white;
  border-radius: 999px;
  padding: 12px 20px;
}
</style>