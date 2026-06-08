<template>
  <div class="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
    
    <div class="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 class="font-black text-lg text-slate-800">{{ titulo }}</h2>
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Buscar en esta tabla..." 
        class="text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 w-full sm:w-64 outline-none focus:border-[#00B4B4] focus:bg-white transition-all"
      />
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <th 
              v-for="header in headers" 
              :key="header.key" 
              @click="cambiarOrden(header.key)"
              class="p-4 cursor-pointer hover:text-slate-600 transition-colors select-none"
            >
              <div class="flex items-center gap-1">
                {{ header.label }}
                <span v-if="sortBy === header.key">{{ sortDesc ? '▼' : '▲' }}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-sm text-slate-600">
          <tr v-for="item in itemsFiltrados" :key="item.id" class="hover:bg-slate-50/40 transition-colors">
            <td v-for="header in headers" :key="header.key" class="p-4">
              <slot :name="header.key" :row="item">
                {{ item[header.key] }}
              </slot>
            </td>
          </tr>
          
          <tr v-if="itemsFiltrados.length === 0">
            <td :colspan="headers.length" class="text-center py-8 text-xs text-slate-400 font-medium">
              No se encontraron registros coincidentes.
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
  titulo: { type: String, default: 'Listado' },
  headers: { type: Array, required: true }, // [{ key: 'nombre', label: 'Nombre' }]
  items: { type: Array, required: true }    // Los datos puros de la BD
});

const searchQuery = ref('');
const sortBy = ref('');
const sortDesc = ref(false);

// 🔄 LÓGICA DE ORDENAMIENTO
const cambiarOrden = (key) => {
  if (sortBy.value === key) {
    sortDesc.value = !sortDesc.value;
  } else {
    sortBy.value = key;
    sortDesc.value = false;
  }
};

// 🔍 FILTRADO Y ORDENAMIENTO COMBINADO (Reactividad pura)
const itemsFiltrados = computed(() => {
  let resultado = [...props.items];

  // 1. Filtrar por buscador global
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase();
    resultado = resultado.filter(item => 
      Object.values(item).some(val => String(val).toLowerCase().includes(query))
    );
  }

  // 2. Ordenar por columna seleccionada
  if (sortBy.value) {
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