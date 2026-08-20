import { ref, computed } from 'vue';
import Swal from 'sweetalert2';
import { API_URL } from '../../constants/api';
import { obtenerHoy } from '../../utils/date';
import { getAuthHeaders } from '../../utils/http';

export function useMetas() {
    const fechaHoy = obtenerHoy();
    const metas = ref([]);

    const totalAhorradoEnMetas = computed(() => metas.value.reduce((a, m) => a + +(m.montoActual ?? m.monto_actual ?? 0), 0));

    const cargarMetas = async () => {
        const res = await fetch(`${API_URL}/api/finance/metas`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error('Error al cargar metas');
        metas.value = await res.json();
    };

    const registrarMeta = async (datos) => {
        if (datos.fecha_limite && datos.fecha_limite < fechaHoy) {
            Swal.fire({ title: 'Fecha inválida', text: 'La meta debe ser a futuro.', icon: 'warning', confirmButtonColor: '#00B4B4' });
            return false;
        }

        try {
            const res = await fetch(`${API_URL}/api/finance/metas`, {
                method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(datos)
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

    const actualizarMetaDB = async (id, datos) => {
        if (datos.fecha_limite && datos.fecha_limite < fechaHoy) {
            Swal.fire({ title: 'Fecha inválida', text: 'La meta debe ser a futuro.', icon: 'warning', confirmButtonColor: '#00B4B4' });
            return false;
        }

        try {
            const res = await fetch(`${API_URL}/api/finance/metas/${id}`, {
                method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(datos)
            });
            if (!res.ok) throw new Error('Error al actualizar la meta en el servidor');
            
            const idx = metas.value.findIndex(m => m.id === id);
            if (idx !== -1) {
                metas.value[idx] = { ...metas.value[idx], ...datos };
                if (datos.monto_actual !== undefined) metas.value[idx].montoActual = datos.monto_actual;
                if (datos.monto_objetivo !== undefined) metas.value[idx].montoObjetivo = datos.monto_objetivo;
            }
            return true;
        } catch (err) {
            Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonColor: '#00B4B4' });
            return false;
        }
    };

    const eliminarMetaDB = async (id) => {
        try {
            const res = await fetch(`${API_URL}/api/finance/metas/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
            if (!res.ok) throw new Error('Error al eliminar la meta');

            metas.value = metas.value.filter(m => m.id !== id);
            Swal.fire({ title: 'Meta eliminada', icon: 'success', confirmButtonColor: '#00B4B4', timer: 1500, showConfirmButton: false });
            return true;
        } catch (err) {
            Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonColor: '#00B4B4' });
            return false;
        }
    };

    return { metas, totalAhorradoEnMetas, cargarMetas, registrarMeta, actualizarMetaDB, eliminarMetaDB, fechaHoy };
}