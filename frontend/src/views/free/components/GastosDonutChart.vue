<template>
    <div class="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 shadow-xs flex flex-col justify-center h-full">

        <div class="text-center mb-4 sm:mb-6">
            <h3 class="font-black text-slate-800 text-xl sm:text-2xl">Tu Total de Gastos</h3>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">

            <!-- Dona centrada -->
            <div class="flex justify-center flex-shrink-0">
                <div class="relative shadow-xs" style="width: 180px; height: 180px; border-radius: 50%;"
                    :style="{ backgroundImage: conicGradient }"
                >
                    <div class="absolute m-auto bg-white rounded-full flex flex-col items-center justify-center shadow-xs"
                        style="width: 116px; height: 116px; top: 32px; left: 32px;"
                    >
                        <p class="text-2xl sm:text-3xl font-black text-slate-800 text-center px-1 truncate max-w-[110px]">${{ displayTotal.toLocaleString("es-MX") }}</p>
                    </div>
                </div>
            </div>

            <!-- Desglose por categorías -->
            <div class="w-full sm:w-1/2 space-y-2.5">
                <div v-for="[cat, monto] in sortedDatos" :key="cat" class="flex justify-between items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors">

                    <div class="flex items-center gap-2 min-w-0">
                        <div class="w-3.5 h-3.5 rounded-full shadow-xs flex-shrink-0"
                            :style="{ backgroundColor: colores[cat]?.hex || '#e8e002' }"></div>
                        <span class="text-xs sm:text-sm font-bold text-slate-700 truncate">{{ cat }}</span>
                    </div>

                    <div class="flex items-center gap-1.5 whitespace-nowrap">
                        <span class="text-xs sm:text-sm font-black text-slate-800">${{ monto.toLocaleString("es-MX") }}</span>
                        <ArrowRight size="13px" class="text-slate-400"/>
                        <span class="text-xs font-semibold text-slate-400"> {{ calculoPorcentaje(monto) }}%</span>
                    </div>

                </div>

                <div v-if="Object.keys(datos).length === 0" class="text-xs sm:text-sm text-slate-400 text-center py-2">
                    No hay gastos registrados. ¡Empieza registrando uno!
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { ArrowRight } from 'lucide-vue-next';
import { animationState } from '../../../utils/animationState';

const props = defineProps({
    total: { type: Number, required: true },
    datos: { type: Object, required: true },
    colores: { type: Object, required: true }
});

const fillProgress = ref(animationState.donut ? 1 : 0);
const displayTotal = ref(props.total || 0);
let counter = null;

const sortedDatos = computed(() => {
    return Object.entries(props.datos).sort((a, b) => b[1] - a[1]);
});

const calculoPorcentaje = (monto) => {
    return displayTotal.value ? ((monto / displayTotal.value) * 100).toFixed(0) : 0;
};

const animarDona = () => {
    if (!props.total) return;

    if (animationState.donut) {
        fillProgress.value = 1;
        displayTotal.value = props.total;
        return;
    }

    animationState.donut = true;
    if (counter) clearInterval(counter);

    let frame = 0;
    const duration = 1500;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    const easeOutQuad = t => t * (2 - t);

    fillProgress.value = 0;
    
    counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        fillProgress.value = progress;
        displayTotal.value = Math.round(props.total * progress);

        if (frame === totalFrames) {
            clearInterval(counter);
            counter = null;
            fillProgress.value = 1;
            displayTotal.value = props.total;
        }
    }, frameRate);
};

onMounted(() => setTimeout(animarDona, 200));

onUnmounted(() => {
    if (counter) {
        clearInterval(counter);
        counter = null;
    }
});

watch(() => props.total, () => {
    if (animationState.donut) {
        fillProgress.value = 1;
        displayTotal.value = props.total || 0;
    } else {
        animarDona();
    }
});

const conicGradient = computed(() => {
    if (!props.total || fillProgress.value === 0) return "conic-gradient(#e2e8f0 0% 100%)";
    
    let gradientStr = "";
    let acumuladoAnimado = 0;

    // Iteramos sobre el array ya ordenado
    for (const [cat, montoBase] of sortedDatos.value) {
        const porcentajeReal = (montoBase / props.total) * 100;
        const porcentajeAnimado = porcentajeReal * fillProgress.value;
        const color = props.colores[cat]?.hex || '#94a3b8';
        
        gradientStr += `${color} ${acumuladoAnimado}% ${acumuladoAnimado + porcentajeAnimado}%, `;
        acumuladoAnimado += porcentajeAnimado;
    }
    gradientStr += `#e2e8f0 ${acumuladoAnimado}% 100%`;
    return `conic-gradient(${gradientStr})`;
});
</script>