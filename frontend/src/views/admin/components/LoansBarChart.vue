<template>
    <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col h-full">
        <div class="mb-6">
            <h3 class="font-bold text-slate-800 text-2xl text-center">Préstamos Registrados por Día</h3>
            <!-- <p class="text-sm text-slate-400 mt-1">Últimos 7 días</p> -->
        </div>

        <div class="flex items-end justify-between gap-2 sm:gap-4 min-h-[160px] flex-1">
            <div v-for="day in prestamosPerDay" :key="day.dateStr" class="flex-1 flex flex-col items-center h-full">
                
                <span class="text-sm font-semibold text-slate-500 mb-2 min-h-[20px]">
                    {{ day.count > 0 ? day.count : "" }}
                </span>

                <div class="w-full bg-slate-50 rounded-t-xl flex items-end overflow-hidden flex-1 max-w-[64px]">
                    
                    <div class="w-full rounded-t-xl transition-all duration-700 ease-out"
                        :class="day.count > 0 ? 'bg-gradient-to-t from-[#009291] to-[#00D4D4]' : 'bg-transparent'"
                        :style="{ height: day.count > 0 ? `${(day.count / maxPorDia) * 100}%` : '0%' }">
                    </div>
                    
                </div>

                <span class="text-xs text-slate-400 font-medium text-center capitalize mt-3">
                    {{ day.label }}
                </span>
                
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    prestamos: { type: Array, required: true }
});

const prestamosPerDay = computed(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        // Usamos el 8 de junio de 2026 para mantener coherencia con tus Mock Data
        const d = new Date("2026-06-08");
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        const label = d.toLocaleDateString("es-MX", { weekday: "short", day: "numeric" });

        // Contamos los préstamos que coincidan con la fecha
        const count = props.prestamos.filter((p) => p.fecha === dateStr).length;
        days.push({ label, count, dateStr });
    }
    return days;
});

const maxPorDia = computed(() => Math.max(...prestamosPerDay.value.map((d) => d.count), 1));
</script>