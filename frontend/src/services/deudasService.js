import { API_URL } from '../constants/api'

export const obtenerDeudas = async () => {
  const response = await fetch(`${API_URL}/deudas`)

  if (!response.ok) {
    throw new Error('Error al obtener deudas')
  }

  return response.json()
}

export const crearDeuda = async (data) => {
  const response = await fetch(`${API_URL}/deudas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Error al crear deuda')
  }

  return response.json()
}