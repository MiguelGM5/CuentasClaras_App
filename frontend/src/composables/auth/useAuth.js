import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { API_URL } from "../../constants/api";
import { resetAnimationState } from "../../utils/animationState";

const token = ref(localStorage.getItem('token'));
const user = ref(null);

let temporizadorSesion = null; // La bomba por expiración de JWT
let temporizadorInactividad = null; // El rastreador de que te fuiste a tomar mates

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

    // ── 1. CERRAR SESIÓN ──────────────────────────────────────
    const logoutSession = () => {
        resetAnimationState();
        token.value = null;
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('recentLogin');
        
        if (temporizadorSesion) clearTimeout(temporizadorSesion);
        if (temporizadorInactividad) clearTimeout(temporizadorInactividad);
        apagarRastreadorInactividad(); // Dejamos de escuchar el mouse
    };

    const forzarCierreSeguridad = (mensaje = 'Tu sesión ha caducado por seguridad.') => {
        logoutSession();
        Swal.fire({ title: 'Sesión Expirada', text: mensaje, icon: 'info', confirmButtonColor: '#00B4B4', allowOutsideClick: false })
            .then(() => router.push('/login'));
    };

    // ── 2. LA MAGIA DE LA INACTIVIDAD ─────────────────────────
    const TIEMPO_LIMITE_INACTIVO = 45 * 60 * 1000; // 45 minutos (te avisa antes de que muera la hora)

    const reiniciarRelojInactividad = () => {
        if (!token.value) return; // Si no está logueado, no hacemos nada
        
        if (temporizadorInactividad) clearTimeout(temporizadorInactividad);
        
        temporizadorInactividad = setTimeout(() => {
            mostrarAlertaSiguesAhi();
        }, TIEMPO_LIMITE_INACTIVO);
    };

    const mostrarAlertaSiguesAhi = () => {
        // Pausamos el rastreador para que mover el mouse no lo quite
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

    // ── 3. EXTENDER LA VIDA CON EL BACKEND ────────────────────
    const requestRenewedToken = async () => {
        try {
            // Vamos al backend a pedir 1 hora más
            const res = await fetch(`${API_URL}/api/auth/refresh`, { 
                headers: { 'Authorization': `Bearer ${token.value}` }
            });

            if (!res.ok) throw new Error('No se pudo renovar');
            
            const data = await res.json();
            
            // Reemplazamos el token viejo por el nuevo
            token.value = data.token;
            localStorage.setItem('token', data.token);

            Swal.fire({ title: 'Sesión extendida', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
            
            // Volvemos a armar todas las bombas de tiempo
            programarCierreSesion();
            encenderRastreadorInactividad();

        } catch (error) {
            forzarCierreSeguridad('Tu sesión ya había vencido. Vuelve a entrar.');
        }
    };

    // ── 4. RASTREADORES DEL DOM (Mouse y Teclado) ─────────────
    const eventos = ['mousemove', 'keydown', 'scroll', 'click'];
    
    // Usamos un throttle (freno) rudimentario para no saturar el navegador si mueven mucho el mouse
    let bloqueado = false;
    const detectorActividad = () => {
        if (bloqueado) return;
        reiniciarRelojInactividad();
        bloqueado = true;
        setTimeout(() => bloqueado = false, 2000); // Solo actualiza el reloj cada 2 segundos máximo
    };

    const encenderRastreadorInactividad = () => {
        eventos.forEach(evt => window.addEventListener(evt, detectorActividad));
        reiniciarRelojInactividad();
    };

    const apagarRastreadorInactividad = () => {
        eventos.forEach(evt => window.removeEventListener(evt, detectorActividad));
    };

    // ── 5. LA BOMBA ORIGINAL DEL JWT ──────────────────────────
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

    // ── 6. LOGIN EXPORT ───────────────────────────────────────
    const loginSession = (newToken, newUser) => {
        resetAnimationState();
        token.value = newToken;
        user.value = newUser;
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        programarCierreSesion();
        encenderRastreadorInactividad(); // Prendemos los radares
    };

    return {
        token, user: userProfile, isLoggedIn, userRole,
        loginSession, logoutSession, 
        programarCierreSesion, encenderRastreadorInactividad
    };
}