<script setup>
    defineProps({
        requisites: {
            type: Array,
            required: true
        },
        visible: {
            type: Boolean,
            default: false
        }
    });
</script>

<template>
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform -translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-2 opacity-0"
    >
        <ul v-if="visible" class="mt-3 text-xs space-y-1 pl-1 transition-all duration-300">
            <li
                v-for="(rule, index) in requisites"
                :key = "index"
                :class = "rule.cumple ? 'text-green-600 font-semibold flex items-center gap-1.5' : 'text-red-400 flex items-center gap-1.5'"
                class = "transition-colors duration-200"
            >
                <span>
                    {{ rule.cumple ? '✓' : '*' }}
                </span>
                {{ rule.texto }}
            </li>
        </ul>
    </Transition>
</template>