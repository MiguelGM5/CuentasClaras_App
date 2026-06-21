<template>
    <div class="h-full flex flex-col">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-black text-slate-800 tracking-tight">Mis Préstamos</h1>
                <p class="text-sm text-slate-400 mt-1">Llevá la cuenta de quién te debe y a quién le debés</p>
            </div>
            <button @click="abrirCrear"
                class="flex items-center gap-2 bg-[#00B4B4] hover:bg-[#009291] text-white font-bold px-4 py-2.5 rounded-xl text-md shadow-md transition-all">
                <Plus :size="20" /> Nuevo Prestamo
            </button>
        </div>

        <div v-if="isPremium" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm flex items-center gap-5">
                <div class="w-14 h-14 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock :size="26" stroke-width="2.5" />
                </div>
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pendientes ({{ prestamosPendientes.length }})</p>
                    <p class="text-3xl font-black text-slate-800">${{ formatearDinero(totalPendiente) }}</p>
                </div>
            </div>

            <div class="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex items-center gap-5">
                <div class="w-14 h-14 bg-emerald-50 text-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 :size="26" stroke-width="2.5" />
                </div>
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Saldados ({{ prestamosSaldados.length }})</p>
                    <p class="text-3xl font-black text-slate-800">${{ formatearDinero(totalSaldado) }}</p>
                </div>
            </div>
        </div>

        <BaseDataTable titulo="Registro de Préstamos" placeholderBuscar="Buscar persona o concepto..."
            :headers="columnas" :items="prestamos" :searchFields="['deudor', 'concepto']">
            
            <template #tipo="{ row }">
                <span :class="row.tipo === 'prestado' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-bold w-fit">
                    {{ row.tipo === "prestado" ? "Yo presté" : "Me prestaron" }}
                </span>
            </template>
            
            <template #deudor="{ row }"><span class="font-bold text-slate-700">{{ row.deudor }}</span></template>
            <template #concepto="{ row }"><span class="text-slate-400 text-xs">{{ row.concepto }}</span></template>
            <template #monto="{ row }"><span class="font-black text-slate-800">${{ formatearDinero(row.monto) }}</span></template>
            
            <template #estado="{ row }">
                <button v-if="row.estado === 'Pendiente'" @click="confirmarSaldar(row)" title="Marcar como saldado"
                    class="bg-amber-50 text-amber-600 hover:bg-emerald-500 hover:text-white px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group">
                    <Clock :size="12" class="group-hover:hidden" />
                    <CheckCircle2 :size="12" class="hidden group-hover:block" />
                    <span class="group-hover:hidden">Pendiente</span>
                    <span class="hidden group-hover:block">¡Saldar!</span>
                </button>
                <span v-else
                    class="bg-slate-100 text-slate-400 px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 w-fit">
                    <CheckCircle2 :size="12" /> Saldado
                </span>
            </template>
            
            <template #fechaPago="{ row }"><span class="text-xs text-slate-400">{{ row.fechaPago ? formatearFecha(row.fechaPago) : 'Sin límite' }}</span></template>
        </BaseDataTable>

        <Transition name="modal">
            <div v-if="modalPrestamo" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" @mousedown.self="modalPrestamo = false">
                <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="font-black text-xl text-slate-800">Registrar Préstamo</h3>
                            <p class="text-xs text-slate-400 mt-0.5">Lleva la cuenta de préstamos informales</p>
                        </div>
                        <button @click="modalPrestamo = false" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"><X :size="17" /></button>
                    </div>

                    <div class="flex gap-3 mb-5">
                        <button v-for="t in [{ key: 'prestado', label: 'Yo presté' }, { key: 'pedido', label: 'Me prestaron' }]" :key="t.key" @click="formPrestamo.tipo = t.key" :class="[
                            'flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border',
                            formPrestamo.tipo === t.key ? 'bg-[#00B4B4] text-white border-[#00B4B4] shadow-md shadow-teal-100' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        ]">
                            <component :is="t.key === 'prestado' ? ArrowUpRight : ArrowDownLeft" :size="16" /> {{ t.label }}
                        </button>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                                {{ formPrestamo.tipo === 'prestado' ? '¿A quién le prestaste? *' : '¿Quién te prestó? *' }}
                            </label>
                            <input v-model="formPrestamo.deudor" type="text" placeholder="Nombre de la persona" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                        </div>
                        <div>
                            <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Concepto *</label>
                            <input v-model="formPrestamo.concepto" type="text" placeholder="¿Para qué fue?" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Monto (MXN) *</label>
                                <input v-model="formPrestamo.monto" type="number" min="1" placeholder="0.00" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                            </div>
                            <div>
                                <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Fecha Límite</label>
                                <input v-model="formPrestamo.fecha_pago" type="date" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-3 mt-6">
                        <button @click="modalPrestamo = false" class="flex-1 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 text-sm transition-colors">Cancelar</button>
                        <button @click="guardarNuevoPrestamo" class="flex-1 bg-[#00B4B4] hover:bg-[#009291] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-100 transition-colors">
                            <Check :size="15" /> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from 'vue';
