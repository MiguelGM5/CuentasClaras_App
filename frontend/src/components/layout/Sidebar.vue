<script setup>
    import { LogOut, Crown, X } from 'lucide-vue-next';
    import { useLogout } from '../../composables/auth/useLogout';

    const { manejadorLogout } = useLogout();

    defineProps({
        modelValue: { type: String, required: true },
        subtitulo:  { type: String },
        isPremium:  { type: Boolean, default: false }, 
        items:      { type: Array, required: true },
        usuario:    { type: Object, required: true },
        isOpen:     { type: Boolean, default: false }
    });

    const emit = defineEmits(['update:modelValue', 'irAPerfil', 'close']);

    const seleccionarItem = (key) => {
        emit('update:modelValue', key);
        emit('close');
    };

    const irAPerfilYCerrar = () => {
        emit('irAPerfil');
        emit('close');
    };
</script>

<template>
    <!-- Backdrop oscuro para móvil -->
    <Transition name="fade">
        <div 
            v-if="isOpen" 
            @click="$emit('close')"
            class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
        ></div>
    </Transition>

    <!-- Sidebar / Drawer -->
    <aside 
        :class="[
            'fixed top-0 left-0 h-full w-[280px] sm:w-72 md:w-60 bg-white border-r border-slate-100 flex flex-col z-50 shadow-2xl md:shadow-xs transition-transform duration-300 ease-in-out md:translate-x-0',
            isOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
    >
        <!-- Encabezado del menú -->
        <div class="px-5 py-5 border-b border-slate-100 flex items-center justify-between">
            <div 
                @click="seleccionarItem('overview')" 
                class="flex items-center gap-3 cursor-pointer group"
                title="Ir a Mi Resumen"
            >
                <div class="w-10 h-10 md:w-9 md:h-9 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <img 
                        src="../../assets/LogoRecortado.png" 
                        alt="Cuentas Claras" 
                        class="h-10 w-auto object-contain"
                    />
                </div>
                <div>
                    <p class="font-black text-[#001D3D] leading-tight text-xl group-hover:text-[#00B4B4] transition-colors">Cuentas Claras</p>
                    <p class="text-xs font-bold uppercase tracking-widest transition-colors"
                       :class="isPremium ? 'text-amber-500' : 'text-slate-400'">
                        {{ subtitulo }}
                    </p>
                </div>
            </div>
            
            <!-- Botón de cierre en móvil -->
            <button 
                @click="$emit('close')" 
                class="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                aria-label="Cerrar menú"
            >
                <X :size="22" />
            </button>
        </div>

        <!-- Lista de opciones con botones táctiles grandes en móviles -->
        <nav class="flex-1 p-4 md:p-3 space-y-2 md:space-y-1 overflow-y-auto">
            <button
                v-for="item in items"
                :key="item.key"
                @click="seleccionarItem(item.key)"
                :class="[
                    'w-full flex items-center gap-3.5 md:gap-3 px-4 md:px-3 py-3.5 md:py-2.5 rounded-2xl md:rounded-xl text-base md:text-sm font-bold md:font-semibold transition-all duration-200 active:scale-[0.98]',
                    modelValue === item.key
                    ? 'bg-[#00B4B4] text-white shadow-md shadow-teal-100'
                    : 'text-slate-600 md:text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                ]"
            >
                <component :is="item.icon" class="w-5 h-5 md:w-4.5 md:h-4.5 flex-shrink-0" />
                <span>{{ item.label }}</span>
            </button>
        </nav>

        <!-- Pie del menú (Perfil y Salida) con botones táctiles grandes -->
        <div class="p-4 md:p-3 border-t border-slate-100 space-y-2">
            <button
                @click="irAPerfilYCerrar"
                class="w-full flex items-center gap-3 px-3 py-3 md:py-2 rounded-2xl md:rounded-xl hover:bg-slate-50 bg-slate-50/50 md:bg-transparent border border-slate-100 md:border-none transition-colors group active:scale-[0.98]"
            >
                <div class="relative w-9 h-9 md:w-8 md:h-8 flex-shrink-0">
                    <div v-if="isPremium" class="absolute -top-2.5 -right-2 bg-gradient-to-tr from-amber-400 to-amber-600 text-white rounded-full p-[3px] shadow-xs border-2 border-white z-10">
                        <Crown :size="10" stroke-width="4" />
                    </div>
                    
                    <div class="w-full h-full rounded-xl bg-[#001D3D] flex items-center justify-center text-white text-base md:text-md font-black group-hover:bg-[#00B4B4] transition-colors">
                        {{ usuario.inicial }}
                    </div>
                </div>

                <div class="min-w-0 text-left flex-1">
                    <p class="text-base md:text-sm font-bold text-slate-700 truncate group-hover:text-[#00B4B4] transition-colors">{{ usuario.nombre }}</p>
                    <p class="text-xs text-slate-400 truncate">Ver perfil</p>
                </div>
            </button>

            <button
                @click="manejadorLogout"
                class="w-full flex items-center justify-center md:justify-start gap-2.5 px-4 md:px-3 py-3.5 md:py-2.5 rounded-2xl md:rounded-xl font-bold text-red-500 bg-red-50/80 md:bg-transparent hover:bg-red-100 md:hover:bg-red-50 hover:text-red-600 transition-colors active:scale-[0.98]"
            >
                <LogOut class="w-5 h-5 md:w-4.5 md:h-4.5" />
                <span class="text-base md:text-sm">Cerrar Sesión</span> 
            </button>
        </div>
    </aside>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>