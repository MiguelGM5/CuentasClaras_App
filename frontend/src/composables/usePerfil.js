import { ref, computed } from 'vue';

export function usePerfil() {

    // Datos del usuario (simulado, viene de localStorage / API)
    const perfil = ref({
        nombre: 'Miguel',
        apellidoPaterno: 'Gomez',
        apellidoMaterno: 'Mendez',
        email: 'miguel@ipn.mx',
        telefono: '55 1234 5678',
        fechaNacimiento: '1998-04-12',
        inicial: 'M',
        plan: 'free',          // 'free' | 'premium'
        miembroDesde: '2026-01-15',
        notificacionesEmail: true,
        notificacionesApp: false
    });

    // Copia editable separada para no mutar el original hasta guardar
    const perfilEditable = ref({ ...perfil.value });

    // Historial de facturas / pagos
    const historialPagos = ref([
        { id: 1, concepto: 'Plan Premium - Enero 2026', monto: 99, fecha: '2026-01-15', estado: 'Pagado' },
        { id: 2, concepto: 'Plan Premium - Febrero 2026', monto: 99, fecha: '2026-02-15', estado: 'Pagado' },
    ]);

    // -------------------------------------------------
    // COMPUTED
    // -------------------------------------------------
    const nombreCompleto = computed(() =>
        `${perfil.value.nombre} ${perfil.value.apellidoPaterno} ${perfil.value.apellidoMaterno}`
    );

    const esPremium = computed(() => perfil.value.plan === 'premium');

    const diasComoMiembro = computed(() => {
        const inicio = new Date(perfil.value.miembroDesde);
        const hoy    = new Date();
        return Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24));
    });

    // -------------------------------------------------
    // ACCIONES
    // -------------------------------------------------
    const guardarPerfil = (datos) => {
        perfil.value = { ...perfil.value, ...datos };
        perfilEditable.value = { ...perfil.value };
        // TODO: llamada a API PUT /api/perfil
        return true;
    };

    const cambiarPassword = (actual, nueva) => {
        // TODO: llamada a API PUT /api/auth/password
        return true;
    };

    const cancelarSuscripcion = () => {
        perfil.value.plan = 'free';
        // TODO: llamada a API DELETE /api/suscripcion
    };

    const actualizarSuscripcion = (nuevoPlan) => {
        perfil.value.plan = nuevoPlan;
        // TODO: llamada a API POST /api/suscripcion
    };

    return {
        perfil,
        perfilEditable,
        historialPagos,
        nombreCompleto,
        esPremium,
        diasComoMiembro,
        guardarPerfil,
        cambiarPassword,
        cancelarSuscripcion,
        actualizarSuscripcion
    };
}
