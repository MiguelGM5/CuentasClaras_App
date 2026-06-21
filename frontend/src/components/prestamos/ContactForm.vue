<script setup>
const props = defineProps({
  tipoPrestamo: String,
  nombre: String,
  concepto: String
})

const emit = defineEmits([
  'update:nombre',
  'update:concepto'
])

const conceptosPrestado = [
  '🍕 Comida',
  '⛽ Gasolina',
  '✈ Viaje',
  '🏠 Renta'
]

const conceptosPedido = [
  '💳 Tarjeta',
  '🏥 Emergencia',
  '📚 Escuela',
  '🚗 Auto'
]

const obtenerConceptos = () => {
  return props.tipoPrestamo === 'prestado'
    ? conceptosPrestado
    : conceptosPedido
}
</script>

<template>
  <div class="form-card">

    <h3>
      {{
        tipoPrestamo === 'prestado'
          ? '¿A QUIÉN LE PRESTASTE?'
          : '¿QUIÉN TE PRESTÓ?'
      }}
    </h3>

    <input
      :value="nombre"
      @input="emit('update:nombre', $event.target.value)"
      :placeholder="
        tipoPrestamo === 'prestado'
          ? 'Nombre de quien te debe...'
          : 'Nombre de quien te prestó...'
      "
    />

    <textarea
      :value="concepto"
      @input="emit('update:concepto', $event.target.value)"
      :placeholder="
        tipoPrestamo === 'prestado'
          ? '¿Por qué le prestaste dinero?'
          : '¿Por qué pediste dinero?'
      "
    ></textarea>

    <div class="tags">

      <button
        v-for="item in obtenerConceptos()"
        :key="item"
        @click="emit('update:concepto', item)"
      >
        {{ item }}
      </button>

    </div>

  </div>
</template>

<style scoped>
.form-card {
  background: white;
  border-radius: 28px;
  padding: 30px;
}

h3 {
  margin-bottom: 20px;
}

input,
textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
}

textarea {
  resize: none;
  height: 100px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tags button {
  border-radius: 999px;
  border: 1px solid #ddd;
  background: white;
  padding: 10px 18px;
  cursor: pointer;
  transition: 0.2s;
}

.tags button:hover {
  background: #f4f4f4;
}
</style>