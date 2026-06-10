<template>
    <div>
        <div class="mb-8">
            <h1 class="text-3xl font-black text-slate-800 tracking-tight">Préstamos Registrados</h1>
            <p class="text-sm text-slate-400 mt-1">Todos los préstamos informales de los usuarios</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div class="bg-white p-4 rounded-xl border border-slate-100">
                <p class="text-[11px] font-bold text-slate-400 uppercase">Total Registros</p>
                <p class="text-2xl font-black text-slate-800 mt-1">{{ totalPrestamos }}</p>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-100">
                <div class="flex items-center gap-1.5 mb-1">
                    <ArrowUpRight :size="13" class="text-emerald-500" />
                    <p class="text-[11px] font-bold text-emerald-500 uppercase">Monto Prestado</p>
                </div>
                <p class="text-2xl font-black text-slate-800">${{ montoPrestado.toLocaleString("es-MX") }}</p>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-100">
                <div class="flex items-center gap-1.5 mb-1">
                    <ArrowDownLeft :size="13" class="text-amber-500" />
                    <p class="text-[11px] font-bold text-amber-500 uppercase">Monto Pedido</p>
                </div>
                <p class="text-2xl font-black text-slate-800">${{ montoPedido.toLocaleString("es-MX") }}</p>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-100">
                <div class="flex items-center gap-1.5 mb-1">
                    <AlertTriangle :size="13" class="text-orange-500" />
                    <p class="text-[11px] font-bold text-orange-500 uppercase">Pendientes</p>
                </div>
                <p class="text-2xl font-black text-slate-800">{{ prestamosPendientes }}</p>
            </div>
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
import { ArrowUpRight, ArrowDownLeft, AlertTriangle } from 'lucide-vue-next';
import BaseDataTable from '../../../components/dashboard/BaseDataTable.vue';

defineProps({ prestamos: Array, totalPrestamos: Number, montoPrestado: Number, montoPedido: Number, prestamosPendientes: Number });

const columnas = [
    { key: 'usuario', label: 'Usuario' }, { key: 'tipo', label: 'Tipo' }, { key: 'concepto', label: 'Concepto' },
    { key: 'monto', label: 'Monto' }, { key: 'fechaPago', label: 'Fecha Límite' }, { key: 'estado', label: 'Estado' }
];
const camposBusqueda = ['usuarioNombre', 'concepto', 'tipo', 'estado'];
</script>