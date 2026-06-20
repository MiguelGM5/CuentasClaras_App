<template>
    <div>
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
                <h1 class="text-4xl font-black text-slate-800 tracking-tight">Mi Resumen</h1>
                <p class="text-md text-slate-400 mt-1">Monitorea tus finanzas</p>
            </div>

            <div class="flex flex-wrap gap-2">
                <button @click="$emit('abrirModalMeta')"
                    class="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold px-4 py-2.5 rounded-xl text-md flex items-center justify-center gap-2 transition-all">
                    <Target :size="20" /> Meta
                </button>
                <button @click="$emit('abrirModalPrestamo')"
                    class="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold px-4 py-2.5 rounded-xl text-md flex items-center justify-center gap-2 transition-all">
                    <CreditCard :size="20" /> Préstamo
                </button>
                <button @click="$emit('abrirModalMovimiento')"
                    class="w-full sm:w-auto bg-[#00B4B4] hover:bg-[#009291] text-white font-bold px-5 py-2.5 rounded-xl text-md flex items-center justify-center gap-2 shadow-md shadow-teal-100 transition-all">
                    <Plus :size="20" /> Movimiento
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
            <div class="bg-[#001D3D] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                <div class="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-5 rounded-full blur-2xl"></div>
                <p class="text-[14px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <DollarSign :size="15" />Saldo Actual
                </p>
                <p class="text-3xl font-black">${{ displaySaldo.toLocaleString("es-MX") }}</p>
            </div>
            <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <p class="text-[14px] font-bold text-emerald-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <ArrowDownLeft :size="15" /> Ingresos Mes
                </p>
                <p class="text-3xl font-black text-slate-800">${{ displayIngresos.toLocaleString("es-MX") }}</p>
            </div>
            <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <p class="text-[14px] font-bold text-orange-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <ArrowUpRight :size="15" /> Gastos Mes
                </p>
                <p class="text-3xl font-black text-slate-800">${{ displayGastos.toLocaleString("es-MX") }}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">
            <GastosDonutChart :total="totalGastos" :datos="gastosPorCategoria" :colores="coloresCategorias" />
            <MetasBarChart :metas="metas" />
            <IngresosHistogram :movimientos="movimientos" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Target, CreditCard, Plus, ArrowDownLeft, ArrowUpRight, DollarSign } from 'lucide-vue-next';
import GastosDonutChart from './GastosDonutChart.vue';
import MetasBarChart from './MetasBarChart.vue';
import IngresosHistogram from './IngresosHistogram.vue';

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
    Entretenimiento: { hex: '#ec4899' },
    Salud: { hex: '#00bc7d' }, 
    Educación: { hex: '#432dd7' },
    Otro: { hex: '#e8e002' }
};

// --- MOTOR DE ANIMACIÓN PARA LAS TARJETAS ---
const displaySaldo = ref(0);
const displayIngresos = ref(0);
const displayGastos = ref(0);

const animateNumbers = () => {
    const duration = 1800;
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameRate);
    const easeOutQuad = t => t * (2 - t);

    let frame = 0;
    const targets = {
        saldo: props.saldoActual || 0,
        ingresos: props.totalIngresos || 0,
        gastos: props.totalGastos || 0
    };

    displaySaldo.value = 0;
    displayIngresos.value = 0;
    displayGastos.value = 0;

    const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);

        displaySaldo.value = Math.round(targets.saldo * progress);
        displayIngresos.value = Math.round(targets.ingresos * progress);
        displayGastos.value = Math.round(targets.gastos * progress);

        if (frame === totalFrames) {
            clearInterval(counter);
            displaySaldo.value = targets.saldo;
            displayIngresos.value = targets.ingresos;
            displayGastos.value = targets.gastos;
        }
    }, frameRate);
};

onMounted(animateNumbers);

watch(
    () => [props.saldoActual, props.totalIngresos, props.totalGastos],
    animateNumbers
);
</script>