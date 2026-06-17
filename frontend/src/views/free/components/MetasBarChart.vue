<!-- src/views/free/components/MetasBarChart.vue -->
<template>
	<div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
		<h3 class="text-2xl font-black text-slate-800 text-center">Top Metas de Ahorro</h3>
		<!-- <p class="text-md text-slate-400 mt-0.5 mb-6 text-center">Tus 3 objetivos más cercanos</p> -->

		<div class="flex-1 flex flex-col justify-center gap-6">
			<div v-for="meta in topMetas" :key="meta.id">
				<!-- Textos Superiores -->
				<div class="flex justify-between items-end mb-2">
					<span class="text-lg font-bold text-slate-700 truncate pr-2">{{ meta.titulo }}</span>
					<span class="text-lg font-black text-[#00B4B4]">{{ calcularPorcentaje(meta) }}%</span>
				</div>

				<!-- GRÁFICA DE BARRA HORIZONTAL BLINDADA -->
				<div class="relative w-full rounded-full overflow-hidden"
					style="height: 14px; background-color: #f1f5f9;">
					<div class="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
						style="background: linear-gradient(to right, #009291, #00D4D4);"
						:style="{ width: `${calcularPorcentaje(meta)}%` }"></div>
				</div>

				<!-- Textos Inferiores -->
				<div class="flex justify-between mt-2">
					<span class="text-sm text-slate-500 font-semibold">
						Llevas: <span class="text-slate-700">${{ meta.montoActual.toLocaleString("es-MX") }}</span>
					</span>
					<span class="text-sm text-slate-400 font-semibold">
						Meta: ${{ meta.montoObjetivo.toLocaleString("es-MX") }}
					</span>
				</div>
			</div>

			<!-- Estado vacío -->
			<div v-if="topMetas.length === 0"
				class="text-center text-slate-400 text-xs py-4 flex flex-col items-center">
				<Target :size="24" class="text-slate-300 mb-2" />
				No tienes metas activas. ¡Crea una!
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { Target } from 'lucide-vue-next';

const props = defineProps({
	metas: { type: Array, required: true }
});

// Agarramos solo las primeras 3
const topMetas = computed(() => (props.metas || []).slice(0, 3));

// Calculamos el porcentaje topado a 100%
const calcularPorcentaje = (meta) => {
	return Math.min((meta.montoActual / meta.montoObjetivo) * 100, 100).toFixed(0);
};
</script>