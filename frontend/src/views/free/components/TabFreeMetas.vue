<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">Metas de Ahorro</h1>
        <p class="text-sm text-slate-400 mt-1">Separá plata para tus objetivos</p>
      </div>
      <button @click="$emit('abrirModalMeta')" class="flex items-center gap-2 bg-[#00B4B4] hover:bg-[#009291] text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-md">
        <Plus :size="16" /> Crear Meta
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="meta in metas" :key="meta.id" class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
        <div class="flex justify-between items-start mb-4">
          <h3 class="font-black text-slate-800 text-lg leading-tight">{{ meta.titulo }}</h3>
          <button class="text-slate-400 hover:text-slate-600"><MoreVertical :size="18"/></button>
        </div>
        
        <div class="flex justify-between items-end mb-2 mt-auto">
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase">Ahorrado</p>
            <p class="text-2xl font-black text-[#00B4B4]">${{ meta.montoActual.toLocaleString("es-MX") }}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-bold text-slate-400 uppercase">Objetivo</p>
            <p class="text-sm font-bold text-slate-600">${{ meta.montoObjetivo.toLocaleString("es-MX") }}</p>
          </div>
        </div>

        <!-- Progress Bar Mágica -->
        <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
          <div class="h-full bg-gradient-to-r from-[#009291] to-[#00D4D4] rounded-full" 
               :style="{ width: `${Math.min((meta.montoActual / meta.montoObjetivo) * 100, 100)}%` }">
          </div>
        </div>
        
        <div class="flex justify-between items-center text-xs">
          <span class="font-bold text-[#00B4B4]">{{ ((meta.montoActual / meta.montoObjetivo) * 100).toFixed(0) }}%</span>
          <span class="text-slate-400 flex items-center gap-1"><Calendar :size="12"/> {{ meta.fechaLimite }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Plus, MoreVertical, Calendar } from 'lucide-vue-next';

defineProps({ metas: Array });
defineEmits(['abrirModalMeta']);
</script>