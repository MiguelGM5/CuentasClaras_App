<script setup>
import PremiumSummary from '../../components/PremiumSummary.vue';
import PremiumPagares from '../../components/PremiumPagares.vue';
import PremiumTools from '../../components/PremiumTools.vue';
import { Crown } from 'lucide-vue-next';
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans">
    <div class="max-w-7xl mx-auto flex flex-col gap-8">
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-extrabold text-[#001D3D] tracking-tight">Mi Panel Financiero</h1>
            <span class="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-widest shadow-sm">
              <Crown :size="12" /> Premium
            </span>
          </div>
          <p class="text-gray-500 mt-1 text-sm">Garantías legales, pagarés activos y el control inteligente de tus préstamos entre cuates.</p>
        </div>
      </header>

      <main class="flex flex-col gap-8">
        <PremiumSummary />
        <PremiumPagares />
        <PremiumTools />
      </main>
    </div>
  </div>
</template>
