<script setup>
import { FileSignature, AlertCircle, CheckCircle2 } from 'lucide-vue-next';

const pagares = [
  { id: 1, deudor: 'Carlos Martínez', monto: '$5,000.00', vencimiento: '15/07/2026', estado: 'Al corriente' },
  { id: 2, deudor: 'Ana Perea', monto: '$9,500.00', vencimiento: '01/06/2026', estado: 'Atrasado' }
];
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <FileSignature class="text-[#00B4B4]" :size="24" /> 
        Gestión de Pagarés Avalados
      </h2>
      <button class="bg-[#00B4B4] hover:bg-[#009291] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all duration-200">
        + Emitir Nuevo Pagaré
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider font-semibold">
            <th class="pb-3 pt-2 px-4">Cuate / Deudor</th>
            <th class="pb-3 pt-2 px-4">Monto Solicitado</th>
            <th class="pb-3 pt-2 px-4">Fecha de Vencimiento</th>
            <th class="pb-3 pt-2 px-4">Estatus Legal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pagare in pagares" :key="pagare.id" class="border-b border-gray-50 hover:bg-gray-50/70 transition-colors">
            <td class="py-4 px-4 font-semibold text-gray-700">{{ pagare.deudor }}</td>
            <td class="py-4 px-4 text-gray-600 font-medium">{{ pagare.monto }}</td>
            <td class="py-4 px-4 text-gray-500 text-sm">{{ pagare.vencimiento }}</td>
            <td class="py-4 px-4">
              <span 
                :class="pagare.estado === 'Atrasado' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'"
                class="px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5"
              >
                <AlertCircle v-if="pagare.estado === 'Atrasado'" :size="14" />
                <CheckCircle2 v-else :size="14" />
                {{ pagare.estado }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
