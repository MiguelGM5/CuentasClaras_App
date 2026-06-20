<script setup>
    import { ref, watch } from 'vue';
    import { X, Check, ShieldUser, UserStar, User, Pencil } from 'lucide-vue-next';

    const props = defineProps({
        modelValue:     { type: Boolean, required: true },
        mode:           { type: String, default: 'create' },
        usuario:        { type: Object, required: true },
        totalPrestamos: { type: Number, default: 0 },
        totalGastos:    { type: Number, default: 0 }
    });

    const emit = defineEmits(['update:modelValue', 'guardar', 'cambiarAModoEditar']);

    const localUser = ref({ ...props.usuario });

    watch(() => props.usuario, (newVal) => {
        localUser.value = { ...newVal };
    }, { deep: true, immediate: true });

    watch(() => localUser.value.plan, (newPlan) => {
        const rolMap = { free: 'user', premium: 'premium', superAdmin: 'superAdmin' };
        localUser.value.rol = rolMap[newPlan] ?? 'user';
    });

    const planClases = {
        free:    'bg-teal-50 text-teal-700 border border-teal-100',
        premium: 'bg-[#001D3D] text-white',
        superAdmin:   'bg-amber-50 text-amber-700 border border-amber-100',
    };

    const planIconos = {
        free: { icono: User, color: 'text-teal-500' },
        premium: { icono: UserStar, color: 'text-violet-500' },
        superAdmin: { icono: ShieldUser, color: 'text-amber-500' }
    };

    const obtenerIniciales = (nombre, apellido) => {
        return `${nombre?.[0] ?? ''}${apellido?.[0] ?? ''}`.toUpperCase();
    };


</script>

<template>
    <Transition name="modal">
        <div v-if="modelValue"
            class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            mousedown.self="$emit('update:modelValue', false)"
        >
            <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">

                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h3 class="font-black text-xl text-slate-800">
                            {{ mode === 'create' ? 'Nuevo Usuario' : mode === 'edit' ? 'Editar Usuario' : 'Detalle de Usuario' }}
                        </h3>
                        <p class="text-xs text-slate-400 mt-0.5">
                            {{ mode === 'create' ? 'Completa los campos para crear la cuenta' : mode === 'edit' ? 'Modifica los datos del usuario' : 'Informacion general del usuario' }}
                        </p>
                    </div>
                    <button @click="$emit('update:modelValue', false)"
                        class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors -mt-1 -mr-1"
                    >
                        <X :size="17" />
                    </button>
                </div>

                <div v-if="mode === 'view' && localUser" class="space-y-5">
                    <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                        <div
                            class="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-[#009291] flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                            {{ obtenerIniciales(localUser.nombre, localUser.apellidoPaterno) }}
                        </div>
                        <div class="min-w-0">
                            <p class="font-black text-slate-800 text-lg leading-tight truncate">
                                {{ localUser.nombre }} {{ localUser.apellidoPaterno }}
                            </p>
                            <p class="text-sm text-slate-400 truncate">{{ localUser.email }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div class="p-3 bg-slate-50 rounded-xl">
                            <p class="text-[10px] text-slate-400 font-bold uppercase">Plan</p>
                            <span :class="planClases[localUser.plan]"
                                class="inline-block mt-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize">
                                {{ localUser.plan }}
                            </span>
                        </div>
                        <div class="p-3 bg-slate-50 rounded-xl">
                            <p class="text-[10px] text-slate-400 font-bold uppercase">Estado</p>
                            <p :class="localUser.status === 1 ? 'text-green-600' : 'text-red-500'"
                                class="font-black mt-1.5 text-sm">
                                {{ localUser.status === 1 ? '● Activo' : '○ Inactivo' }}
                            </p>
                        </div>
                        <div class="p-3 bg-slate-50 rounded-xl">
                            <p class="text-[10px] text-slate-400 font-bold uppercase">Préstamos</p>
                            <p class="font-black text-slate-800 mt-1.5 text-xl">{{ totalPrestamos }}</p>
                        </div>
                        <div class="p-3 bg-slate-50 rounded-xl">
                            <p class="text-[10px] text-slate-400 font-bold uppercase">Gastos</p>
                            <p class="font-black text-slate-800 mt-1.5 text-xl">{{ totalGastos }}</p>
                        </div>
                        <div class="p-3 bg-slate-50 rounded-xl col-span-2">
                            <p class="text-[10px] text-slate-400 font-bold uppercase">Fecha de Registro</p>
                            <p class="font-bold text-slate-800 mt-1 text-sm">{{ localUser.fechaRegistro || 'Sin registrar' }}</p>
                        </div>
                    </div>
                </div>

                <div v-else class="space-y-4">
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Nombre *</label>
                            <input v-model="localUser.nombre" type="text" placeholder="Nombre"
                                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" 
                            />
                        </div>
                        <div>
                            <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Apellido * </label>
                            <input v-model="localUser.apellidoPaterno" type="text" placeholder="Apellido"
                                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" 
                            />
                        </div>
                    </div>

                    <div>
                        <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Correo Electrónico *</label>
                        <input v-model="localUser.email" type="email" placeholder="correo@ejemplo.com"
                            class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors" 
                        />
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Plan</label>
                            <select v-model="localUser.plan"
                                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors"
                            >
                                <option value="free">Free</option>
                                <option value="premium">Premium</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Estado</label>
                            <select v-model="localUser.status"
                                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors"
                            >
                                <option :value="1">Activo</option>
                                <option :value="0">Inactivo</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-3 text-xs text-slate-500">
                        <component 
                            :is="planIconos[localUser.plan]?.icono || User" 
                            :size="20" 
                            :class="[planIconos[localUser.plan]?.color || 'text-slate-400', 'flex-shrink-0']" 
                        />
                        <span>Rol asignado automáticamente: <strong class="text-slate-700 capitalize">{{ localUser.rol }}</strong></span>
                    </div>
                </div>

                <div class="flex gap-3 mt-6">
                    <template v-if="mode === 'view'">
                        <button @click="$emit('update:modelValue', false)"
                            class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-sm transition-colors"
                        >
                            Cerrar
                        </button>
                        <button @click="$emit('cambiarAModoEditar')"
                            class="flex-1 bg-[#00B4B4] hover:bg-[#009291] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-100 transition-colors"
                        >
                            <Pencil :size="14" />
                            Editar usuario
                        </button>
                    </template>

                    <template v-else>
                        <button @click="$emit('update:modelValue', false)"
                            class="flex-1 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 text-sm transition-colors"
                        >
                            Cancelar
                        </button>
                        <button @click="$emit('guardar', { ...localUser })"
                            class="flex-1 bg-[#00B4B4] hover:bg-[#009291] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-100 transition-colors"
                        >
                            <Check :size="15" />
                            {{ mode === 'create' ? 'Crear Usuario' : 'Guardar Cambios' }}
                        </button>
                    </template>
                </div>
            </div>
        </div>
    </Transition>
</template>