import { ref, onMounted } from 'vue'

import {
  obtenerDeudas,
  crearDeuda
} from '../services/deudasService'

export const useDeudas = () => {
  const deudas = ref([])
  const loading = ref(false)
  const error = ref(null)

  const cargarDeudas = async () => {
    loading.value = true
    error.value = null

    try {
      deudas.value = await obtenerDeudas()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const registrarDeuda = async (data) => {
    loading.value = true
    error.value = null

    try {
      const nueva = await crearDeuda(data)

      deudas.value.push(nueva)

      return nueva

    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  onMounted(cargarDeudas)

  return {
    deudas,
    loading,
    error,
    registrarDeuda
  }
}