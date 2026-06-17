<template>
    <div>
        <div class="mb-8">
            <h1 class="text-3xl font-black text-slate-800 tracking-tight">Préstamos Registrados</h1>
            <p class="text-sm text-slate-400 mt-1">Todos los préstamos informales de los usuarios</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <!-- <div class="bg-white p-4 rounded-xl border border-slate-100">
                <p class="text-lg font-bold text-slate-400 uppercase">Total Registros</p>
                <p class="text-4xl font-black text-slate-800 mt-1">{{ totalPrestamos }}</p>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-100">
                <div class="flex items-center gap-1.5 mb-1">
                    <ArrowUpRight :size="18" class="text-emerald-500" />
                    <p class="text-lg font-bold text-emerald-500 uppercase">Monto Prestado</p>
                </div>
                <p class="text-4xl font-black text-slate-800">${{ montoPrestado.toLocaleString("es-MX") }}</p>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-100">
                <div class="flex items-center gap-1.5 mb-1">
                    <ArrowDownLeft :size="18" class="text-amber-500" />
                    <p class="text-lg font-bold text-amber-500 uppercase">Monto Pedido</p>
                </div>
                <p class="text-4xl font-black text-slate-800">${{ montoPedido.toLocaleString("es-MX") }}</p>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-100">
                <div class="flex items-center gap-1.5 mb-1">
                    <AlertTriangle :size="18" class="text-orange-500" />
                    <p class="text-lg font-bold text-orange-500 uppercase">Pendientes</p>
                </div>
                <p class="text-4xl font-black text-slate-800">{{ prestamosPendientes }}</p>
            </div> -->

            <StatCard v-for="card in cardsPrestamos" 
                :key="card.id" 
                :label="card.label" 
                :value="card.value" 
                :icon="card.icon" 
                :color-texto="card.colorTexto" 
                :color-bg="card.colorBg"
            >
                <template #footer>
                    {{ card.footer }}
                </template>
            </StatCard>
        </div>

        <BaseDataTable titulo="Todos los Préstamos" placeholderBuscar="Buscar por usuario o concepto..." :headers="columnas" :items="prestamos" :searchFields="camposBusqueda">
            <template #usuario="{ row }">
                <div class="flex items-center gap-2.5">
                    <div
                        class="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-black text-[10px] flex-shrink-0">
                        {{row.usuarioNombre.split(" ").map((n) => n[0]).join("").toUpperCase()}}
                    </div>
                    <span class="font-semibold text-slate-700">{{ row.usuarioNombre }}</span>
                </div>
            </template>
            <template #tipo="{ row }">
                <span :class="row.tipo === 'prestado' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 w-fit">
                    <component :is="row.tipo === 'prestado' ? ArrowUpRight : ArrowDownLeft" :size="11" />
                    {{ row.tipo === "prestado" ? "Prestó" : "Pidió" }}
                </span>
            </template>
            <template #concepto="{ row }">
                <span class="text-slate-400 text-xs">
                    {{ row.concepto }}
                </span>
            </template>
            <template #monto="{ row }">
                <span :class="row.tipo === 'prestado' ? 'text-emerald-600' : 'text-amber-600'"
                    class="font-black text-sm">
                    ${{ row.monto.toLocaleString("es-MX") }}
                </span>
            </template>
            <template #fechaPago="{ row }">
                <span class="text-xs text-slate-400">
                    {{ row.fechaPago }}
                </span>
            </template>
            <template #estado="{ row }">
                <span
                    :class="row.estado === 'Saldado' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'"
                    class="px-2.5 py-1 rounded-full text-[11px] font-bold">
                    {{ row.estado }}
                </span>
            </template>
        </BaseDataTable>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { ArrowUpRight, ArrowDownLeft, AlertTriangle, BriefcaseBusiness } from 'lucide-vue-next';

import BaseDataTable from '../../../components/dashboard/BaseDataTable.vue';
import StatCard from './StatCard.vue';

const props = defineProps({ 
    prestamos:{type:Array, default: () => [] }, 
    totalPrestamos:{type:Number, default:0 }, 
    montoPrestado:{type:Number, default:0 }, 
    montoPedido:{type:Number, default:0 }, 
    prestamosPendientes:{type:Number, default:0 }  
});

const cardsPrestamos = computed(() => [
    { 
        id: 1,
        label: "Total Registros",
        value: props.totalPrestamos, 
        icon: BriefcaseBusiness,
        colorTexto: "text-indigo-600",
        colorBg: "bg-indigo-100",
        footer: `` 
    },
    {
        id: 2,
        label: "Monto Prestado",
        value: `$${props.montoPrestado.toLocaleString("es-MX")}`,
        icon: ArrowUpRight,
        colorTexto: "text-teal-600",
        colorBg: "bg-teal-100",
        footer: ``
    },
    {
        id: 3,
        label: "Monto Pedido",
        value: `$${props.montoPedido.toLocaleString("es-MX")}`,
        icon: ArrowDownLeft,
        colorTexto: "text-amber-600",
        colorBg: "bg-amber-100",
        footer: ``
    }, 
    {
        id: 4,
        label: "Pendientes",
        value: props.prestamosPendientes,
        icon: AlertTriangle,
        colorTexto: "text-red-600",
        colorBg: "bg-red-100",
        footer: ``
    }, 
]);

const columnas = [
    { key: 'usuario', label: 'Usuario' }, { key: 'tipo', label: 'Tipo' }, { key: 'concepto', label: 'Concepto' },
    { key: 'monto', label: 'Monto' }, { key: 'fechaPago', label: 'Fecha Límite' }, { key: 'estado', label: 'Estado' }
];
const camposBusqueda = ['usuarioNombre', 'concepto', 'tipo', 'estado'];
</script>