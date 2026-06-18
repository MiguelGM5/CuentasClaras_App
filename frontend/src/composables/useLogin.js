import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { API_URL } from "../constants/api";

export function useLogin() {
    const router = useRouter();

    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    
    const manejadorLogin = async () => {
        if(!email.value || !password.value) return Swal.fire({
            title: 'Campos incompletos',
            text: 'Ingresa tu correo y contraseña',
            icon: 'warning'
        });

        loading.value = true;

        Swal.fire({
            title: 'Iniciando sesión',
            text: 'Preparando tu panel...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const datosLogin = {
                email: email.value,
                password: password.value
            }

            const res = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosLogin)
            });

            const datos = await res.json();

            if(!res.ok) return Swal.fire({
                title: datos.title,
                text: datos.text,
                icon: datos.icon
            }); 

            localStorage.setItem('token', datos.token);
            localStorage.setItem('usuario', JSON.stringify(datos.usuario));

            sessionStorage.setItem('recentLogin', 'true');

            Swal.close();

            router.push('/user/dashboard');

        } catch (error) {
            console.error("Error en login:", error);
            Swal.fire({
                title: 'Error de conexión',
                text: 'Hubo un problema al conectar con el servidor.',
                icon: 'error'
            });
        }finally{
            loading.value = false;
        }
    }

    return {
        email,
        password,
        loading,
        manejadorLogin
    }
}