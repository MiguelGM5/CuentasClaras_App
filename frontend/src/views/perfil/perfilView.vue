<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { User, CreditCard, PieChart, ArrowRightLeft, Target } from 'lucide-vue-next';

import { usePerfil } from '../../composables/usePerfil.js';
import Sidebar from '../../components/layout/Sidebar.vue';
import TabPerfilDatos from './components/TabPerfilDatos.vue';
import TabPerfilSuscripcion from './components/TabPerfilSuscripcion.vue';

const router = useRouter();

const {
    perfil, historialPagos,
    nombreCompleto, esPremium, diasComoMiembro,
    guardarPerfil, cambiarPassword,
    cancelarSuscripcion, actualizarSuscripcion
} = usePerfil();

// Tab activo del contenido (Datos / Suscripcion)
const tabActivo = ref('datos');

const tabsConfig = {
    datos:       TabPerfilDatos,
    suscripcion: TabPerfilSuscripcion
};

// Menu lateral identico al del freeDashboardView (sin entrada "Perfil",
// porque a esta vista se accede desde el boton inferior del Sidebar)
const menuItems = [
    { key: 'overview',    label: 'Mi Resumen',     icon: PieChart       },
    { key: 'movimientos', label: 'Mis Movimientos', icon: ArrowRightLeft },
    { key: 'prestamos',   label: 'Prestamos',       icon: CreditCard     },
    { key: 'metas',       label: 'Metas Ahorro',    icon: Target         },
];

// El Sidebar siempre vuelve al dashboard cuando se clickea un item del menu,
// ya que estamos parados en la vista de Perfil, no en el dashboard con tabs
const irADashboard = () => {
    router.push('/user/dashboard');
};

// ── Usuario en sesion (mismo patron que freeDashboardView) ──────────
const usuarioSesion = JSON.parse(localStorage.getItem('user') || '{}');
const rolUsuario   = usuarioSesion.rol ?? 'user';
const esPremiumSesion = computed(() => rolUsuario === 'premium');

const datosSidebar = computed(() => ({
    nombre:  nombreCompleto.value || `${usuarioSesion.nombre ?? ''} ${usuarioSesion.apellido_paterno ?? ''}`.trim(),
    inicial: (perfil.value.nombre || usuarioSesion.nombre || 'U').charAt(0).toUpperCase()
}));

const subtituloSidebar = computed(() => esPremiumSesion.value ? 'Plan Premium' : 'Plan Free');
</script>

<template>
    <div class="min-h-screen bg-slate-50 flex font-sans">

        <Sidebar
            modelValue=""
            :subtitulo="subtituloSidebar"
            :isPremium="esPremiumSesion"
            :items="menuItems"
            :usuario="datosSidebar"
            @update:modelValue="irADashboard"
        />

        <main class="ml-60 flex-1 p-8 min-h-screen">

            <!-- HEADER CON AVATAR Y RESUMEN -->
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
                <div class="flex items-center gap-5">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00B4B4] to-[#001D3D] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-teal-100 flex-shrink-0">
                        {{ datosSidebar.inicial }}
                    </div>
                    <div>
                        <h1 class="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                            {{ nombreCompleto || 'Cargando...' }}
                        </h1>
                        <p class="text-sm text-slate-400 mt-0.5">{{ perfil.email }}</p>
                        <span
                            :class="esPremium ? 'bg-teal-50 text-[#00B4B4] border-teal-100' : 'bg-slate-100 text-slate-500 border-slate-200'"
                            class="inline-flex items-center gap-1 text-[11px] font-black border px-2.5 py-1 rounded-full mt-2"
                        >
                            <CreditCard :size="10" />
                            Plan {{ esPremium ? 'Premium' : 'Gratuito' }}
                        </span>
                    </div>
                </div>

                <div class="flex items-center gap-2 bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-sm">
                    <div class="text-right">
                        <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">Miembro desde</p>
                        <p class="text-base font-black text-slate-800">{{ diasComoMiembro }} dias</p>
                    </div>
                </div>
            </div>

            <!-- TABS DE NAVEGACION INTERNA -->
            <div class="flex gap-1 bg-white border border-slate-100 rounded-2xl p-1 mb-6 shadow-sm w-fit">
                <button
                    @click="tabActivo = 'datos'"
                    :class="tabActivo === 'datos'
                        ? 'bg-[#00B4B4] text-white shadow-md shadow-teal-100'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'"
                    class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all"
                >
                    <User :size="13" /> Mis Datos
                </button>
                <button
                    @click="tabActivo = 'suscripcion'"
                    :class="tabActivo === 'suscripcion'
                        ? 'bg-[#00B4B4] text-white shadow-md shadow-teal-100'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'"
                    class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all"
                >
                    <CreditCard :size="13" /> Suscripcion
                </button>
            </div>

            <!-- CONTENIDO DINAMICO DE LA TAB -->
            <component
                :is="tabsConfig[tabActivo]"
                :perfil="perfil"
                :historialPagos="historialPagos"
                :esPremium="esPremium"
                @guardar="guardarPerfil"
                @cambiarPassword="cambiarPassword"
                @actualizar="actualizarSuscripcion"
                @cancelar="cancelarSuscripcion"
            />

        </main>
    </div>
</template>