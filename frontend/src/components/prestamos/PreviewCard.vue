<script setup>
defineProps({
  tipoPrestamo: String,
  monto: Number,
  nombre: String,
  concepto: String,
  fechaPrestamo: String,
  fechaPago: String
})
</script>

<template>
  <div
    class="preview-card"
    :class="tipoPrestamo"
  >

    <span class="top">

      {{
        tipoPrestamo === 'prestado'
          ? '← ME DEBEN'
          : '← YO DEBO'
      }}

    </span>

    <h1>${{ monto.toLocaleString() }}</h1>

    <p>
      {{ concepto || 'Sin concepto aún' }}
    </p>

    <div class="person">
      {{ nombre || 'Sin nombre' }}
    </div>

    <div class="info">

      <div>
        <span>Fecha</span>

        <strong>
          {{ fechaPrestamo || 'Sin fecha' }}
        </strong>
      </div>

      <div>
        <span>Vence</span>

        <strong>
          {{ fechaPago || 'Sin fecha' }}
        </strong>
      </div>

      <div>
        <span>Estado</span>

        <strong class="pending">
          Pendiente
        </strong>
      </div>

    </div>

  </div>
</template>

<style scoped>
.preview-card {
  background: #f2eee7;
  border-radius: 28px;
  padding: 30px;
}

.prestado {
  border-top: 5px solid #11a579;
}

.pedido {
  border-top: 5px solid #d54b4b;
}

.top {
  font-weight: bold;
}

h1 {
  font-size: 60px;
  margin: 30px 0 10px;
}

p {
  color: gray;
  margin-bottom: 20px;
}

.person {
  background: white;
  padding: 14px;
  border-radius: 16px;
  margin-bottom: 30px;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.info div {
  display: flex;
  justify-content: space-between;
}

.pending {
  color: orange;
}
</style>