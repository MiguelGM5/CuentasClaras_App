<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { ArrowRight } from 'lucide-vue-next';

const props = defineProps({
    total: { type: Number, required: true },
    free: { type: Number, required: true },
    premium: { type: Number, required: true },
});

// Variables reactivas para animar los números y la dona
const fillProgress = ref(0);
const displayTotal = ref(0);
const displayFree = ref(0);
const displayPremium = ref(0);

let yaAnimadoUserDonut = false;

const animarDona = () => {
    if (!props.total) return;

    if (yaAnimadoUserDonut) {
        fillProgress.value = 1;
        displayTotal.value = props.total;
        displayFree.value = props.free;
        displayPremium.value = props.premium;
        return;
    }

    yaAnimadoUserDonut = true;
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
        displayFree.value = Math.round(props.free * progress);
        displayPremium.value = Math.round(props.premium * progress);

        if (frame === totalFrames) {
            clearInterval(counter);
            fillProgress.value = 1;
            displayTotal.value = props.total;
            displayFree.value = props.free;
            displayPremium.value = props.premium;
        }
    }, frameRate);
};

onMounted(() => {
    setTimeout(animarDona, 200);
});

watch(() => props.total, () => {
    if (yaAnimadoUserDonut) {
        fillProgress.value = 1;
        displayTotal.value = props.total || 0;
        displayFree.value = props.free || 0;
        displayPremium.value = props.premium || 0;
    } else {
        animarDona();
    }
});

const calculoPorcentaje = plan => {
    return ((plan / (props.total)) * 100).toFixed(0);
};

const conicGradient = computed(() => {
    if (!props.total) return "conic-gradient(#e2e8f0 0% 100%)";
    
    // Porcentajes reales
    const pFreeReal = (props.free / props.total) * 100;
    
    // Porcentajes en animación (el barrido gris a color)
    const pTotalAnim = 100 * fillProgress.value; 
    const pFreeAnim = (pFreeReal / 100) * pTotalAnim; 

    return `conic-gradient(#00B4B4 0% ${pFreeAnim}%, #001D3D ${pFreeAnim}% ${pTotalAnim}%, #e2e8f0 ${pTotalAnim}% 100%)`;
});
</script>

<template>
    <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center h-full">

        <div class="text-center mb-8">
            <h3 class="font-black text-slate-800 text-2xl">Usuarios Totales</h3>
        </div>

        <div class="flex flex-row items-center w-full">

            <div class="w-1/2 flex justify-center">
                <div class="relative shadow-sm" style="width: 200px; height: 200px; border-radius: 50%;"
                    :style="{ backgroundImage: conicGradient }"
                >
                    <div class="absolute m-auto bg-white rounded-full flex flex-col items-center justify-center shadow-sm"
                        style="width: 130px; height: 130px; top: 35px; left: 35px;"
                    >
                        <p class="text-4xl font-black text-slate-800">{{ displayTotal.toLocaleString("es-MX") }}</p>
                        <p class="text-lg font-black text-slate-400">Usuarios</p>
                    </div>
                </div>
            </div>

            <div class="w-1/2 pl-2 sm:pl-6 space-y-4">
                
                <div class="flex justify-between items-center gap-2">
                    <div class="flex items-center gap-2">
                        <div class="w-3.5 h-3.5 rounded-full shadow-sm flex-shrink-0 bg-[#00B4B4]"></div>
                        <span class="text-lg font-semibold text-slate-700 truncate">Plan Gratis</span>
                    </div>

                    <div class="flex items-center gap-1.5 whitespace-nowrap">
                        <span class="text-lg font-black text-slate-800">{{ displayFree.toLocaleString("es-MX") }}</span>
                        <ArrowRight :size="15" class="text-slate-400"/>
                        <span class="text-md font-semibold text-slate-400">{{ total ? calculoPorcentaje(displayFree) : 0 }}%</span>
                    </div>
                </div>

                <div class="flex justify-between items-center gap-2">
                    <div class="flex items-center gap-2">
                        <div class="w-3.5 h-3.5 rounded-full shadow-sm flex-shrink-0 bg-[#001D3D]"></div>
                        <span class="text-lg font-semibold text-slate-700 truncate">Plan Premium</span>
                    </div>

                    <div class="flex items-center gap-1.5 whitespace-nowrap">
                        <span class="text-lg font-black text-slate-800">{{ displayPremium.toLocaleString("es-MX") }}</span>
                        <ArrowRight :size="15" class="text-slate-400"/>
                        <span class="text-md font-semibold text-slate-400">{{ total ? calculoPorcentaje(displayPremium) : 0 }}%</span>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>