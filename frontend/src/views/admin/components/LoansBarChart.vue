<template>
    <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col h-full">
        <div class="mb-6">
            <h3 class="font-bold text-slate-800 text-2xl text-center">Préstamos Registrados por Día</h3>
        </div>

        <div class="flex items-end justify-between gap-2 sm:gap-4 min-h-[160px] flex-1">
            <div v-for="day in prestamosPerDay" :key="day.dateStr" class="flex-1 flex flex-col items-center h-full">

                <span class="text-sm font-semibold text-slate-500 mb-2 min-h-[20px] transition-opacity duration-1000" 
                      :class="showBars ? 'opacity-100' : 'opacity-0'">
                    {{ day.count > 0 ? day.count : "" }}
                </span>

                <div class="w-full bg-slate-50 rounded-t-xl flex items-end overflow-hidden flex-1 max-w-[64px]">
                    <div
                        class="w-full rounded-t-xl transition-all duration-1000 ease-out"
                        :class="day.count > 0 ? 'bg-gradient-to-t from-[#009291] to-[#00D4D4]' : 'bg-transparent'"
                        :style="{ height: (day.count > 0 && showBars) ? `${(day.count / maxPorDia) * 100}%` : '0%' }"
                    ></div>
                </div>

                <span class="text-xs text-slate-400 font-medium text-center capitalize mt-3">
                    {{ day.label }}
                </span>

            </div>
        </div>

        <p v-if="!prestamos.length" class="text-center text-sm text-slate-400 mt-4">
            Aún no hay préstamos registrados en los últimos 7 días.
        </p>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
    prestamos: { type: Array, required: true }
});

// El interruptor que dispara las barras
const showBars = ref(false);

onMounted(() => {
    // Le damos un micro-retraso para que la vista cargue el 0% primero, y luego estire a tope
    setTimeout(() => {
        showBars.value = true;
    }, 150);
});

const prestamosPerDay = computed(() => {
    const days = [];
    const hoy  = new Date();

    for (let i = 6; i >= 0; i--) {
        const d = new Date(hoy);
        d.setDate(hoy.getDate() - i);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        const dateStr = `${year}-${month}-${day}`;
        const label = d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' });

        const count = props.prestamos.filter(p => {
            const fechaReal = p.fecha || p.fechaPago || p.fecha_pago;
            return fechaReal === dateStr;
        }).length;
        days.push({ label, count, dateStr });
    }
    return days;
});

const maxPorDia = computed(() =>
    Math.max(...prestamosPerDay.value.map(d => d.count), 1)
);
</script>