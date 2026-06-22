import { ref, onMounted } from 'vue';

// Importamos a los módulos especialistas
import { useMovimientos } from './finance/useMovimientos';
import { usePrestamos } from './finance/usePrestamos';
import { useMetas } from './finance/useMetas';
import { usePagares } from './finance/usePagare';

export function useFinance() {
    const loading = ref(false);
    const error   = ref(null);

    const usuario   = JSON.parse(localStorage.getItem('user') || '{}');
    const esPremium = usuario.rol === 'premium';

    // Desempaquetamos a los obreros
    const { movimientos, totalIngresos, totalGastos, saldoActual, gastosPorCategoria, cargarMovimientos, registrarMovimiento } = useMovimientos();
    const { prestamos, totalPrestado, totalDeuda, cargarPrestamos, registrarPrestamo, saldarPrestamo } = usePrestamos();
    const { metas, totalAhorradoEnMetas, cargarMetas, registrarMeta, actualizarMetaDB, eliminarMetaDB } = useMetas();
    const { pagares, cargarPagares, handleCrearPagare } = usePagares();

    // ─────────────────────────────────────────
    // MOTOR DE CARGA CONCURRENTE
    // ─────────────────────────────────────────
    const cargarDatos = async () => {
        loading.value = true;
        error.value   = null;
        try {
            // Preparamos el array de promesas. Esto hace que todo cargue al mismo tiempo y sea ultra rápido
            const promesas = [
                cargarMovimientos(),
                cargarPrestamos(),
                cargarMetas()
            ];

            // Si es premium, le sumamos la petición de pagarés a la lista
            if (esPremium) promesas.push(cargarPagares());

            // Ejecutamos todo de un golpe
            await Promise.all(promesas);

        } catch (err) {
            error.value = err.message;
            console.error('useFinance.cargarDatos:', err);
        } finally {
            loading.value = false;
        }
    };

    onMounted(cargarDatos);

    // Exportamos el objeto GIGANTE exacto que el Dashboard necesita leer
    return {
        // Estado y Utilidades
        loading, error, cargarDatos,
        
        // Movimientos
        movimientos, totalIngresos, totalGastos, saldoActual, gastosPorCategoria, registrarMovimiento,
        
        // Préstamos
        prestamos, totalPrestado, totalDeuda, registrarPrestamo, saldarPrestamo,
        
        // Metas
        metas, totalAhorradoEnMetas, registrarMeta, actualizarMetaDB, eliminarMetaDB,
        
        // Pagarés
        pagares, handleCrearPagare
    };
}