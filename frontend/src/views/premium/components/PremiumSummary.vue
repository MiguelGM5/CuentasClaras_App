<script setup>
import { Wallet, TrendingUp } from 'lucide-vue-next';
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div class="p-4 bg-teal-50 rounded-xl text-[#00B4B4]">
        <Wallet :size="28" />
      </div>
      <div>
        <p class="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Prestado entre Cuates</p>
        <p class="text-2xl font-bold text-gray-800">$14,500.00</p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div class="p-4 bg-amber-50 rounded-xl text-amber-600">
        <TrendingUp :size="28" />
      </div>
      <div>
        <p class="text-gray-400 text-xs font-bold uppercase tracking-wider">Rendimiento Legal Estimado</p>
        <p class="text-2xl font-bold text-gray-800">+$1,250.00</p>
      </div>
    </div>
  </div>
</template>
