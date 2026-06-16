<template>
	<div>
		<!-- HEADER -->
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
			<div>
				<h1 class="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
					<FileSignature class="text-[#00B4B4]" :size="32" /> Mis Pagarés
				</h1>
				<p class="text-sm text-slate-400 mt-1">Gestión de pagarés con validez legal entre cuates.</p>
			</div>
			<button
				class="flex items-center gap-2 bg-[#00B4B4] hover:bg-[#009291] text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-md transition-all">
				<Plus :size="16" /> Emitir Pagaré
			</button>
		</div>

		<!-- TABLA MÁGICA -->
		<BaseDataTable titulo="Registro de Pagarés Activos" placeholderBuscar="Buscar por nombre de cuate..."
			:headers="columnas" :items="pagares" :searchFields="['deudor']">
			<template #deudor="{ row }">
				<span class="font-bold text-slate-700">{{ row.deudor }}</span>
			</template>

			<template #monto="{ row }">
				<span class="font-black text-slate-800">${{ row.monto.toLocaleString("es-MX") }}</span>
			</template>

			<template #vencimiento="{ row }">
				<span class="text-xs text-slate-500 font-semibold">{{ row.vencimiento }}</span>
			</template>

			<template #estado="{ row }">
				<span
					:class="row.estado === 'Atrasado' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'"
					class="px-2.5 py-1.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5">
					<component :is="row.estado === 'Atrasado' ? AlertCircle : CheckCircle2" :size="13" />
					{{ row.estado }}
				</span>
			</template>
		</BaseDataTable>
	</div>
</template>

<script setup>
import { Plus, FileSignature, AlertCircle, CheckCircle2 } from 'lucide-vue-next';
// Asegurate de que la ruta al BaseDataTable sea la correcta en tu proyecto
import BaseDataTable from '../../../components/dashboard/BaseDataTable.vue';

defineProps({
	pagares: { type: Array, required: true }
});

const columnas = [
	{ key: 'deudor', label: 'Cuate / Deudor' },
	{ key: 'monto', label: 'Monto Solicitado' },
	{ key: 'vencimiento', label: 'Vencimiento' },
	{ key: 'estado', label: 'Estatus Legal' }
];
</script>