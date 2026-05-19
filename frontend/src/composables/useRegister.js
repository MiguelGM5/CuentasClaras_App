import {ref} from 'vue';
import Swal from 'sweetalert2';

export function useRegister(){
    //Datos del formulario
    const nombre = ref('');
    const apellidoPaterno = ref('');
    const apellidoMaterno = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPass = ref('');

    const loading = ref(false);

    const manejadorRegistro = async () => {
        //Validaciones
        if(!nombre.value || !apellidoPaterno.value || !email.value || !password.value || !confirmPass.value){
            Swal.fire({
                title: "Error",
                text: "Debes llenar todos los campos obligatorios.!",
                icon: "error"
            });
            return;
        }

        if(password.value !== confirmPass.value){
            Swal.fire({
                title: "Error",
                text: "Las contraseñas no coinciden.",
                icon: "error"
            });
            return;
        }

        loading.value = true;

        try {
            const 
        } catch (error) {
            
        }
    }
}