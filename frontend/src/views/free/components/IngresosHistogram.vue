<template>
    <div class="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col h-full">
        <!-- HEADER: Ahora con el Total de la Semana para rellenar la derecha -->
        <div class="flex justify-between items-start mb-8">
            <div>
                <h3 class="font-black text-slate-800 text-2xl">Ingresos a la Semana</h3>
                <!-- <p class="text-xs text-slate-400 mt-0.5">Últimos 7 días de facturación o cobros</p> -->
            </div>
            <div class="text-right flex items-center gap-4">
                <div class="hidden sm:block">
                    <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Semana</p>
                    <p class="text-xl font-black text-emerald-600">${{ totalSemana.toLocaleString("es-MX") }}</p>
                </div>
                <div class="p-2.5 bg-emerald-50 rounded-xl">
                    <TrendingUp :size="25" class="text-emerald-500" />
                </div>
            </div>
        </div>

        <!-- ÁREA DE LA GRÁFICA (Más alta y con líneas de fondo) -->
        <div class="relative flex-1 mt-2 min-h-[200px] flex items-end">

            <!-- GRID DE FONDO (Líneas punteadas para rellenar el espacio en blanco) -->
            <div class="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
                <div class="w-full border-b border-dashed border-slate-200"></div>
                <div class="w-full border-b border-dashed border-slate-200"></div>
                <div class="w-full border-b border-dashed border-slate-200"></div>
                <div class="w-full border-b border-solid border-slate-200"></div>
            </div>

            <!-- BARRAS DEL HISTOGRAMA -->
            <div class="relative w-full flex items-end justify-between gap-2 sm:gap-4 h-full pb-6 z-10">
                <div v-for="day in ingresosPerDay" :key="day.dateStr"
                    class="flex-1 flex flex-col items-center gap-2 h-[180px] justify-end group">

                    <!-- Texto del Monto -->
                    <span class="text-sm font-black transition-colors duration-300 min-h-[16px]"
                        :class="day.sum > 0 ? 'text-emerald-600 group-hover:text-emerald-500' : 'text-transparent'">
                        {{ day.sum > 0 ? `$${day.sum.toLocaleString("es-MX")}` : '' }}
                    </span>

                    <!-- Contenedor de la barra (Más gordito: max-w-[64px]) -->
                    <div class="w-full bg-slate-50/80 rounded-t-2xl flex items-end overflow-hidden transition-all duration-300 group-hover:bg-slate-100"
                        style="height: 100%; max-width: 64px;">
                        <div class="w-full rounded-t-2xl transition-all duration-700 ease-out relative overflow-hidden group-hover:brightness-110"
                            :style="{
                                height: day.sum > 0 ? `${Math.max((day.sum / maxIngreso) * 100, 10)}%` : '0%',
                                background: day.sum > 0 ? 'linear-gradient(to top, #10b981, #34d399)' : 'transparent'
                            }">
                            <!-- Brillo sutil al hacer hover -->
                            <div
                                class="absolute inset-0 bg-white/20 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity">
                            </div>
                        </div>
                    </div>

                    <!-- Etiqueta del Día -->
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
import { computed } from 'vue';
import { TrendingUp } from 'lucide-vue-next';

const props = defineProps({
    movimientos: { type: Array, required: true }
});

const ingresosPerDay = computed(() => {
    const days = [];
    // Usamos el 10 de junio de 2026 para que coincida con tus Mocks
    for (let i = 6; i >= 0; i--) {
        const d = new Date("2026-06-10");
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        const label = d.toLocaleDateString("es-MX", { weekday: "short", day: "numeric" }).replace('.', '');

        const sum = (props.movimientos || [])
            .filter(m => m.tipo === 'ingreso' && m.fecha === dateStr)
            .reduce((a, b) => a + b.monto, 0);

        days.push({ label, sum, dateStr });
    }
    return days;
});

const maxIngreso = computed(() => {
    const max = Math.max(...ingresosPerDay.value.map(d => d.sum));
    return max > 0 ? max : 100;
});

// Calculamos la suma total de estos 7 días
const totalSemana = computed(() => {
    return ingresosPerDay.value.reduce((acc, curr) => acc + curr.sum, 0);
});
</script>