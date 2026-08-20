<script setup>
    import { ref } from 'vue';
    import { User, Mail, Lock, Eye, EyeOff } from 'lucide-vue-next';
    import { RouterLink } from 'vue-router';
    import { useRegister } from '../../composables/auth/useRegister.js';
    import ValidadorCampos from '../../components/registro/ValidadorCampos.vue';
    import FloatingBackButton from '../../components/common/FloatingBackButton.vue';

    const {
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        email,
        password,
        confirmPassword,
        loading,
        validPass,
        validEmail,
        validConfirmedPass,
        validForm,
        manejadorRegistro,
    } = useRegister();

    const mostrarPassword = ref(false);
    const mostrarConfirmPassword = ref(false);
</script>

<template>
    <div class="min-h-screen w-full flex bg-white font-sans">
        <div class="hidden lg:block lg:w-1/2 relative overflow-hidden">
            <img 
                src="../../assets/Fondo2.jpg" 
                alt="Fondo registro" 
                class="absolute inset-0 w-full h-full object-cover object-center"
                loading="lazy"
            />
            <div class="absolute inset-0 bg-black/20"></div>
        </div>

        <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 overflow-y-auto relative">
            <FloatingBackButton />

            <div class="w-full max-w-md py-8 my-auto pt-10 sm:pt-8">
                
                <!-- Logo coronando el formulario -->
                <div class="mb-6 sm:mb-8">
                    <img src="../../assets/LogoCC.png" 
                        alt="Logo Cuentas Claras" 
                        loading="lazy" 
                        class="h-20 sm:h-24 md:h-28 w-auto object-contain transition-all duration-300"
                    >
                </div>

                <h1 class="text-4xl font-bold text-gray-900 mb-2">Crear cuenta</h1>
                <p class="text-gray-500 mb-1 text-lg">Unete para gestionar tus finanzas</p>
                <p class="mb-8 text-sm">
                    ¿Ya tienes una cuenta? 
                    <RouterLink to="/login" class="text-[#00B4B4] font-semibold hover:underline cursor-pointer">
                        ¡Inicia sesión aquí!
                    </RouterLink>
                </p>

                <!-- TU FORMULARIO 100% INTACTO -->
                <form class="space-y-5" @submit.prevent="manejadorRegistro">
                    
                    <div class="border-b-2 border-gray-100 py-1 focus-within:border-[#00B4B4] transition-colors">
                        <label class="block text-xs text-gray-400 uppercase font-bold tracking-wider">Nombre</label>
                        <div class="flex items-center gap-3">
                            <User :size="18" class="text-gray-400" />
                            <input 
                                v-model="nombre"
                                type="text" 
                                placeholder="Tu nombre" 
                                class="w-full outline-none text-gray-700 py-1 bg-transparent" 
                            />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="border-b-2 border-gray-100 py-1 focus-within:border-[#00B4B4] transition-colors">
                            <label class="block text-xs text-gray-400 uppercase font-bold tracking-wider">Apellido Paterno</label>
                            <div class="flex items-center gap-3">
                                <User :size="18" class="text-gray-400" />
                                <input 
                                    v-model="apellidoPaterno"
                                    type="text" 
                                    placeholder="Primer apellido" 
                                    class="w-full outline-none text-gray-700 py-1 bg-transparent" 
                                />
                            </div>
                        </div>

                        <div class="border-b-2 border-gray-100 py-1 focus-within:border-[#00B4B4] transition-colors">
                            <label class="block text-xs text-gray-400 uppercase font-bold tracking-wider">Apellido Materno (Opcional)</label>
                            <div class="flex items-center gap-3">
                                <User :size="18" class="text-gray-400" />
                                <input 
                                    v-model="apellidoMaterno"
                                    type="text" 
                                    placeholder="Segundo apellido" 
                                    class="w-full outline-none text-gray-700 py-1 bg-transparent" 
                                />
                            </div>
                        </div>
                    </div>

                    <div class="border-b-2 border-gray-100 py-1 focus-within:border-[#00B4B4] transition-colors">
                        <label class="block text-xs text-gray-400 uppercase font-bold tracking-wider">Correo electrónico</label>
                        <div class="flex items-center gap-3">
                            <Mail :size="18" class="text-gray-400" />
                            <input 
                                v-model="email"
                                type="email" 
                                placeholder="Ingresa tu correo" 
                                class="w-full outline-none text-gray-700 py-1 bg-transparent" 
                            />
                        </div>
                    </div>
                    <ValidadorCampos :visible="email.length > 0" :requisites="validEmail"/>

                    <div class="border-b-2 border-gray-100 py-1 focus-within:border-[#00B4B4] transition-colors">
                        <label class="block text-xs text-gray-400 uppercase font-bold tracking-wider">Contraseña</label>
                        <div class="flex items-center gap-3">
                            <Lock :size="18" class="text-gray-400" />
                            <input 
                                v-model="password"
                                :type="mostrarPassword ? 'text' : 'password'" 
                                placeholder="Crea una contraseña" 
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
                    
                    <ValidadorCampos :visible="password.length > 0" :requisites="validPass"/>

                    <div class="border-b-2 border-gray-100 py-1 focus-within:border-[#00B4B4] transition-colors">
                        <label class="block text-xs text-gray-400 uppercase font-bold tracking-wider">Confirmar Contraseña</label>
                        <div class="flex items-center gap-3">
                            <Lock :size="18" class="text-gray-400" />
                            <input 
                                v-model="confirmPassword"
                                :type="mostrarConfirmPassword ? 'text' : 'password'" 
                                placeholder="Repite tu contraseña" 
                                class="w-full outline-none text-gray-700 py-1 bg-transparent" 
                            />
                            <button
                                type="button"
                                @click="mostrarConfirmPassword = !mostrarConfirmPassword"
                                class="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                                :aria-label="mostrarConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                            >
                                <component :is="mostrarConfirmPassword ? EyeOff : Eye" :size="18" />
                            </button>
                        </div>
                    </div>
                    <ValidadorCampos :visible="confirmPassword.length > 0" :requisites="validConfirmedPass"/>

                    <button 
                        :disabled="loading || !validForm"
                        class="w-full bg-[#00B4B4] text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-100 hover:bg-[#009291] transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                    >
                        {{ loading ? 'Creando cuenta...' : 'Registrarme' }}
                    </button>
                </form>
            </div>
            
        </div>

    </div>
</template>