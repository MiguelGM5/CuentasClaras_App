<template>
    <div class="h-full flex flex-col">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-black text-slate-800 tracking-tight">Mis Movimientos</h1>
                <p class="text-sm text-slate-400 mt-1">Historial de ingresos y gastos</p>
            </div>
            <button @click="abrirCrear"
                class="flex items-center gap-2 bg-[#00B4B4] hover:bg-[#009291] text-white font-bold px-4 py-2.5 rounded-xl text-md shadow-md transition-all">
                <Plus :size="20" /> Registrar Movimiento
            </button>
        </div>

        <!-- LAS 3 STAT CARDS -->
        <div v-if="isPremium" class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            <!-- Card 1: Top 3 Categorías de Gasto -->
            <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[120px]">
                <div class="flex items-center gap-4 mb-2">
                    <div class="w-11 h-11 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <TrendingDown :size="22" stroke-width="2.5" />
                    </div>
                    <div>
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Top 3 Gastos</p>
                        <p class="text-sm font-black text-slate-700">Tus gastos mas grandes </p>
                    </div>
                </div>
                
                <div class="space-y-1.5 mt-1">
                    <div v-for="([cat, total], index) in topCategorias" :key="cat" class="flex justify-between items-center text-xs">
                        <div class="flex items-center gap-2">
                            <span class="font-black text-slate-400 w-3">{{ index + 1 }}.</span>
                            <span class="font-bold text-slate-600">{{ cat }}</span>
                        </div>
                        <span class="font-black text-slate-800">${{ formatearDinero(total) }}</span>
                    </div>
                    <div v-if="topCategorias.length === 0" class="text-xs text-slate-400 py-1 text-center">
                        No hay gastos registrados todavía.
                    </div>
                </div>
            </div>

            <!-- Card 2: El Gasto Más Fuerte -->
            <div class="bg-white rounded-2xl p-5 border border-red-100 shadow-sm flex items-center gap-5 min-h-[120px]">
                <div class="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Flame :size="26" stroke-width="2.5" />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">El golpe más duro</p>
                    <template v-if="gastoMasFuerte">
                        <p class="text-3xl font-black text-red-600">${{ formatearDinero(gastoMasFuerte.monto) }}</p>
                        <p class="text-[11px] font-bold text-slate-500 truncate mt-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 w-fit capitalize">
                            {{ gastoMasFuerte.categoria }} • <span class="font-medium text-slate-400">{{ gastoMasFuerte.descripcion }}</span>
                        </p>
                    </template>
                    <template v-else>
                        <p class="text-2xl font-black text-slate-300 mt-1">Ninguno aún</p>
                    </template>
                </div>
            </div>

            <!-- Card 3: Balance de Vida Camaleónica -->
            <div :class="`bg-white rounded-2xl p-5 border shadow-sm flex items-center gap-5 min-h-[120px] ${balanceStatus.colorBorder}`">
                <div :class="`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${balanceStatus.colorBg} ${balanceStatus.colorIcon}`">
                    <TrendingUp v-if="balanceStatus.estado === 'superavit'" :size="26" stroke-width="2.5" />
                    <AlertTriangle v-else-if="balanceStatus.estado === 'deficit'" :size="26" stroke-width="2.5" />
                    <Scale v-else :size="26" stroke-width="2.5" />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">{{ balanceStatus.titulo }}</p>
                    <p :class="`text-3xl font-black ${balanceStatus.colorTextMonto}`">
                        <span v-if="balanceStatus.diferencia > 0">${{ formatearDinero(balanceStatus.diferencia) }}</span>
                        <span v-else class="text-2xl">Equilibrio</span>
                    </p>
                    <p class="text-[11px] font-bold text-slate-500 truncate mt-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 w-fit">
                        {{ balanceStatus.mensaje }}
                    </p>
                </div>
            </div>

        </div>

        <BaseDataTable titulo="Historial Completo" placeholderBuscar="Buscar descripción o categoría..."
            :headers="columnas" :items="movimientos" :searchFields="['descripcion', 'categoria']">
            <template #tipo="{ row }">
                <span
                    :class="row.tipo === 'ingreso' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-500'"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 w-fit capitalize">
                    <component :is="row.tipo === 'ingreso' ? ArrowDownLeft : ArrowUpRight" :size="11" />
                    {{ row.tipo }}
                </span>
            </template>
            <template #categoria="{ row }">
                <span class="text-xs font-bold text-slate-600">{{ row.categoria }}</span>
            </template>
            <template #descripcion="{ row }"><span class="text-slate-500 text-xs">{{ row.descripcion }}</span></template>
            <template #monto="{ row }">
                <span :class="row.tipo === 'ingreso' ? 'text-emerald-600' : 'text-slate-800'"
                    class="font-black text-sm">
                    {{ row.tipo === 'ingreso' ? '+' : '-' }}${{ formatearDinero(row.monto) }}
                </span>
            </template>
            <template #fecha="{ row }"><span class="text-xs text-slate-400">{{ row.fecha }}</span></template>
        </BaseDataTable>

        <!-- MODAL · REGISTRAR MOVIMIENTO -->
        <BaseModal 
            v-model="modalMovimiento"
            title="Registrar Movimiento"
            subtitle="Registra un ingreso o gasto en tu cuenta"
        >
            <div class="flex gap-3 mb-5">
                <button v-for="t in ['ingreso', 'gasto']" :key="t" @click="formMovimiento.tipo = t" :class="[
                    'flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border',
                    formMovimiento.tipo === t
                        ? t === 'ingreso' ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' : 'bg-orange-500 text-white border-orange-500 shadow-md'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                ]">
                    <component :is="t === 'ingreso' ? ArrowDownLeft : ArrowUpRight" :size="16" />
                    {{ t === 'ingreso' ? 'Ingreso' : 'Gasto' }}
                </button>
            </div>

            <div class="space-y-4">
                <div>
                    <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Categoría *</label>
                    <select v-model="formMovimiento.categoria"
                        class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors">
                        <option value="" disabled>Selecciona una categoría</option>
                        <option v-for="cat in categoriasActuales" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                </div>

                <div>
                    <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Descripción *</label>
                    <input v-model="formMovimiento.descripcion" type="text" placeholder="Ej. Quincena, Supermercado..."
                        class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Monto (MXN) *</label>
                        <input v-model="formMovimiento.monto" type="number" min="1" placeholder="0.00"
                            class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                    </div>
                    <div>
                        <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Fecha *</label>
                        <input v-model="formMovimiento.fecha" type="date" :max="fechaHoy"
                            class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex gap-3">
                    <button @click="modalMovimiento = false"
                        class="flex-1 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 text-sm transition-colors">Cancelar</button>
                    <button @click="guardarNuevaMovimiento"
                        :disabled="guardando"
                        :class="['flex-1 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed', formMovimiento.tipo === 'ingreso' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-orange-500 hover:bg-orange-600']">
                        <Check :size="15" /> {{ guardando ? 'Guardando...' : 'Guardar' }}
                    </button>
                </div>
            </template>
        </BaseModal>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onActivated } from 'vue';
