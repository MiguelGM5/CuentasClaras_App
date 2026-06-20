<template>
    <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
        <h3 class="text-2xl font-black text-slate-800 text-center">Top Metas de Ahorro</h3>

        <div class="flex-1 flex flex-col justify-center gap-6 mt-6">
            <!-- 🔥 Usamos el arreglo displayMetas que tiene los valores animados -->
            <div v-for="meta in displayMetas" :key="meta.id">
                
                <div class="flex justify-between items-end mb-2">
                    <span class="text-lg font-bold text-slate-700 truncate pr-2">{{ meta.titulo }}</span>
                    <!-- Porcentaje Animado -->
                    <span class="text-lg font-black text-[#00B4B4]">{{ meta.displayPorcentaje }}%</span>
                </div>

                <div class="relative w-full rounded-full overflow-hidden"
                    style="height: 14px; background-color: #f1f5f9;">
                    <div class="absolute top-0 left-0 h-full rounded-full shadow-sm"
                        style="background: linear-gradient(to right, #009291, #00D4D4);"
                        :style="{ width: `${meta.displayPorcentaje}%` }"></div>
                </div>

                <div class="flex justify-between mt-2">
                    <span class="text-sm text-slate-500 font-semibold">
                        Llevas: <span class="text-slate-700">${{ formatearDinero((meta.displayMonto || 0).toLocaleString("es-MX")) }}</span>
                    </span>
                    <span class="text-sm text-slate-400 font-semibold">
                        Meta: ${{ formatearDinero((meta.montoObjetivo ?? meta.monto_objetivo ?? 0).toLocaleString("es-MX")) }}
                    </span>
                </div>
                
            </div>

            <div v-if="displayMetas.length === 0"
                class="text-center text-slate-400 text-xs py-4 flex flex-col items-center">
                <Target :size="40" class="text-slate-300 mb-2" />
                <p class="text-lg">No tienes metas activas. ¡Crea una!</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Target } from 'lucide-vue-next';

const props = defineProps({
    metas: { type: Array, required: true }
});

const formatearDinero = (monto) => {
    if (isNaN(monto) || monto === null) return "0.00";
    return Number(monto).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const topMetas = computed(() => (props.metas || []).slice(0, 3));
const displayMetas = ref([]);
let motorAnimacion = null; // Variable para matar la animación si se repite

const animarMetas = () => {
    if (!topMetas.value.length) {
        displayMetas.value = [];
        return;
    }

    // FRENO DE MANO: Matamos cualquier animación previa para que no se vuelvan locos los números
    if (motorAnimacion) clearInterval(motorAnimacion);

    let frame = 0;
    const duration = 1500;
    const frameRate = 1000 / 60; 
    const totalFrames = Math.round(duration / frameRate);
    const easeOutQuad = t => t * (2 - t);

    motorAnimacion = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);

        displayMetas.value = topMetas.value.map(meta => {
            // 🔥 BLINDAJE ANTI SNAKE-CASE: Leemos ambas variables por si tu BD escupe guiones bajos
            const actual = meta.montoActual ?? meta.monto_actual ?? 0;
            const objetivo = meta.montoObjetivo ?? meta.monto_objetivo ?? 1; // Evitamos dividir entre 0
            
            const targetPorcentaje = Math.min((actual / objetivo) * 100, 100);

            return {
                ...meta,
                displayMonto: Math.round(actual * progress),
                displayPorcentaje: (targetPorcentaje * progress).toFixed(0)
            };
        });

        if (frame === totalFrames) {
            clearInterval(motorAnimacion);
            // Clavamos los valores exactos al terminar
            displayMetas.value = topMetas.value.map(meta => {
                const actual = meta.montoActual ?? meta.monto_actual ?? 0;
                const objetivo = meta.montoObjetivo ?? meta.monto_objetivo ?? 1;
                return {
                    ...meta,
                    displayMonto: actual,
                    displayPorcentaje: Math.min((actual / objetivo) * 100, 100).toFixed(0)
                };
            });
        }
    }, frameRate);
};

//  WATCHER CORREGIDO: Usamos immediate para ahorrarnos el onMounted y vigilar los cambios reales
watch(() => props.metas, () => {
    animarMetas();
}, { deep: true, immediate: true });

</script>