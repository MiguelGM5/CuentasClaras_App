<template>
	<div>
		<!-- HEADER -->
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
			<div>
				<h1 class="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
					<FileSignature class="text-[#00B4B4]" :size="32" /> Mis Pagarés
				</h1>
				<p class="text-sm text-slate-400 mt-1">Gestión de pagarés.</p>
			</div>
			<button
				@click="$emit('abrirModalPagare')"
				class="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-5 py-2.5 rounded-xl text-md shadow-md transition-all">
				<Plus :size="20" /> Emitir Pagaré
			</button>
		</div>

		<!-- Resumen rápido -->
		<div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
			<div class="bg-white rounded-xl p-4 border border-slate-100">
				<p class="text-[11px] font-bold text-slate-400 uppercase">Total Pagarés</p>
				<p class="text-2xl font-black text-slate-800 mt-1">{{ pagares.length }}</p>
			</div>
			<div class="bg-white rounded-xl p-4 border border-slate-100">
				<p class="text-[11px] font-bold text-emerald-500 uppercase">Al Corriente</p>
				<p class="text-2xl font-black text-slate-800 mt-1">{{ pagares.filter(p => p.estado === 'Al corriente').length }}</p>
			</div>
			<div class="bg-white rounded-xl p-4 border border-slate-100">
				<p class="text-[11px] font-bold text-red-500 uppercase">Atrasados</p>
				<p class="text-2xl font-black text-slate-800 mt-1">{{ pagares.filter(p => p.estado === 'Atrasado').length }}</p>
			</div>
		</div>

		<!-- TABLA -->
		<BaseDataTable
			titulo="Registro de Pagarés Activos"
			placeholderBuscar="Buscar por nombre de cuate..."
			:headers="columnas"
			:items="pagares"
			:searchFields="['deudor']"
		>
			<template #deudor="{ row }">
				<div class="flex items-center gap-2.5">
					<div class="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
						{{ row.deudor.charAt(0).toUpperCase() }}
					</div>
					<span class="font-bold text-slate-700">{{ row.deudor }}</span>
				</div>
			</template>

			<template #monto="{ row }">
				<span class="font-black text-slate-800">${{ (+row.monto).toLocaleString('es-MX') }}</span>
			</template>

			<template #vencimiento="{ row }">
				<span class="text-xs text-slate-500 font-semibold">{{ row.vencimiento }}</span>
			</template>

			<template #estado="{ row }">
				<span
					:class="row.estado === 'Atrasado'
						? 'bg-red-50 text-red-600 border border-red-100'
						: 'bg-emerald-50 text-emerald-600 border border-emerald-100'"
					class="px-2.5 py-1.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5">
					<component :is="row.estado === 'Atrasado' ? AlertCircle : CheckCircle2" :size="13" />
					{{ row.estado }}
				</span>
			</template>
		</BaseDataTable>

		<!-- ═══════════════════════════════════════════════════════ -->
        <!-- MODAL 4 · EMITIR PAGARÉ  (solo premium)               -->
        <!-- ═══════════════════════════════════════════════════════ -->
        <Transition name="modal">
            <div v-if="modalPagare && esPremium"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                @mousedown.self="modalPagare = false">
                <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">

                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="font-black text-xl text-slate-800 flex items-center gap-2">
                                <span
                                    class="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Premium</span>
                                Emitir Pagaré
                            </h3>
                            <p class="text-xs text-slate-400 mt-0.5">Documenta un préstamo con validez legal</p>
                        </div>
                        <button @click="modalPagare = false"
                            class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                            <X :size="17" />
                        </button>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label
                                class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Nombre
                                del Deudor *</label>
                            <input v-model="formPagare.deudor" type="text" placeholder="Nombre completo del deudor"
                                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label
                                    class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Monto
                                    (MXN) *</label>
                                <input v-model="formPagare.monto" type="number" min="1" placeholder="0.00"
                                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                            </div>
                            <div>
                                <label
                                    class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Fecha
                                    de Vencimiento *</label>
                                <input v-model="formPagare.vencimiento" type="date"
                                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                            </div>
                        </div>
                        <!-- Info legal -->
                        <div class="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                            <DollarSign :size="18" class="text-amber-500 flex-shrink-0 mt-0.5" />
                            <p class="text-xs text-amber-700 leading-relaxed">
                                El pagaré quedará registrado como <strong>Al corriente</strong>.
                                Puedes actualizar su estado desde la pestaña Pagarés si se atrasa.
                            </p>
                        </div>
                    </div>

                    <div class="flex gap-3 mt-6">
                        <button @click="modalPagare = false"
                            class="flex-1 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 text-sm transition-colors">Cancelar</button>
                        <button @click="guardarPagare"
                            class="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-colors">
                            <Check :size="15" /> Emitir Pagaré
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

	</div>
</template>

<script setup>
import { Plus, FileSignature, AlertCircle, CheckCircle2 } from 'lucide-vue-next';
import BaseDataTable from '../../../components/dashboard/BaseDataTable.vue';

defineProps({
	pagares: { type: Array, required: true }
});

defineEmits(['abrirModalPagare']);

const columnas = [
	{ key: 'deudor',      label: 'Cuate / Deudor'   },
	{ key: 'monto',       label: 'Monto Solicitado'  },
	{ key: 'vencimiento', label: 'Vencimiento'        },
	{ key: 'estado',      label: 'Estatus Legal'      }
];
</script>