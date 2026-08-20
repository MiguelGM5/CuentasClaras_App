import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { API_URL } from "../../constants/api";
import { resetAnimationState } from "../../utils/animationState";

const token = ref(localStorage.getItem('token'));
const user = ref(null);

let temporizadorSesion = null;
let temporizadorInactividad = null;

try {
    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== 'null' && savedUser !== 'undefined') {
        user.value = JSON.parse(savedUser);
    }
} catch (e) { user.value = null; }

export function useAuth() {
    const router = useRouter();
    const isLoggedIn = computed(() => !!token.value);
    const userRole = computed(() => user.value?.rol ? String(user.value.rol) : '');
    const userProfile = computed(() => user.value);

    // Cierre de sesión
    const logoutSession = () => {
        resetAnimationState();
        token.value = null;
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('recentLogin');
        
        if (temporizadorSesion) clearTimeout(temporizadorSesion);
        if (temporizadorInactividad) clearTimeout(temporizadorInactividad);
        apagarRastreadorInactividad();
    };

    const forzarCierreSeguridad = (mensaje = 'Tu sesión ha caducado por seguridad.') => {
        logoutSession();
        Swal.fire({ title: 'Sesión Expirada', text: mensaje, icon: 'info', confirmButtonColor: '#00B4B4', allowOutsideClick: false })
            .then(() => router.push('/login'));
    };

    // Control de inactividad
    const TIEMPO_LIMITE_INACTIVO = 45 * 60 * 1000;

    const reiniciarRelojInactividad = () => {
        if (!token.value) return;
        
        if (temporizadorInactividad) clearTimeout(temporizadorInactividad);
        
        temporizadorInactividad = setTimeout(() => {
            mostrarAlertaSiguesAhi();
        }, TIEMPO_LIMITE_INACTIVO);
    };

    const mostrarAlertaSiguesAhi = () => {
        apagarRastreadorInactividad(); 

        Swal.fire({
            title: '¿Sigues ahí?',
            text: 'Tu sesión está por cerrarse por inactividad.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#00B4B4',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, extender sesión',
            cancelButtonText: 'Cerrar sesión',
            allowOutsideClick: false
        }).then(async (result) => {
            if (result.isConfirmed) {
                await requestRenewedToken();
            } else {
                forzarCierreSeguridad('Cerraste sesión por inactividad.');
            }
        });
    };

    // Renovación de sesión con el backend
    const requestRenewedToken = async () => {
        try {
            const res = await fetch(`${API_URL}/api/auth/refresh`, { 
                headers: { 'Authorization': `Bearer ${token.value}` }
            });

            if (!res.ok) throw new Error('No se pudo renovar');
            
            const data = await res.json();
            
            token.value = data.token;
            localStorage.setItem('token', data.token);

            Swal.fire({ title: 'Sesión extendida', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
            
            programarCierreSesion();
            encenderRastreadorInactividad();

        } catch (error) {
            forzarCierreSeguridad('Tu sesión ya había vencido. Vuelve a entrar.');
        }
    };

    // Eventos de actividad de usuario
    const eventos = ['mousemove', 'keydown', 'scroll', 'click'];
    
    let bloqueado = false;
    const detectorActividad = () => {
        if (bloqueado) return;
        reiniciarRelojInactividad();
        bloqueado = true;
        setTimeout(() => bloqueado = false, 2000);
    };

    const encenderRastreadorInactividad = () => {
        eventos.forEach(evt => window.addEventListener(evt, detectorActividad));
        reiniciarRelojInactividad();
    };

    const apagarRastreadorInactividad = () => {
        eventos.forEach(evt => window.removeEventListener(evt, detectorActividad));
    };

    // Verificación de expiración de JWT
    const programarCierreSesion = () => {
        if (!token.value) return;
        try {
            const payload = JSON.parse(atob(token.value.split('.')[1]));
            const tiempoRestante = (payload.exp * 1000) - Date.now();

            if (temporizadorSesion) clearTimeout(temporizadorSesion);

            if (tiempoRestante <= 0) {
                forzarCierreSeguridad();
            } else {
                temporizadorSesion = setTimeout(() => forzarCierreSeguridad(), tiempoRestante);
            }
        } catch (error) {
            forzarCierreSeguridad('Token inválido.');
        }
    };

    // Inicio de sesión
    const loginSession = (newToken, newUser) => {
        resetAnimationState();
        token.value = newToken;
        user.value = newUser;
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        programarCierreSesion();
        encenderRastreadorInactividad();
    };

    return {
        token, user: userProfile, isLoggedIn, userRole,
        loginSession, logoutSession, 
        programarCierreSesion, encenderRastreadorInactividad
    };
}