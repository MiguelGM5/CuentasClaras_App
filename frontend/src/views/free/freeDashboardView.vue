<template>
    <div class="min-h-screen bg-slate-50 flex font-sans">

        <Sidebar v-model="tabActivo" 
            :subtitulo="rolUsuario" :isPremium="esPremium" :items="dynamicMenu"
            :usuario="datosSidebar" @irAPerfil="router.push('/user/perfil')" 
        />

        <main class="ml-60 flex-1 p-8 min-h-screen relative">

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

            <KeepAlive>
                <component 
                    :is="tabsConfig[tabActivo]" 
                    :isPremium = "esPremium"
                    :movimientos="movimientos" 
                    :prestamos="prestamos" 
                    :metas="metas"
                    :pagares="pagares" 
                    :totalIngresos="totalIngresos" 
                    :totalGastos="totalGastos" 
                    :saldoActual="saldoActual"
                    :gastosPorCategoria="gastosPorCategoria" 
                    :totalPrestado="totalPrestado" 
                    :totalDeuda="totalDeuda"
                    :totalAhorradoEnMetas="totalAhorradoEnMetas" 
                    
                    @cambiarTab="tabActivo = $event"
                    
                    @abrirModalMeta="manejarAbrirMetaDesdeOverview"
                    @abrirModalMovimiento="manejarAbrirMovimientoDesdeOverview"
                    @abrirModalPrestamo="manejarAbrirPrestamoDesdeOverview"
                    
                    @crearMeta="manejarCrearMeta"
                    @abonarMeta="manejarAbonoMeta"
                    @editarMeta="manejarEdicionMeta"
                    @eliminarMeta="manejarEliminacionMeta" 

                    @crearMovimiento="manejarCrearMovimiento"
                    @crearPrestamo="manejarCrearPrestamo"
                    @saldarPrestamo="manejarSaldarPrestamo"
                    
                    @pagareCreado="manejarCrearPagare"
                />
            </KeepAlive>
        </main>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { PieChart, ArrowRightLeft, CreditCard, Target, FileSignature } from "lucide-vue-next";
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
const obtenerUsuarioActual = () => JSON.parse(localStorage.getItem('user') || '{}');

// Convertimos el rol en una computed para que se refresque sola
const rolUsuario = computed(() => {
    const u = obtenerUsuarioActual();
    // Atajamos tanto 'rol' como 'nombre_rol' y forzamos minúsculas por seguridad
    const r = u.rol || u.nombre_rol || 'user';
    return r.toString().trim().toLowerCase();
});

// Ahora esPremium reacciona al toque ante cualquier cambio
const esPremium = computed(() => rolUsuario.value === 'premium');

// Los datos del Sidebar también se recalculan si el usuario cambia algo
const datosSidebar = computed(() => {
    const u = obtenerUsuarioActual();
    return {
        nombre: `${u.nombre ?? ''} ${u.apellido_paterno ?? ''}`.trim() || 'Usuario',
        inicial: (u.nombre ?? 'U').charAt(0).toUpperCase()
    };
});
// ── Composable financiero (datos reales desde la BD) ───────────────
const {
    movimientos, prestamos, metas, pagares, loading,
    totalIngresos, totalGastos, saldoActual, gastosPorCategoria,
    totalPrestado, totalDeuda, totalAhorradoEnMetas,
    registrarMovimiento, registrarPrestamo, saldarPrestamo, registrarMeta,
    actualizarMetaDB, eliminarMetaDB
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

    const tabPendiente = localStorage.getItem('navegar_a_tab');
    if (tabPendiente) {
        tabActivo.value = tabPendiente;
        localStorage.removeItem('navegar_a_tab'); 
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

// ── Puentes de Acceso Rápido desde el Overview ───────────────────
const manejarAbrirMetaDesdeOverview = () => {
    tabActivo.value = "metas";
    localStorage.setItem('abrir_modal_meta', 'true');
};

const manejarAbrirMovimientoDesdeOverview = () => {
    tabActivo.value = "movimientos";
    localStorage.setItem('abrir_modal_movimiento', 'true');
};

const manejarAbrirPrestamoDesdeOverview = () => {
    tabActivo.value = "prestamos";
    localStorage.setItem('abrir_modal_prestamo', 'true');
};

// ── Manejadores de Eventos CRUD (Hacia useFinance) ────────────────
const manejarCrearMeta = async (payload) => {
    await registrarMeta(payload);
};

const manejarAbonoMeta = async (payload) => {
    await actualizarMetaDB(payload.id, { monto_actual: payload.monto_actual });
};

const manejarEdicionMeta = async (payload) => {
    await actualizarMetaDB(payload.id, payload);
};

const manejarEliminacionMeta = async (id) => {
    await eliminarMetaDB(id);
};

const manejarCrearMovimiento = async (payload) => {
    await registrarMovimiento(payload);
};

const manejarCrearPrestamo = async (payload) => {
    await registrarPrestamo(payload);
};

const manejarSaldarPrestamo = async (id) => {
    await saldarPrestamo(id);
};

const manejarCrearPagare = (nuevoPagareCompletado) => {
    pagares.value.push(nuevoPagareCompletado);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>