import { ref, computed } from 'vue';
import Swal from 'sweetalert2';
import { API_URL } from '../../constants/api';
import { obtenerHoy } from '../../utils/date';
import { getAuthHeaders } from '../../utils/http';

export function usePrestamos() {
    const fechaHoy = obtenerHoy();
    const prestamos = ref([]);

    const totalPrestado = computed(() => prestamos.value.filter(p => p.tipo === 'prestado').reduce((a, p) => a + +p.monto, 0));
    const totalDeuda = computed(() => prestamos.value.filter(p => p.tipo === 'pedido' && p.estado === 'Pendiente').reduce((a, p) => a + +p.monto, 0));

    const cargarPrestamos = async () => {
        const res = await fetch(`${API_URL}/api/finance/prestamos`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error('Error al cargar préstamos');
        prestamos.value = await res.json();
    };

    const registrarPrestamo = async (datos) => {
        if (datos.fecha_pago && datos.fecha_pago < fechaHoy) {
            Swal.fire({ title: 'Fecha inválida', text: 'La fecha límite de pago debe ser a futuro.', icon: 'warning', confirmButtonColor: '#00B4B4' });
            return false;
        }

        try {
            const res = await fetch(`${API_URL}/api/finance/prestamos`, {
                method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(datos)
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
                method: 'PUT', headers: getAuthHeaders()
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

    return { 
        prestamos, totalPrestado, totalDeuda, 
        cargarPrestamos, registrarPrestamo, saldarPrestamo, fechaHoy 
    };
}