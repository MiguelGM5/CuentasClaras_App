<script setup>
defineProps({
  tipoPrestamo: String,
  fechaPrestamo: String,
  fechaPago: String,
  loading: Boolean
})

const emit = defineEmits([
  'update:fechaPrestamo',
  'update:fechaPago',
  'guardar'
])
</script>

<template>
  <div class="date-card">

    <h3>
      {{
        tipoPrestamo === 'prestado'
          ? 'DETALLES DEL COBRO'
          : 'DETALLES DEL PAGO'
      }}
    </h3>

    <div class="dates">

      <div>
        <label>
          {{
            tipoPrestamo === 'prestado'
              ? 'FECHA DEL PRÉSTAMO'
              : 'FECHA EN QUE RECIBISTE'
          }}
        </label>

        <input
          type="date"
          :value="fechaPrestamo"
          @input="emit('update:fechaPrestamo', $event.target.value)"
        />
      </div>

      <div>
        <label>
          {{
            tipoPrestamo === 'prestado'
              ? 'FECHA LÍMITE DE PAGO'
              : 'FECHA EN QUE PAGARÁS'
          }}
        </label>

        <input
          type="date"
          :value="fechaPago"
          @input="emit('update:fechaPago', $event.target.value)"
        />
      </div>

    </div>

    <button
      class="main-btn"
      :class="tipoPrestamo"
      :disabled="loading"
      @click="emit('guardar')"
    >
      {{
        loading
          ? 'Guardando...'
          : tipoPrestamo === 'prestado'
            ? 'Registrar préstamo'
            : 'Registrar deuda'
      }}
    </button>

  </div>
</template>

<style scoped>
.date-card {
  background: white;
  border-radius: 28px;
  padding: 30px;
}

h3 {
  margin-bottom: 24px;
}

.dates {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
}

input[type='date'] {
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid #ddd;
}

.main-btn {
  margin-top: 30px;
  width: 100%;
  border: none;
  color: white;
  padding: 18px;
  border-radius: 18px;
  font-size: 18px;
  font-weight: bold;
}

.prestado {
  background: #11a579;
}

.pedido {
  background: #d54b4b;
}

.main-btn:disabled {
  opacity: 0.6;
}
</style>