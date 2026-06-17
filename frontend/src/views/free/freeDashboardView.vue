<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { PieChart, ArrowRightLeft, CreditCard, Target, X, Crown, FileSignature, Zap } from "lucide-vue-next";

import { useFinance } from "../../composables/useFinance";

import Sidebar from "../../components/layout/Sidebar.vue";

import TabFreeOverview from "./components/TabFreeOverview.vue";
import TabFreeMovimientos from "./components/TabFreeMovimientos.vue";
import TabFreePrestamos from "./components/TabFreePrestamos.vue";
import TabFreeMetas from "./components/TabFreeMetas.vue";
import TabPremiumPagares from "./components/TabPremiumPagares.vue"; 
//import TabPremiumTools from "../premium/components/TabPremiumTools.vue/index.js";

const router = useRouter();

// Extraemos TODA la data financiera
const { 
    movimientos, prestamos, metas, pagares,
    totalIngresos, totalGastos, saldoActual, gastosPorCategoria,
    totalPrestado, totalDeuda, totalAhorradoEnMetas
} = useFinance();

const tabActivo = ref("overview");

const tabsConfig = {
    overview: TabFreeOverview,
    movimientos: TabFreeMovimientos,
    prestamos: TabFreePrestamos,
    metas: TabFreeMetas,
    pagares: TabPremiumPagares,
    //herramientas: TabPremiumTools
};

const menuFree = [
    { key: 'overview',   label: 'Mi Resumen',     icon: PieChart },
    { key: 'movimientos',label: 'Mis Movimientos',icon: ArrowRightLeft },
    { key: 'prestamos',  label: 'Préstamos',      icon: CreditCard },
    { key: 'metas',      label: 'Metas Ahorro',   icon: Target },
    { key: 'pagares',    label: 'Pagarés Legales',icon: FileSignature, premium: true }, 
    //{ key: 'herramientas',label: 'Herramientas',  icon: Zap, premium: true }
];

const datosUsuarioLogueado = { nombre: 'Miguel Gómez', email: 'miguel@gmail.com', inicial: 'M', plan: 'premium' };

const esPremium = computed(() => datosUsuarioLogueado.plan === 'premium');

const dynamicMenu = computed(()=>{
    return menuFree.filter(item => {
        if(item.premium && !esPremium.value) return false;
        return true;
    });
});

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
            v-model= "tabActivo"
            :subtitulo= "esPremium ? 'PREMIUM' : 'BASIC'" 
            :isPremium= "esPremium" 
            :items= "dynamicMenu"
            :usuario= "datosUsuarioLogueado"
            @logout= "cerrarSesion"
            @irAPerfil="router.push('/user/perfil')"
        />

        <main class="ml-60 flex-1 p-8 min-h-screen relative">

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