import { ref, computed, onMounted } from 'vue';

const API_URL = 'http://localhost:3000';

export function usePerfil() {
    const perfil = ref({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        telefono: '',
        fechaNacimiento: '',
        inicial: 'U',
        plan: 'free',
        miembroDesde: new Date().toISOString(),
        notificacionesEmail: true,
        notificacionesApp: false
    });

    const historialPagos = ref([]);
    const cargando = ref(false);

    const getToken = () => localStorage.getItem('token');

    const getHeaders = () => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
    });

    const cargarPerfil = async () => {
        cargando.value = true;

        try {
            const res = await fetch(`${API_URL}/api/perfil`, {
                method: 'GET',
                headers: getHeaders()
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Error al cargar perfil');
            }

            perfil.value = {
                ...perfil.value,
                ...data
            };
        } finally {
            cargando.value = false;
        }
    };

    const guardarPerfil = async (datos) => {
        const datosCambiados = {};

        Object.keys(datos).forEach((key) => {
            if (datos[key] !== perfil.value[key]) {
                datosCambiados[key] = datos[key];
            }
        });

        if (Object.keys(datosCambiados).length === 0) {
            return true;
        }

        const res = await fetch(`${API_URL}/api/perfil`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(datosCambiados)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Error al guardar perfil');
        }

        perfil.value = {
            ...perfil.value,
            ...data.user
        };

        return true;
    };

    const cambiarPassword = async (actual, nueva) => {
        const res = await fetch(`${API_URL}/api/perfil/password`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ actual, nueva })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Error al cambiar contraseña');
        }

        return true;
    };

    const cancelarSuscripcion = () => {
        perfil.value.plan = 'free';
    };

    const actualizarSuscripcion = (nuevoPlan) => {
        perfil.value.plan = nuevoPlan;
    };

    const nombreCompleto = computed(() =>
        `${perfil.value.nombre} ${perfil.value.apellidoPaterno} ${perfil.value.apellidoMaterno}`.trim()
    );

    const esPremium = computed(() => perfil.value.plan === 'premium');

   const diasComoMiembro = computed(() => {
    if (!perfil.value.miembroDesde) return 0;

    const inicio = new Date(perfil.value.miembroDesde);
    const hoy = new Date();

    inicio.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    const dias = Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24));

    return dias < 0 ? 0 : dias;
});

    onMounted(() => {
        cargarPerfil().catch(console.error);
    });

    return {
        perfil,
        historialPagos,
        cargando,
        nombreCompleto,
        esPremium,
        diasComoMiembro,
        cargarPerfil,
        guardarPerfil,
        cambiarPassword,
        cancelarSuscripcion,
        actualizarSuscripcion
    };
}