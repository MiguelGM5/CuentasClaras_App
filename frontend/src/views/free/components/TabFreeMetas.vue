<template>
    <div class="h-full flex flex-col">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
                <h2 class="text-3xl font-black text-slate-800 tracking-tight">Mis Metas de Ahorro</h2>
                <p class="text-md text-slate-400 mt-1">Gestiona y abona a tus objetivos financieros</p>
            </div>
            <button @click="abrirCrear"
                class="w-full sm:w-auto bg-[#00B4B4] hover:bg-[#009291] text-white font-bold px-5 py-2.5 rounded-xl text-md flex items-center justify-center gap-2 shadow-md shadow-teal-100 transition-all">
                <Plus :size="20" /> Nueva Meta
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="meta in displayMetas" :key="meta.id" 
                class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col relative group transition-all hover:shadow-md">
                
                <div class="absolute top-4 right-4 flex items-center gap-1.5 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="abrirAbonar(meta)" class="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors" title="Abonar ahorro"><DollarSign :size="16" /></button>
                    <button @click="abrirEditar(meta)" class="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-500 hover:text-white transition-colors" title="Editar meta"><Edit2 :size="16" /></button>
                    <button @click="confirmarEliminar(meta)" class="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors" title="Eliminar meta"><Trash2 :size="16" /></button>
                </div>

                <h3 class="text-xl font-bold text-slate-800 pr-32 truncate">{{ meta.titulo }}</h3>
                <p class="text-xs font-semibold text-slate-400 mt-1 flex items-center gap-1.5">
                    <Calendar :size="13" /> 
                    {{ (meta.fechaLimite ?? meta.fecha_limite) ? formatearFecha(meta.fechaLimite ?? meta.fecha_limite) : 'Sin fecha límite' }}
                </p>

                <div class="mt-6 flex-1 flex flex-col justify-end">
                    <div class="flex justify-between items-end mb-2">
                        <span class="text-sm font-bold text-slate-400 uppercase tracking-wider">Progreso</span>
                        <span class="text-2xl font-black text-[#00B4B4]">{{ meta.displayPorcentaje }}%</span>
                    </div>

                    <div class="relative w-full rounded-full overflow-hidden mb-3" style="height: 12px; background-color: #f1f5f9;">
                        <div class="absolute top-0 left-0 h-full rounded-full shadow-sm"
                            style="background: linear-gradient(to right, #009291, #00D4D4);"
                            :style="{ width: `${meta.displayPorcentaje}%` }"></div>
                    </div>

                    <div class="flex justify-between items-center bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div class="flex flex-col">
                            <span class="text-[10px] font-bold text-slate-400 uppercase">Llevas</span>
                            <span class="text-sm font-bold text-slate-700">${{ formatearDinero(meta.displayMonto || 0) }}</span>
                        </div>
                        <div class="h-6 w-px bg-slate-200"></div>
                        <div class="flex flex-col text-right">
                            <span class="text-[10px] font-bold text-slate-400 uppercase">Objetivo</span>
                            <span class="text-sm font-bold text-slate-700">${{ formatearDinero(meta.montoObjetivo ?? meta.monto_objetivo ?? 0) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="displayMetas.length === 0" class="flex-1 flex flex-col items-center justify-center py-20">
            <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4"><Target :size="40" class="text-slate-300" /></div>
            <h3 class="text-xl font-bold text-slate-700 mb-1">Aún no tienes metas</h3>
            <p class="text-slate-400 text-center max-w-sm mb-6">Establece objetivos de ahorro y dales seguimiento para alcanzar tus sueños financieros.</p>
            <button @click="abrirCrear" class="bg-[#00B4B4] text-white font-bold px-6 py-3 rounded-xl shadow-md">Crear mi primera Meta</button>
        </div>

        <Transition name="modal">
            <div v-if="modalCrear" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" @mousedown.self="modalCrear = false">
                <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="font-black text-xl text-slate-800">Nueva Meta de Ahorro</h3>
                            <p class="text-xs text-slate-400 mt-0.5">Define tu objetivo financiero</p>
                        </div>
                        <button @click="modalCrear = false" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"><X :size="17" /></button>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Nombre de la Meta *</label>
                            <input v-model="formCrear.titulo" type="text" placeholder="Ej. Fondo de Emergencia..." class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Objetivo (MXN) *</label>
                                <input v-model="formCrear.monto_objetivo" type="number" min="1" placeholder="15,000" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                            </div>
                            <div>
                                <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Ya ahorrado</label>
                                <input v-model="formCrear.monto_actual" type="number" min="0" placeholder="0" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                            </div>
                        </div>
                        <div>
                            <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Fecha Límite</label>
                            <input v-model="formCrear.fecha_limite" type="date" :min="fechaHoy" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                        </div>
                    </div>

                    <div class="flex gap-3 mt-6">
                        <button @click="modalCrear = false" class="flex-1 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 text-sm transition-colors">Cancelar</button>
                        <button @click="guardarNuevaMeta" class="flex-1 bg-[#00B4B4] hover:bg-[#009291] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-100 transition-colors">
                            <Check :size="15" /> Crear Meta
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <Transition name="modal">
            <div v-if="modalEditar" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" @mousedown.self="modalEditar = false">
                <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="font-black text-xl text-slate-800">Editar Meta</h3>
                            <p class="text-xs text-slate-400 mt-0.5">Modifica los detalles de tu objetivo</p>
                        </div>
                        <button @click="modalEditar = false" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"><X :size="17" /></button>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Nombre de la Meta</label>
                            <input v-model="formEditar.titulo" type="text" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-colors" />
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Objetivo (MXN)</label>
                                <input v-model="formEditar.monto_objetivo" type="number" min="1" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-colors" />
                            </div>
                            <div>
                                <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Fecha Límite</label>
                                <input v-model="formEditar.fecha_limite" type="date" :min="fechaHoy" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-3 mt-6">
                        <button @click="modalEditar = false" class="flex-1 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 text-sm transition-colors">Cancelar</button>
                        <button @click="guardarEdicion" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-200 transition-colors">
                            <Check :size="15" /> Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <Transition name="modal">
            <div v-if="modalAbonar" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" @mousedown.self="modalAbonar = false">
                <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="font-black text-xl text-slate-800">Abonar a tu Meta</h3>
                            <p class="text-xs text-slate-400 mt-0.5">Súmale saldo a "{{ formAbonar.titulo }}"</p>
                        </div>
                        <button @click="modalAbonar = false" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"><X :size="17" /></button>
                    </div>

                    <div class="bg-slate-50 p-4 rounded-xl mb-5 border border-slate-100 flex justify-between items-center">
                        <div>
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ya ahorrado</p>
                            <p class="text-sm font-bold text-slate-700">${{ formatearDinero(formAbonar.monto_actual) }}</p>
                        </div>
                        <div class="h-8 w-px bg-slate-200"></div>
                        <div class="text-right">
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Faltan</p>
                            <p class="text-sm font-bold text-emerald-600">${{ formatearDinero(Math.max(formAbonar.monto_objetivo - formAbonar.monto_actual, 0)) }}</p>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Monto a sumar (MXN) *</label>
                            <input v-model="formAbonar.abono" type="number" min="1" placeholder="Ej. 500" class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-colors font-semibold" />
                        </div>
                    </div>

                    <div class="flex gap-3 mt-6">
                        <button @click="modalAbonar = false" class="flex-1 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 text-sm transition-colors">Cancelar</button>
                        <button @click="guardarAbono" class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition-colors">
                            <DollarSign :size="15" /> Sumar Ahorro
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onActivated } from 'vue';
import { Plus, Trash2, Edit2, Target, Calendar, DollarSign, X, Check } from 'lucide-vue-next';
import { obtenerHoy } from '../../../utils/date';
import Swal from 'sweetalert2';

const props = defineProps({ metas: { type: Array, required: true } });
const emit = defineEmits(['crearMeta', 'abonarMeta', 'editarMeta', 'eliminarMeta']);

const fechaHoy = obtenerHoy();

// ──  HELPER DEL FORMATO FINANCIERO ──────────────────────────────
const formatearDinero = (monto) => {
    if (isNaN(monto) || monto === null) return "0.00";
    // Forzamos los 2 decimales y clavamos la coma separadora de miles a la fuerza con Regex
    return Number(monto).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '';
    const [year, month, day] = fechaStr.split('T')[0].split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("es-MX", { year: 'numeric', month: 'short', day: 'numeric' });
};

const displayMetas = ref([]);
let motorAnimacion = null;

watch(() => props.metas, () => {
    if (!props.metas || !props.metas.length) {
        displayMetas.value = [];
        return;
    }
    if (motorAnimacion) clearInterval(motorAnimacion);

    let frame = 0;
    const duration = 1200;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    const easeOutQuad = t => t * (2 - t);

    motorAnimacion = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);

        displayMetas.value = props.metas.map(meta => {
            const actual = meta.montoActual ?? meta.monto_actual ?? 0;
            const objetivo = meta.montoObjetivo ?? meta.monto_objetivo ?? 1;
            const targetPorcentaje = Math.min((actual / objetivo) * 100, 100);

            return {
                ...meta,
                displayMonto: actual * progress,
                displayPorcentaje: (targetPorcentaje * progress).toFixed(0)
            };
        });

        if (frame === totalFrames) {
            clearInterval(motorAnimacion);
            displayMetas.value = props.metas.map(meta => {
                const actual = meta.montoActual ?? meta.monto_actual ?? 0;
                const objetivo = meta.montoObjetivo ?? meta.monto_objetivo ?? 1;
                return {
                    ...meta,
                    displayMonto: actual,
                    displayPorcentaje: Math.min((actual / objetivo) * 100, 100).toFixed(0)
                };
            });
        }
    }, frameRate);
}, { deep: true, immediate: true });

