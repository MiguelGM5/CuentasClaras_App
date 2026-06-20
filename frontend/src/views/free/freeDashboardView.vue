<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { PieChart, ArrowRightLeft, CreditCard, Target, Crown, FileSignature, X, Check, DollarSign, ArrowUpRight, ArrowDownLeft } from "lucide-vue-next";
import Swal from "sweetalert2";

import { useFinance } from "../../composables/useFinance";
import Sidebar from "../../components/layout/Sidebar.vue";

import TabFreeOverview from "./components/TabFreeOverview.vue";
import TabFreeMovimientos from "./components/TabFreeMovimientos.vue";
import TabFreePrestamos from "./components/TabFreePrestamos.vue";
import TabFreeMetas from "./components/TabFreeMetas.vue";
import TabPremiumPagares from "./components/TabPremiumPagares.vue";

const router = useRouter();

// ── Usuario en sesión ──────────────────────────────────────────────
const usuarioSesion = JSON.parse(localStorage.getItem('user') || '{}');
const rolUsuario = usuarioSesion.rol ?? 'user';

const esPremium = computed(() => rolUsuario === 'premium');

const datosSidebar = {
    nombre: `${usuarioSesion.nombre ?? ''} ${usuarioSesion.apellido_paterno ?? ''}`.trim(),
    inicial: (usuarioSesion.nombre ?? 'U').charAt(0).toUpperCase()
};

// ── Composable financiero (datos reales desde la BD) ───────────────
const {
    movimientos, prestamos, metas, pagares,
    loading,
    totalIngresos, totalGastos, saldoActual, gastosPorCategoria,
    totalPrestado, totalDeuda, totalAhorradoEnMetas,
    registrarMovimiento,
    registrarPrestamo,
    registrarMeta,
    registrarPagare
} = useFinance();

// ── Toast de bienvenida ────────────────────────────────────────────
onMounted(() => {
    if (sessionStorage.getItem('recentLogin')) {
        const toast = Swal.mixin({
            toast: true, position: 'top-end',
            showConfirmButton: false, timer: 2500, timerProgressBar: true,
            didOpen: t => { t.onmouseenter = Swal.stopTimer; t.onmouseleave = Swal.resumeTimer; }
        });
        toast.fire({ icon: 'success', title: `Bienvenido, ${datosSidebar.nombre}` });
        sessionStorage.removeItem('recentLogin');
    }
});

// ── Navegación ────────────────────────────────────────────────────
const tabActivo = ref("overview");

const tabsConfig = {
    overview: TabFreeOverview,
    movimientos: TabFreeMovimientos,
    prestamos: TabFreePrestamos,
    metas: TabFreeMetas,
    pagares: TabPremiumPagares,
};

const menuItems = [
    { key: 'overview', label: 'Mi Resumen', icon: PieChart },
    { key: 'movimientos', label: 'Mis Movimientos', icon: ArrowRightLeft },
    { key: 'prestamos', label: 'Préstamos', icon: CreditCard },
    { key: 'metas', label: 'Metas Ahorro', icon: Target },
    { key: 'pagares', label: 'Pagarés Legales', icon: FileSignature, premium: true },
];

const dynamicMenu = computed(() =>
    menuItems.filter(item => !(item.premium && !esPremium.value))
);

// ── Helpers ───────────────────────────────────────────────────────
const hoy = () => new Date().toISOString().split('T')[0];

const resetearForm = (form, valores) => Object.assign(form.value, valores);

// ═════════════════════════════════════════════════════════════════
//  MODAL 1 — MOVIMIENTO
// ═════════════════════════════════════════════════════════════════
const modalMovimiento = ref(false);
const formMovimiento = ref({ tipo: 'gasto', categoria: '', descripcion: '', monto: '', fecha: hoy() });

const categoriasIngreso = ['Sueldo', 'Ventas', 'Freelance', 'Inversiones', 'Otro'];
const categoriasGasto = ['Alimentación', 'Transporte', 'Servicios', 'Entretenimiento', 'Salud', 'Educación', 'Otro'];
const categoriasActuales = computed(() =>
    formMovimiento.value.tipo === 'ingreso' ? categoriasIngreso : categoriasGasto
);