import { Plus, ArrowDownLeft, ArrowUpRight, Check, TrendingDown, Flame, TrendingUp, AlertTriangle, Scale } from 'lucide-vue-next';
import Swal from 'sweetalert2';
import BaseDataTable from '../../../components/dashboard/BaseDataTable.vue';
import BaseModal from '../../../components/common/BaseModal.vue';
import { obtenerHoy } from '../../../utils/date.js';
import { formatearDinero } from '../../../utils/format.js';

const props = defineProps({ 
    movimientos: Array,
    totalIngresos: Number,
    totalGastos: Number,
    isPremium: Boolean
});
const emit = defineEmits(['crearMovimiento']);

const fechaHoy = obtenerHoy();
const guardando = ref(false);

const columnas = [
    { key: 'tipo', label: 'Tipo' }, { key: 'categoria', label: 'Categoría' },
    { key: 'descripcion', label: 'Descripción' }, { key: 'monto', label: 'Monto' }, { key: 'fecha', label: 'Fecha' }
];

const topCategorias = computed(() => {
    if (!props.movimientos || props.movimientos.length === 0) return [];
    const acumulador = {};
    props.movimientos.filter(m => m.tipo === 'gasto').forEach(m => {
        acumulador[m.categoria] = (acumulador[m.categoria] || 0) + Number(m.monto);
    });
    return Object.entries(acumulador).sort((a, b) => b[1] - a[1]).slice(0, 3);
});

