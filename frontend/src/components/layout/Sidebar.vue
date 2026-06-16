<script setup>
	import { LogOut } from 'lucide-vue-next';

	defineProps({
		modelValue: { type: String, required: true },
		subtitulo:  { type: String, default: 'Finanzas' },
		items:      { type: Array, required: true },
		usuario:    { type: Object, required: true }
	});

	defineEmits(['update:modelValue', 'logout', 'irAPerfil']);
</script>

<template>
	<aside class="w-60 bg-white border-r border-slate-100 flex flex-col fixed h-full z-20 shadow-sm">
    	<div class="px-5 py-5 border-b border-slate-100">
      		<div class="flex items-center gap-3">
        		<div class="w-9 h-9 bg-[#00B4B4] rounded-xl flex items-center justify-center shadow-md shadow-teal-100 flex-shrink-0">
          			<div class="w-4 h-4 bg-white rounded-sm"></div>
        		</div>
        		<div>
          			<p class="font-black text-[#001D3D] leading-tight">Cuentas Claras</p>
          			<p class="text-[9px] font-bold uppercase tracking-widest text-slate-400">
            			{{ subtitulo }}
          			</p>
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
      		<button
        		@click="$emit('irAPerfil')"
        		class="w-full flex items-center gap-3 px-2 py-2 mb-1 rounded-xl hover:bg-slate-50 transition-colors group"
      		>
        		<div class="w-8 h-8 rounded-xl bg-[#001D3D] flex items-center justify-center text-white text-xs font-black flex-shrink-0 group-hover:bg-[#00B4B4] transition-colors">
          			{{ usuario.inicial }}
        		</div>
        		<div class="min-w-0 text-left">
          			<p class="text-xs font-bold text-slate-700 truncate group-hover:text-[#00B4B4] transition-colors">{{ usuario.nombre }}</p>
          			<p class="text-[10px] text-slate-400 truncate">Ver perfil</p>
        		</div>
      		</button>
      		<button
        		@click="$emit('logout')"
        		class="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
      		>
        		<LogOut :size="15" />
        		Cerrar sesion
      		</button>
    	</div>
  	</aside>
</template>