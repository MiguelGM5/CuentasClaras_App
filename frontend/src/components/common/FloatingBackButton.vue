<script setup>
import { RouterLink } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';

defineProps({
    to: {
        type: String,
        default: '/'
    },
    label: {
        type: String,
        default: 'Volver al Inicio'
    }
});
</script>

<template>
    <RouterLink 
        :to="to" 
        class="absolute top-5 right-5 sm:top-8 sm:right-8 inline-flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-slate-100/90 hover:bg-[#00B4B4] text-slate-700 hover:text-white border border-slate-200/80 hover:border-[#00B4B4] rounded-2xl text-xs sm:text-sm font-black shadow-2xs hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 group z-20"
    >
        <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-white group-hover:bg-white/20 flex items-center justify-center text-slate-600 group-hover:text-white transition-colors flex-shrink-0 shadow-2xs">
            <ArrowLeft class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform" />
        </div>
        <span>{{ label }}</span>
    </RouterLink>
</template>
