<template>
    <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center h-full">

        <div class="text-center mb-8">
            <h3 class="font-black text-slate-800 text-2xl">Tu Total de Gastos</h3>
        </div>

        <div class="flex flex-row items-center w-full">

            <div class="w-1/2 flex justify-center">
                <div class="relative shadow-sm" style="width: 200px; height: 200px; border-radius: 50%;"
                    :style="{ backgroundImage: conicGradient }"
                >
                    <div class="absolute m-auto bg-white rounded-full flex flex-col items-center justify-center shadow-sm"
                        style="width: 130px; height: 130px; top: 35px; left: 35px;"
                    >
                        <p class="text-4xl font-black text-slate-800">${{ displayTotal.toLocaleString("es-MX") }}</p>
                    </div>
                </div>
            </div>

            <div class="w-1/2 pl-2 sm:pl-6 space-y-4">
                <div v-for="[cat, monto] in sortedDatos" :key="cat" class="flex justify-between items-center gap-2">

                    <div class="flex items-center gap-2">
                        <div class="w-3.5 h-3.5 rounded-full shadow-sm flex-shrink-0"
                            :style="{ backgroundColor: colores[cat]?.hex || '#e8e002' }"></div>
                        <span class="text-lg font-semibold text-slate-700 truncate">{{ cat }}</span>
                    </div>

                    <div class="flex items-center gap-1.5 whitespace-nowrap">
                        <span class="text-lg font-black text-slate-800">${{ monto.toLocaleString("es-MX") }}</span>
                        <ArrowRight size="15px" class="text-slate-400"/>
                        <span class="text-md font-semibold text-slate-400 ml-1"> {{ calculoPorcentaje(monto) }}%</span>
                    </div>

                </div>

                <div v-if="Object.keys(datos).length === 0" class="text-lg text-slate-400 text-center py-2">
                    No hay gastos registrados, ¡Empieza registrando uno!.
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { ArrowRight } from 'lucide-vue-next';

const props = defineProps({
    total: { type: Number, required: true },
    datos: { type: Object, required: true },
    colores: { type: Object, required: true }
});

// --- MOTOR DE ORDENAMIENTO Y ANIMACIÓN ---
const fillProgress = ref(0);
const displayTotal = ref(0);
const datosAnimados = ref({});

const sortedDatos = computed(() => {
    return Object.entries(props.datos).sort((a, b) => b[1] - a[1]);
});

const calculoPorcentaje = (monto) => {
    return displayTotal.value ? ((monto / displayTotal.value) * 100).toFixed(0) : 0;
};

const animarDona = () => {
    if (!props.total) return;
    let frame = 0;
    const duration = 1500;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    const easeOutQuad = t => t * (2 - t);

    fillProgress.value = 0;
    
    const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        fillProgress.value = progress;
        displayTotal.value = Math.round(props.total * progress);

        if (frame === totalFrames) {
            clearInterval(counter);
            fillProgress.value = 1;
            displayTotal.value = props.total;
        }
    }, frameRate);
};

onMounted(() => setTimeout(animarDona, 200));
watch(() => props.total, animarDona);

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