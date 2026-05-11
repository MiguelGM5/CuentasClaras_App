<script setup>
import { useRouter } from 'vue-router'

import { useAuth } from '../../composables/useAuth'

const router = useRouter()

const {
  usuario,
  logout
} = useAuth()

const cerrarSesion = () => {

  logout()

  router.push('/')

}
</script>

<template>
  <aside class="sidebar">

    <div class="logo">
      $
    </div>

    <div class="user">

      <div class="avatar">
        {{ usuario?.avatar || '👤' }}
      </div>

      <strong>
        {{ usuario?.nombre }}
      </strong>

      <span>
        {{ usuario?.email }}
      </span>

    </div>

    <button
      class="logout"
      @click="cerrarSesion"
    >
      Salir
    </button>

  </aside>
</template>

<style scoped>
.sidebar {
  background: white;
  border-radius: 24px;
  padding: 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.logo {
  width: 54px;
  height: 54px;

  border-radius: 16px;

  background: #11a579;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 24px;
  font-weight: bold;
}

.user {
  text-align: center;
}

.avatar {
  width: 54px;
  height: 54px;

  border-radius: 50%;

  background: #11a579;
  color: white;

  margin: auto auto 10px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.user span {
  display: block;
  font-size: 12px;
  color: gray;
  margin-top: 6px;
}

.logout {
  border: none;
  background: #ffe5e5;
  color: red;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
}
</style>