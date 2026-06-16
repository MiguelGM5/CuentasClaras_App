<script setup>
	import { LogOut } from 'lucide-vue-next';

	defineProps({
		modelValue: { type: String, required: true }, 
		subtitulo:  { type: String, default: 'Finanzas' }, 
		items:      { type: Array, required: true },    
		usuario:    { type: Object, required: true },
		isPremium: { type: Boolean, default: false }    
	});

	defineEmits(['update:modelValue', 'logout']);
</script>

<template>
	<aside class="w-60 bg-white border-r border-slate-100 flex flex-col fixed h-full z-20 shadow-sm">
    	<div class="px-5 py-5 border-b border-slate-100">
      		<div class="flex items-center gap-3">
        		<div class="w-9 h-9 bg-[#00B4B4] rounded-xl flex items-center justify-center shadow-md shadow-teal-100 flex-shrink-0">
          			<div class="w-4 h-4 bg-white rounded-sm"></div>
        		</div>
        		<div class="flex flex-col items-start">
    				<p class="font-black text-[#001D3D] leading-tight">Cuentas Claras</p>
    				<span 
        				class="text-[9px] font-black uppercase tracking-widest mt-0.5 rounded-md transition-colors"
        				:class="isPremium ? 'bg-amber-100 text-amber-600 px-2 py-0.5' : 'text-slate-400'"
    				>
        				{{ subtitulo }}
    				</span>
				</div>
      		</div>
    	</div>

    
    	<nav class="flex-1 p-3 space-y-0.5">
      		<button
        		v-for="item in items"
        		:key="item.key"
        		@click="$emit('update:modelValue', item.key)"
        		:class="[
          			'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
          			modelValue === item.key
            		? 'bg-[#00B4B4] text-white shadow-md shadow-teal-100'
            		: 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
        		]"
      		>
        		<component :is="item.icon" :size="17" />
        		{{ item.label }}
      		</button>
    	</nav>

    	<div class="p-3 border-t border-slate-100">
      		<div class="flex items-center gap-3 px-2 mb-2">
        		<div class="w-8 h-8 rounded-xl bg-[#001D3D] flex items-center justify-center text-white text-xs font-black flex-shrink-0">
          			{{ usuario.inicial }}
        		</div>
        		<div class="min-w-0">
          			<p class="text-xs font-bold text-slate-700 truncate">{{ usuario.nombre }}</p>
          			<p class="text-[10px] text-slate-400 truncate">{{ usuario.email }}</p>
        		</div>
      		</div>
      		<button
        		@click="$emit('logout')"
        		class="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
      		>
        		<LogOut :size="15" />
        		Cerrar sesión
      		</button>
    	</div>
  	</aside>
</template>