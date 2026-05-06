<script setup>
	import { ref, onMounted } from "vue";
	const deudas = ref([]);
	//Prueba para leer el json que se mando desde el back
	onMounted(() => {
  		fetch("http://localhost:3000/deudas")
		.then(res => res.json())
		.then(data => {
      		console.log(data);
			deudas.value = data;
    	}).catch(error => console.log('error', error));
	});
</script>

<template>
  <h1>Lista de Deudas</h1>

  <ul>
    <li v-for="(deuda, index) in deudas" :key="index">
      {{ deuda.nombre }} - ${{ deuda.monto }} - {{ deuda.estado }}
    </li>
  </ul>
</template>
