<script setup>
    import {User, Mail, Lock} from 'lucide-vue-next';
    
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-white p-4 font-sans">
        <div class="flex w-full max-w-6xl bg-white overflow-hidden">
            
            <div class="hidden lg:flex w-1/2 flex-col justify-center items-center p-12 bg-[#F9FAFF]">
                <div class="self-start mb-8 flex items-center gap-2">
                    <div class="bg-[#009291] p-1 rounded-lg">
                        <div class="w-5 h-5 bg-white rounded-sm"></div>
                    </div>
                    <span class="font-bold text-2xl text-[#001D3D]">Cuentas Claras</span>
                </div>
                <img 
                    src="https://img.freepik.com/free-vector/digital-lifestyle-concept-illustration_114360-7327.jpg" 
                    alt="CuentasClaras Illustration" 
                    class="w-full max-w-md" 
                />
            </div>

            <div class="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <h1 class="text-4xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
                <p class="text-gray-500 mb-6 text-lg">Sumate para controlar tus gastos y formalizar préstamos</p>
                
                <p class="mb-6 text-sm">
                    ¿Ya tienes una cuenta? 
                    <RouterLink to="/" class="text-[#00B4B4] font-semibold hover:underline">
                        ¡Inicia sesión aquí!
                    </RouterLink>

                </p>

                <form class="space-y-5" @submit.prevent="handleRegister">
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="border-b-2 border-gray-100 py-1 focus-within:border-[#00B4B4] transition-colors">
                            <label class="block text-xs text-gray-400 uppercase font-bold tracking-wider">Nombre(s) *</label>
                            <div class="flex items-center gap-2 mt-1">
                                <User :size="16" class="text-gray-400" />
                                <input v-model="nombre" type="text" placeholder="Tu nombre" class="w-full outline-none text-gray-700 bg-transparent" :disabled="loading"/>
                            </div>
                        </div>

                        <div class="border-b-2 border-gray-100 py-1 focus-within:border-[#00B4B4] transition-colors">
                            <label class="block text-xs text-gray-400 uppercase font-bold tracking-wider">Apellido Paterno *</label>
                            <div class="flex items-center gap-2 mt-1">
                                <User :size="16" class="text-gray-400" />
                                <input v-model="apellidoPaterno" type="text" placeholder="Primer apellido" class="w-full outline-none text-gray-700 bg-transparent" :disabled="loading"/>
                            </div>
                        </div>
                    </div>

                    <div class="border-b-2 border-gray-100 py-1 focus-within:border-[#00B4B4] transition-colors">
                        <label class="block text-xs text-gray-400 uppercase font-bold tracking-wider">Apellido Materno (Opcional)</label>
                        <div class="flex items-center gap-2 mt-1">
                            <User :size="16" class="text-gray-400" />
                            <input v-model="apellidoMaterno" type="text" placeholder="Segundo apellido" class="w-full outline-none text-gray-700 bg-transparent" :disabled="loading"/>
                        </div>
                    </div>

                    <div class="border-b-2 border-gray-100 py-1 focus-within:border-[#00B4B4] transition-colors">
                        <label class="block text-xs text-gray-400 uppercase font-bold tracking-wider">Correo electrónico *</label>
                        <div class="flex items-center gap-2 mt-1">
                            <Mail :size="16" class="text-gray-400" />
                            <input v-model="email" type="email" placeholder="ejemplo@correo.com" class="w-full outline-none text-gray-700 bg-transparent" :disabled="loading"/>
                        </div>
                    </div>

                    <div class="border-b-2 border-gray-100 py-1 focus-within:border-[#00B4B4] transition-colors">
                        <label class="block text-xs text-gray-400 uppercase font-bold tracking-wider">Contraseña *</label>
                        <div class="flex items-center gap-2 mt-1">
                            <Lock :size="16" class="text-gray-400" />
                            <input v-model="password" type="password" placeholder="Mínimo 8 caracteres" class="w-full outline-none text-gray-700 bg-transparent" :disabled="loading"/>
                        </div>
                    </div>

                    <div class="border-b-2 border-gray-100 py-1 focus-within:border-[#00B4B4] transition-colors">
                        <label class="block text-xs text-gray-400 uppercase font-bold tracking-wider">Confirmar Contraseña *</label>
                        <div class="flex items-center gap-2 mt-1">
                            <Lock :size="16" class="text-gray-400" />
                            <input v-model="confirmPassword" type="password" placeholder="Repite tu contraseña" class="w-full outline-none text-gray-700 bg-transparent" :disabled="loading"/>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        :disabled="loading"
                        class="w-full mt-4 bg-[#00B4B4] text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-100 hover:bg-[#009291] transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
                    >
                        {{ loading ? 'Creando cuenta...' : 'Registrarme' }}
                    </button>
                </form>
            </div>

        </div>
    </div>
</template>