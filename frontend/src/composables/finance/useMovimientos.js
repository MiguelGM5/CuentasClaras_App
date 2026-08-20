import { ref, computed } from 'vue';
import Swal from 'sweetalert2';
import { API_URL } from '../../constants/api';
import { obtenerHoy } from '../../utils/date';
import { getAuthHeaders } from '../../utils/http';

export function useMovimientos() {
    const fechaHoy = obtenerHoy();
    const movimientos = ref([]);

    const totalIngresos = computed(() => movimientos.value.filter(m => m.tipo === 'ingreso').reduce((a, m) => a + +m.monto, 0));
    const totalGastos = computed(() => movimientos.value.filter(m => m.tipo === 'gasto').reduce((a, m) => a + +m.monto, 0));
    const saldoActual = computed(() => totalIngresos.value - totalGastos.value);
    
    const gastosPorCategoria = computed(() => {
        const agrupado = {};
        movimientos.value.filter(m => m.tipo === 'gasto').forEach(g => {
            agrupado[g.categoria] = (agrupado[g.categoria] || 0) + +g.monto;
        });
        return agrupado;
    });

    const cargarMovimientos = async () => {
        const res = await fetch(`${API_URL}/api/finance/movimientos`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error('Error al cargar movimientos');
        movimientos.value = await res.json();
    };

    const registrarMovimiento = async (datos) => {
        if (datos.fecha && datos.fecha > fechaHoy) {
            Swal.fire({ title: '¡Epá!', text: 'No puedes registrar movimientos con fecha del futuro.', icon: 'warning', confirmButtonColor: '#00B4B4' });
            return false;
        }

        try {
            const res = await fetch(`${API_URL}/api/finance/movimientos`, {
                method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(datos)
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

    return { 
        movimientos, totalIngresos, totalGastos, saldoActual, gastosPorCategoria, 
        cargarMovimientos, registrarMovimiento, fechaHoy
    };
}