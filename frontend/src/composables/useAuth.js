import { ref } from 'vue'

const usuario = ref(null)

export function useAuth() {

  const login = async (email, password) => {

    usuario.value = {
      nombre: 'Jonathan',
      email,
      avatar: '👤'
    }

    return true
  }

  const logout = () => {
    usuario.value = null
  }

  return {
    usuario,
    login,
    logout
  }
}