const gastoMasFuerte = computed(() => {
    if (!props.movimientos || props.movimientos.length === 0) return null;
    const gastos = props.movimientos.filter(m => m.tipo === 'gasto');
    if (gastos.length === 0) return null;
    return gastos.reduce((max, m) => Number(m.monto) > Number(max.monto) ? m : max, gastos[0]);
});

const balanceStatus = computed(() => {
    const ingresos = props.totalIngresos || 0;
    const gastos = props.totalGastos || 0;

    if (ingresos > gastos) {
        return { estado: 'superavit', titulo: 'Vas en verde', mensaje: 'Ganás más de lo que gastás', diferencia: ingresos - gastos, colorBorder: 'border-emerald-100', colorBg: 'bg-emerald-50', colorIcon: 'text-emerald-500', colorTextMonto: 'text-emerald-600' };
    } else if (gastos > ingresos) {
        return { estado: 'deficit', titulo: 'Números Rojos', mensaje: 'Gastás más de lo que ganás', diferencia: gastos - ingresos, colorBorder: 'border-red-100', colorBg: 'bg-red-50', colorIcon: 'text-red-500', colorTextMonto: 'text-red-600' };
    } else {
        return { estado: 'empate', titulo: 'Tablas', mensaje: 'Ingresos y gastos iguales', diferencia: 0, colorBorder: 'border-blue-100', colorBg: 'bg-blue-50', colorIcon: 'text-blue-500', colorTextMonto: 'text-blue-600' };
    }
});

const modalMovimiento = ref(false);
const formMovimiento = ref({ tipo: 'gasto', categoria: '', descripcion: '', monto: '', fecha: fechaHoy });

const categoriasIngreso = ['Sueldo', 'Ventas', 'Freelance', 'Inversiones', 'Otro'];
const categoriasGasto = ['Alimentación', 'Transporte', 'Servicios', 'Entretenimiento', 'Salud', 'Educación', 'Otro'];

const categoriasActuales = computed(() => formMovimiento.value.tipo === 'ingreso' ? categoriasIngreso : categoriasGasto );

watch(() => formMovimiento.value.tipo, () => { formMovimiento.value.categoria = ''; });

const abrirCrear = () => {
    formMovimiento.value = { tipo: 'gasto', categoria: '', descripcion: '', monto: '', fecha: fechaHoy };
    modalMovimiento.value = true;
};

const guardarNuevaMovimiento = async () => {
    if (guardando.value) return;
    const { tipo, categoria, descripcion, monto, fecha } = formMovimiento.value;
    if (!tipo || !categoria || !descripcion || !monto || !fecha) {
        return Swal.fire({ title: 'Campos incompletos', text: 'Completa todos los campos antes de guardar.', icon: 'warning', confirmButtonColor: '#00B4B4' });
    }

    if (fecha > fechaHoy) {
        return Swal.fire({ title: '¡No se puede!', text: 'La fecha no puede ser posterior a hoy.', icon: 'warning', confirmButtonColor: '#00B4B4' });
    }

    guardando.value = true;
    try {
        await emit('crearMovimiento', formMovimiento.value);
        modalMovimiento.value = false;
    } finally {
        setTimeout(() => { guardando.value = false; }, 600);
    }
};

const verificarAccesoRapido = () => {
    if (localStorage.getItem('abrir_modal_movimiento') === 'true') {
        localStorage.removeItem('abrir_modal_movimiento'); 
        abrirCrear(); 
    }
};

onMounted(verificarAccesoRapido);
onActivated(verificarAccesoRapido);
</script>