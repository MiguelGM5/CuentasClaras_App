import { ref, onMounted } from 'vue';

import { useMovimientos } from './finance/useMovimientos';
import { usePrestamos } from './finance/usePrestamos';
import { useMetas } from './finance/useMetas';
import { usePagares } from './finance/usePagare';

export function useFinance() {
    const loading = ref(false);
    const error   = ref(null);

    const usuario   = JSON.parse(localStorage.getItem('user') || '{}');
    const esPremium = usuario.rol === 'premium';

    const { movimientos, totalIngresos, totalGastos, saldoActual, gastosPorCategoria, cargarMovimientos, registrarMovimiento } = useMovimientos();
    const { prestamos, totalPrestado, totalDeuda, cargarPrestamos, registrarPrestamo, saldarPrestamo } = usePrestamos();
    const { metas, totalAhorradoEnMetas, cargarMetas, registrarMeta, actualizarMetaDB, eliminarMetaDB } = useMetas();
    const { pagares, cargarPagares, handleCrearPagare } = usePagares();

    const cargarDatos = async () => {
        loading.value = true;
        error.value   = null;
        try {
            const promesas = [
                cargarMovimientos(),
                cargarPrestamos(),
                cargarMetas()
            ];

            if (esPremium) promesas.push(cargarPagares());

            await Promise.all(promesas);

        } catch (err) {
            error.value = err.message;
            console.error('useFinance.cargarDatos:', err);
        } finally {
            loading.value = false;
        }
    };

    onMounted(cargarDatos);

    return {
        loading, error, cargarDatos,
        movimientos, totalIngresos, totalGastos, saldoActual, gastosPorCategoria, registrarMovimiento,
        prestamos, totalPrestado, totalDeuda, registrarPrestamo, saldarPrestamo,
        metas, totalAhorradoEnMetas, registrarMeta, actualizarMetaDB, eliminarMetaDB,
        pagares, handleCrearPagare
    };
}