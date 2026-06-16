<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { PieChart, ArrowRightLeft, CreditCard, Target, X, Crown, FileSignature, Zap } from "lucide-vue-next";

// 1. Importamos el Cerebro 🧠
import { useFinance } from "../../composables/useFinance";

// 2. Importamos Componentes de UI 🖼️
import Sidebar from "../../components/layout/Sidebar.vue";

// 🌟 Importación de Pestañas
import TabFreeOverview from "./components/TabFreeOverview.vue";
import TabFreeMovimientos from "./components/TabFreeMovimientos.vue";
import TabFreePrestamos from "./components/TabFreePrestamos.vue";
import TabFreeMetas from "./components/TabFreeMetas.vue";
import TabPremiumPagares from "./components/TabPremiumPagares.vue"; // NUEVA PESTAÑA
import TabPremiumTools from "./components/TabPremiumTools.vue";     // NUEVA PESTAÑA

const router = useRouter();

// Extraemos TODA la data financiera (ahora también trae los pagarés)
const { 
    movimientos, prestamos, metas, pagares,
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
    metas: TabFreeMetas,
    pagares: TabPremiumPagares,
    herramientas: TabPremiumTools
};

// Menú unificado (Ahora con funciones Premium desbloqueadas)
const menuFree = [
    { key: 'overview',   label: 'Mi Resumen',     icon: PieChart },
    { key: 'movimientos',label: 'Mis Movimientos',icon: ArrowRightLeft },
    { key: 'prestamos',  label: 'Préstamos',      icon: CreditCard },
    { key: 'metas',      label: 'Metas Ahorro',   icon: Target },
    { key: 'pagares',    label: 'Pagarés Legales',icon: FileSignature, premium: true }, // Se marca como premium
    { key: 'herramientas',label: 'Herramientas',  icon: Zap, premium: true }
];

const datosUsuarioLogueado = { nombre: 'Miguel Gómez', email: 'miguel@ipn.mx', inicial: 'M', plan: 'premium' };

// Modales
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
            subtitulo="Plan Premium"
            :items="menuFree"
            :usuario="datosUsuarioLogueado"
            @logout="cerrarSesion"
        />

        <main class="ml-60 flex-1 p-8 min-h-screen relative">
            
            <div class="absolute top-8 right-8 z-10 flex items-center gap-2">
              <span class="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-widest shadow-md">
                <Crown :size="12" /> Premium Activo
              </span>
            </div>

            <component 
                :is="tabsConfig[tabActivo]"
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
                @abrirModalMovimiento="modalMovimiento = true"
                @abrirModalPrestamo="modalPrestamo = true"
                @abrirModalMeta="modalMeta = true"
            />
        </main>

        </div>
</template>