<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { PieChart, ArrowRightLeft, CreditCard, Target, X } from "lucide-vue-next";

// 1. Importamos el Cerebro 🧠
import { useFinance } from "../../composables/useFinance";

// 2. Importamos Componentes de UI 🖼️
import Sidebar from "../../components/layout/Sidebar.vue";

// 🌟 Importación de nuestras Pestañas Modulares (Las crearemos en el próximo paso)
import TabFreeOverview from "./components/TabFreeOverview.vue";
import TabFreeMovimientos from "./components/TabFreeMovimientos.vue";
import TabFreePrestamos from "./components/TabFreePrestamos.vue";
import TabFreeMetas from "./components/TabFreeMetas.vue";

const router = useRouter();

// Extraemos TODA la data financiera
const { 
    movimientos, prestamos, metas,
    totalIngresos, totalGastos, saldoActual, gastosPorCategoria,
    totalPrestado, totalDeuda, totalAhorradoEnMetas
} = useFinance();

// ─────────────────────────────────────────
// NAVEGACIÓN
// ─────────────────────────────────────────
const tabActivo = ref("overview");

const tabsConfig = {
    overview: TabFreeOverview,
    movimientos: TabFreeMovimientos,
    prestamos: TabFreePrestamos,
    metas: TabFreeMetas
};

const menuFree = [
    { key: 'overview',   label: 'Mi Resumen',     icon: PieChart },
    { key: 'movimientos',label: 'Mis Movimientos',icon: ArrowRightLeft },
    { key: 'prestamos',  label: 'Préstamos',      icon: CreditCard },
    { key: 'metas',      label: 'Metas Ahorro',   icon: Target },
];

const datosUsuarioLogueado = { nombre: 'Miguel Gómez', email: 'miguel@ipn.mx', inicial: 'M' };

// ─────────────────────────────────────────
// ESTADO DE LOS MODALES DE ACCIÓN RÁPIDA
// ─────────────────────────────────────────
const modalMovimiento = ref(false);
const modalPrestamo = ref(false);
const modalMeta = ref(false);

const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    router.push("/");
};
</script>

<template>
    <div class="min-h-screen bg-slate-50 flex font-sans">
        
        <Sidebar 
            v-model="tabActivo"
            subtitulo="Plan Free"
            :items="menuFree"
            :usuario="datosUsuarioLogueado"
            @logout="cerrarSesion"
        />

        <main class="ml-60 flex-1 p-8 min-h-screen relative">
            <!-- 🔥 Renderizado dinámico de pestañas -->
            <component 
                :is="tabsConfig[tabActivo]"
                :movimientos="movimientos"
                :prestamos="prestamos"
                :metas="metas"
                :totalIngresos="totalIngresos"
                :totalGastos="totalGastos"
                :saldoActual="saldoActual"
                :gastosPorCategoria="gastosPorCategoria"
                :totalPrestado="totalPrestado"
                :totalDeuda="totalDeuda"
                :totalAhorradoEnMetas="totalAhorradoEnMetas"
                @cambiarTab="tabActivo = $event"
                @abrirModalMovimiento="modalMovimiento = true"
                @abrirModalPrestamo="modalPrestamo = true"
                @abrirModalMeta="modalMeta = true"
            />
        </main>

        <!-- ═══════════════════════════════════ -->
        <!-- MODALES DE ACCIÓN RÁPIDA (Skeleton) -->
        <!-- ═══════════════════════════════════ -->
        
        <!-- Modal 1: Registrar Movimiento (Ingreso/Gasto/Ahorro) -->
        <div v-if="modalMovimiento" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
                <div class="flex justify-between items-center mb-5">
                    <h3 class="font-black text-xl text-slate-800">Registrar Movimiento</h3>
                    <button @click="modalMovimiento = false" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"><X :size="17" /></button>
                </div>
                <p class="text-sm text-slate-500 mb-4">Acá irá el formulario para registrar si entró o salió plata.</p>
                <!-- Formulario irá acá -->
            </div>
        </div>

        <!-- Modal 2: Registrar Préstamo -->
        <div v-if="modalPrestamo" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
                <div class="flex justify-between items-center mb-5">
                    <h3 class="font-black text-xl text-slate-800">Nuevo Préstamo</h3>
                    <button @click="modalPrestamo = false" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"><X :size="17" /></button>
                </div>
                <p class="text-sm text-slate-500 mb-4">Acá irá el formulario para elegir si prestaste o pediste plata.</p>
                <!-- Formulario irá acá -->
            </div>
        </div>

        <!-- Modal 3: Nueva Meta de Ahorro -->
        <div v-if="modalMeta" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
                <div class="flex justify-between items-center mb-5">
                    <h3 class="font-black text-xl text-slate-800">Nueva Meta de Ahorro</h3>
                    <button @click="modalMeta = false" class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"><X :size="17" /></button>
                </div>
                <p class="text-sm text-slate-500 mb-4">Acá irá el formulario para crear tu meta (ej. Comprar PC).</p>
                <!-- Formulario irá acá -->
            </div>
        </div>

    </div>
</template>