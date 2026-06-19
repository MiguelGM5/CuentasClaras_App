<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { PieChart, ArrowRightLeft, CreditCard, Target, X, Crown, FileSignature, Zap } from "lucide-vue-next";
import Swal from "sweetalert2";

import { useFinance } from "../../composables/useFinance";
import Sidebar from "../../components/layout/Sidebar.vue";

import TabFreeOverview from "./components/TabFreeOverview.vue";
import TabFreeMovimientos from "./components/TabFreeMovimientos.vue";
import TabFreePrestamos from "./components/TabFreePrestamos.vue";
import TabFreeMetas from "./components/TabFreeMetas.vue";
import TabPremiumPagares from "./components/TabPremiumPagares.vue"; 

const router = useRouter();

const usuarioSesion = JSON.parse(localStorage.getItem('user'));

const rolUsuario = usuarioSesion.rol;

const esPremium = computed(() => {
    return rolUsuario === 'premium';
});

const datosSidebar = {
    nombre: `${usuarioSesion.nombre} ${usuarioSesion.apellido_paterno}`,
    inicial: usuarioSesion.nombre.charAt(0).toUpperCase()
}

onMounted(() => {
    if(sessionStorage.getItem('recentLogin')){
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            didOpen: toast => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });

        toast.fire({
            icon: 'success',
            title: `Bienvenido, ${datosSidebar.nombre}`
        });
        sessionStorage.removeItem('recentLogin');
    }
});

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
};

const menuFree = [
    { key: 'overview',   label: 'Mi Resumen',     icon: PieChart },
    { key: 'movimientos',label: 'Mis Movimientos',icon: ArrowRightLeft },
    { key: 'prestamos',  label: 'Préstamos',      icon: CreditCard },
    { key: 'metas',      label: 'Metas Ahorro',   icon: Target },
    { key: 'pagares',    label: 'Pagarés Legales',icon: FileSignature, premium: true }, 
];

const dynamicMenu = computed(()=>{
    return menuFree.filter(item => {
        if(item.premium && !esPremium.value) return false;
        return true;
    });
});

const modalMovimiento = ref(false);
const modalPrestamo = ref(false);
const modalMeta = ref(false);
</script>

<template>
    <div class="min-h-screen bg-slate-50 flex font-sans">
        
        <Sidebar 
            v-model= "tabActivo"
            :subtitulo= "rolUsuario" 
            :isPremium= "esPremium" 
            :items= "dynamicMenu"
            :usuario= "datosSidebar"
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