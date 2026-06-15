import { ref, computed } from 'vue';
import Swal from 'sweetalert2';

export function useFinance() {
    //Datos Haardcodeados
    const movimientos = ref([
        // Ingresos viejos (fuera del rango de 7 días, no salen en la gráfica pero suman al total)
        { id: 1, tipo: "ingreso", categoria: "Sueldo", descripcion: "Quincena", monto: 12000, fecha: "2026-06-01" },
        
        // Gastos
        { id: 2, tipo: "gasto", categoria: "Alimentación", descripcion: "Walmart", monto: 1500, fecha: "2026-06-05" },
        { id: 3, tipo: "gasto", categoria: "Servicios", descripcion: "Internet", monto: 600, fecha: "2026-06-06" },
        
        // 🔥 INGRESOS NUEVOS (Para llenar el Histograma) 🔥
        { id: 4, tipo: "ingreso", categoria: "Ventas", descripcion: "Venta teclado", monto: 800, fecha: "2026-06-04" },
        { id: 5, tipo: "ingreso", categoria: "Ventas", descripcion: "Venta monitor", monto: 2500, fecha: "2026-06-05" },
        { id: 6, tipo: "ingreso", categoria: "Sueldo", descripcion: "Bono", monto: 1200, fecha: "2026-06-07" },
        { id: 7, tipo: "ingreso", categoria: "Ventas", descripcion: "Juego de PS5", monto: 950, fecha: "2026-06-08" },
        { id: 8, tipo: "ingreso", categoria: "Sueldo", descripcion: "Reintegro obra social", monto: 3400, fecha: "2026-06-09" }
    ]);

    const prestamos = ref([
        { id: 1, tipo: "prestado", deudor: "Carlos", concepto: "Para la renta", monto: 1500, estado: "Pendiente", fechaPago: "2026-06-15" },
        { id: 2, tipo: "pedido", deudor: "Mamá", concepto: "Emergencia médica", monto: 800, estado: "Saldado", fechaPago: "2026-06-10" }
    ]);

    const metas = ref([
        { id: 1, titulo: "Fondo de Emergencia", montoObjetivo: 15000, montoActual: 5000, fechaLimite: "2026-12-31" },
        { id: 2, titulo: "Viaje a Cancún", montoObjetivo: 25000, montoActual: 3500, fechaLimite: "2027-03-15" }
    ]);

    // ─────────────────────────────────────────
    // 2. MATEMÁTICAS Y ESTADÍSTICAS
    // ─────────────────────────────────────────
    const totalIngresos = computed(() => movimientos.value.filter(m => m.tipo === "ingreso").reduce((a, m) => a + m.monto, 0));
    const totalGastos = computed(() => movimientos.value.filter(m => m.tipo === "gasto").reduce((a, m) => a + m.monto, 0));
    const saldoActual = computed(() => totalIngresos.value - totalGastos.value);

    // Agrupamos gastos para la gráfica de pastel
    const gastosPorCategoria = computed(() => {
        const agrupado = {};
        movimientos.value.filter(m => m.tipo === "gasto").forEach(g => {
            if (!agrupado[g.categoria]) agrupado[g.categoria] = 0;
            agrupado[g.categoria] += g.monto;
        });
        return agrupado;
    });

    const totalPrestado = computed(() => prestamos.value.filter(p => p.tipo === "prestado").reduce((a, p) => a + p.monto, 0));
    const totalDeuda = computed(() => prestamos.value.filter(p => p.tipo === "pedido" && p.estado === "Pendiente").reduce((a, p) => a + p.monto, 0));
    const totalAhorradoEnMetas = computed(() => metas.value.reduce((a, m) => a + m.montoActual, 0));

    // ─────────────────────────────────────────
    // 3. FUNCIONES CRUD BÁSICAS
    // ─────────────────────────────────────────
    const registrarMovimiento = (datos) => { /* Lógica de guardado a BD irá acá */ };
    const registrarPrestamo = (datos) => { /* Lógica de guardado a BD irá acá */ };
    const registrarMeta = (datos) => { /* Lógica de guardado a BD irá acá */ };

    return {
        movimientos, prestamos, metas,
        totalIngresos, totalGastos, saldoActual, gastosPorCategoria,
        totalPrestado, totalDeuda, totalAhorradoEnMetas,
        registrarMovimiento, registrarPrestamo, registrarMeta
    };
}