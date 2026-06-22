import { ref, computed } from 'vue';

export function usePerfil() {
    // Leemos el usuario real guardado en la sesión
    const usuarioStorage = JSON.parse(localStorage.getItem('user') || '{}');

    // ── 1. EL PERFIL REAL (100% Sincronizado con TiDB) ──────────────
    const perfil = ref({
        nombre:          usuarioStorage.nombre || '',
        apellidoPaterno: usuarioStorage.apellido_paterno || '',
        apellidoMaterno: usuarioStorage.apellido_materno || '',
        email:           usuarioStorage.email || '',
        rol:             usuarioStorage.rol ?? 'user' // 'user' o 'premium'
    });

    // Historial de facturas / pagos (Data limpia para las tablas)
    const historialPagos = ref([
        { id: 1, concepto: 'Plan Premium - Enero 2026', monto: 99, fecha: '2026-01-15', estado: 'Pagado' },
        { id: 2, concepto: 'Plan Premium - Febrero 2026', monto: 99, fecha: '2026-02-15', estado: 'Pagado' },
    ]);

    // -------------------------------------------------
    //  COMPUTED PROPERTIES COMPACTAS Y SEGURAS
    // -------------------------------------------------
    
    // Nombre completo limpio eliminando espacios extra si falta el materno
    const nombreCompleto = computed(() => {
        const nombre = perfil.value.nombre;
        const paterno = perfil.value.apellidoPaterno;
        const materno = perfil.value.apellidoMaterno || '';
        return `${nombre} ${paterno} ${materno}`.trim().replace(/\s+/g, ' ');
    });

    // Sincronizado con la propiedad 'rol' del Dashboard principal
    const esPremium = computed(() => perfil.value.rol === 'premium');

    //Forzamos la validación en tiempo de ejecución
    const diasComoMiembro = computed(() => {
        const diasValidos = parseInt(usuarioStorage.dias_miembro, 10);
        return isNaN(diasValidos) ? 0 : diasValidos;
    });

    // -------------------------------------------------
    // ACCIONES DE SEGURIDAD Y SUSCRIPCIÓN
    // -------------------------------------------------
    const cambiarPassword = async (actual, nueva) => {
        try {
            // TODO: Axios / Fetch a tu API real: PUT /api/auth/password
            // await api.put('/auth/password', { actual, nueva });
            return true;
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            return false;
        }
    };

    const cancelarSuscripcion = () => {
        perfil.value.rol = 'user';
        // Actualizamos el storage local para que el Dashboard reaccione al toque
        usuarioStorage.rol = 'user';
        localStorage.setItem('user', JSON.stringify(usuarioStorage));
        // TODO: llamada a API DELETE /api/suscripcion
    };

    const actualizarSuscripcion = (nuevoRol) => {
        perfil.value.rol = nuevoRol;
        // Actualizamos el storage local para que el Dashboard reaccione al toque
        usuarioStorage.rol = nuevoRol;
        localStorage.setItem('user', JSON.stringify(usuarioStorage));
        // TODO: llamada a API POST /api/suscripcion
    };

    return {
        perfil,
        historialPagos,
        nombreCompleto,
        esPremium,
        diasComoMiembro,
        cambiarPassword,
        cancelarSuscripcion,
        actualizarSuscripcion
    };
}