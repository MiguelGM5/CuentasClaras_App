<template>
    <div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
                <h1 class="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">Mi Resumen</h1>
                <p class="text-sm sm:text-md text-slate-400 mt-0.5 sm:mt-1">Monitorea tus finanzas</p>
            </div>

            <!-- Barra de Acciones Rápidas con UX Táctil Optimizado -->
            <div class="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto">
                <button @click="$emit('abrirModalMovimiento')"
                    class="w-full sm:w-auto order-1 sm:order-3 bg-[#00B4B4] hover:bg-[#009291] active:scale-[0.98] text-white font-bold px-5 py-3.5 sm:py-2.5 rounded-2xl sm:rounded-xl text-base sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-100/50 transition-all">
                    <Plus class="w-5 h-5 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                    <span>Nuevo Movimiento</span>
                </button>

                <div class="grid grid-cols-2 gap-2 sm:flex sm:gap-3 w-full sm:w-auto order-2">
                    <button @click="$emit('abrirModalMeta')"
                        class="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] font-bold px-4 py-3 sm:py-2.5 rounded-2xl sm:rounded-xl text-sm flex items-center justify-center gap-2 shadow-2xs transition-all">
                        <Target class="w-4.5 h-4.5 text-[#00B4B4]" />
                        <span>Nueva Meta</span>
                    </button>
                    
                    <button @click="$emit('abrirModalPrestamo')"
                        class="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] font-bold px-4 py-3 sm:py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-2xs transition-all">
                        <CreditCard class="w-4.5 h-4.5 text-indigo-500" />
                        <span>Nuevo Préstamo</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5 mb-6 sm:mb-8">
            <!-- Tarjeta Saldo Actual (Hero Glassmorphism Card) -->
            <div class="bg-gradient-to-br from-[#001D3D] via-[#002855] to-[#001229] rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden group hover:-translate-y-0.5 transition-all duration-300 border border-slate-800">
                <div class="absolute -right-6 -top-6 w-32 h-32 bg-[#00B4B4] opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div class="absolute -left-6 -bottom-6 w-28 h-28 bg-blue-500 opacity-15 rounded-full blur-xl"></div>
                
                <div class="flex items-center justify-between mb-2">
                    <p class="text-xs sm:text-[13px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                        <DollarSign class="w-4 h-4 text-[#00B4B4]" />
                        <span>Saldo Actual</span>
                    </p>
                    <span class="text-[10px] font-bold bg-[#00B4B4]/20 text-[#00B4B4] px-2.5 py-0.5 rounded-full border border-[#00B4B4]/30">EN VIVO</span>
                </div>
                <p class="text-3xl sm:text-4xl font-black tracking-tight text-white">${{ (saldoActual || 0).toLocaleString("es-MX") }}</p>
            </div>

            <!-- Tarjeta Ingresos Mes -->
            <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-xs sm:text-[13px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                        <ArrowDownLeft class="w-4 h-4 text-emerald-500" />
                        <span>Ingresos Mes</span>
                    </p>
                    <div class="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <ArrowDownLeft class="w-4.5 h-4.5" />
                    </div>
                </div>
                <p class="text-2.5xl sm:text-3xl font-black text-slate-800 tracking-tight">${{ (totalIngresos || 0).toLocaleString("es-MX") }}</p>
            </div>

            <!-- Tarjeta Gastos Mes -->
            <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-xs sm:text-[13px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
                        <ArrowUpRight class="w-4 h-4 text-rose-500" />
                        <span>Gastos Mes</span>
                    </p>
                    <div class="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                        <ArrowUpRight class="w-4.5 h-4.5" />
                    </div>
                </div>
                <p class="text-2.5xl sm:text-3xl font-black text-slate-800 tracking-tight">${{ (totalGastos || 0).toLocaleString("es-MX") }}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-7">
            <GastosDonutChart :total="totalGastos" :datos="gastosPorCategoria" :colores="coloresCategorias" />
            <MetasBarChart :metas="metas" />
            <div class="lg:col-span-2">
                <IngresosHistogram :movimientos="movimientos" />
            </div>
        </div>
    </div>
</template>

<script setup>
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
</script>