<script setup>
import { ref, watch } from 'vue'

import Sidebar from '../components/layout/Sidebar.vue'

import LoanTypeCard from '../components/prestamos/LoanTypeCard.vue'
import AmountCard from '../components/prestamos/AmountCard.vue'
import ContactForm from '../components/prestamos/ContactForm.vue'
import DateForm from '../components/prestamos/DateForm.vue'
import PreviewCard from '../components/prestamos/PreviewCard.vue'
import TipsCard from '../components/prestamos/TipsCard.vue'

import { useDeudas } from '../composables/useDeudas'

const {
  loading,
  error,
  registrarDeuda
} = useDeudas()

const tipoPrestamo = ref('prestado')

const monto = ref(1000)

const nombre = ref('')
const concepto = ref('')

const fechaPrestamo = ref('')
const fechaPago = ref('')
watch(tipoPrestamo, () => {

  monto.value = 1000

  nombre.value = ''

  concepto.value = ''

  fechaPrestamo.value = ''

  fechaPago.value = ''

})
const guardarPrestamo = async () => {

  if (!nombre.value) {
    alert('El nombre es obligatorio')
    return
  }

  await registrarDeuda({
    tipo: tipoPrestamo.value,
    monto: monto.value,
    nombre: nombre.value,
    concepto: concepto.value,
    fechaPrestamo: fechaPrestamo.value,
    fechaPago: fechaPago.value,
    estado: 'Pendiente'
  })

  alert('Registro exitoso')
}
</script>

<template>
  <div class="container">

    <Sidebar />

    <main class="main-content">

      <LoanTypeCard
        v-model:tipoPrestamo="tipoPrestamo"
      />

      <AmountCard
        v-model:monto="monto"
      />

      <ContactForm
        :tipoPrestamo="tipoPrestamo"
        v-model:nombre="nombre"
        v-model:concepto="concepto"
      />

      <DateForm
        :tipoPrestamo="tipoPrestamo"
        v-model:fechaPrestamo="fechaPrestamo"
        v-model:fechaPago="fechaPago"
        :loading="loading"
        @guardar="guardarPrestamo"
      />

      <div
        v-if="error"
        class="error"
      >
        {{ error }}
      </div>

    </main>

    <aside class="preview-section">

      <PreviewCard
        :tipoPrestamo="tipoPrestamo"
        :monto="monto"
        :nombre="nombre"
        :concepto="concepto"
        :fechaPrestamo="fechaPrestamo"
        :fechaPago="fechaPago"
      />

      <TipsCard />

    </aside>

  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 90px 1fr 340px;
  min-height: 100vh;
  gap: 30px;
  padding: 20px;
  background: #f5f1eb;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.error {
  background: #ffe5e5;
  color: red;
  padding: 14px;
  border-radius: 14px;
}

@media (max-width: 1200px) {

  .container {
    grid-template-columns: 1fr;
  }

}
</style>