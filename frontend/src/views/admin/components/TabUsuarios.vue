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

        <div class="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">

            <StatCard v-for="card in cardsUsuarios" 
                :key="card.id" 
                :label="card.label" 
                :value="card.value" 
                :icon="card.icon" 
                :color-texto="card.colorTexto" 
                :color-bg="card.colorBg"
            >
                <template #footer>
                    {{ card.footer }}
                </template>
            </StatCard>
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
import { computed } from 'vue';
import { Plus, Eye, Pencil, Trash2, UsersRound, UserRoundCheck, UserStar, UserRound } from 'lucide-vue-next';

import BaseDataTable from '../../../components/dashboard/BaseDataTable.vue';
import StatCard from './StatCard.vue';

const props = defineProps({ 
    usuarios: {type: Array, default: () => [] }, 
    totalUsuarios: {type:Number, default:0}, 
    cntFree: {type:Number, default:0}, 
    cntPremium: {type:Number, default:0}, 
    cntActivos: {type:Number, default:0} 
});

defineEmits(['abrirCrear', 'abrirVer', 'abrirEditar', 'eliminarUsuario', 'toggleStatus']);

const cardsUsuarios = computed(() => [
    { 
        id: 1,
        label: "Total Usuarios",
        value: props.totalUsuarios, 
        icon: UsersRound,
        colorTexto: "text-indigo-600",
        colorBg: "bg-indigo-100",
        footer: `` 
    },
    {
        id: 2,
        label: "Usuarios Gratis",
        value: props.cntFree,
        icon: UserRound,
        colorTexto: "text-sky-600",
        colorBg: "bg-sky-100",
        footer: ``
    },
    {
        id: 3,
        label: "Usuarios Premium",
        value: props.cntPremium,
        icon: UserStar,
        colorTexto: "text-yellow-600",
        colorBg: "bg-yellow-100",
        footer: ``
    }, 
    {
        id: 4,
        label: "Usuarios Activos",
        value: props.cntFree,
        icon: UserRoundCheck,
        colorTexto: "text-emerald-600",
        colorBg: "bg-emerald-100",
        footer: ``
    }, 
]);

const columnas = [
    { key: 'usuario', label: 'Usuario' }, { key: 'email', label: 'Correo' }, { key: 'plan', label: 'Plan' },
    { key: 'status', label: 'Estado' }, { key: 'fechaRegistro', label: 'Registro' }, { key: 'acciones', label: 'Acciones', sortable: false }
];
const camposBusqueda = ['nombre', 'apellidoPaterno', 'email', 'plan'];
const planClases = { free: "bg-teal-50 text-teal-700 border border-teal-100", premium: "bg-[#001D3D] text-white", superAdmin: "bg-amber-50 text-amber-700 border border-amber-100" };
const iniciales = (nombre, apellido) => `${nombre?.[0] ?? ""}${apellido?.[0] ?? ""}`.toUpperCase();
</script>