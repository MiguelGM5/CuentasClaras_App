<template>
    <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">

        <Sidebar 
            modelValue="" 
            :subtitulo="rolUsuario" 
            :isPremium="esPremiumSesion" 
            :items="menuItems"
            :usuario="datosSidebar" 
            :isOpen="sidebarAbierto"
            @update:modelValue="navegarDesdePerfil" 
            @close="sidebarAbierto = false"
        />

        <div class="flex-1 flex flex-col min-h-screen min-w-0 md:ml-60">
            <!-- Header Móvil -->
            <header class="md:hidden bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                <div 
                    @click="navegarDesdePerfil('overview')" 
                    class="flex items-center gap-2 cursor-pointer group"
                    title="Ir a Mi Resumen"
                >
                    <img src="../../assets/LogoRecortado.png" alt="Cuentas Claras" class="h-8 w-auto object-contain group-hover:scale-105 transition-transform" />
                    <span class="font-black text-[#001D3D] text-lg group-hover:text-[#00B4B4] transition-colors">Cuentas Claras</span>
                </div>
                <button 
                    @click="sidebarAbierto = true"
                    class="p-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                    aria-label="Abrir menú"
                >
                    <Menu :size="24" />
                </button>
            </header>

            <main class="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">

                <Transition name="tab-slide" appear>
                    <div>
                        <!-- Header del Perfil -->
                        <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                            <div class="flex items-center gap-4 sm:gap-5">
                                <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#001D3D] via-[#002855] to-[#00B4B4] flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-xl shadow-teal-500/20 border-4 border-white flex-shrink-0">
                                    {{ datosSidebar.inicial }}
                                </div>
                                <div class="min-w-0">
                                    <h1 class="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-tight truncate">
                                        {{ nombreCompleto || 'Cargando...' }}
                                    </h1>
                                    <p class="text-xs sm:text-sm text-slate-400 mt-0.5 truncate">{{ perfil.email }}</p>
                                    
                                    <div class="mt-2.5 flex items-center gap-2">
                                        <span
                                            :class="esPremium ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'"
                                            class="inline-flex items-center gap-1.5 text-xs font-black border px-3 py-1 rounded-full shadow-2xs">
                                            <Crown v-if="esPremium" :size="13" class="text-amber-500" />
                                            <CreditCard v-else :size="13" />
                                            <span>Plan {{ esPremium ? 'Premium' : 'Gratuito' }}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-3.5 sm:px-5 sm:py-3.5 shadow-2xs self-start sm:self-auto">
                                <div class="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#00B4B4] flex-shrink-0">
                                    <Calendar :size="20" />
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Miembro desde</p>
                                    <p class="text-base sm:text-lg font-black text-slate-800 leading-none mt-0.5">
                                        {{ isNaN(Number(diasComoMiembro)) ? 0 : diasComoMiembro }} días
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Navegador de pestañas de Perfil (Datos vs Suscripción) -->
                        <div class="flex gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl mb-6 w-full sm:w-fit border border-slate-200/60">
                            <button 
                                @click="tabActivo = 'datos'" 
                                :class="[
                                    'flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95',
                                    tabActivo === 'datos'
                                    ? 'bg-[#00B4B4] text-white shadow-md shadow-teal-100'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
                                ]"
                            >
                                <User :size="14" /> 
                                <span>Mis Datos</span>
                            </button>

                            <button 
                                @click="tabActivo = 'suscripcion'" 
                                :class="[
                                    'flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95',
                                    tabActivo === 'suscripcion'
                                    ? 'bg-[#00B4B4] text-white shadow-md shadow-teal-100'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
                                ]"
                            >
                                <CreditCard :size="14" /> 
                                <span>Suscripción</span>
                            </button>
                        </div>

                        <!-- Transición suave entre pestañas del perfil -->
                        <Transition name="tab-slide" mode="out-in">
                            <component 
                                :key="tabActivo"
                                :is="tabsConfig[tabActivo]" 
                                :perfil="perfil" 
                                :historialPagos="historialPagos"
                                :esPremium="esPremium" 
                                @cambiarPassword="cambiarPassword" 
                                @actualizar="actualizarSuscripcion"
                                @cancelar="cancelarSuscripcion" 
                            />
                        </Transition>
                    </div>
                </Transition>

            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { User, CreditCard, PieChart, ArrowRightLeft, Target, FileSignature, Menu, Crown, Calendar } from 'lucide-vue-next';

