<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import {
    Target, PieChart, CreditCard, TrendingUp,
    Check, X, ChevronDown, ArrowRight, Menu, Shield
} from 'lucide-vue-next';

// Navbar scroll
const scrolled = ref(false);
const menuAbierto = ref(false);

const onScroll = () => { scrolled.value = window.scrollY > 20; };
onMounted(() => window.addEventListener('scroll', onScroll));
onUnmounted(() => window.removeEventListener('scroll', onScroll));

// Scroll suave a secciones
const irA = (id) => {
    menuAbierto.value = false;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

// Datos del hero animado
const saldoVisible = ref(false);
onMounted(() => setTimeout(() => (saldoVisible.value = true), 400));

const features = [
    {
        icon: Target,
        titulo: 'Metas de Ahorro',
        desc: 'Define cuanto quieres ahorrar y para cuando. Ve tu progreso en tiempo real con barras visuales que te mantienen enfocado.',
        color: 'bg-teal-50',
        iconColor: 'text-[#00B4B4]'
    },
    {
        icon: PieChart,
        titulo: 'Gastos por Categoria',
        desc: 'Registra cada gasto y clasificalo. La grafica de pastel te muestra de un vistazo en que se va tu dinero cada mes.',
        color: 'bg-blue-50',
        iconColor: 'text-blue-500'
    },
    {
        icon: CreditCard,
        titulo: 'Prestamos Informales',
        desc: 'Nunca pierdas de vista quien te debe y a quien le debes. Registro simple: persona, monto, fecha y estado.',
        color: 'bg-violet-50',
        iconColor: 'text-violet-500'
    },
    {
        icon: TrendingUp,
        titulo: 'Analisis Premium',
        desc: 'Accede al historico completo, exporta reportes y recibe recomendaciones inteligentes basadas en tus habitos.',
        color: 'bg-amber-50',
        iconColor: 'text-amber-500'
    }
];

const planesConfig = [
    {
        nombre: 'Gratuito',
        precio: '$0',
        periodo: 'para siempre',
        descripcion: 'Ideal para empezar a ordenar tus finanzas sin compromiso.',
        cta: 'Crear cuenta gratis',
        ruta: '/registro',
        destacado: false,
        items: [
            { texto: 'Metas de ahorro', incluido: true },
            { texto: 'Registro de gastos por categoria', incluido: true },
            { texto: 'Prestamos informales', incluido: true },
            { texto: 'Analiticas del mes actual', incluido: true },
            { texto: 'Historico completo', incluido: false },
            { texto: 'Reportes exportables', incluido: false },
            { texto: 'Analisis Personalizado', incluido: false },
        ]
    },
    {
        nombre: 'Premium',
        precio: '$99',
        periodo: 'por mes',
        descripcion: 'Para quienes toman sus finanzas en serio y quieren el panorama completo.',
        cta: 'Empezar Premium',
        ruta: '/registro',
        destacado: true,
        items: [
            { texto: 'Todo lo del plan Gratuito', incluido: true },
            { texto: 'Historico completo sin limites', incluido: true },
            { texto: 'Pagares exportables en PDF', incluido: true },
            { texto: 'Analisis Personalizado', incluido: true },
            { texto: 'Funciones Exclusivas', incluido: true },
            { texto: 'Soporte prioritario', incluido: true },
            { texto: 'Acceso anticipado a nuevas funciones', incluido: true },
        ]
    }
];
</script>

<template>
    <div class="min-h-screen bg-[#F8FAFC] font-sans antialiased">

        <!-- ══════════════════════════════════════ -->
        <!-- NAVBAR                                 -->
        <!-- ══════════════════════════════════════ -->
        <header
            class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            :class="scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-100' : 'bg-transparent'"
        >
            <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <!-- Logo -->
                <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
                    <img 
                        src="../../assets/LogoRecortado.png" 
                        alt="Icono Nivel Pro" 
                        class="h-10 w-auto object-contain"
                    />
                </div>
                    <span class="font-black text-[#001D3D] text-lg leading-tight">Cuentas Claras</span>
                </div>

                <!-- Nav links desktop -->
                <nav class="hidden md:flex items-center gap-7">
                    <button @click="irA('features')" class="text-sm font-semibold text-slate-500 hover:text-[#001D3D] transition-colors">Funciones</button>
                    <button @click="irA('precios')"  class="text-sm font-semibold text-slate-500 hover:text-[#001D3D] transition-colors">Precios</button>
                </nav>

                <!-- CTAs desktop -->
                <div class="hidden md:flex items-center gap-3">
                    <RouterLink to="/login"
                        class="text-sm font-bold text-slate-600 hover:text-[#001D3D] px-4 py-2 rounded-xl hover:bg-slate-100 transition-all">
                        Iniciar sesion
                    </RouterLink>
                    <RouterLink to="/registro"
                        class="text-sm font-black text-white bg-[#00B4B4] hover:bg-[#009291] px-4 py-2 rounded-xl shadow-md shadow-teal-100 transition-all flex items-center gap-1.5">
                        Registrarse <ArrowRight :size="14" />
                    </RouterLink>
                </div>

                <!-- Hamburger mobile -->
                <button @click="menuAbierto = !menuAbierto" class="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500">
                    <Menu :size="20" />
                </button>
            </div>

            <!-- Menu mobile -->
            <div v-if="menuAbierto" class="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-2 shadow-lg">
                <button @click="irA('features')" class="block w-full text-left text-sm font-semibold text-slate-600 py-2.5 px-3 rounded-xl hover:bg-slate-50">Funciones</button>
                <button @click="irA('precios')"  class="block w-full text-left text-sm font-semibold text-slate-600 py-2.5 px-3 rounded-xl hover:bg-slate-50">Precios</button>
                <div class="pt-2 border-t border-slate-100 flex flex-col gap-2">
                    <RouterLink to="/login"   class="text-sm font-bold text-slate-600 py-2.5 px-3 rounded-xl border border-slate-200 text-center">Iniciar sesion</RouterLink>
                    <RouterLink to="/registro" class="text-sm font-black text-white bg-[#00B4B4] py-2.5 px-3 rounded-xl text-center">Registrarse</RouterLink>
                </div>
            </div>
        </header>

        <!-- ══════════════════════════════════════ -->
        <!-- HERO                                   -->
        <!-- ══════════════════════════════════════ -->
        <section class="relative min-h-screen flex items-center overflow-hidden pt-16">

            <!-- Fondo con gradiente sutil -->
            <div class="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-white to-teal-50/40 pointer-events-none"></div>
            <!-- Blob decorativo -->
            <div class="absolute top-1/4 right-0 w-96 h-96 bg-[#00B4B4]/8 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute bottom-1/4 left-0 w-72 h-72 bg-[#001D3D]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div class="relative max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 items-center py-20">

                <!-- Texto -->
                <div>
                    <span class="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 text-[#009291] text-xs font-black px-3 py-1.5 rounded-full mb-6">
                        <span class="w-1.5 h-1.5 bg-[#00B4B4] rounded-full animate-pulse"></span>
                        Control financiero para todos
                    </span>

                    <h1 class="text-5xl lg:text-6xl font-black text-[#001D3D] leading-[1.05] tracking-tight mb-6">
                        Tu dinero,<br/>
                        <span class="text-[#00B4B4]">tus reglas.</span>
                    </h1>

                    <p class="text-lg text-slate-500 font-medium leading-relaxed mb-8 max-w-md">
                        Registra gastos, define metas de ahorro y controla prestamos informales. Sin complicaciones, sin letra chica.
                    </p>

                    <div class="flex flex-wrap gap-3">
                        <RouterLink to="/registro"
                            class="flex items-center gap-2 bg-[#001D3D] hover:bg-[#002a57] text-white font-black px-6 py-3.5 rounded-2xl text-sm shadow-lg shadow-slate-200 transition-all">
                            Empieza gratis
                            <ArrowRight :size="16" />
                        </RouterLink>
                        <RouterLink to="/login"
                            class="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold px-6 py-3.5 rounded-2xl text-sm shadow-sm transition-all">
                            Ya tengo cuenta
                        </RouterLink>
                    </div>

                    <p class="text-xs text-slate-400 font-medium mt-4">
                        Sin tarjeta de credito. Gratis para siempre en el plan basico.
                    </p>
                </div>

                <!-- Tarjeta animada del producto (firma visual) -->
                <div class="flex justify-center lg:justify-end">
                    <div class="relative w-80">

                        <!-- Card principal: saldo -->
                        <div
                            class="bg-[#001D3D] rounded-3xl p-6 text-white shadow-2xl shadow-slate-900/20 transition-all duration-700"
                            :class="saldoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
                        >
                            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Saldo actual</p>
                            <p class="text-4xl font-black mb-5">$18,450</p>

                            <div class="grid grid-cols-2 gap-3">
                                <div class="bg-white/8 rounded-2xl p-3">
                                    <p class="text-[10px] font-bold text-emerald-400 uppercase mb-1">Ingresos</p>
                                    <p class="text-lg font-black">$24,000</p>
                                </div>
                                <div class="bg-white/8 rounded-2xl p-3">
                                    <p class="text-[10px] font-bold text-orange-400 uppercase mb-1">Gastos</p>
                                    <p class="text-lg font-black">$5,550</p>
                                </div>
                            </div>
                        </div>

                        <!-- Card flotante: meta de ahorro -->
                        <div
                            class="absolute -bottom-8 -left-8 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 w-52 transition-all duration-700 delay-300"
                            :class="saldoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
                        >
                            <div class="flex items-center gap-2 mb-2">
                                <div class="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center">
                                    <Target :size="13" class="text-[#00B4B4]" />
                                </div>
                                <p class="text-xs font-black text-slate-700">Viaje a Cancun</p>
                            </div>
                            <div class="flex justify-between text-[10px] text-slate-400 mb-1.5 font-bold">
                                <span>$3,200 ahorrados</span>
                                <span>64%</span>
                            </div>
                            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full rounded-full bg-gradient-to-r from-[#009291] to-[#00D4D4]" style="width: 64%; transition: width 1.2s ease 0.8s;"></div>
                            </div>
                        </div>

                        <!-- Badge flotante: prestamo -->
                        <div
                            class="absolute -top-5 -right-5 bg-white rounded-2xl px-3 py-2.5 shadow-lg border border-slate-100 transition-all duration-700 delay-500"
                            :class="saldoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'"
                        >
                            <p class="text-[10px] font-bold text-slate-400 uppercase">Prestamo registrado</p>
                            <p class="text-sm font-black text-slate-800">Carlos te debe $500</p>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Flecha de scroll -->
            <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-300">
                <span class="text-[10px] font-bold uppercase tracking-widest">Descubre mas</span>
                <ChevronDown :size="18" class="animate-bounce" />
            </div>
        </section>

        <!-- ══════════════════════════════════════ -->
        <!-- FEATURES                               -->
        <!-- ══════════════════════════════════════ -->
        <section id="features" class="py-24 bg-white">
            <div class="max-w-6xl mx-auto px-6">

                <!-- Header -->
                <div class="text-center mb-16">
                    <span class="text-xs font-black text-[#00B4B4] uppercase tracking-widest">Funcionalidades</span>
                    <h2 class="text-4xl font-black text-[#001D3D] mt-2 mb-4">Todo lo que necesitas,<br/>nada que no uses</h2>
                    <p class="text-slate-400 font-medium max-w-md mx-auto">Herramientas disenadas para la realidad de las finanzas personales en Mexico.</p>
                </div>

                <!-- Grid de features -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div
                        v-for="(feature, i) in features"
                        :key="i"
                        class="group flex gap-5 p-6 rounded-2xl border border-slate-100 hover:border-teal-100 hover:shadow-md transition-all duration-300 cursor-default"
                    >
                        <div :class="[feature.color, 'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300']">
                            <component :is="feature.icon" :size="20" :class="feature.iconColor" />
                        </div>
                        <div>
                            <h3 class="font-black text-[#001D3D] mb-1.5">{{ feature.titulo }}</h3>
                            <p class="text-sm text-slate-400 font-medium leading-relaxed">{{ feature.desc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ══════════════════════════════════════ -->
        <!-- PLANES Y PRECIOS                       -->
        <!-- ══════════════════════════════════════ -->
        <section id="precios" class="py-24 bg-[#F8FAFC]">
            <div class="max-w-6xl mx-auto px-6">

                <!-- Header -->
                <div class="text-center mb-16">
                    <span class="text-xs font-black text-[#00B4B4] uppercase tracking-widest">Planes</span>
                    <h2 class="text-4xl font-black text-[#001D3D] mt-2 mb-4">Empieza gratis,<br/>escala cuando quieras</h2>
                    <p class="text-slate-400 font-medium max-w-md mx-auto">Sin contratos anuales. Sin sorpresas. Cambia de plan cuando lo necesites.</p>
                </div>

                <!-- Cards de planes -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    <div
                        v-for="plan in planesConfig"
                        :key="plan.nombre"
                        class="rounded-3xl p-8 flex flex-col transition-all duration-300"
                        :class="plan.destacado
                            ? 'bg-[#001D3D] text-white shadow-2xl shadow-slate-900/20 scale-[1.02]'
                            : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'"
                    >
                        <!-- Nombre y descripcion -->
                        <div class="mb-6">
                            <div class="flex items-center justify-between mb-3">
                                <p class="font-black text-lg" :class="plan.destacado ? 'text-white' : 'text-[#001D3D]'">
                                    {{ plan.nombre }}
                                </p>
                                <span v-if="plan.destacado" class="bg-[#00B4B4] text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                                    POPULAR
                                </span>
                            </div>
                            <div class="flex items-end gap-1 mb-3">
                                <span class="text-4xl font-black" :class="plan.destacado ? 'text-white' : 'text-[#001D3D]'">{{ plan.precio }}</span>
                                <span class="text-sm pb-1 font-medium" :class="plan.destacado ? 'text-slate-400' : 'text-slate-400'">{{ plan.periodo }}</span>
                            </div>
                            <p class="text-sm font-medium leading-relaxed" :class="plan.destacado ? 'text-slate-400' : 'text-slate-500'">
                                {{ plan.descripcion }}
                            </p>
                        </div>

                        <!-- Divider -->
                        <div class="h-px mb-6" :class="plan.destacado ? 'bg-white/10' : 'bg-slate-100'"></div>

                        <!-- Lista de items -->
                        <ul class="space-y-3 mb-8 flex-1">
                            <li v-for="item in plan.items" :key="item.texto" class="flex items-center gap-3 text-sm">
                                <div class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                    :class="item.incluido
                                        ? (plan.destacado ? 'bg-[#00B4B4]/20' : 'bg-teal-50')
                                        : (plan.destacado ? 'bg-white/5' : 'bg-slate-50')"
                                >
                                    <component
                                        :is="item.incluido ? Check : X"
                                        :size="11"
                                        :class="item.incluido
                                            ? 'text-[#00B4B4]'
                                            : (plan.destacado ? 'text-slate-600' : 'text-slate-300')"
                                        stroke-width="3"
                                    />
                                </div>
                                <span :class="item.incluido
                                    ? (plan.destacado ? 'text-slate-200' : 'text-slate-700')
                                    : (plan.destacado ? 'text-slate-600' : 'text-slate-300')"
                                    class="font-medium"
                                >
                                    {{ item.texto }}
                                </span>
                            </li>
                        </ul>

                        <!-- CTA -->
                        <RouterLink
                            :to="plan.ruta"
                            class="block text-center font-black text-sm py-3.5 rounded-2xl transition-all"
                            :class="plan.destacado
                                ? 'bg-[#00B4B4] hover:bg-[#009291] text-white shadow-lg shadow-teal-900/30'
                                : 'bg-slate-50 hover:bg-slate-100 text-[#001D3D] border border-slate-200'"
                        >
                            {{ plan.cta }}
                        </RouterLink>
                    </div>
                </div>

                <!-- Nota de seguridad -->
                <div class="flex items-center justify-center gap-2 mt-10 text-slate-400">
                    <Shield :size="14" />
                    <p class="text-xs font-medium">Pago seguro. Cancela en cualquier momento. Sin permanencia.</p>
                </div>
            </div>
        </section>

        <!-- ══════════════════════════════════════ -->
        <!-- FOOTER                                 -->
        <!-- ══════════════════════════════════════ -->
        <footer class="bg-[#001D3D] text-white">
            <div class="max-w-6xl mx-auto px-6 py-14">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

                    <!-- Brand -->
                    <div>
                        <div class="flex items-center gap-2.5 mb-4">
                            <div class="w-8 h-8 bg-[#00B4B4] rounded-xl flex items-center justify-center">
                                <div class="w-3.5 h-3.5 bg-white rounded-sm"></div>
                            </div>
                            <span class="font-black text-lg">Cuentas Claras</span>
                        </div>
                        <p class="text-sm text-slate-400 font-medium leading-relaxed max-w-xs">
                            Finanzas personales simples y sin complicaciones. Hecho en Mexico para personas reales.
                        </p>
                    </div>

                    <!-- Links producto -->
                    <div>
                        <p class="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Producto</p>
                        <ul class="space-y-3">
                            <li><button @click="irA('features')" class="text-sm font-medium text-slate-300 hover:text-white transition-colors">Funciones</button></li>
                            <li><button @click="irA('precios')"  class="text-sm font-medium text-slate-300 hover:text-white transition-colors">Precios</button></li>
                            <li><RouterLink to="/registro" class="text-sm font-medium text-slate-300 hover:text-white transition-colors">Crear cuenta</RouterLink></li>
                            <li><RouterLink to="/login" class="text-sm font-medium text-slate-300 hover:text-white transition-colors">Iniciar sesion</RouterLink></li>
                        </ul>
                    </div>

                    <!-- Links legales -->
                    <div>
                        <p class="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Legal</p>
                        <ul class="space-y-3">
                            <li><a href="#" class="text-sm font-medium text-slate-300 hover:text-white transition-colors">Terminos de uso</a></li>
                            <li><a href="#" class="text-sm font-medium text-slate-300 hover:text-white transition-colors">Privacidad</a></li>
                            <li><a href="#" class="text-sm font-medium text-slate-300 hover:text-white transition-colors">Cookies</a></li>
                        </ul>
                    </div>
                </div>

                <!-- Linea base -->
                <div class="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p class="text-xs text-slate-500 font-medium">
                        {{ new Date().getFullYear() }} Cuentas Claras. Todos los derechos reservados.
                    </p>
                    <p class="text-xs text-slate-500 font-medium">
                        Hecho con cuidado para tu bolsillo
                    </p>
                </div>
            </div>
        </footer>

    </div>
</template>