// Limpiar categoría al cambiar tipo
watch(() => formMovimiento.value.tipo, () => { formMovimiento.value.categoria = ''; });

const guardarMovimiento = async () => {
    const { tipo, categoria, descripcion, monto, fecha } = formMovimiento.value;
    if (!tipo || !categoria || !descripcion || !monto || !fecha)
        return Swal.fire({ title: 'Campos incompletos', text: 'Completa todos los campos antes de guardar.', icon: 'warning', confirmButtonColor: '#00B4B4' });

    const ok = await registrarMovimiento({ tipo, categoria, descripcion, monto: +monto, fecha });
    if (ok) {
        modalMovimiento.value = false;
        resetearForm(formMovimiento, { tipo: 'gasto', categoria: '', descripcion: '', monto: '', fecha: hoy() });
    }
};

// ═════════════════════════════════════════════════════════════════
//  MODAL 2 — PRÉSTAMO
// ═════════════════════════════════════════════════════════════════
const modalPrestamo = ref(false);
const formPrestamo = ref({ tipo: 'prestado', deudor: '', concepto: '', monto: '', fecha_pago: '' });

const guardarPrestamo = async () => {
    const { tipo, deudor, concepto, monto, fecha_pago } = formPrestamo.value;
    if (!tipo || !deudor || !concepto || !monto)
        return Swal.fire({ title: 'Campos incompletos', text: 'Tipo, persona, concepto y monto son requeridos.', icon: 'warning', confirmButtonColor: '#00B4B4' });

    const ok = await registrarPrestamo({ tipo, deudor, concepto, monto: +monto, fecha_pago: fecha_pago || null });
    if (ok) {
        modalPrestamo.value = false;
        resetearForm(formPrestamo, { tipo: 'prestado', deudor: '', concepto: '', monto: '', fecha_pago: '' });
    }
};

// ═════════════════════════════════════════════════════════════════
//  MODAL 3 — META
// ═════════════════════════════════════════════════════════════════
const modalMeta = ref(false);
const formMeta = ref({ titulo: '', monto_objetivo: '', monto_actual: '', fecha_limite: '' });

const guardarMeta = async () => {
    const { titulo, monto_objetivo, monto_actual, fecha_limite } = formMeta.value;
    if (!titulo || !monto_objetivo)
        return Swal.fire({ title: 'Campos incompletos', text: 'El título y el objetivo son requeridos.', icon: 'warning', confirmButtonColor: '#00B4B4' });

    const ok = await registrarMeta({ titulo, monto_objetivo: +monto_objetivo, monto_actual: +(monto_actual || 0), fecha_limite: fecha_limite || null });
    if (ok) {
        modalMeta.value = false;
        resetearForm(formMeta, { titulo: '', monto_objetivo: '', monto_actual: '', fecha_limite: '' });
    }
};

// ═════════════════════════════════════════════════════════════════
//  MODAL 4 — PAGARÉ (solo premium)
// ═════════════════════════════════════════════════════════════════
const modalPagare = ref(false);
const formPagare = ref({ deudor: '', monto: '', vencimiento: '' });

const guardarPagare = async () => {
    const { deudor, monto, vencimiento } = formPagare.value;
    if (!deudor || !monto || !vencimiento)
        return Swal.fire({ title: 'Campos incompletos', text: 'Deudor, monto y vencimiento son requeridos.', icon: 'warning', confirmButtonColor: '#00B4B4' });

    const ok = await registrarPagare({ deudor, monto: +monto, vencimiento });
    if (ok) {
        modalPagare.value = false;
        resetearForm(formPagare, { deudor: '', monto: '', vencimiento: '' });
    }
};
</script>

