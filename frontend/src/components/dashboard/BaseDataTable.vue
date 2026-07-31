<template>
	<div class="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
    	<div class="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-3 items-center">
      		<h2 class="font-black text-slate-800 text-lg sm:text-xl tracking-tight w-full sm:w-auto text-left">{{ titulo }}</h2>
      
      		<input 
        		v-model="searchQuery" 
        		type="text" 
        		:placeholder="placeholderBuscar" 
        		class="text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 w-full sm:w-64 outline-none focus:border-[#00B4B4] focus:bg-white transition-all"
      		/>
    	</div>

		<!-- VISTA MÓVIL: Tarjetas Nativas para dedos (< md) -->
		<div class="block md:hidden divide-y divide-slate-100">
			<div 
				v-for="item in itemsFiltrados" 
				:key="item.id || item._id" 
				class="p-4 space-y-2.5 hover:bg-slate-50/60 transition-colors"
			>
				<div 
					v-for="header in headers" 
					:key="header.key"
					class="flex justify-between items-center text-xs gap-3"
				>
					<span class="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex-shrink-0">{{ header.label }}</span>
					<div class="font-semibold text-slate-700 text-right min-w-0">
						<slot :name="header.key" :row="item">
							{{ item[header.key] }}
						</slot>
					</div>
				</div>
			</div>

			<div v-if="itemsFiltrados.length === 0" class="p-8 text-center text-xs text-slate-400 font-medium">
				No se encontraron registros con ese criterio.
			</div>
		</div>

    	<!-- VISTA ESCRITORIO: Tabla tradicional (>= md) -->
    	<div class="hidden md:block overflow-x-auto">
      		<table class="w-full text-left border-collapse">
        		<thead>
          			<tr class="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            			<th 
              				v-for="header in headers" 
              				:key="header.key" 
              				@click="header.sortable !== false ? cambiarOrden(header.key) : null"
              				:class="[
                				'px-5 py-3.5 select-none', 
                				header.sortable !== false ? 'cursor-pointer hover:text-slate-600 transition-colors' : ''
              				]"
            			>
              				<div class="flex items-center gap-1">
                				{{ header.label }}
                				<span v-if="sortBy === header.key" class="text-[9px]">
                  					{{ sortDesc ? '▼' : '▲' }}
                				</span>
              				</div>
            			</th>
          			</tr>
        		</thead>
        
        		<tbody class="divide-y divide-slate-50 text-sm text-slate-600">

          			<tr 
						v-for="item in itemsFiltrados" 
						:key="item.id || item._id" 
						class="hover:bg-slate-50/50 transition-colors"
          			>
            			<td v-for="header in headers" :key="header.key" class="px-5 py-3.5">
              				<slot :name="header.key" :row="item">
                				{{ item[header.key] }}
              				</slot>
            			</td>
          			</tr>
          
          			<tr v-if="itemsFiltrados.length === 0">
            			<td :colspan="headers.length" class="px-5 py-10 text-center text-xs text-slate-400 font-medium">
              				No se encontraron registros con ese criterio.
            			</td>
          			</tr>
        		</tbody>
      		</table>
    	</div>
  	</div>
</template>

<script setup>
	import { ref, computed } from 'vue';

	const props = defineProps({
  		titulo:            { type: String, required: true },
  		placeholderBuscar: { type: String, default: 'Buscar...' },
  		headers:           { type: Array, required: true },  
  		items:             { type: Array, required: true },  
  		searchFields:      { type: Array, default: () => [] }
	});

	const searchQuery = ref('');
	const sortBy = ref('');
	const sortDesc = ref(false);

	const cambiarOrden = (key) => {
		if (sortBy.value === key) {
			sortDesc.value = !sortDesc.value;
		} else {
			sortBy.value = key;
			sortDesc.value = false;
		}
	};

	const itemsFiltrados = computed(() => {
		let resultado = [...props.items];
		const q = searchQuery.value.toLowerCase().trim();

		if(q){
			resultado = resultado.filter(item => {
				if (props.searchFields.length > 0) {
					return props.searchFields.some(field => String(item[field] || '').toLowerCase().includes(q));
				}
				return Object.values(item).some(val => String(val).toLowerCase().includes(q));
			});
		}

		if(sortBy.value){
			resultado.sort((a, b) => {
				const valA = a[sortBy.value];
				const valB = b[sortBy.value];
		
				if (valA < valB) return sortDesc.value ? 1 : -1;
				if (valA > valB) return sortDesc.value ? -1 : 1;
				return 0;
			});
		}
  		return resultado;
	});
</script>