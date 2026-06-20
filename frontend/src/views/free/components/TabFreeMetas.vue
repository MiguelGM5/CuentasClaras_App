<template>
    <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
        <h3 class="text-2xl font-black text-slate-800 text-center">Top Metas de Ahorro</h3>

        <div class="flex-1 flex flex-col justify-center gap-6 mt-6">
            <!-- 🔥 Usamos el arreglo displayMetas que tiene los valores animados -->
            <div v-for="meta in displayMetas" :key="meta.id">
                
                <!-- Textos Superiores -->
                <div class="flex justify-between items-end mb-2">
                    <span class="text-lg font-bold text-slate-700 truncate pr-2">{{ meta.titulo }}</span>
                    <!-- Porcentaje Animado -->
                    <span class="text-lg font-black text-[#00B4B4]">{{ meta.displayPorcentaje }}%</span>
                </div>

                <!-- GRÁFICA DE BARRA HORIZONTAL -->
                <div class="relative w-full rounded-full overflow-hidden"
                    style="height: 14px; background-color: #f1f5f9;">
                    <!-- Le quitamos el transition de CSS porque nuestro JS ya lo anima fluido a 60 FPS -->
                    <div class="absolute top-0 left-0 h-full rounded-full shadow-sm"
                        style="background: linear-gradient(to right, #009291, #00D4D4);"
                        :style="{ width: `${meta.displayPorcentaje}%` }"></div>
                </div>

                <!-- Textos Inferiores -->
                <div class="flex justify-between mt-2">
                    <span class="text-sm text-slate-500 font-semibold">
                        Llevas: <span class="text-slate-700">${{ meta.displayMonto.toLocaleString("es-MX") }}</span>
                    </span>
                    <span class="text-sm text-slate-400 font-semibold">
                        Meta: ${{ meta.montoObjetivo.toLocaleString("es-MX") }}
                    </span>
                </div>
                
            </div>

            <!-- Estado vacío -->
            <div v-if="topMetas.length === 0"
                class="text-center text-slate-400 text-xs py-4 flex flex-col items-center">
                <Target :size="24" class="text-slate-300 mb-2" />
                No tienes metas activas. ¡Crea una!
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Target } from 'lucide-vue-next';

const props = defineProps({
    metas: { type: Array, required: true }
});

// Agarramos solo las primeras 3
const topMetas = computed(() => (props.metas || []).slice(0, 3));

// Arreglo reactivo para guardar los datos mientras van subiendo
const displayMetas = ref([]);

const animarMetas = () => {
    if (!topMetas.value.length) return;

    // Inicializamos todo en 0 para que arranque desde abajo
    displayMetas.value = topMetas.value.map(m => ({
        ...m,
        displayMonto: 0,
        displayPorcentaje: 0
    }));

    let frame = 0;
    const duration = 1500;
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameRate);
    const easeOutQuad = t => t * (2 - t);

    const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);

        // Actualizamos cada meta en vivo
        displayMetas.value = topMetas.value.map(meta => {
            const targetMonto = meta.montoActual || 0;
            // Topamos el porcentaje a 100 por si el güey ahorró de más
            const targetPorcentaje = Math.min((targetMonto / meta.montoObjetivo) * 100, 100) || 0;

            return {
                ...meta,
                displayMonto: Math.round(targetMonto * progress),
                displayPorcentaje: (targetPorcentaje * progress).toFixed(0)
            };
        });

        // Cuando termina, clavamos los valores exactos
        if (frame === totalFrames) {
            clearInterval(counter);
            displayMetas.value = topMetas.value.map(meta => {
                const targetMonto = meta.montoActual || 0;
                return {
                    ...meta,
                    displayMonto: targetMonto,
                    displayPorcentaje: Math.min((targetMonto / meta.montoObjetivo) * 100, 100).toFixed(0)
                };
            });
        }
    }, frameRate);
};

// Arrancamos el motorcito un microsegundo después de montar el componente
onMounted(() => {
    setTimeout(animarMetas, 150);
});

// Si el usuario crea o edita una meta, que se vuelva a animar
watch(topMetas, animarMetas, { deep: true });
</script>