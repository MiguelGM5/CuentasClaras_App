<template>
	<div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center h-full">

		<div class="text-center mb-8">
			<h3 class="font-black text-slate-800 text-2xl">Tu Total de Gastos</h3>
			<!-- <p class="text-sm text-slate-400 mt-1">Distribución por categoría</p> -->
		</div>

		<div class="flex flex-row items-center w-full">

			<div class="w-1/2 flex justify-center">
				<div class="relative shadow-sm" style="width: 200px; height: 200px; border-radius: 50%;"
					:style="{ backgroundImage: conicGradient }"
				>

					<div class="absolute m-auto bg-white rounded-full flex flex-col items-center justify-center shadow-sm"
						style="width: 130px; height: 130px; top: 35px; left: 35px;"
					>
						<!-- <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total</p> -->
						<p class="text-4xl font-black text-slate-800">${{ total.toLocaleString("es-MX") }}</p>
					</div>

				</div>
			</div>

			<div class="w-1/2 pl-2 sm:pl-6 space-y-4">
				<div v-for="(monto, cat) in datos" :key="cat" class="flex justify-between items-center gap-2">

					<div class="flex items-center gap-2">
						<div class="w-3.5 h-3.5 rounded-full shadow-sm flex-shrink-0"
							:style="{ backgroundColor: colores[cat]?.hex || '#94a3b8' }"></div>
						<span class="text-lg font-semibold text-slate-700 truncate">{{ cat }}</span>
					</div>

					<!-- Monto y Porcentaje -->
					<div class="flex items-center gap-1.5 whitespace-nowrap">
						<span class="text-lg font-black text-slate-800">${{ monto.toLocaleString("es-MX") }}</span>
						<ArrowRight size="15px" class="text-slate-400"/>
						<span class="text-md font-semibold text-slate-400 ml-1"> {{ calculoPorcentaje(monto) }}%</span>
					</div>

				</div>

				<!-- Mensaje por si no hay datos -->
				<div v-if="Object.keys(datos).length === 0" class="text-lg text-slate-400 text-center py-2">
					No hay gastos registrados, ¡Empieza registrando uno!.
				</div>
			</div>

		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { ArrowRight } from 'lucide-vue-next';

const props = defineProps({
	total: { type: Number, required: true },
	datos: { type: Object, required: true },
	colores: { type: Object, required: true }
});

const calculoPorcentaje = (monto) => {
	return props.total ? ((monto / props.total) * 100).toFixed(0) : 0;
};

// Generador del gradiente dinámico blindado
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