<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">Mis Préstamos</h1>
        <p class="text-sm text-slate-400 mt-1">Llevá la cuenta de quién te debe y a quién le debés</p>
      </div>
      <button @click="$emit('abrirModalPrestamo')" class="flex items-center gap-2 bg-[#00B4B4] hover:bg-[#009291] text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-md">
        <Plus :size="16" /> Nuevo
      </button>
    </div>

    <BaseDataTable titulo="Registro de Préstamos" placeholderBuscar="Buscar persona o concepto..." :headers="columnas" :items="prestamos" :searchFields="['deudor', 'concepto']">
      <template #tipo="{ row }">
        <span :class="row.tipo === 'prestado' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'" class="px-2.5 py-1 rounded-lg text-[11px] font-bold w-fit">
          {{ row.tipo === "prestado" ? "Yo presté" : "Me prestaron" }}
        </span>
      </template>
      <template #deudor="{ row }"><span class="font-bold text-slate-700">{{ row.deudor }}</span></template>
      <template #concepto="{ row }"><span class="text-slate-400 text-xs">{{ row.concepto }}</span></template>
      <template #monto="{ row }"><span class="font-black text-slate-800">${{ row.monto.toLocaleString("es-MX") }}</span></template>
      <template #estado="{ row }">
        <span :class="row.estado === 'Saldado' ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-600'" class="px-2.5 py-1 rounded-full text-[11px] font-bold">
          {{ row.estado }}
        </span>
      </template>
      <template #fechaPago="{ row }"><span class="text-xs text-slate-400">{{ row.fechaPago }}</span></template>
    </BaseDataTable>
  </div>
</template>

<script setup>
import { Plus } from 'lucide-vue-next';
import BaseDataTable from '../../../components/dashboard/BaseDataTable.vue';

defineProps({ prestamos: Array });
defineEmits(['abrirModalPrestamo']);

const columnas = [
  { key: 'tipo', label: 'Tipo' }, { key: 'deudor', label: 'Persona' }, { key: 'concepto', label: 'Concepto' }, 
  { key: 'monto', label: 'Monto' }, { key: 'estado', label: 'Estado' }, { key: 'fechaPago', label: 'Límite' }
];
</script>