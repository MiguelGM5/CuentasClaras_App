<template>
  <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
    <h3 class="text-xl font-black text-slate-800 text-base">Mis Gastos</h3>
    <p class="text-base text-slate-400 mt-0.5 mb-6">Distribución por categoría</p>
    
    <div class="flex-1 flex flex-col xl:flex-row items-center justify-center gap-8">
      
      <div class="relative flex-shrink-0 shadow-sm" style="width: 140px; height: 140px; border-radius: 50%;" :style="{ backgroundImage: conicGradient }">
        <div class="absolute m-auto bg-white rounded-full flex flex-col items-center justify-center shadow-sm" style="width: 90px; height: 90px; top: 25px; left: 25px;">
          <p class="text-base font-black text-slate-800">${{ total }}</p>
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total</p>
        </div>
      </div>
      
      <div class="w-full xl:w-auto flex-1 space-y-3">
        <div v-for="(monto, cat) in datos" :key="cat" class="flex justify-between items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full shadow-sm" :style="{ backgroundColor: colores[cat]?.hex || '#94a3b8' }"></div>
            <span class="text-xs font-semibold text-slate-600 truncate max-w-[120px]">{{ cat }}</span>
          </div>
          <div class="text-right">
            <span class="text-xs font-black text-slate-800">${{ monto }}</span>
            <span class="text-[10px] text-slate-400 ml-1">{{ calculoPorcentaje(monto) }}%</span>
          </div>
        </div>
        <div v-if="Object.keys(datos).length === 0" class="text-xs text-slate-400 text-center py-2">
          No hay gastos registrados.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  total: { type: Number, required: true },
  datos: { type: Object, required: true }, // Ej: { Alimentación: 1500, Servicios: 600 }
  colores: { type: Object, required: true } // El mapa de colores
});

const calculoPorcentaje = (monto) => {
  return props.total ? ((monto / props.total) * 100).toFixed(0) : 0;
};

// Generador del gradiente dinámico
const conicGradient = computed(() => {
  if (!props.total) return "conic-gradient(#e2e8f0 0% 100%)";
  let gradientStr = "";
  let acumulado = 0;
  
  for (const [cat, monto] of Object.entries(props.datos)) {
    const porcentaje = (monto / props.total) * 100;
    const color = props.colores[cat]?.hex || '#94a3b8';
    gradientStr += `${color} ${acumulado}% ${acumulado + porcentaje}%, `;
    acumulado += porcentaje;
  }
  
  return `conic-gradient(${gradientStr.slice(0, -2)})`;
});
</script>