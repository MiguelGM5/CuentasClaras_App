<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">Mis Movimientos</h1>
        <p class="text-sm text-slate-400 mt-1">Historial de ingresos y gastos</p>
      </div>
      <button @click="$emit('abrirModalMovimiento')" class="flex items-center gap-2 bg-[#00B4B4] hover:bg-[#009291] text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-md">
        <Plus :size="16" /> Registrar
      </button>
    </div>

    <!-- Reutilizamos la súper tabla -->
    <BaseDataTable titulo="Historial Completo" placeholderBuscar="Buscar descripción o categoría..." :headers="columnas" :items="movimientos" :searchFields="['descripcion', 'categoria']">
      <template #tipo="{ row }">
        <span :class="row.tipo === 'ingreso' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-500'" class="px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 w-fit capitalize">
          <component :is="row.tipo === 'ingreso' ? ArrowDownLeft : ArrowUpRight" :size="11" />
          {{ row.tipo }}
        </span>
      </template>
      <template #categoria="{ row }">
        <span class="text-xs font-bold text-slate-600">{{ row.categoria }}</span>
      </template>
      <template #descripcion="{ row }"><span class="text-slate-500 text-xs">{{ row.descripcion }}</span></template>
      <template #monto="{ row }">
        <span :class="row.tipo === 'ingreso' ? 'text-emerald-600' : 'text-slate-800'" class="font-black text-sm">
          {{ row.tipo === 'ingreso' ? '+' : '-' }}${{ row.monto.toLocaleString("es-MX") }}
        </span>
      </template>
      <template #fecha="{ row }"><span class="text-xs text-slate-400">{{ row.fecha }}</span></template>
    </BaseDataTable>
  </div>
</template>

<script setup>
import { Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-vue-next';
import BaseDataTable from '../../../components/dashboard/BaseDataTable.vue';

defineProps({ movimientos: Array });
defineEmits(['abrirModalMovimiento']);

const columnas = [
  { key: 'tipo', label: 'Tipo' }, { key: 'categoria', label: 'Categoría' }, 
  { key: 'descripcion', label: 'Descripción' }, { key: 'monto', label: 'Monto' }, { key: 'fecha', label: 'Fecha' }
];
</script>