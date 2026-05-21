import {ref} from 'vue';
import Swal from 'sweetalert2';
import { API_URL } from '../constants/api';

export function useRegister(){
    //Datos del formulario
    const nombre = ref('');
    const apellidoPaterno = ref('');
    const apellidoMaterno = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');

    const loading = ref(false);

    const manejadorRegistro = async () => {
        loading.value = true;
        try {
            const datosRegistro = {
                nombre: nombre.value,
                apellidoPaterno: apellidoPaterno.value,
                apellidoMaterno: apellidoMaterno.value,
                email: email.value,
                password: password.value,
                confirmPassword: confirmPassword.value
            };

            const respuesta = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosRegistro)
            });
            
            const datos = await respuesta.json();
            if(!respuesta.ok){
                //const errorData = await respuesta.json();
                Swal.fire({
                    title: datos.title,
                    text: datos.text,
                    icon: datos.icon
                });
            }

            Swal.fire({
                title: datos.title,
                text: datos.text,
                icon: datos.icon
            });

        } catch (error) {
            console.error("error:", error);
            Swal.fire({
                title: error.title,
                text: error.text,
                icon: error.icon
            });
        }finally{
            loading.value = false;
        }
    }
    return {
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        email,
        password,
        confirmPassword,
        loading,
        manejadorRegistro
    }
}