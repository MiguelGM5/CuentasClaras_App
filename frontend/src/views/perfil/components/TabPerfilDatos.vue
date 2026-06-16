<script setup>
import { ref, reactive } from 'vue';
import { User, Mail, Phone, Calendar, Lock, Eye, EyeOff, Save, CheckCircle } from 'lucide-vue-next';

const props = defineProps({
    perfil: { type: Object, required: true }
});

const emit = defineEmits(['guardar', 'cambiarPassword']);

// Copia local editable para no tocar el prop directamente
const form = reactive({
    nombre:           props.perfil.nombre,
    apellidoPaterno:  props.perfil.apellidoPaterno,
    apellidoMaterno:  props.perfil.apellidoMaterno,
    email:            props.perfil.email,
    telefono:         props.perfil.telefono,
    fechaNacimiento:  props.perfil.fechaNacimiento
});

const passForm = reactive({ actual: '', nueva: '', confirmar: '' });
const mostrarActual  = ref(false);
const mostrarNueva   = ref(false);
const guardadoOk     = ref(false);
const passGuardadoOk = ref(false);

const guardarDatos = () => {
    emit('guardar', { ...form });
    guardadoOk.value = true;
    setTimeout(() => (guardadoOk.value = false), 2500);
};

const guardarPassword = () => {
    if (!passForm.actual || !passForm.nueva || !passForm.confirmar) return;
    if (passForm.nueva !== passForm.confirmar) return;
    emit('cambiarPassword', passForm.actual, passForm.nueva);
    passForm.actual = '';
    passForm.nueva  = '';
    passForm.confirmar = '';
    passGuardadoOk.value = true;
    setTimeout(() => (passGuardadoOk.value = false), 2500);
};

const errorConfirmar = ref(false);
const validarConfirmar = () => {
    errorConfirmar.value = passForm.confirmar.length > 0 && passForm.nueva !== passForm.confirmar;
};
</script>

<template>
    <div class="space-y-6">

        <!-- CARD: DATOS PERSONALES -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 class="font-black text-slate-800 text-base">Datos Personales</h3>
                    <p class="text-xs text-slate-400 mt-0.5">Actualiza tu informacion de perfil</p>
                </div>
                <div class="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center">
                    <User :size="16" class="text-[#00B4B4]" />
                </div>
            </div>

            <div class="p-6">
                <!-- Aviso de exito -->
                <div v-if="guardadoOk"
                    class="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold px-4 py-3 rounded-xl mb-5">
                    <CheckCircle :size="15" />
                    Cambios guardados correctamente
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <!-- Nombre -->
                    <div>
                        <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Nombre</label>
                        <div class="relative">
                            <User :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input
                                v-model="form.nombre"
                                type="text"
                                class="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#00B4B4] transition-colors"
                                placeholder="Tu nombre"
                            />
                        </div>
                    </div>

                    <!-- Apellido Paterno -->
                    <div>
                        <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Apellido Paterno</label>
                        <input
                            v-model="form.apellidoPaterno"
                            type="text"
                            class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#00B4B4] transition-colors"
                            placeholder="Apellido paterno"
                        />
                    </div>

                    <!-- Apellido Materno -->
                    <div>
                        <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Apellido Materno</label>
                        <input
                            v-model="form.apellidoMaterno"
                            type="text"
                            class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#00B4B4] transition-colors"
                            placeholder="Apellido materno"
                        />
                    </div>

                    <!-- Telefono -->
                    <div>
                        <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Telefono</label>
                        <div class="relative">
                            <Phone :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input
                                v-model="form.telefono"
                                type="tel"
                                class="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#00B4B4] transition-colors"
                                placeholder="55 0000 0000"
                            />
                        </div>
                    </div>

                    <!-- Email (readonly) -->
                    <div>
                        <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                            Correo Electronico
                            <span class="ml-1 text-slate-300 normal-case font-normal">(no editable)</span>
                        </label>
                        <div class="relative">
                            <Mail :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input
                                :value="form.email"
                                type="email"
                                readonly
                                class="w-full border border-slate-100 bg-slate-50 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-400 outline-none cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <!-- Fecha de nacimiento -->
                    <div>
                        <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Fecha de Nacimiento</label>
                        <div class="relative">
                            <Calendar :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input
                                v-model="form.fechaNacimiento"
                                type="date"
                                class="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-600 outline-none focus:border-[#00B4B4] transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button
                        @click="guardarDatos"
                        class="flex items-center gap-2 bg-[#00B4B4] hover:bg-[#009291] text-white font-black px-5 py-2.5 rounded-xl text-sm shadow-md shadow-teal-100 transition-all"
                    >
                        <Save :size="14" /> Guardar cambios
                    </button>
                </div>
            </div>
        </div>

        <!-- CARD: CAMBIAR PASSWORD -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 class="font-black text-slate-800 text-base">Cambiar Contrasena</h3>
                    <p class="text-xs text-slate-400 mt-0.5">Recomendamos usar una contrasena segura y unica</p>
                </div>
                <div class="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Lock :size="16" class="text-amber-500" />
                </div>
            </div>

            <div class="p-6">
                <div v-if="passGuardadoOk"
                    class="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold px-4 py-3 rounded-xl mb-5">
                    <CheckCircle :size="15" />
                    Contrasena actualizada correctamente
                </div>

                <div class="space-y-4 max-w-sm">
                    <!-- Password actual -->
                    <div>
                        <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Contrasena Actual</label>
                        <div class="relative">
                            <Lock :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input
                                v-model="passForm.actual"
                                :type="mostrarActual ? 'text' : 'password'"
                                class="w-full border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-sm outline-none focus:border-[#00B4B4] transition-colors"
                                placeholder="Tu contrasena actual"
                            />
                            <button
                                @click="mostrarActual = !mostrarActual"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                            >
                                <component :is="mostrarActual ? EyeOff : Eye" :size="15" />
                            </button>
                        </div>
                    </div>

                    <!-- Nueva password -->
                    <div>
                        <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Nueva Contrasena</label>
                        <div class="relative">
                            <Lock :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input
                                v-model="passForm.nueva"
                                :type="mostrarNueva ? 'text' : 'password'"
                                class="w-full border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-sm outline-none focus:border-[#00B4B4] transition-colors"
                                placeholder="Minimo 8 caracteres"
                            />
                            <button
                                @click="mostrarNueva = !mostrarNueva"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                            >
                                <component :is="mostrarNueva ? EyeOff : Eye" :size="15" />
                            </button>
                        </div>
                    </div>

                    <!-- Confirmar -->
                    <div>
                        <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Confirmar Nueva Contrasena</label>
                        <input
                            v-model="passForm.confirmar"
                            type="password"
                            @input="validarConfirmar"
                            :class="errorConfirmar ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-[#00B4B4]'"
                            class="w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                            placeholder="Repite tu nueva contrasena"
                        />
                        <p v-if="errorConfirmar" class="text-xs text-red-400 font-bold mt-1">Las contrasenas no coinciden</p>
                    </div>
                </div>

                <div class="flex justify-end mt-5">
                    <button
                        @click="guardarPassword"
                        :disabled="!passForm.actual || !passForm.nueva || errorConfirmar"
                        class="flex items-center gap-2 bg-[#001D3D] hover:bg-[#002a57] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black px-5 py-2.5 rounded-xl text-sm transition-all"
                    >
                        <Lock :size="14" /> Actualizar contrasena
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>