import { Plus, ArrowDownLeft, ArrowUpRight, X, Check, Clock, CheckCircle2 } from 'lucide-vue-next';
import Swal from 'sweetalert2';
import BaseDataTable from '../../../components/dashboard/BaseDataTable.vue';

const props = defineProps({ prestamos: Array, isPremium: Boolean});
const emit = defineEmits(['crearPrestamo', 'saldarPrestamo']);

const columnas = [
    { key: 'tipo', label: 'Tipo' }, { key: 'deudor', label: 'Persona' }, { key: 'concepto', label: 'Concepto' },
    { key: 'monto', label: 'Monto' }, { key: 'estado', label: 'Estado' }, { key: 'fechaPago', label: 'Límite' }
];

// ──  HELPER DEL FORMATO FINANCIERO ──────────────────────────────
const formatearDinero = (monto) => {
    return Number(monto).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const prestamosPendientes = computed(() => props.prestamos.filter(p => p.estado === 'Pendiente'));
const prestamosSaldados = computed(() => props.prestamos.filter(p => p.estado === 'Saldado'));

const totalPendiente = computed(() => prestamosPendientes.value.reduce((acc, p) => acc + Number(p.monto), 0));
const totalSaldado = computed(() => prestamosSaldados.value.reduce((acc, p) => acc + Number(p.monto), 0));

const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '';
    const [year, month, day] = fechaStr.split('T')[0].split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("es-MX", { year: 'numeric', month: 'short', day: 'numeric' });
};

const confirmarSaldar = (prestamo) => {
    const mensaje = prestamo.tipo === 'prestado'
        ? `¿Ya te devolvieron los $${formatearDinero(prestamo.monto)} del concepto "${prestamo.concepto}"?`
        : `¿Ya pagaste tu deuda de $${formatearDinero(prestamo.monto)} por "${prestamo.concepto}"?`;

    Swal.fire({
        title: '¿Marcar como Saldado?',
        text: mensaje,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#cbd5e1',
        confirmButtonText: 'Sí, saldado',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            emit('saldarPrestamo', prestamo.id);
        }
    });
};

const modalPrestamo = ref(false);
const formPrestamo = ref({ tipo: 'prestado', deudor: '', concepto: '', monto: '', fecha_pago: '' });

const abrirCrear = () => {
    formPrestamo.value = { tipo: 'prestado', deudor: '', concepto: '', monto: '', fecha_pago: '' };
    modalPrestamo.value = true;
};

const guardarNuevoPrestamo = () => {
    const { tipo, deudor, concepto, monto, fecha_pago } = formPrestamo.value;
    if (!tipo || !deudor || !concepto || !monto) {
        return Swal.fire({ title: 'Campos incompletos', text: 'Tipo, persona, concepto y monto son requeridos.', icon: 'warning', confirmButtonColor: '#00B4B4' });
    }
    emit('crearPrestamo', formPrestamo.value);
    modalPrestamo.value = false;
};

const verificarAccesoRapido = () => {
    if (localStorage.getItem('abrir_modal_prestamo') === 'true') {
        localStorage.removeItem('abrir_modal_prestamo'); 
        abrirCrear(); 
    }
};

onMounted(verificarAccesoRapido);
onActivated(verificarAccesoRapido);
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from > div, .modal-leave-to > div { transform: scale(0.96) translateY(8px); transition: transform 0.2s ease; }
</style>