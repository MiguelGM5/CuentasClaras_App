<script setup>
    import { ref, computed } from 'vue';
    import { Mail, Lock, Eye, EyeOff, Facebook, Apple, Chrome, ArrowLeft } from 'lucide-vue-next';
    import { RouterLink } from 'vue-router';
    import { useLogin } from '../../composables/auth/useLogin';

    const {
        email,
        password,
        loading,
        manejadorLogin
    } = useLogin();

    const mostrarPassword = ref(false);
</script>

<template>
    <!-- Contenedor absoluto que ocupa el 100% del ancho y alto de la ventana -->
    <div class="min-h-screen w-full flex bg-white font-sans">
        <div class="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <!-- MITAD IZQUIERDA: 50% de la pantalla pegada a los bordes -->
        	<img 
                src="../../assets/Fondo.jpg" 
                alt="Fondo financiero" 
                class="absolute inset-0 w-full h-full object-cover object-center"
            />
            <!-- Filtro oscuro sutil -->
            <div class="absolute inset-0 bg-black/20"></div>
        </div>

        <!-- MITAD DERECHA: El otro 50% de la pantalla -->
        <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
            
            <!-- Botón Flotante para regresar a la Landing -->
            <RouterLink 
                to="/" 
                class="absolute top-5 right-5 sm:top-8 sm:right-8 inline-flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-slate-100/90 hover:bg-[#00B4B4] text-slate-700 hover:text-white border border-slate-200/80 hover:border-[#00B4B4] rounded-2xl text-xs sm:text-sm font-black shadow-2xs hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 group z-20"
            >
                <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-white group-hover:bg-white/20 flex items-center justify-center text-slate-600 group-hover:text-white transition-colors flex-shrink-0 shadow-2xs">
                    <ArrowLeft class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform" />
                </div>
                <span>Volver al Inicio</span>
            </RouterLink>

            <!-- Contenedor interno para que tu formulario no se estire de más y quede centrado -->
            <div class="w-full max-w-md pt-6 sm:pt-0">
                
                <!-- Logo -->
                <div class="mb-6 sm:mb-8">
                    <img src="../../assets/LogoCC.png" 
                        alt="Logo Cuentas Claras" 
                        loading="lazy" 
                        class="h-20 sm:h-24 md:h-28 w-auto object-contain transition-all duration-300"
                    >
                </div>

                <h1 class="text-4xl font-bold text-gray-900 mb-2">Iniciar sesión</h1>
                <p class="text-gray-500 mb-1 text-lg">Tus finanzas y prestamos informales en una sola app</p>
                <p class="mb-10 text-sm">
                    ¿No tienes cuenta? 
                    <RouterLink to="/registro" class="text-[#00B4B4] font-semibold hover:underline cursor-pointer">
                        ¡Puedes crear una cuenta aquí!
                    </RouterLink>
                </p>

                <!-- TU FORMULARIO INTACTO -->
                <form class="space-y-6" @submit.prevent="manejadorLogin">
                    <div class="border-b-2 border-gray-100 py-2 focus-within:border-[#00B4B4] transition-colors">
                        <label class="block text-xs text-gray-400 uppercase font-bold tracking-wider">Correo electrónico</label>
                        <div class="flex items-center gap-3">
                            <Mail :size="18" class="text-gray-400" />
                            <input
                                v-model="email" 
                                type="email" 
                                placeholder="Ingresa tu correo electrónico" 
                                class="w-full outline-none text-gray-700 py-1 bg-transparent" 
                            />
                        </div>
                    </div>

                    <div class="border-b-2 border-gray-100 py-2 focus-within:border-[#00B4B4] transition-colors">
                        <label class="block text-xs text-gray-400 uppercase font-bold tracking-wider">Contraseña</label>
                        <div class="flex items-center gap-3">
                            <Lock :size="18" class="text-gray-400" />
                            <input
                                v-model="password" 
                                :type="mostrarPassword ? 'text' : 'password'" 
                                placeholder="Ingresa tu contraseña" 
                                class="w-full outline-none text-gray-700 py-1 bg-transparent" 
                            />
                            <button
                                type="button"
                                @click="mostrarPassword = !mostrarPassword"
                                class="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                                :aria-label="mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                            >
                                <component :is="mostrarPassword ? EyeOff : Eye" :size="18" />
                            </button>
                        </div>
                    </div>

                    <button :disabled="loading" class="w-full bg-[#00B4B4] text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-100 hover:bg-[#009291] transition-all transform hover:-translate-y-1">
                        {{ loading ? 'Iniciando Sesion...' : 'Iniciar Sesion' }}
                    </button>
                </form>
            </div>

        </div>

    </div>
</template>