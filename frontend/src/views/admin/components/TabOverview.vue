<template>
    <div>
        <div class="mb-8">
            <h1 class="text-3xl font-black text-slate-800 tracking-tight">Dashboard General</h1>
            <p class="text-sm text-slate-400 mt-1">Resumen del sistema · Cuentas Claras</p>
        </div>

        <div class="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
            <StatCard label="Total Usuarios" :value="totalUsuarios" :icon="Users">
                <template #footer>
                    {{ cntActivos }} activos
                </template>
            </StatCard>
            <StatCard label="Usuarios Premium" :value="cntPremium" :icon="UserStar" colorTexto="text-teal-500" colorBg="bg-teal-50">
                <template #footer>
                    {{ totalUsuarios ? ((cntPremium / totalUsuarios) * 100).toFixed(0) : 0 }}% del total
                </template>
            </StatCard>
            <StatCard label="Préstamos Activos" :value="prestamosPendientes" :icon="CreditCard" colorTexto="text-violet-500" colorBg="bg-violet-50">
                <template #footer>
                    {{ totalPrestamos }} registros en total
                </template>
            </StatCard>
            <StatCard label="Gasto Total" :value="`$${totalGastos.toLocaleString('es-MX')}`" :icon="Wallet" colorTexto="text-amber-500" colorBg="bg-amber-50">
                <template #footer>
                    Promedio ${{ promedioGasto.toLocaleString('es-MX') }}
                </template>
            </StatCard>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-7">
            <UserDonutChart :total="totalUsuarios" :free="cntFree" :premium="cntPremium" />
            <LoansBarChart :prestamos="prestamos" />
        </div>

        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="p-5 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h3 class="font-black text-slate-800">Últimos Préstamos</h3>
                </div>
                <button @click="$emit('cambiarTab', 'prestamos')"
                    class="text-xs font-bold text-[#00B4B4] hover:underline">
                    Ver todos →
                </button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-slate-50/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th class="px-5 py-3">Usuario</th>
                            <th class="px-5 py-3">Tipo</th>
                            <th class="px-5 py-3">Concepto</th>
                            <th class="px-5 py-3">Monto</th>
                            <th class="px-5 py-3">Estado</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50 text-sm text-slate-600">
                        <tr v-for="p in prestamos.slice().reverse().slice(0, 5)" :key="p.id" class="hover:bg-slate-50/40 transition-colors">
                            <td class="px-5 py-3 font-semibold">{{ p.usuarioNombre }}</td>
                            <td class="px-5 py-3">
                                <span :class="p.tipo === 'prestado' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'"
                                    class="px-2 py-0.5 rounded-full text-[11px] font-bold">
                                    {{ p.tipo === "prestado" ? "↑Prestó": "↓ Pidió" }}
                                </span>
                            </td>
                            <td class="px-5 py-3 text-slate-400">{{ p.concepto }}</td>
                            <td class="px-5 py-3">
                                <span :class="p.tipo === 'prestado' ? 'text-emerald-600' : 'text-amber-600'" class="font-black">
                                    ${{ p.monto.toLocaleString("es-MX") }}
                                </span>
                            </td>
                            <td class="px-5 py-3">
                                <span :class="p.estado === 'Saldado' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'"
                                    class="px-2 py-0.5 rounded-full text-[11px] font-bold">
                                    {{ p.estado }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Users, UserStar, CreditCard, Wallet } from 'lucide-vue-next';
import StatCard from './StatCard.vue';
import UserDonutChart from '../../../components/dashboard/UserDonutChart.vue';
import LoansBarChart from '../../../components/dashboard/LoansBarChart.vue';

defineProps({
    prestamos: Array, 
    totalUsuarios: Number, 
    cntFree: Number, 
    cntPremium: Number,
    cntActivos: Number, 
    totalPrestamos: Number, 
    prestamosPendientes: Number,
    totalGastos: Number, 
    promedioGasto: Number
});
defineEmits(['cambiarTab']);
</script>