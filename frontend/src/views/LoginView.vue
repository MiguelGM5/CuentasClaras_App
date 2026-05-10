<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuth } from '../composables/useAuth'

const router = useRouter()

const { login } = useAuth()

const email = ref('')
const password = ref('')

const error = ref('')
const loading = ref(false)

const iniciarSesion = async () => {

  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'Completa todos los campos'
    return
  }

  try {

    loading.value = true

    await login(
      email.value,
      password.value
    )

    router.push('/prestamos')

  } catch (err) {

    error.value = 'Error al iniciar sesión'

  } finally {

    loading.value = false

  }

}
</script>

<template>
  <div class="login-page">

    <div class="login-card">

      <h1>Fintech App</h1>

      <p>
        Inicia sesión para continuar
      </p>

      <form @submit.prevent="iniciarSesion">

        <input
          type="email"
          v-model="email"
          placeholder="Correo electrónico"
        />

        <input
          type="password"
          v-model="password"
          placeholder="Contraseña"
        />

        <div
          v-if="error"
          class="error"
        >
          {{ error }}
        </div>

        <button :disabled="loading">

          {{
            loading
              ? 'Ingresando...'
              : 'Entrar'
          }}

        </button>

      </form>

    </div>

  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f1eb;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: white;
  padding: 40px;
  border-radius: 24px;
}

h1 {
  margin-bottom: 10px;
}

p {
  margin-bottom: 30px;
  color: gray;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

input {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #ddd;
}

button {
  border: none;
  background: #11a579;
  color: white;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
}

.error {
  background: #ffe5e5;
  color: red;
  padding: 12px;
  border-radius: 12px;
}
</style>