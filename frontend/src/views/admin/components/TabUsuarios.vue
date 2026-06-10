<template>
    <div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
                <h1 class="text-3xl font-black text-slate-800 tracking-tight">Gestión de Usuarios</h1>
                <p class="text-sm text-slate-400 mt-1">Crear, editar, ver y eliminar cuentas del sistema</p>
            </div>
            <button @click="$emit('abrirCrear')" class="flex items-center gap-2 bg-[#00B4B4] hover:bg-[#009291] text-white font-bold px-5 py-3 rounded-xl text-sm shadow-md shadow-teal-100 flex-shrink-0">
                <Plus :size="16" /> Nuevo Usuario
            </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div v-for="stat in [{ label: 'Total', value: totalUsuarios, color: 'text-slate-800' }, { label: 'Free', value: cntFree, color: 'text-teal-600' }, { label: 'Premium', value: cntPremium, color: 'text-[#001D3D]' }, { label: 'Activos', value: cntActivos, color: 'text-green-600' }]"
                :key="stat.label" class="bg-white rounded-xl p-4 border border-slate-100">
                <p class="text-[11px] font-bold text-slate-400 uppercase">{{ stat.label }}</p>
                <p :class="['text-2xl font-black mt-1', stat.color]">{{ stat.value }}</p>
            </div>
        </div>

        <BaseDataTable titulo="Lista de Usuarios" placeholderBuscar="Buscar por nombre, correo o plan..."
            :headers="columnas" :items="usuarios" :searchFields="camposBusqueda">
            <template #usuario="{ row }">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-[#009291] flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                        {{ iniciales(row.nombre, row.apellidoPaterno) }}
                    </div>
                    <div>
                        <p class="font-bold text-slate-800 leading-tight">{{ row.nombre }} {{ row.apellidoPaterno }}</p>
                        <p class="text-[11px] text-slate-400 capitalize">{{ row.rol }}</p>
                    </div>
                </div>
            </template>
            <template #email="{ row }">
                <span class="text-slate-400 text-xs">
                    {{ row.email }}
                </span>
            </template>
            <template #plan="{ row }">
                <span :class="planClases[row.plan]" class="px-2.5 py-1 rounded-full text-[11px] font-bold capitalize">
                    {{ row.plan }}
                </span>
            </template>
            <template #status="{ row }">
                <button @click="$emit('toggleStatus', row)"
                    :class="row.status === 1 ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-500 hover:bg-red-100'"
                    class="px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors">
                    {{ row.status === 1 ? "● Activo" : "○ Inactivo" }}
                </button>
            </template>
            <template #fechaRegistro="{ row }">
                <span class="text-xs text-slate-400">
                    {{ row.fechaRegistro }}
                </span>
            </template>
            <template #acciones="{ row }">
                <div class="flex gap-1.5">
                    <button @click="$emit('abrirVer', row)" class="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400">
                        <Eye :size="14" />
                    </button>
                    <button @click="$emit('abrirEditar', row)" class="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-600">
                        <Pencil :size="14" />
                    </button>
                    <button @click="$emit('eliminarUsuario', row)" class="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-400">
                        <Trash2 :size="14" />
                    </button>
                </div>
            </template>
        </BaseDataTable>
    </div>
</template>

<script setup>
import { Plus, Eye, Pencil, Trash2 } from 'lucide-vue-next';
import BaseDataTable from '../../../components/dashboard/BaseDataTable.vue';

defineProps({ usuarios: Array, totalUsuarios: Number, cntFree: Number, cntPremium: Number, cntActivos: Number });
defineEmits(['abrirCrear', 'abrirVer', 'abrirEditar', 'eliminarUsuario', 'toggleStatus']);

const columnas = [
    { key: 'usuario', label: 'Usuario' }, { key: 'email', label: 'Correo' }, { key: 'plan', label: 'Plan' },
    { key: 'status', label: 'Estado' }, { key: 'fechaRegistro', label: 'Registro' }, { key: 'acciones', label: 'Acciones', sortable: false }
];
const camposBusqueda = ['nombre', 'apellidoPaterno', 'email', 'plan'];
const planClases = { free: "bg-teal-50 text-teal-700 border border-teal-100", premium: "bg-[#001D3D] text-white", superAdmin: "bg-amber-50 text-amber-700 border border-amber-100" };
const iniciales = (nombre, apellido) => `${nombre?.[0] ?? ""}${apellido?.[0] ?? ""}`.toUpperCase();
</script>