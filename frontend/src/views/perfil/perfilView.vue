<template>
    <div class="min-h-screen bg-slate-50 flex font-sans">

        <Sidebar
            modelValue=""
            :subtitulo="rolUsuario"
            :isPremium="esPremiumSesion"
            :items="menuItems"
            :usuario="datosSidebar"
            @update:modelValue="navegarDesdePerfil"
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
                            :class="esPremium ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-100 text-slate-500 border-slate-200'"
                            class="inline-flex items-center gap-1 text-md font-black border px-2.5 py-1 rounded-full mt-2"
                        >
                            <CreditCard :size="13" />
                            Plan {{ esPremium ? 'Premium' : 'Gratuito' }}
                        </span>
                    </div>
                </div>

                <div class="flex items-center gap-2 bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-sm">
                    <div class="text-right">
                        <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">Miembro desde</p>
                        <p class="text-base font-black text-slate-800">
                            {{ isNaN(Number(diasComoMiembro)) ? 0 : diasComoMiembro }} días
                        </p>
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
                    <CreditCard :size="13" /> Suscripción
                </button>
            </div>

            <!-- CONTENIDO DINAMICO DE LA TAB -->
            <component
                :is="tabsConfig[tabActivo]"
                :perfil="perfil"
                :historialPagos="historialPagos"
                :esPremium="esPremium"
                @cambiarPassword="cambiarPassword"
                @actualizar="actualizarSuscripcion"
                @cancelar="cancelarSuscripcion"
            />

        </main>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { User, CreditCard, PieChart, ArrowRightLeft, Target, FileSignature } from 'lucide-vue-next';

import { usePerfil } from '../../composables/usePerfil.js';
import Sidebar from '../../components/layout/Sidebar.vue';
import TabPerfilDatos from './components/TabPerfilDatos.vue';
import TabPerfilSuscripcion from './components/TabPerfilSuscripcion.vue';

const router = useRouter();

const {
    perfil, historialPagos,
    nombreCompleto, esPremium, diasComoMiembro,
    cambiarPassword, cancelarSuscripcion, actualizarSuscripcion
} = usePerfil();

// Tab activo del contenido (Datos / Suscripcion)
const tabActivo = ref('datos');

const tabsConfig = {
    datos:       TabPerfilDatos,
    suscripcion: TabPerfilSuscripcion
};

// ── LOGICA INTELIGENTE DE RETORNO AL DASHBOARD ──────────────────
const navegarDesdePerfil = (destinoKey) => {
    localStorage.setItem('navegar_a_tab', destinoKey);
    router.push('/user/dashboard');
};

// ── Usuario en sesion ───────────────────────────────────────────────
const obtenerUsuarioActual = () => JSON.parse(localStorage.getItem('user') || '{}');

const rolUsuario = computed(() => {
    const u = obtenerUsuarioActual();
    const r = u.rol || u.nombre_rol || 'user';
    return r.toString().trim().toLowerCase();
});

const esPremiumSesion = computed(() => rolUsuario.value === 'premium');

const datosSidebar = computed(() => {
    const u = obtenerUsuarioActual();
    return {
        nombre: nombreCompleto.value || `${u.nombre ?? ''} ${u.apellido_paterno ?? ''}`.trim() || 'Usuario',
        inicial: (perfil.value.nombre || u.nombre || 'U').charAt(0).toUpperCase()
    };
});

const menuItems = computed(() => {
    const items = [
        { key: 'overview',    label: 'Mi Resumen',     icon: PieChart },
        { key: 'movimientos', label: 'Mis Movimientos', icon: ArrowRightLeft },
        { key: 'prestamos',   label: 'Préstamos',       icon: CreditCard },
        { key: 'metas', label: 'Metas Ahorro', icon: Target }
    ];

    // Si es VIP, le inyectamos los pagarés antes de las metas
    if (esPremiumSesion.value) {
        items.push({ key: 'pagares', label: 'Pagarés Legales', icon: FileSignature });
    }
    
    return items;
});

</script>