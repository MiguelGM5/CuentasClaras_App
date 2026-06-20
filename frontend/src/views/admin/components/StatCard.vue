<script setup>
    import { ref, onMounted, watch } from 'vue';

    const props = defineProps({
        label: String,
        value: [String, Number],
        icon: {
            type: [Object, Function], 
            required: true
        },
        colorTexto: String,
        colorBg: String
    });

    const displayValue = ref(0);
    const animateNumbers = () => {
        const esString = typeof props.value === 'string';
        const target = esString ? Number(props.value.replace(/[^0-9.-]+/g, "")) : props.value;

        if(isNaN(target) || target === 0){
            displayValue.value = props.value;
            return;
        }
        const duration = 1500;
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration/frameRate);

        const easeOutQuad = t => t * (2 - t);

        let frame = 0;
        displayValue.value = 0;

        const counter = setInterval(() => {
            frame++;

            const progress = easeOutQuad(frame / totalFrames);
            const valorActual = Math.round(target * progress);

            displayValue.value = esString ? `$${valorActual.toLocaleString('es-MX')}` : valorActual;
            if (frame === totalFrames) {
                clearInterval(counter);
                displayValue.value = esString ? `$${target.toLocaleString('es-MX')}` : target; // Clavamos el final exacto
            }
        }, frameRate);
    };

    onMounted(() => {
        animateNumbers();
    });

    watch(() => props.value, () => {
        animateNumbers();
    });
</script>

<template>
    <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div class="flex items-center justify-between mb-3">
            <p class="text-lg font-bold uppercase tracking-wider" :class="colorTexto">
                {{ label }}
            </p>
            <div class="w-8 h-8 rounded-xl flex items-center justify-center" :class="colorBg">
                <component :is="icon" :size="18" :class="colorTexto" />
            </div>
        </div>
        <p class="text-4xl font-black text-slate-800">{{ displayValue }}</p>
        <p class="text-[15px] text-slate-400 mt-1.5 font-medium">
            <slot name="footer"></slot>
        </p>
    </div>
</template>

