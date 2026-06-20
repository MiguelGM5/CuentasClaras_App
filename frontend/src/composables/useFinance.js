import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { API_URL } from '../constants/api';

export function useFinance() {

    const movimientos = ref([]);
    const prestamos   = ref([]);
    const metas       = ref([]);
    const pagares     = ref([]);
    const loading     = ref(false);
    const error       = ref(null);

    const usuario  = JSON.parse(localStorage.getItem('user') || '{}');
    const esPremium = usuario.rol === 'premium';

    const getHeaders = () => ({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    // ─────────────────────────────────────────
    // CARGA INICIAL (se llama en onMounted)
    // ─────────────────────────────────────────
    const cargarDatos = async () => {
        loading.value = true;
        error.value   = null;
        try {
            const [movRes, preRes, metRes] = await Promise.all([
                fetch(`${API_URL}/api/finance/movimientos`, { headers: getHeaders() }),
                fetch(`${API_URL}/api/finance/prestamos`,   { headers: getHeaders() }),
                fetch(`${API_URL}/api/finance/metas`,       { headers: getHeaders() }),
            ]);

            if (!movRes.ok || !preRes.ok || !metRes.ok)
                throw new Error('Error al cargar datos financieros');

            movimientos.value = await movRes.json();
            prestamos.value   = await preRes.json();
            metas.value       = await metRes.json();

            // Solo cargamos pagarés si es usuario premium
            if (esPremium) {
                const pagRes = await fetch(`${API_URL}/api/finance/pagares`, { headers: getHeaders() });
                if (pagRes.ok) pagares.value = await pagRes.json();
            }
        } catch (err) {
            error.value = err.message;
            console.error('useFinance.cargarDatos:', err);
        } finally {
            loading.value = false;
        }
    };

    // ─────────────────────────────────────────
    // COMPUTED  (igual que antes, pero +monto)
    // ─────────────────────────────────────────
    const totalIngresos = computed(() =>
        movimientos.value
            .filter(m => m.tipo === 'ingreso')
            .reduce((a, m) => a + +m.monto, 0)
    );

    const totalGastos = computed(() =>
        movimientos.value
            .filter(m => m.tipo === 'gasto')
            .reduce((a, m) => a + +m.monto, 0)
    );

    const saldoActual = computed(() => totalIngresos.value - totalGastos.value);

    const gastosPorCategoria = computed(() => {
        const agrupado = {};
        movimientos.value
            .filter(m => m.tipo === 'gasto')
            .forEach(g => {
                agrupado[g.categoria] = (agrupado[g.categoria] || 0) + +g.monto;
            });
        return agrupado;
    });

    const totalPrestado = computed(() =>
        prestamos.value
            .filter(p => p.tipo === 'prestado')
            .reduce((a, p) => a + +p.monto, 0)
    );

    const totalDeuda = computed(() =>
        prestamos.value
            .filter(p => p.tipo === 'pedido' && p.estado === 'Pendiente')
            .reduce((a, p) => a + +p.monto, 0)
    );

    const totalAhorradoEnMetas = computed(() =>
        metas.value.reduce((a, m) => a + +m.montoActual, 0)
    );

    // ─────────────────────────────────────────
    // CRUD — MOVIMIENTOS
    // ─────────────────────────────────────────
    const registrarMovimiento = async (datos) => {
        try {
            const res  = await fetch(`${API_URL}/api/finance/movimientos`, {
                method:  'POST',
                headers: getHeaders(),
                body:    JSON.stringify(datos)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            movimientos.value.unshift(data);
            Swal.fire({ title: '¡Movimiento registrado!', icon: 'success', confirmButtonColor: '#00B4B4', timer: 1500, showConfirmButton: false });
            return true;
        } catch (err) {
            Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonColor: '#00B4B4' });
            return false;
        }
    };

    // ─────────────────────────────────────────
    // CRUD — PRÉSTAMOS
    // ─────────────────────────────────────────
    const registrarPrestamo = async (datos) => {
        try {
            const res  = await fetch(`${API_URL}/api/finance/prestamos`, {
                method:  'POST',
                headers: getHeaders(),
                body:    JSON.stringify(datos)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            prestamos.value.unshift(data);
            Swal.fire({ title: '¡Préstamo registrado!', icon: 'success', confirmButtonColor: '#00B4B4', timer: 1500, showConfirmButton: false });
            return true;
        } catch (err) {
            Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonColor: '#00B4B4' });
            return false;
        }
    };

    const saldarPrestamo = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/finance/prestamos/${id}/saldar`, {
                method:  'PUT',
                headers: getHeaders()
            });
            if (!res.ok) throw new Error('No se pudo saldar el préstamo');
            const idx = prestamos.value.findIndex(p => p.id === id);
            if (idx !== -1) prestamos.value[idx].estado = 'Saldado';
            Swal.fire({ title: '¡Saldado!', icon: 'success', confirmButtonColor: '#00B4B4', timer: 1500, showConfirmButton: false });
            return true;
        } catch (err) {
            Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonColor: '#00B4B4' });
            return false;
        }
    };

    // ─────────────────────────────────────────
    // CRUD — METAS
    // ─────────────────────────────────────────
    const registrarMeta = async (datos) => {
        try {
            const res  = await fetch(`${API_URL}/api/finance/metas`, {
                method:  'POST',
                headers: getHeaders(),
                body:    JSON.stringify(datos)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            metas.value.unshift(data);
            Swal.fire({ title: '¡Meta creada!', icon: 'success', confirmButtonColor: '#00B4B4', timer: 1500, showConfirmButton: false });
            return true;
        } catch (err) {
            Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonColor: '#00B4B4' });
            return false;
        }
    };

    const abonarMeta = async (id, abono) => {
        try {
            const res = await fetch(`${API_URL}/api/finance/metas/${id}/abonar`, {
                method:  'PUT',
                headers: getHeaders(),
                body:    JSON.stringify({ abono })
            });
            if (!res.ok) throw new Error('No se pudo abonar a la meta');
            const idx = metas.value.findIndex(m => m.id === id);
            if (idx !== -1) metas.value[idx].montoActual = +metas.value[idx].montoActual + +abono;
            Swal.fire({ title: '¡Abono registrado!', icon: 'success', confirmButtonColor: '#00B4B4', timer: 1500, showConfirmButton: false });
            return true;
        } catch (err) {
            Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonColor: '#00B4B4' });
            return false;
        }
    };

    // ─────────────────────────────────────────
    // CRUD — PAGARÉS (premium)
    // ─────────────────────────────────────────
    const registrarPagare = async (datos) => {
        try {
            const res  = await fetch(`${API_URL}/api/finance/pagares`, {
                method:  'POST',
                headers: getHeaders(),
                body:    JSON.stringify(datos)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            pagares.value.unshift(data);
            Swal.fire({ title: '¡Pagaré emitido!', icon: 'success', confirmButtonColor: '#00B4B4', timer: 1500, showConfirmButton: false });
            return true;
        } catch (err) {
            Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonColor: '#00B4B4' });
            return false;
        }
    };

    onMounted(cargarDatos);

    return {
        // Estado
        movimientos, prestamos, metas, pagares,
        loading, error,

        // Computed
        totalIngresos, totalGastos, saldoActual, gastosPorCategoria,
        totalPrestado, totalDeuda, totalAhorradoEnMetas,

        // CRUD
        registrarMovimiento,
        registrarPrestamo, saldarPrestamo,
        registrarMeta,     abonarMeta,
        registrarPagare,

        // Utilitario
        cargarDatos
    };
}