const confirmarEliminar = (meta) => {
    Swal.fire({
        title: '¿Eliminar esta meta?',
        text: `Perderás el registro de "${meta.titulo}". Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#cbd5e1',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            emit('eliminarMeta', meta.id);
        }
    });
};

const modalCrear = ref(false);
const formCrear = ref({ titulo: '', monto_objetivo: '', monto_actual: '', fecha_limite: '' });

const abrirCrear = () => {
    formCrear.value = { titulo: '', monto_objetivo: '', monto_actual: '', fecha_limite: '' };
    modalCrear.value = true;
};

const guardarNuevaMeta = () => {
    if (!formCrear.value.titulo || !formCrear.value.monto_objetivo) {
        return Swal.fire({ icon: 'error', title: 'Campos vacíos', text: 'El nombre y el objetivo son obligatorios.'});
    }
    // 3. VALIDACIÓN FRONTEND
    if (formCrear.value.fecha_limite && formCrear.value.fecha_limite < fechaHoy) {
        return Swal.fire({ icon: 'warning', title: 'Fecha inválida', text: 'No puedes poner un límite en el pasado.' });
    }
    emit('crearMeta', formCrear.value);
    modalCrear.value = false;
};

const modalEditar = ref(false);
const formEditar = ref({ id: null, titulo: '', monto_objetivo: '', fecha_limite: '' });

const abrirEditar = (meta) => {
    const fechaReal = meta.fechaLimite ?? meta.fecha_limite;
    formEditar.value = {
        id: meta.id,
        titulo: meta.titulo,
        monto_objetivo: meta.montoObjetivo ?? meta.monto_objetivo,
        fecha_limite: fechaReal ? String(fechaReal).split('T')[0] : '' 
    };
    modalEditar.value = true;
};

const guardarEdicion = () => {
    if (!formEditar.value.titulo || !formEditar.value.monto_objetivo) {
        return Swal.fire({ icon: 'error', title: 'Campos vacíos', text: 'El nombre y el objetivo son obligatorios.'});
    }
    //4. VALIDACIÓN FRONTEND
    if (formEditar.value.fecha_limite && formEditar.value.fecha_limite < fechaHoy) {
        return Swal.fire({ icon: 'warning', title: 'Fecha inválida', text: 'No puedes poner un límite en el pasado.' });
    }
    emit('editarMeta', formEditar.value);
    modalEditar.value = false;
    Swal.fire({ icon: 'success', title: 'Meta actualizada', showConfirmButton: false, timer: 1500 });
};

const modalAbonar = ref(false);
const formAbonar = ref({ id: null, titulo: '', abono: '', monto_actual: 0, monto_objetivo: 0 });

const abrirAbonar = (meta) => {
    formAbonar.value = {
        id: meta.id,
        titulo: meta.titulo,
        abono: '',
        monto_actual: meta.montoActual ?? meta.monto_actual ?? 0,
        monto_objetivo: meta.montoObjetivo ?? meta.monto_objetivo ?? 0
    };
    modalAbonar.value = true;
};

const guardarAbono = () => {
    if (!formAbonar.value.abono || formAbonar.value.abono <= 0) {
        return Swal.fire({ icon: 'error', title: 'Monto inválido', text: 'Ingresa una cantidad mayor a 0 para abonar.' });
    }
    const nuevoTotal = Number(formAbonar.value.monto_actual) + Number(formAbonar.value.abono);
    emit('abonarMeta', { id: formAbonar.value.id, monto_actual: nuevoTotal });
    modalAbonar.value = false;
    Swal.fire({ icon: 'success', title: '¡Abono registrado!', showConfirmButton: false, timer: 1500 });
};

const verificarAccesoRapido = () => {
    if (localStorage.getItem('abrir_modal_meta') === 'true') {
        localStorage.removeItem('abrir_modal_meta'); 
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