<script setup>
import { computed } from 'vue';

const props = defineProps({
    total: { type: Number, required: true },
    free: { type: Number, required: true },
    premium: { type: Number, required: true },
});

const calculoPorcentaje = plan => {
    return ((plan / (props.total)) * 100).toFixed(0);
};

const conicGradient = computed(() => {
    if (!props.total) return "conic-gradient(#e2e8f0 0% 100%)";
    const pFree = calculoPorcentaje(props.free);
    return `conic-gradient(#00B4B4 0% ${pFree}%, #001D3D ${pFree}% 100%)`;
});

</script>

<template>
    <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 class="font-black text-slate-800 text-base">Usuarios de Cuentas Claras</h3>
        <p class="text-xs text-slate-400 mb-6 mt-0.5">Distribución de planes de clientes</p>

        <div class="flex items-center gap-8">
            <div class="relative flex-shrink-0 w-36 h-36">
                <div class="w-36 h-36 rounded-full" :style="{ background: conicGradient }"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-[88px] h-[88px] bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                        <p class="text-2xl font-black text-slate-800 leading-none">{{ total }}</p>
                        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Clientes</p>
                    </div>
                </div>
            </div>

            <div class="flex-1 space-y-5">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-[#00B4B4] shadow-sm shadow-teal-200"></div>
                        <span class="text-sm font-semibold text-slate-600">Plan Free</span>
                    </div>
                    <div class="text-right">
                        <span class="text-sm font-black text-slate-800">{{ free }}</span>
                        <span class="text-xs text-slate-400 ml-1">
                            {{ total ? calculoPorcentaje(free) : 0 }}%
                        </span>
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-[#001D3D]"></div>
                        <span class="text-sm font-semibold text-slate-600">Plan Premium</span>
                    </div>
                    <div class="text-right">
                        <span class="text-sm font-black text-slate-800">{{ premium }}</span>
                        <span class="text-xs text-slate-400 ml-1">
                            {{ total ? calculoPorcentaje(premium) : 0 }}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>