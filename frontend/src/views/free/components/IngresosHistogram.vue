<template>
    <div class="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col h-full">
        <div class="flex justify-between items-start mb-8">
            <div>
                <h3 class="font-black text-slate-800 text-2xl">Ingresos a la Semana</h3>
            </div>
            <div class="text-right flex items-center gap-4">
                <div class="hidden sm:block">
                    <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Semana</p>
                    <p class="text-xl font-black text-emerald-600">${{ displayTotalSemana.toLocaleString("es-MX") }}</p>
                </div>
                <div class="p-2.5 bg-emerald-50 rounded-xl">
                    <TrendingUp :size="25" class="text-emerald-500" />
                </div>
            </div>
        </div>

        <div class="relative flex-1 mt-2 min-h-[200px] flex items-end">
            <div class="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
                <div class="w-full border-b border-dashed border-slate-200"></div>
                <div class="w-full border-b border-dashed border-slate-200"></div>
                <div class="w-full border-b border-dashed border-slate-200"></div>
                <div class="w-full border-b border-solid border-slate-200"></div>
            </div>

            <div class="relative w-full flex items-end justify-between gap-2 sm:gap-4 h-full pb-6 z-10">
                <div v-for="day in ingresosPerDay" :key="day.dateStr"
                    class="flex-1 flex flex-col items-center gap-2 h-[180px] justify-end group">

                    <span class="text-sm font-black transition-opacity duration-1000 min-h-[16px] text-emerald-600 group-hover:text-emerald-500"
                          :class="showBars && day.sum > 0 ? 'opacity-100' : 'opacity-0'">
                        {{ day.sum > 0 ? `$${day.sum.toLocaleString("es-MX")}` : '' }}
                    </span>

                    <div class="w-full bg-slate-50/80 rounded-t-2xl flex items-end overflow-hidden transition-all duration-300 group-hover:bg-slate-100"
                        style="height: 100%; max-width: 64px;">
                        <div class="w-full rounded-t-2xl transition-all duration-1000 ease-out relative overflow-hidden group-hover:brightness-110"
                            :style="{
                                height: (day.sum > 0 && showBars) ? `${Math.max((day.sum / maxIngreso) * 100, 10)}%` : '0%',
                                background: day.sum > 0 ? 'linear-gradient(to top, #10b981, #34d399)' : 'transparent'
                            }">
                            <div class="absolute inset-0 bg-white/20 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </div>

                    <span class="absolute -bottom-6 text-sm font-bold text-center capitalize transition-colors"
                        :class="day.sum > 0 ? 'text-slate-600' : 'text-slate-400'">
                        {{ day.label }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { TrendingUp } from 'lucide-vue-next';

const props = defineProps({
    movimientos: { type: Array, required: true }
});

const showBars = ref(false);
const displayTotalSemana = ref(0);

const ingresosPerDay = computed(() => {
    const days = [];
    const hoy = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(hoy);
        d.setDate(d.getDate() - i);
        
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`; 
        
        const label = d.toLocaleDateString("es-MX", { weekday: "short", day: "numeric" }).replace('.', '');

        const sum = (props.movimientos || [])
            .filter(m => m.tipo === 'ingreso' && m.fecha === dateStr)
            .reduce((a, b) => a + Number(b.monto), 0);

        days.push({ label, sum, dateStr });
    }
    return days;
});

const maxIngreso = computed(() => {
    const max = Math.max(...ingresosPerDay.value.map(d => d.sum));
    return max > 0 ? max : 100;
});

const totalSemanaReal = computed(() => {
    return ingresosPerDay.value.reduce((acc, curr) => acc + curr.sum, 0);
});

// Animación del Total Semana al lado del icono
const animateTotal = () => {
    let frame = 0;
    const duration = 1500;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    const easeOutQuad = t => t * (2 - t);

    displayTotalSemana.value = 0;
    const target = totalSemanaReal.value;

    const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        displayTotalSemana.value = Math.round(target * progress);

        if (frame === totalFrames) {
            clearInterval(counter);
            displayTotalSemana.value = target;
        }
    }, frameRate);
};

onMounted(() => {
    setTimeout(() => {
        showBars.value = true;
    }, 150);
    animateTotal();
});

watch(totalSemanaReal, animateTotal);
</script>