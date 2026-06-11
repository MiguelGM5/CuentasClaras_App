<template>
    <div>
        <!-- ═══════════════════════════════════ -->
        <!-- HEADER CON LOS 3 BOTONES RÁPIDOS    -->
        <!-- ═══════════════════════════════════ -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
                <h1 class="text-3xl font-black text-slate-800 tracking-tight">Mi Resumen</h1>
                <p class="text-sm text-slate-400 mt-1">Controlá tu plata, no dejes que ella te controle.</p>
            </div>
            <div class="flex flex-wrap gap-2">
                <button @click="$emit('abrirModalMeta')"
                    class="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all">
                    <Target :size="15" /> Meta
                </button>
                <button @click="$emit('abrirModalPrestamo')"
                    class="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all">
                    <CreditCard :size="15" /> Préstamo
                </button>
                <button @click="$emit('abrirModalMovimiento')"
                    class="w-full sm:w-auto bg-[#00B4B4] hover:bg-[#009291] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-100 transition-all">
                    <Plus :size="15" /> Movimiento
                </button>
            </div>
        </div>

        <!-- ═══════════════════════════════════ -->
        <!-- STAT CARDS PRINCIPALES              -->
        <!-- ═══════════════════════════════════ -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
            <div class="bg-[#001D3D] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                <div class="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-5 rounded-full blur-2xl"></div>
                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Saldo Actual</p>
                <p class="text-3xl font-black">${{ saldoActual.toLocaleString("es-MX") }}</p>
            </div>
            <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <p class="text-[11px] font-bold text-emerald-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <ArrowDownLeft :size="13" /> Ingresos Mes
                </p>
                <p class="text-2xl font-black text-slate-800">${{ totalIngresos.toLocaleString("es-MX") }}</p>
            </div>
            <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <p class="text-[11px] font-bold text-orange-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <ArrowUpRight :size="13" /> Gastos Mes
                </p>
                <p class="text-2xl font-black text-slate-800">${{ totalGastos.toLocaleString("es-MX") }}</p>
            </div>
        </div>

        <!-- ═══════════════════════════════════ -->
        <!-- PANEL DE GRÁFICAS (Blindado)        -->
        <!-- ═══════════════════════════════════ -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">

            <!-- 1. PASTEL DE GASTOS (Izquierda) -->
            <GastosDonutChart :total="totalGastos" :datos="gastosPorCategoria" :colores="coloresCategorias" />

            <!-- 2. BARRAS DE METAS (Top 3) (Derecha) -->
            <MetasBarChart :metas="metas" />

            <!-- 3. HISTOGRAMA DE INGRESOS (Abajo, ancho completo) -->
            <div class="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h3 class="font-black text-slate-800 text-base">Evolución de Ingresos</h3>
                        <p class="text-xs text-slate-400 mt-0.5">Últimos 7 días de facturación o cobros</p>
                    </div>
                    <div class="p-2 bg-emerald-50 rounded-xl">
                        <TrendingUp :size="18" class="text-emerald-500" />
                    </div>
                </div>

                <!-- CONTENEDOR BLINDADO DEL HISTOGRAMA -->
                <div class="flex items-end justify-between gap-2 sm:gap-6 mt-4" style="height: 140px;">
                    <div v-for="day in ingresosPerDay" :key="day.dateStr"
                        class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <span class="text-[10px] font-black text-emerald-600 min-h-[16px]">{{ day.sum > 0 ?
                            `$${day.sum}` : '' }}</span>

                        <!-- Barra con estilos directos para evitar que Tailwind lo ignore -->
                        <div class="w-full bg-slate-50 rounded-t-xl flex items-end overflow-hidden"
                            style="height: 100px; max-width: 50px;">
                            <div class="w-full rounded-t-xl transition-all duration-700 ease-out" :style="{
                                height: day.sum > 0 ? `${Math.max((day.sum / maxIngreso) * 100, 15)}%` : '0%',
                                background: day.sum > 0 ? 'linear-gradient(to top, #34d399, #10b981)' : 'transparent'
                            }"></div>
                        </div>

                        <span class="text-[9px] text-slate-400 font-bold text-center leading-tight capitalize">{{
                            day.label }}</span>
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Target, CreditCard, Plus, ArrowDownLeft, ArrowUpRight, TrendingUp } from 'lucide-vue-next';
import GastosDonutChart from './GastosDonutChart.vue';
import MetasBarChart from './MetasBarChart.vue';

const props = defineProps({
    saldoActual: Number,
    totalIngresos: Number,
    totalGastos: Number,
    gastosPorCategoria: Object,
    totalPrestado: Number,
    totalDeuda: Number,
    metas: Array,
    movimientos: Array
});

defineEmits(['abrirModalMovimiento', 'abrirModalPrestamo', 'abrirModalMeta', 'cambiarTab']);

const coloresCategorias = {
    Alimentación: { hex: '#f97316' },
    Transporte: { hex: '#3b82f6' },
    Servicios: { hex: '#a855f7' },
    Sueldo: { hex: '#10b981' },
    Ventas: { hex: '#14b8a6' },
    Entretenimiento: { hex: '#ec4899' }
};

// Pastel garantizado con backgroundImage
const graficaPastel = computed(() => {
    if (props.totalGastos === 0) return "conic-gradient(#e2e8f0 0% 100%)";
    let gradientStr = "";
    let acumulado = 0;
    for (const [cat, monto] of Object.entries(props.gastosPorCategoria || {})) {
        const porcentaje = (monto / props.totalGastos) * 100;
        const color = coloresCategorias[cat]?.hex || '#94a3b8';
        gradientStr += `${color} ${acumulado}% ${acumulado + porcentaje}%, `;
        acumulado += porcentaje;
    }
    return `conic-gradient(${gradientStr.slice(0, -2)})`;
});

const topMetas = computed(() => (props.metas || []).slice(0, 3));
const calcularPorcentaje = (meta) => Math.min((meta.montoActual / meta.montoObjetivo) * 100, 100).toFixed(0);

// Histograma 
const ingresosPerDay = computed(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date("2026-06-10"); // Ojo acá: fijé la fecha para que te cuadren los Mocks
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        const label = d.toLocaleDateString("es-MX", { weekday: "short", day: "numeric" });

        const sum = (props.movimientos || [])
            .filter(m => m.tipo === 'ingreso' && m.fecha === dateStr)
            .reduce((a, b) => a + b.monto, 0);

        days.push({ label, sum, dateStr });
    }
    return days;
});

const maxIngreso = computed(() => {
    const max = Math.max(...ingresosPerDay.value.map(d => d.sum));
    return max > 0 ? max : 100;
});
</script>