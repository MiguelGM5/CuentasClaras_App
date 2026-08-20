<script setup>
import { X } from 'lucide-vue-next';

defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ''
    },
    subtitle: {
        type: String,
        default: ''
    },
    maxWidth: {
        type: String,
        default: 'max-w-md'
    }
});

const emit = defineEmits(['update:modelValue', 'close']);

const cerrar = () => {
    emit('update:modelValue', false);
    emit('close');
};
</script>

<template>
    <Transition name="modal">
        <div 
            v-if="modelValue" 
            class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50"
            @mousedown.self="cerrar"
        >
            <div :class="['bg-white rounded-3xl w-[95%] max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl flex flex-col', maxWidth]">
                <!-- Header -->
                <div class="flex justify-between items-start mb-6 flex-shrink-0">
                    <div>
                        <slot name="title">
                            <h3 v-if="title" class="font-black text-xl text-slate-800">{{ title }}</h3>
                        </slot>
                        <slot name="subtitle">
                            <p v-if="subtitle" class="text-xs text-slate-400 mt-0.5">{{ subtitle }}</p>
                        </slot>
                    </div>
                    <button 
                        @click="cerrar" 
                        class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors -mt-1 -mr-1"
                        aria-label="Cerrar modal"
                    >
                        <X :size="17" />
                    </button>
                </div>

                <!-- Body -->
                <div class="flex-1">
                    <slot></slot>
                </div>

                <!-- Footer (opcional) -->
                <div v-if="$slots.footer" class="mt-6 flex-shrink-0">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
.modal-enter-from > div,
.modal-leave-to > div {
    transform: scale(0.96) translateY(8px);
    transition: transform 0.2s ease;
}
</style>
