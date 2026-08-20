import { ref, computed } from 'vue';
import Swal from 'sweetalert2';
import { API_URL } from '../../constants/api';
import router from '../../router';

export function useRegister(){
    //Datos del formulario
    const nombre = ref('');
    const apellidoPaterno = ref('');
    const apellidoMaterno = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const loading = ref(false);

    const validPass = computed(() => {
        const pass = password.value || '';
        return[
            {texto: 'Entre 8 y 15 caracteres', cumple: pass.length >= 8 && pass.length <= 15},
            {texto: 'Al menos una letra mayuscula', cumple: /[A-Z]/.test(pass)},
            {texto: 'Al menos una letra minuscula', cumple: /[a-z]/.test(pass)},
            {texto: 'Al menos un numero', cumple: /\d/.test(pass)},
            {texto: 'Al menos un caracter especial ($@!%*?&#.)', cumple: /[$@!%*?%#.()_ \-]/.test(pass)}
        ];
    });

    const validEmail = computed(() => {
        const mail = email.value || '';
        const mailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
        return [{texto: 'Formato de correo valido (ejemplo@correo.com)', cumple: mailRegex.test(mail)}];
    });

    const validConfirmedPass = computed(() => {
        return [
            {texto: 'Las contraseñas deben ser identicas', cumple: password.value === confirmPassword.value && confirmPassword.value.length > 0}
        ];
    });

    const validForm = computed (() => {
        const passOk = validPass.value.every(r => r.cumple);
        const confirmedPassOk = validConfirmedPass.value.every(r => r.cumple);
        const emailOk = validEmail.value.every(r => r.cumple);
        const nombresOk = nombre.value.trim() !== '' && apellidoPaterno.value.trim() !== '';
        return passOk && confirmedPassOk && emailOk && nombresOk;
    });

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
                return Swal.fire({
                    title: datos.title,
                    text: datos.text,
                    icon: datos.icon,
                });
            }

            const resp = await Swal.fire({
                title: datos.title,
                text: datos.text,
                icon: datos.icon,
                confirmButtonText: datos.confirmButtonText,
                allowOutsideClick: datos.allowOutsideClick
            });
            if(resp.isConfirmed) router.push('/login');

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
        validPass,
        validEmail,
        validConfirmedPass,
        validForm,
        manejadorRegistro
    }
}