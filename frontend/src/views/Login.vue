<script setup>
	import { Mail, Lock, Facebook, Apple, Chrome } from 'lucide-vue-next';
	import { useRouter } from 'vue-router';

	const router = useRouter()
</script>

<template>
  	<div class="min-h-screen flex items-center justify-center bg-white p-4 font-sans">
    	<div class="flex w-full max-w-6xl bg-white overflow-hidden">
			<div class="hidden lg:flex w-1/2 flex-col justify-center items-center p-12 bg-[#F9FAFF]">
				<div class="self-start mb-8 flex items-center gap-2">
					<div class="bg-[#009291] p-1 rounded-lg">
						<div class="w-5 h-5 bg-white rounded-sm"></div>
					</div>
					<span class="font-bold text-2xl text-[#001D3D]">Cuentas Claras</span>
				</div>
				<img 
					src="https://img.freepik.com/free-vector/digital-lifestyle-concept-illustration_114360-7327.jpg" 
					alt="FinanXpress Illustration" 
					class="w-full max-w-md" 
				/>
			</div>

			<div class="w-full lg:w-1/2 p-8 lg:p-24 flex flex-col justify-center">
				<h1 class="text-4xl font-bold text-gray-900 mb-2">Iniciar sesión</h1>
				<p class="text-gray-500 mb-1 text-lg">Tus finanzas y prestamos informales en una sola app</p>
				<p class="mb-10 text-sm">
					¿No tienes cuenta? 
					<RouterLink to="/registro" class="text-[#00B4B4] font-semibold hover:underline cursor-pointer">
						¡Puedes crear una cuenta aquí!
					</RouterLink>
				</p>

				<form class="space-y-6" @submit.prevent>
					<div class="border-b-2 border-[#00B4B4] py-2">
						<label class="block text-xs text-gray-400 uppercase font-bold tracking-wider">Correo electrónico</label>
						<div class="flex items-center gap-3">
							<Mail :size="18" class="text-gray-400" />
							<input 
								type="email" 
								placeholder="Ingresa tu correo electrónico" 
								class="w-full outline-none text-gray-700 py-1 bg-transparent" 
							/>
						</div>
					</div>

					<div class="border-b-2 border-gray-100 py-2 focus-within:border-[#00B4B4] transition-colors">
						<label class="block text-xs text-gray-400 uppercase font-bold tracking-wider">Contraseña</label>
						<div class="flex items-center gap-3">
							<Lock :size="18" class="text-gray-400" />
							<input 
								type="password" 
								placeholder="Ingresa tu contraseña" 
								class="w-full outline-none text-gray-700 py-1 bg-transparent" 
							/>
						</div>
					</div>

					<button class="w-full bg-[#00B4B4] text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-100 hover:bg-[#009291] transition-all transform hover:-translate-y-1">
						Iniciar sesión
					</button>
				</form>

				<div class="mt-12 text-center">
					<p class="text-gray-400 text-xs mb-6 uppercase tracking-[0.2em] font-semibold">Continúa con</p>
					<div class="flex justify-center gap-6">
						<button class="p-3 rounded-full border border-gray-100 hover:bg-gray-50 transition-colors">
							<Facebook :size="24" class="text-blue-600" />
						</button>
						<button class="p-3 rounded-full border border-gray-100 hover:bg-gray-50 transition-colors">
							<Apple :size="24" class="text-black" />
						</button>
						<button class="p-3 rounded-full border border-gray-100 hover:bg-gray-50 transition-colors">
							<Chrome :size="24" class="text-red-500" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
