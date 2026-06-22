<script setup>
	import { RouterView } from 'vue-router';
	import { onMounted } from 'vue';
	import { useAuth } from './composables/auth/useAuth';

	const { programarCierreSesion, encenderRastreadorInactividad, isLoggedIn } = useAuth();

	onMounted(() => {
    if (isLoggedIn.value) {
        programarCierreSesion(); // Activa la bomba de 1 hora
        encenderRastreadorInactividad(); // Empieza a mirar si mueve el mouse
    }
});
</script>

<template>
	<RouterView />
</template>
