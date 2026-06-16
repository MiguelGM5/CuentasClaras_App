<template>
	<div class="space-y-6">
		<!-- HEADER -->
		<div class="mb-8">
			<h1 class="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
				<Zap class="text-amber-500" :size="32" /> Herramientas Pro
			</h1>
			<p class="text-sm text-slate-400 mt-1">Llevá tus finanzas al siguiente nivel con utilidades avanzadas.</p>
		</div>

		<!-- KPIs PREMIUM -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
			<div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
				<div class="p-4 bg-teal-50 rounded-2xl text-[#00B4B4] shadow-inner">
					<Wallet :size="28" />
				</div>
				<div>
					<p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Prestado con
						Pagaré</p>
					<p class="text-3xl font-black text-slate-800">$14,500.00</p>
				</div>
			</div>

			<div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
				<div class="p-4 bg-amber-50 rounded-2xl text-amber-500 shadow-inner">
					<TrendingUp :size="28" />
				</div>
				<div>
					<p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Rendimiento Estimado
					</p>
					<p class="text-3xl font-black text-emerald-600">+$1,250.00</p>
				</div>
			</div>
		</div>

		<!-- HERRAMIENTAS (Tarjetas Accionables) -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div
				class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between gap-6 hover:border-teal-200 transition-colors group">
				<div>
					<h3 class="font-black text-slate-800 text-lg flex items-center gap-2 mb-2">
						<Calculator class="text-[#00B4B4]" :size="20" /> Simulador de Interés
					</h3>
					<p class="text-slate-500 text-sm leading-relaxed">
						Calculá cuánto debés cobrar de forma justa y legal si tu cuate se retrasa en la fecha acordada
						del pagaré.
					</p>
				</div>
				<button
					class="text-[#00B4B4] bg-teal-50 hover:bg-teal-100 px-4 py-2.5 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors w-full sm:w-auto self-start">
					Iniciar simulación &rarr;
				</button>
			</div>

			<div
				class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between gap-6 hover:border-amber-200 transition-colors group">
				<div>
					<h3 class="font-black text-slate-800 text-lg flex items-center gap-2 mb-2">
						<Download class="text-amber-500" :size="20" /> Exportar Reportes
					</h3>
					<p class="text-slate-500 text-sm leading-relaxed">
						Descargá el historial completo de tus préstamos ordenados, listos para presentar aclaraciones o
						llevar el control contable.
					</p>
				</div>
				<button
					class="text-amber-600 bg-amber-50 hover:bg-amber-100 px-4 py-2.5 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors w-full sm:w-auto self-start">
					Descargar Excel / PDF &rarr;
				</button>
			</div>
		</div>

	</div>
</template>

<script setup>
import { Calculator, Download, Wallet, TrendingUp, Zap } from 'lucide-vue-next';
</script>