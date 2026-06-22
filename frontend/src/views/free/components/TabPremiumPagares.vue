<template>
    <div class="h-full flex flex-col">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
                <h1 class="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    <FileSignature class="text-amber-500" :size="32" /> Mis Pagarés Legales
                </h1>
                <p class="text-sm text-slate-400 mt-1">Generación de pagarés bajo la LGTOC con firma autógrafa digital.</p>
            </div>
            <button
                @click="abrirCrear"
                class="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-5 py-2.5 rounded-xl text-md shadow-md transition-all">
                <Plus :size="20" /> Emitir Pagaré
            </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                <p class="text-[11px] font-bold text-slate-400 uppercase">Total Pagarés</p>
                <p class="text-2xl font-black text-slate-800 mt-1">{{ pagares.length }}</p>
            </div>
            <div class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                <p class="text-[11px] font-bold text-emerald-500 uppercase">Al Corriente</p>
                <p class="text-2xl font-black text-slate-800 mt-1">{{ pagaresAlCorriente }}</p>
            </div>
            <div class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                <p class="text-[11px] font-bold text-red-500 uppercase">Atrasados</p>
                <p class="text-2xl font-black text-slate-800 mt-1">{{ pagaresAtrasados }}</p>
            </div>
            <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100 shadow-sm">
                <p class="text-[11px] font-bold text-amber-600 uppercase">Capital Protegido</p>
                <p class="text-2xl font-black text-amber-600 mt-1">${{ formatearDinero(totalProtegido) }}</p>
            </div>
        </div>

        <BaseDataTable
            titulo="Registro de Pagarés Activos"
            placeholderBuscar="Buscar por folio o deudor..."
            :headers="columnas"
            :items="pagares"
            :searchFields="['folio', 'deudor']"
        >
            <template #folio="{ row }">
                <span class="font-black text-slate-400 text-xs uppercase">{{ row.folio || 'S/N' }}</span>
            </template>
            
            <template #deudor="{ row }">
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                        {{ (row.deudor || '?').charAt(0).toUpperCase() }}
                    </div>
                    <span class="font-bold text-slate-700">{{ row.deudor }}</span>
                </div>
            </template>

            <template #monto_solicitado="{ row }">
                <span class="font-black text-slate-800">${{ formatearDinero(row.monto_solicitado) }}</span>
            </template>

            <template #fecha_vencimiento="{ row }">
                <span class="text-xs text-slate-500 font-semibold">{{ formatearFechaFormatoLargo(row.fecha_vencimiento) }}</span>
            </template>

            <template #estado="{ row }">
                <span
                    :class="{
                        'bg-red-50 text-red-600 border border-red-100': row.estado === 'Atrasado',
                        'bg-emerald-50 text-emerald-600 border border-emerald-100': row.estado === 'Al corriente',
                        'bg-slate-100 text-slate-500 border border-slate-200': row.estado === 'liquidado'
                    }"
                    class="px-2.5 py-1.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 capitalize">
                    <component :is="row.estado === 'Atrasado' ? AlertCircle : CheckCircle2" :size="13" />
                    {{ row.estado }}
                </span>
            </template>
            
            <template #acciones="{ row }">
                <div class="flex items-center gap-1.5">
                    <button @click="descargarPDF(row)" title="Descargar PDF Legal" class="p-1.5 bg-slate-50 hover:bg-amber-50 text-slate-400 hover:text-amber-600 rounded-lg transition-colors border border-slate-100 hover:border-amber-200 shadow-sm">
                        <Download :size="15" />
                    </button>
                    
                    <button 
                        v-if="row.estado?.toLowerCase() !== 'liquidado' && row.estado?.toLowerCase() !== 'atrasado'" 
                        @click="cambiarEstadoPagare(row.id, 'Atrasado')" 
                        title="Marcar como Atrasado" 
                        class="p-1.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors border border-slate-100 hover:border-red-200 shadow-sm">
                        <AlertCircle :size="15" />
                    </button>

                    <button 
                        v-if="row.estado?.toLowerCase() !== 'liquidado'" 
                        @click="cambiarEstadoPagare(row.id, 'liquidado')" 
                        title="Liquidar Pagaré" 
                        class="p-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 rounded-lg transition-colors border border-slate-100 hover:border-emerald-200 shadow-sm">
                        <CheckCircle2 :size="15" />
                    </button>
                </div>
            </template>
        </BaseDataTable>

        <Transition name="modal">
            <div v-if="modalPagare"
                class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                @mousedown.self="modalPagare = false">
                <div class="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">

                    <div class="p-6 border-b border-slate-100 flex justify-between items-start flex-shrink-0">
                        <div>
                            <h3 class="font-black text-xl text-slate-800 flex items-center gap-2">
                                <span class="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Premium</span>
                                Emitir Pagaré
                            </h3>
                            <p class="text-xs text-slate-400 mt-0.5">Captura los datos y la firma autógrafa del deudor</p>
                        </div>
                        <button @click="modalPagare = false"
                            class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                            <X :size="17" />
                        </button>
                    </div>

                    <div class="p-6 overflow-y-auto">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                            <div class="sm:col-span-2">
                                <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Nombre del Deudor (Prestatario) *</label>
                                <input v-model="formPagare.deudor" type="text" placeholder="Nombre completo según identificación"
                                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 bg-slate-50 focus:bg-white transition-colors" />
                            </div>
                            
                            <div>
                                <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Capital a prestar (MXN) *</label>
                                <input v-model="formPagare.monto_solicitado" type="number" min="1" placeholder="0.00"
                                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 bg-slate-50 focus:bg-white font-bold transition-colors" />
                            </div>
                            
                            <div>
                                <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Fecha de Vencimiento *</label>
                                <input v-model="formPagare.fecha_vencimiento" type="date" :min="fechaHoy"
                                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 bg-slate-50 focus:bg-white transition-colors" />
                            </div>
                            
                            <div>
                                <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Interés Moratorio % (Mensual)</label>
                                <input v-model="formPagare.interes_moratorio" type="number" min="0" placeholder="Ej. 10"
                                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 bg-slate-50 focus:bg-white transition-colors" />
                            </div>
                            
                            <div>
                                <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Folio (Opcional)</label>
                                <input v-model="formPagare.folio" type="text" placeholder="Ej. PAG-001"
                                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 bg-slate-50 focus:bg-white transition-colors uppercase" />
                            </div>
                        </div>

                        <div class="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                            <div class="flex justify-between items-center mb-3">
                                <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Firma Autógrafa del Deudor *</label>
                                <button @click="limpiarFirma" class="text-[10px] bg-white border border-slate-200 text-slate-500 font-bold px-2 py-1 rounded shadow-sm hover:text-red-500 transition-colors">
                                    Limpiar recuadro
                                </button>
                            </div>
                            <div class="border-2 border-dashed border-slate-300 rounded-xl overflow-hidden bg-white cursor-crosshair shadow-inner relative">
                                <div class="absolute bottom-6 left-10 right-10 border-b-2 border-slate-200 pointer-events-none"></div>
                                <canvas 
                                    ref="canvasFirma" 
                                    class="w-full h-[180px] touch-none relative z-10"
                                    @mousedown="empezarDibujo"
                                    @mousemove="dibujar"
                                    @mouseup="terminarDibujo"
                                    @mouseleave="terminarDibujo"
                                    @touchstart.prevent="empezarDibujo"
                                    @touchmove.prevent="dibujar"
                                    @touchend.prevent="terminarDibujo"
                                ></canvas>
                            </div>
                            <p class="text-[10px] text-slate-400 text-center mt-2 font-medium">
                                El deudor debe firmar usando el mouse o su dedo sobre la pantalla.
                            </p>
                        </div>
                    </div>

                    <div class="p-6 border-t border-slate-100 flex gap-3 flex-shrink-0 bg-white rounded-b-3xl">
                        <button @click="modalPagare = false"
                            class="flex-1 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 text-sm transition-colors">
                            Cancelar
                        </button>
                        <button @click="guardarNuevoPagare"
                            class="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-colors">
                            <Check :size="15" /> Generar Documento
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { Plus, FileSignature, AlertCircle, CheckCircle2, DollarSign, Download, X, Check } from 'lucide-vue-next';
import BaseDataTable from '../../../components/dashboard/BaseDataTable.vue';

// Importamos los dos composables
import { usePagares } from '../../../composables/finance/usePagare.js';

// Props y Emits
const props = defineProps({ pagares: { type: Array, required: true } });
const emit = defineEmits(['pagareCreado']);

const columnas = [
    { key: 'folio', label: 'Folio' },
    { key: 'deudor', label: 'Deudor' },
    { key: 'monto_solicitado', label: 'Capital' },
    { key: 'fecha_vencimiento', label: 'Vencimiento' },
    { key: 'estado', label: 'Estado' },
    { key: 'acciones', label: 'Acciones' }
];

// Inicializamos todo el motor lógico y destructuramos las variables para el HTML
const { 
    fechaHoy, modalPagare, formPagare, canvasFirma, pagaresAlCorriente, pagaresAtrasados, totalProtegido, 
    abrirCrear, empezarDibujo, dibujar, terminarDibujo, limpiarFirma, guardarNuevoPagare,
    descargarPDF, formatearDinero, formatearFechaFormatoLargo, cambiarEstadoPagare       
} = usePagares(props, emit);

</script>