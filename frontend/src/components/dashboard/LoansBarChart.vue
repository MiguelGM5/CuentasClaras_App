<template>
    <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 class="font-black text-slate-800 text-base">Préstamos Registrados por Día</h3>
        <p class="text-xs text-slate-400 mb-6 mt-0.5">Últimos 7 días</p>

        <div class="flex items-end gap-2 h-36">
            <div v-for="day in prestamosPerDay" :key="day.dateStr" class="flex-1 flex flex-col items-center gap-1">
                <span class="text-xs font-black text-slate-500 min-h-[16px]">{{ day.count > 0 ? day.count : "" }}</span>

                <div class="w-full rounded-t-lg overflow-hidden bg-slate-50 flex items-end" style="height: 88px">
                    <div class="w-full rounded-t-lg transition-all duration-700 ease-out"
                        :class="day.count > 0 ? 'bg-gradient-to-t from-[#009291] to-[#00D4D4]' : 'bg-slate-100'"
                        :style="{ height: day.count > 0 ? `${Math.max((day.count / maxPorDia) * 100, 10)}%` : '4px' }">
                    </div>
                </div>

                <span class="text-[9px] text-slate-400 font-semibold text-center leading-tight capitalize">
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