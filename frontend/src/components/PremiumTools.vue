<script setup>
import { Calculator, Download } from 'lucide-vue-next';
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between gap-4">
      <div>
        <h3 class="font-bold text-gray-800 flex items-center gap-2 mb-2">
          <Calculator class="text-[#00B4B4]" :size="20" /> Simulador de Interés Moratorio
        </h3>
        <p class="text-gray-500 text-sm">Calcula cuánto debes cobrar justamente si tu cuate se retrasa en la fecha acordada.</p>
      </div>
      <a href="#" class="text-[#00B4B4] hover:text-[#009291] text-sm font-bold inline-flex items-center gap-1 transition-colors">
        Iniciar simulación &rarr;
      </a>
    </div>

    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between gap-4">
      <div>
        <h3 class="font-bold text-gray-800 flex items-center gap-2 mb-2">
          <Download class="text-amber-500" :size="20" /> Reportes Fiscales y Contables
        </h3>
        <p class="text-gray-500 text-sm">Exporta el historial de tus préstamos ordenados listos para aclaraciones o declaraciones.</p>
      </div>
      <a href="#" class="text-amber-600 hover:text-amber-700 text-sm font-bold inline-flex items-center gap-1 transition-colors">
        Descargar Excel / PDF &rarr;
      </a>
    </div>
  </div>
</template>
