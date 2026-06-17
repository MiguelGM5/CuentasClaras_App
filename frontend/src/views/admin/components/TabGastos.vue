<template>
    <div>
        <div class="mb-8">
            <h1 class="text-3xl font-black text-slate-800 tracking-tight">Gastos de Usuarios</h1>
            <p class="text-sm text-slate-400 mt-1">Salud financiera registrada en el sistema</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <!-- <div class="bg-white p-4 rounded-xl border border-slate-100">
                <p class="text-lg font-bold text-slate-400 uppercase">Total Gastos</p>
                <p class="text-4xl font-black text-slate-800 mt-1">{{ gastos.length }}</p>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-100">
                <p class="text-lg font-bold text-amber-500 uppercase">Monto Total</p>
                <p class="text-4xl font-black text-slate-800 mt-1">${{ totalGastos.toLocaleString("es-MX") }}</p>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-100">
                <p class="text-lg font-bold text-violet-500 uppercase">Promedio</p>
                <p class="text-4xl font-black text-slate-800 mt-1">${{ promedioGasto.toLocaleString("es-MX") }}</p>
            </div> -->
            <StatCard v-for="card in cardsGastos" 
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

        <BaseDataTable titulo="Todos los Gastos" placeholderBuscar="Buscar por usuario o categoría..."
            :headers="columnas" :items="gastos" :searchFields="camposBusqueda">
            <template #usuario="{ row }">
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-[10px] flex-shrink-0">
                        {{row.usuarioNombre.split(" ").map((n) => n[0]).join("").toUpperCase()}}
                    </div>
                    <span class="font-semibold text-slate-700">{{ row.usuarioNombre }}</span>
                </div>
            </template>
            <template #categoria="{ row }">
                <span :class="categoriaColor[row.categoria] ?? 'bg-slate-100 text-slate-600'"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-bold">
                    {{ row.categoria }}
                </span>
            </template>
            <template #descripcion="{ row }">
                <span class="text-slate-400 text-xs">
                    {{ row.descripcion}}
                </span>
            </template>
            <template #monto="{ row }">
                <span class="font-black text-amber-600">
                    ${{ row.monto.toLocaleString("es-MX")}}
                </span>
            </template>
            <template #fecha="{ row }">
                <span class="text-xs text-slate-400">
                    {{ row.fecha }}
                </span>
            </template>
        </BaseDataTable>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { PiggyBank, XLineTop, Receipt } from 'lucide-vue-next';
import BaseDataTable from '../../../components/dashboard/BaseDataTable.vue';
import StatCard from './StatCard.vue';

const props = defineProps({ 
    gastos: {type:Array, default: () => []}, 
    totalGastos: {type:Number, default:0}, 
    promedioGasto: {type:Number, default:0} 
});

const cardsGastos = computed(() => [
    { 
        id: 1,
        label: "Total gastos",
        value: props.gastos.length, 
        icon: Receipt,
        colorTexto: "text-indigo-600",
        colorBg: "bg-indigo-100",
        footer: `` 
    },
    {
        id: 2,
        label: "Monto Total",
        value: `$${props.totalGastos.toLocaleString("es-MX")}`,
        icon: PiggyBank,
        colorTexto: "text-teal-600",
        colorBg: "bg-teal-100",
        footer: ``
    },
    {
        id: 3,
        label: "Promedio",
        value: `$${props.promedioGasto.toLocaleString("es-MX")}`,
        icon: XLineTop,
        colorTexto: "text-amber-600",
        colorBg: "bg-amber-100",
        footer: ``
    }
])

const columnas = [
    { key: 'usuario', label: 'Usuario' }, 
    { key: 'categoria', label: 'Categoría' },
    { key: 'descripcion', label: 'Descripción' }, 
    { key: 'monto', label: 'Monto' }, 
    { key: 'fecha', label: 'Fecha' }
];
const camposBusqueda = ['usuarioNombre', 'categoria', 'descripcion'];
const categoriaColor = {
    Alimentación: "bg-orange-50 text-orange-700", 
    Transporte: "bg-blue-50 text-blue-700", 
    Servicios: "bg-purple-50 text-purple-700", 
    Entretenimiento: "bg-pink-50 text-pink-700", 
    Salud: "bg-green-50 text-green-700", 
    Educación: "bg-indigo-50 text-indigo-700" 
};
</script>