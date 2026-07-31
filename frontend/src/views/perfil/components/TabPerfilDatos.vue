<template>
    <div class="space-y-6">

        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 class="font-black text-slate-800 text-lg">Datos Personales</h3>
                    <p class="text-md text-slate-400 mt-0.5">Información legal de tu cuenta</p>
                </div>
                <div class="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <User :size="16" class="text-emerald-700" />
                </div>
            </div>

            <div class="p-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                            Nombre <span class="ml-1 text-slate-300 normal-case font-normal">(no editable)</span>
                        </label>
                        <div class="relative">
                            <User :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input
                                :value="perfil.nombre"
                                type="text"
                                readonly
                                class="w-full border border-slate-100 bg-slate-50 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-500 outline-none cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div>
                        <label class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                            Apellido Paterno <span class="ml-1 text-slate-300 normal-case font-normal">(no editable)</span>
                        </label>
                        <input
                            :value="perfil.apellidoPaterno"
                            type="text"
                            readonly
                            class="w-full border border-slate-100 bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-slate-500 outline-none cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                            Apellido Materno <span class="ml-1 text-slate-300 normal-case font-normal">(no editable)</span>
                        </label>
                        <input
                            :value="perfil.apellidoMaterno"
                            type="text"
                            readonly
                            class="w-full border border-slate-100 bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-slate-500 outline-none cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                            Correo Electrónico <span class="ml-1 text-slate-300 normal-case font-normal">(no editable)</span>
                        </label>
                        <div class="relative">
                            <Mail :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input
                                :value="perfil.email"
                                type="email"
                                readonly
                                class="w-full border border-slate-100 bg-slate-50 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-500 outline-none cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
                
                </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 class="font-black text-slate-800 text-lg">Cambiar Contraseña</h3>
                    <p class="text-md text-slate-400 mt-0.5">Recomendamos usar una contraseña segura y única</p>
                </div>
                <div class="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Lock :size="16" class="text-amber-500" />
                </div>
            </div>

            <div class="p-6">
                <div v-if="passGuardadoOk"
                    class="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold px-4 py-3 rounded-xl mb-5">
                    <CheckCircle :size="15" />
                    Contraseña actualizada correctamente
                </div>

                <div class="space-y-4 max-w-sm">
                    <div>
                        <label class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Contraseña Actual</label>
                        <div class="relative">
                            <Lock :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input
                                v-model="passForm.actual"
                                :type="mostrarActual ? 'text' : 'password'"
                                class="w-full border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-sm outline-none focus:border-[#00B4B4] transition-colors"
                                placeholder="Tu contraseña actual"
                            />
                            <button
                                @click="mostrarActual = !mostrarActual"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                            >
                                <component :is="mostrarActual ? EyeOff : Eye" :size="15" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Nueva Contraseña</label>
                        <div class="relative">
                            <Lock :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input
                                v-model="passForm.nueva"
                                :type="mostrarNueva ? 'text' : 'password'"
                                class="w-full border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-sm outline-none focus:border-[#00B4B4] transition-colors"
                                placeholder="Mínimo 8 caracteres"
                            />
                            <button
                                @click="mostrarNueva = !mostrarNueva"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                            >
                                <component :is="mostrarNueva ? EyeOff : Eye" :size="15" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Confirmar Nueva Contraseña</label>
                        <input
                            v-model="passForm.confirmar"
                            type="password"
                            @input="validarConfirmar"
                            :class="errorConfirmar ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-[#00B4B4]'"
                            class="w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                            placeholder="Repite tu nueva contraseña"
                        />
                        <p v-if="errorConfirmar" class="text-sm text-red-400 font-bold mt-1">Las contraseñas no coinciden</p>
                    </div>
                </div>

                <div class="flex justify-end mt-5">
                    <button
                        @click="guardarPassword"
                        :disabled="guardando || !passForm.actual || !passForm.nueva || errorConfirmar"
                        class="flex items-center gap-2 bg-[#001D3D] hover:bg-[#002a57] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black px-5 py-2.5 rounded-xl text-sm transition-all"
                    >
                        <Lock :size="14" /> {{ guardando ? 'Actualizando...' : 'Actualizar contraseña' }}
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-vue-next';

// Solo atrapamos el perfil, ya no necesitamos emitir "guardar"
const props = defineProps({
    perfil: { type: Object, required: true }
});

const emit = defineEmits(['cambiarPassword']);

// ── LÓGICA DE CONTRASEÑA ──────────────────────────────────────────
const passForm = reactive({ actual: '', nueva: '', confirmar: '' });
const mostrarActual  = ref(false);
const mostrarNueva   = ref(false);
const passGuardadoOk = ref(false);
const guardando      = ref(false);

const guardarPassword = async () => {
    if (guardando.value) return;
    if (!passForm.actual || !passForm.nueva || !passForm.confirmar) return;
    if (passForm.nueva !== passForm.confirmar) return;
    
    guardando.value = true;
    try {
        await emit('cambiarPassword', passForm.actual, passForm.nueva);
        passForm.actual = '';
        passForm.nueva  = '';
        passForm.confirmar = '';
        passGuardadoOk.value = true;
        setTimeout(() => (passGuardadoOk.value = false), 2500);
    } finally {
        setTimeout(() => guardando.value = false, 600);
    }
};

const errorConfirmar = ref(false);
const validarConfirmar = () => {
    errorConfirmar.value = passForm.confirmar.length > 0 && passForm.nueva !== passForm.confirmar;
};
</script>