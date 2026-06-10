<script setup>
    defineProps({
        label: {
            type: String,
            requiered: true
        },
        value: {
            type: [String, Number],
            requiered: true
        },
        icon: {
            type: Object, 
            requiered: true
        },
        colorTexto: {
            type: String,
            default: 'text-slate-400'
        },
        colorBg: {
            type: String,
            default: 'bg-slate-50'
        }
    });
</script>

<template>
    <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div class="flex items-center justify-between mb-3">
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider" :class="colorTexto">
                {{ label }}
            </p>
            <div class="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center" :class="colorBg">
                <component :is="icon" :size="15" :class="colorTexto" />
            </div>
        </div>
        <p class="text-3xl font-black text-slate-800">{{ value }}</p>
        <p class="text-[11px] text-slate-400 mt-1.5">
            <slot name="footer"></slot>
        </p>
    </div>
</template>

