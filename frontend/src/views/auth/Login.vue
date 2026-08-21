<script setup>
import { ref } from 'vue';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ShieldCheck, CheckCircle2, TrendingUp, FileSignature } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import { useLogin } from '../../composables/auth/useLogin';
import FloatingBackButton from '../../components/common/FloatingBackButton.vue';

const {
    email,
    password,
    loading,
    manejadorLogin
} = useLogin();

const mostrarPassword = ref(false);
</script>

<template>
    <div class="min-h-screen w-full flex bg-[#F8FAFC] font-sans antialiased text-slate-800">
        
        <!-- ══════════════════════════════════════ -->
        <!-- PANEL IZQUIERDO: SHOWCASE FINANCIERO   -->
        <!-- ══════════════════════════════════════ -->
        <div class="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#001D3D] via-[#002855] to-[#001226] p-12 flex-col justify-between overflow-hidden">
            
            <!-- Luces y Malla Ambiental de Fondo -->
            <div class="absolute top-0 right-0 w-96 h-96 bg-[#00B4B4]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div class="absolute bottom-0 left-0 w-96 h-96 bg-[#003566]/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
            <div class="absolute top-1/2 left-1/3 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl pointer-events-none"></div>

            <!-- Header de Marca Superior -->
            <div class="relative z-10 flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-2 flex items-center justify-center shadow-lg shadow-black/20">
                    <img 
                        src="../../assets/LogoRecortado.png" 
                        alt="Cuentas Claras" 
                        class="h-full w-auto object-contain brightness-0 invert"
                    />
                </div>
                <div>
                    <span class="font-black text-2xl text-white tracking-tight">Cuentas Claras</span>
                    <p class="text-xs text-teal-300 font-bold uppercase tracking-widest">Finanzas Personales</p>
                </div>
            </div>

            <!-- Centro: Tarjetas Flotantes Glassmorphic -->
            <div class="relative z-10 my-auto py-8 space-y-6 max-w-lg">
                
                <!-- Titular de Bienvenida en Panel -->
                <div class="space-y-3">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-teal-300 text-xs font-bold shadow-inner">
                        <Sparkles :size="14" />
                        <span>Tu centro de control financiero</span>
                    </div>
                    <h2 class="text-3xl xl:text-4xl font-black text-white leading-tight tracking-tight">
                        Organiza tus ingresos, ahorros y préstamos con total claridad.
                    </h2>
                </div>

                <!-- Tarjeta 1: Meta de Ahorro en Vivo -->
                <div class="p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/20 space-y-3 transition-transform hover:scale-[1.02] duration-300">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                                <TrendingUp :size="20" />
                            </div>
                            <div>
                                <p class="text-xs font-bold text-slate-300 uppercase tracking-wider">Meta activa</p>
                                <p class="text-sm font-black text-white">Fondo de Emergencia</p>
                            </div>
                        </div>
                        <span class="px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-black">
                            85% alcanzado
                        </span>
                    </div>
                    <div class="w-full bg-white/10 h-2.5 rounded-full overflow-hidden p-0.5">
                        <div class="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full w-[85%]"></div>
                    </div>
                    <div class="flex justify-between text-xs font-medium text-slate-300 pt-1">
                        <span>Ahorrado: $21,250 MXN</span>
                        <span class="font-bold text-white">Objetivo: $25,000 MXN</span>
                    </div>
                </div>

                <!-- Tarjeta 2: Pagaré con Firma -->
                <div class="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-xl shadow-black/10 flex items-center justify-between transition-transform hover:scale-[1.02] duration-300">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                            <FileSignature :size="18" />
                        </div>
                        <div>
                            <p class="text-xs font-black text-white">Pagaré digital formalizado</p>
                            <p class="text-[11px] text-slate-300">Folio respaldado con firma en pantalla</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 text-xs font-bold text-teal-300 bg-teal-900/40 px-2.5 py-1 rounded-lg border border-teal-500/30">
                        <CheckCircle2 :size="14" />
                        <span>Al corriente</span>
                    </div>
                </div>

            </div>

            <!-- Footer del Panel -->
            <div class="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <div class="flex items-center gap-2">
                    <ShieldCheck :size="16" class="text-teal-400" />
                    <span>Cifrado y seguridad activa</span>
                </div>
                <span>© {{ new Date().getFullYear() }} Cuentas Claras</span>
            </div>

        </div>

        <!-- ══════════════════════════════════════ -->
        <!-- PANEL DERECHO: FORMULARIO DE ACCESO    -->
        <!-- ══════════════════════════════════════ -->
        <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-14 relative overflow-y-auto">
            
            <FloatingBackButton />

            <div class="w-full max-w-md my-auto py-8">
                
                <!-- Logo Móvil y Badge Superior -->
                <div class="flex items-center justify-between mb-8">
                    <div class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#001D3D] to-[#003566] p-2 flex items-center justify-center shadow-md shadow-slate-900/10">
                            <img 
                                src="../../assets/LogoRecortado.png" 
                                alt="Logo Cuentas Claras" 
                                loading="lazy" 
                                class="h-full w-auto object-contain brightness-0 invert"
                            >
                        </div>
                        <div class="flex flex-col">
                            <span class="font-black text-xl text-[#001D3D] leading-none">Cuentas Claras</span>
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Finanzas Personales</span>
                        </div>
                    </div>

                    <RouterLink 
                        to="/registro" 
                        class="text-xs font-bold text-[#00B4B4] hover:text-[#009291] bg-teal-50/80 hover:bg-teal-100/80 px-3.5 py-2 rounded-xl transition-all"
                    >
                        Crear Cuenta
                    </RouterLink>
                </div>

                <!-- Encabezado del Formulario -->
                <div class="mb-8 space-y-2">
                    <h1 class="text-3xl sm:text-4xl font-black text-[#001D3D] tracking-tight">
                        ¡Hola de nuevo! 👋
                    </h1>
                    <p class="text-sm text-slate-500 font-medium leading-relaxed">
                        Ingresa a tu cuenta para continuar administrando tus gastos, metas de ahorro y préstamos.
                    </p>
                </div>

                <!-- Formulario -->
                <form class="space-y-5" @submit.prevent="manejadorLogin">
                    
                    <!-- Campo: Correo Electrónico -->
                    <div class="space-y-1.5">
                        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Correo electrónico
                        </label>
                        <div class="relative flex items-center rounded-2xl bg-white border border-slate-200/90 shadow-xs focus-within:border-[#00B4B4] focus-within:ring-4 focus-within:ring-teal-500/10 transition-all">
                            <div class="pl-4 pr-2 text-slate-400 flex items-center pointer-events-none">
                                <Mail :size="18" />
                            </div>
                            <input
                                v-model="email" 
                                type="email" 
                                required
                                placeholder="ejemplo@correo.com" 
                                class="w-full py-3.5 pr-4 text-sm text-slate-800 placeholder:text-slate-400 bg-transparent outline-none font-medium" 
                            />
                        </div>
                    </div>

                    <!-- Campo: Contraseña -->
                    <div class="space-y-1.5">
                        <div class="flex justify-between items-center">
                            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Contraseña
                            </label>
                        </div>
                        <div class="relative flex items-center rounded-2xl bg-white border border-slate-200/90 shadow-xs focus-within:border-[#00B4B4] focus-within:ring-4 focus-within:ring-teal-500/10 transition-all">
                            <div class="pl-4 pr-2 text-slate-400 flex items-center pointer-events-none">
                                <Lock :size="18" />
                            </div>
                            <input
                                v-model="password" 
                                :type="mostrarPassword ? 'text' : 'password'" 
                                required
                                placeholder="Ingresa tu contraseña" 
                                class="w-full py-3.5 pr-2 text-sm text-slate-800 placeholder:text-slate-400 bg-transparent outline-none font-medium" 
                            />
                            <button
                                type="button"
                                @click="mostrarPassword = !mostrarPassword"
                                class="px-3 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 cursor-pointer"
                                :aria-label="mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                            >
                                <component :is="mostrarPassword ? EyeOff : Eye" :size="18" />
                            </button>
                        </div>
                    </div>

                    <!-- Botón de Envío (CTA) -->
                    <button 
                        type="submit"
                        :disabled="loading" 
                        class="w-full mt-2 py-4 px-6 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-[#001D3D] via-[#002855] to-[#00B4B4] hover:opacity-95 shadow-lg shadow-slate-900/15 hover:shadow-xl hover:shadow-teal-900/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span v-if="!loading">Iniciar Sesión</span>
                        <ArrowRight v-if="!loading" :size="16" />
                    </button>
                </form>

                <!-- Pie de Formulario: Registro -->
                <div class="mt-8 pt-6 border-t border-slate-200/80 text-center">
                    <p class="text-xs text-slate-500 font-medium">
                        ¿Aún no tienes una cuenta?
                        <RouterLink to="/registro" class="text-[#00B4B4] font-black hover:underline ml-1">
                            Regístrate gratis aquí
                        </RouterLink>
                    </p>
                </div>

            </div>

        </div>

    </div>
</template>