import { usePerfil } from '../../composables/usePerfil.js';
import Sidebar from '../../components/layout/Sidebar.vue';
import TabPerfilDatos from './components/TabPerfilDatos.vue';
import TabPerfilSuscripcion from './components/TabPerfilSuscripcion.vue';

const router = useRouter();
const route = useRoute();
const sidebarAbierto = ref(false);

const {
    perfil, historialPagos,
    nombreCompleto, diasComoMiembro,
    cambiarPassword, cancelarSuscripcion, actualizarSuscripcion
} = usePerfil();

// Tab activo del contenido (Datos / Suscripcion)
const tabActivo = ref('datos');

const tabsConfig = {
    datos: TabPerfilDatos,
    suscripcion: TabPerfilSuscripcion
};

watch(
    () => route.query.pago, 
    async (nuevoEstadoPago) => {
        if (nuevoEstadoPago === 'exito') {
            tabActivo.value = 'suscripcion';
            
            if (perfil.value) {
                perfil.value.rol_Id = 3;
                perfil.value.nombre_rol = 'Premium';
            }

            const userLocal = JSON.parse(localStorage.getItem('user') || '{}');
            
            if (userLocal.id) {
                userLocal.rol = 'Premium';
                userLocal.nombre_rol = 'Premium';
                userLocal.rol_Id = 3; 
                
                localStorage.setItem('user', JSON.stringify(userLocal));
                
                setTimeout(() => {
                    window.location.href = '/user/perfil'; 
                }, 4000);
            }
        }
    }, 
    { immediate: true }
);

// ── LÓGICA INTELIGENTE DE RETORNO AL DASHBOARD ──────────────────
const navegarDesdePerfil = (destinoKey) => {
    localStorage.setItem('navegar_a_tab', destinoKey);
    router.push('/user/dashboard');
};

// ── Usuario en sesión ───────────────────────────────────────────────
const obtenerUsuarioActual = () => JSON.parse(localStorage.getItem('user') || '{}');

const rolUsuario = computed(() => {
    const u = obtenerUsuarioActual();
    const nombreDelRol = u.nombre_rol || u.rol || (u.rol_Id === 3 ? 'premium' : 'basic');
    return nombreDelRol.charAt(0).toUpperCase() + nombreDelRol.slice(1).toLowerCase();
});

const esPremiumSesion = computed(() => rolUsuario.value.toLowerCase() === 'premium');

const esPremium = computed(() => {
    return esPremiumSesion.value || (perfil.value?.rol_Id === 3);
});

const datosSidebar = computed(() => {
    const u = obtenerUsuarioActual();
    return {
        nombre: nombreCompleto.value || `${u.nombre ?? ''} ${u.apellido_paterno ?? ''}`.trim() || 'Usuario',
        inicial: (perfil.value.nombre || u.nombre || 'U').charAt(0).toUpperCase()
    };
});

const menuItems = computed(() => {
    const items = [
        { key: 'overview', label: 'Mi Resumen', icon: PieChart },
        { key: 'movimientos', label: 'Mis Movimientos', icon: ArrowRightLeft },
        { key: 'prestamos', label: 'Préstamos', icon: CreditCard },
        { key: 'metas', label: 'Metas Ahorro', icon: Target }
    ];

    if (esPremiumSesion.value) {
        items.push({ key: 'pagares', label: 'Pagarés Legales', icon: FileSignature });
    }

    return items;
});
</script>

<style scoped>
.tab-slide-enter-active,
.tab-slide-leave-active {
    transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.tab-slide-enter-from {
    opacity: 0;
    transform: translateY(10px) scale(0.995);
}

.tab-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>