<template>
    <div class="min-h-screen bg-slate-50 flex font-sans">

        <Sidebar v-model="tabActivo" :subtitulo="rolUsuario" :isPremium="esPremium" :items="dynamicMenu"
            :usuario="datosSidebar" @irAPerfil="router.push('/user/perfil')" />

        <main class="ml-60 flex-1 p-8 min-h-screen relative">

            <!-- Loading overlay -->
            <Transition name="fade">
                <div v-if="loading"
                    class="absolute inset-0 bg-slate-50/80 backdrop-blur-sm flex items-center justify-center z-30">
                    <div class="flex flex-col items-center gap-3">
                        <div class="w-10 h-10 border-4 border-[#00B4B4] border-t-transparent rounded-full animate-spin">
                        </div>
                        <p class="text-sm font-semibold text-slate-500">Cargando tus finanzas...</p>
                    </div>
                </div>
            </Transition>

            <!-- Badge premium flotante -->
            <div v-if="esPremium" class="absolute top-8 right-8 z-10 flex items-center gap-2">
                <span
                    class="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-widest shadow-md">
                    <Crown :size="12" /> Premium Activo
                </span>
            </div>

            <!-- Contenido dinámico por pestaña -->
             <keep-alive>
                 <component :is="tabsConfig[tabActivo]" :movimientos="movimientos" :prestamos="prestamos" :metas="metas"
                     :pagares="pagares" :totalIngresos="totalIngresos" :totalGastos="totalGastos" :saldoActual="saldoActual"
                     :gastosPorCategoria="gastosPorCategoria" :totalPrestado="totalPrestado" :totalDeuda="totalDeuda"
                     :totalAhorradoEnMetas="totalAhorradoEnMetas" @cambiarTab="tabActivo = $event"
                     @abrirModalMovimiento="modalMovimiento = true" @abrirModalPrestamo="modalPrestamo = true"
                     @abrirModalMeta="modalMeta = true" @abrirModalPagare="modalPagare = true" 
                 />
             
            </keep-alive>
        </main>

        <!-- ═══════════════════════════════════════════════════════ -->
        <!-- MODAL 1 · REGISTRAR MOVIMIENTO                        -->
        <!-- ═══════════════════════════════════════════════════════ -->
        <Transition name="modal">
            <div v-if="modalMovimiento"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                @mousedown.self="modalMovimiento = false">
                <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">

                    <!-- Header -->
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="font-black text-xl text-slate-800">Registrar Movimiento</h3>
                            <p class="text-xs text-slate-400 mt-0.5">Registra un ingreso o gasto en tu cuenta</p>
                        </div>
                        <button @click="modalMovimiento = false"
                            class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                            <X :size="17" />
                        </button>
                    </div>

                    <!-- Tipo selector -->
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
                        <!-- Categoría -->
                        <div>
                            <label
                                class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Categoría
                                *</label>
                            <select v-model="formMovimiento.categoria"
                                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors">
                                <option value="" disabled>Selecciona una categoría</option>
                                <option v-for="cat in categoriasActuales" :key="cat" :value="cat">{{ cat }}</option>
                            </select>
                        </div>

                        <!-- Descripción -->
                        <div>
                            <label
                                class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Descripción
                                *</label>
                            <input v-model="formMovimiento.descripcion" type="text"
                                placeholder="Ej. Quincena, Supermercado..."
                                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                        </div>

                        <!-- Monto + Fecha -->
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label
                                    class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Monto
                                    (MXN) *</label>
                                <input v-model="formMovimiento.monto" type="number" min="1" placeholder="0.00"
                                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                            </div>
                            <div>
                                <label
                                    class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Fecha
                                    *</label>
                                <input v-model="formMovimiento.fecha" type="date"
                                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-3 mt-6">
                        <button @click="modalMovimiento = false"
                            class="flex-1 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 text-sm transition-colors">Cancelar</button>
                        <button @click="guardarMovimiento"
                            :class="['flex-1 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-colors', formMovimiento.tipo === 'ingreso' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-orange-500 hover:bg-orange-600']">
                            <Check :size="15" /> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- ═══════════════════════════════════════════════════════ -->
        <!-- MODAL 2 · REGISTRAR PRÉSTAMO                          -->
        <!-- ═══════════════════════════════════════════════════════ -->
        <Transition name="modal">
            <div v-if="modalPrestamo"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                @mousedown.self="modalPrestamo = false">
                <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">

                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="font-black text-xl text-slate-800">Registrar Préstamo</h3>
                            <p class="text-xs text-slate-400 mt-0.5">Lleva la cuenta de préstamos informales</p>
                        </div>
                        <button @click="modalPrestamo = false"
                            class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                            <X :size="17" />
                        </button>
                    </div>

                    <!-- Tipo selector -->
                    <div class="flex gap-3 mb-5">
                        <button
                            v-for="t in [{ key: 'prestado', label: 'Yo presté' }, { key: 'pedido', label: 'Me prestaron' }]"
                            :key="t.key" @click="formPrestamo.tipo = t.key" :class="[
                                'flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border',
                                formPrestamo.tipo === t.key
                                    ? 'bg-[#00B4B4] text-white border-[#00B4B4] shadow-md shadow-teal-100'
                                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                            ]">
                            <component :is="t.key === 'prestado' ? ArrowUpRight : ArrowDownLeft" :size="16" />
                            {{ t.label }}
                        </button>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                                {{ formPrestamo.tipo === 'prestado' ? '¿A quién le prestaste? *' : '¿Quién te prestó? *'
                                }}
                            </label>
                            <input v-model="formPrestamo.deudor" type="text" placeholder="Nombre de la persona"
                                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                        </div>
                        <div>
                            <label
                                class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Concepto
                                *</label>
                            <input v-model="formPrestamo.concepto" type="text" placeholder="¿Para qué fue?"
                                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label
                                    class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Monto
                                    (MXN) *</label>
                                <input v-model="formPrestamo.monto" type="number" min="1" placeholder="0.00"
                                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                            </div>
                            <div>
                                <label
                                    class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Fecha
                                    Límite</label>
                                <input v-model="formPrestamo.fecha_pago" type="date"
                                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-3 mt-6">
                        <button @click="modalPrestamo = false"
                            class="flex-1 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 text-sm transition-colors">Cancelar</button>
                        <button @click="guardarPrestamo"
                            class="flex-1 bg-[#00B4B4] hover:bg-[#009291] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-100 transition-colors">
                            <Check :size="15" /> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- ═══════════════════════════════════════════════════════ -->
        <!-- MODAL 3 · CREAR META DE AHORRO                        -->
        <!-- ═══════════════════════════════════════════════════════ -->
        <Transition name="modal">
            <div v-if="modalMeta"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                @mousedown.self="modalMeta = false">
                <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">

                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="font-black text-xl text-slate-800">Nueva Meta de Ahorro</h3>
                            <p class="text-xs text-slate-400 mt-0.5">Define tu objetivo financiero</p>
                        </div>
                        <button @click="modalMeta = false"
                            class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                            <X :size="17" />
                        </button>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label
                                class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Nombre
                                de la Meta *</label>
                            <input v-model="formMeta.titulo" type="text"
                                placeholder="Ej. Fondo de Emergencia, Viaje a Cancún..."
                                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label
                                    class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Objetivo
                                    (MXN) *</label>
                                <input v-model="formMeta.monto_objetivo" type="number" min="1" placeholder="15,000"
                                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                            </div>
                            <div>
                                <label
                                    class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Ya
                                    ahorrado</label>
                                <input v-model="formMeta.monto_actual" type="number" min="0" placeholder="0"
                                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                            </div>
                        </div>
                        <div>
                            <label
                                class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Fecha
                                Límite</label>
                            <input v-model="formMeta.fecha_limite" type="date"
                                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" />
                        </div>

                        <!-- Preview de progreso -->
                        <div v-if="formMeta.monto_objetivo" class="bg-slate-50 rounded-xl p-4">
                            <div class="flex justify-between text-xs font-bold mb-2">
                                <span class="text-[#00B4B4]">${{ (+formMeta.monto_actual || 0).toLocaleString('es-MX')
                                    }} ahorrado</span>
                                <span class="text-slate-400">meta: ${{
                                    (+formMeta.monto_objetivo).toLocaleString('es-MX') }}</span>
                            </div>
                            <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-[#009291] to-[#00D4D4] rounded-full transition-all duration-500"
                                    :style="{ width: `${Math.min(((+formMeta.monto_actual || 0) / +formMeta.monto_objetivo) * 100, 100)}%` }">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-3 mt-6">
                        <button @click="modalMeta = false"
                            class="flex-1 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 text-sm transition-colors">Cancelar</button>
                        <button @click="guardarMeta"
                            class="flex-1 bg-[#00B4B4] hover:bg-[#009291] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-100 transition-colors">
                            <Check :size="15" /> Crear Meta
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

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

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from>div,
.modal-leave-to>div {
    transform: scale(0.96) translateY(8px);
    transition: transform 0.2s ease;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>