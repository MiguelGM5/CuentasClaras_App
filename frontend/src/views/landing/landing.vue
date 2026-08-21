<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { RouterLink } from "vue-router";
import {
    Target, PieChart, CreditCard, TrendingUp,
    Check, X, ChevronDown, ChevronUp, ArrowRight, Menu, Shield,
    Sparkles, FileSignature, Lock, CheckCircle2, Zap
} from "lucide-vue-next";

// ── NAVEGACIÓN Y SCROLL SPY (APPLE LIQUID GLASS) ─────────
const scrolled = ref(false);
const menuAbierto = ref(false);
const seccionActiva = ref("");

const navItems = [
    { id: "demo", label: "Cómo Funciona" },
    { id: "simulador", label: "Simulador" },
    { id: "features", label: "Herramientas" },
    { id: "precios", label: "Precios" },
    { id: "faq", label: "Preguntas" }
];

const actualizarScrollYSeccion = () => {
    const scrollY = window.scrollY;
    scrolled.value = scrollY > 20;

    // Si está arriba en el hero
    if (scrollY < 200) {
        seccionActiva.value = "";
        return;
    }

    // Scroll spy: verificar qué sección está actualmente en vista
    const secciones = ["faq", "precios", "features", "simulador", "demo"];
    for (const id of secciones) {
        const el = document.getElementById(id);
        if (el) {
            const rect = el.getBoundingClientRect();
            // Margen de detección para activar la pestaña correspondiente
            if (rect.top <= 280 && rect.bottom >= 140) {
                seccionActiva.value = id;
                return;
            }
        }
    }
};

onMounted(() => {
    window.addEventListener("scroll", actualizarScrollYSeccion, { passive: true });
    actualizarScrollYSeccion();
});

onUnmounted(() => {
    window.removeEventListener("scroll", actualizarScrollYSeccion);
});

const irA = (id) => {
    menuAbierto.value = false;
    seccionActiva.value = id;
    const el = document.getElementById(id);
    if (el) {
        const offset = 85;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
};

// ── HERO: ANIMACIÓN DE ENTRADA ───────────────────────────
const animado = ref(false);
onMounted(() => {
    setTimeout(() => {
        animado.value = true;
    }, 150);
});

// ── SIMULADOR INTERACTIVO DE AHORRO ──────────────────────
const ingresoMensual = ref(18000);
const porcentajeAhorro = ref(20);

const necesidadesMonto = computed(() => Math.round(ingresoMensual.value * 0.50));
const deseosMonto = computed(() => Math.round(ingresoMensual.value * 0.30));
const ahorroMensualMonto = computed(() => Math.round((ingresoMensual.value * porcentajeAhorro.value) / 100));
const ahorroAnualMonto = computed(() => ahorroMensualMonto.value * 12);
const ahorroCincoAnios = computed(() => ahorroMensualMonto.value * 60);

// ── DEMO INTERACTIVA DEL PRODUCTO ─────────────────────────
const tabActivaDemo = ref("metas");

const tabsDemo = [
    { id: "metas", label: "Metas de Ahorro", icon: Target, badge: "Fácil" },
    { id: "pagares", label: "Pagarés con Firma", icon: FileSignature, badge: "Exclusivo" },
    { id: "gastos", label: "Control de Gastos", icon: PieChart, badge: "Visual" },
    { id: "prestamos", label: "Préstamos", icon: CreditCard, badge: "Al Día" }
];

// ── PLANES Y PRECIOS (FACTURACIÓN MENSUAL) ───────────────
const planesConfig = [
    {
        nombre: "Gratuito",
        precio: "$0",
        periodo: "para siempre",
        subtitulo: "Todo lo necesario para organizar tu dinero día a día sin gastar un centavo.",
        cta: "Comenzar Gratis",
        ruta: "/registro",
        destacado: false,
        items: [
            { texto: "Registro ilimitado de ingresos y gastos", incluido: true },
            { texto: "Metas de ahorro con barras de avance visual", incluido: true },
            { texto: "Control de préstamos entre amigos (debo / me deben)", incluido: true },
            { texto: "Gráficas claras de tus gastos por categoría", incluido: true },
            { texto: "Resumen de tus ingresos", incluido: true },
            { texto: "Crear pagarés con firma digital en pantalla", incluido: false },
            { texto: "Descargar pagarés en formato PDF listos para imprimir", incluido: false },
            { texto: "Soporte personalizado prioritario", incluido: false }
        ]
    },
    {
        nombre: "Premium",
        precio: "$99",
        periodo: "al mes",
        subtitulo: "Para quienes prestan dinero, cobran intereses o quieren respaldo total.",
        cta: "Obtener Premium",
        ruta: "/registro",
        destacado: true,
        items: [
            { texto: "Todo lo incluido en el Plan Gratuito", incluido: true },
            { texto: "Crear pagarés con firma digital en pantalla", incluido: true },
            { texto: "Descargar pagarés en PDF formal con un solo clic", incluido: true },
            { texto: "Cálculo automático de intereses si se atrasan en pagarte", incluido: true },
            { texto: "Historial completo de movimientos sin límites", incluido: true },
            { texto: "Comprobantes de pago descargables", incluido: true },
            { texto: "Soporte prioritario y atención personalizada", incluido: true }
        ]
    }
];

// ── PREGUNTAS FRECUENTES (FAQ EN LENGUAJE SENCILLO) ───────
const faqAbierta = ref(0);
const toggleFaq = (index) => {
    faqAbierta.value = faqAbierta.value === index ? null : index;
};

const faqs = [
    {
        pregunta: "¿Es realmente gratis usar Cuentas Claras?",
        respuesta: "¡Sí, totalmente! Puedes registrarte sin ingresar ninguna tarjeta. Tendrás acceso inmediato para registrar tus ingresos, gastos del día, crear metas de ahorro y llevar la cuenta de préstamos con conocidos sin pagar nada."
    },
    {
        pregunta: "¿Cómo funcionan los pagarés con firma en pantalla?",
        respuesta: "Con el Plan Premium puedes generar un pagaré formal en segundos: anotas a quién le prestas, la cantidad y la fecha acordada. La persona firma directamente en la pantalla de tu celular o computadora con su dedo o mouse, y el sistema crea al momento un documento en PDF listo para guardar, enviar por WhatsApp o imprimir."
    },
    {
        pregunta: "¿Mi información y mis cuentas están seguras?",
        respuesta: "Completamente. Tu información viaja protegida con los candados de seguridad más estrictos de internet y tu contraseña se guarda de forma secreta. Solo tú tienes acceso a tu cuenta y a tus datos personales."
    },
    {
        pregunta: "¿Puedo cancelar Premium cuando yo quiera?",
        respuesta: "Sí, cuando tú decidas desde tu perfil y con un solo clic. No hay plazos forzosos, ni contratos, ni penalizaciones de ningún tipo."
    },
    {
        pregunta: "¿Puedo usar la aplicación desde mi celular o tablet?",
        respuesta: "¡Claro que sí! Puedes entrar desde el navegador de cualquier celular, tablet o computadora sin necesidad de descargar aplicaciones pesadas. Todo se adapta automáticamente a tu pantalla para que lo uses con total comodidad."
    }
];
</script>

<template>
    <div class="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-800 selection:bg-[#00B4B4]/20 selection:text-[#001D3D] overflow-x-hidden">

        <!-- ══════════════════════════════════════ -->
        <!-- NAVBAR (APPLE LIQUID GLASS)            -->
        <!-- ══════════════════════════════════════ -->
        <header
            class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            :class="scrolled 
                ? 'bg-white/75 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,29,61,0.06)] border-b border-white/60 py-3' 
                : 'bg-transparent py-5'"
        >
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                
                <!-- Logo con branding -->
                <RouterLink to="/" class="flex items-center gap-3 group">
                    <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#001D3D] to-[#003566] p-2 flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform">
                        <img 
                            src="../../assets/LogoRecortado.png" 
                            alt="Cuentas Claras" 
                            class="h-full w-auto object-contain brightness-0 invert"
                        />
                    </div>
                    <div class="flex flex-col">
                        <span class="font-black text-xl text-[#001D3D] tracking-tight group-hover:text-[#00B4B4] transition-colors leading-none">
                            Cuentas Claras
                        </span>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                            Finanzas Personales
                        </span>
                    </div>
                </RouterLink>

                <!-- Enlaces de navegación desktop (Cápsula Apple Liquid Glass) -->
                <nav class="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-white/55 backdrop-blur-2xl border border-white/85 shadow-[0_8px_32px_rgba(0,29,61,0.08),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1)] ring-1 ring-slate-900/5 transition-all duration-300">
                    <button 
                        v-for="item in navItems"
                        :key="item.id"
                        @click="irA(item.id)" 
                        class="relative px-4 py-2 rounded-full text-xs transition-all duration-300 flex items-center gap-2 cursor-pointer select-none"
                        :class="seccionActiva === item.id
                            ? 'bg-white text-[#001D3D] font-black shadow-[0_3px_14px_rgba(0,29,61,0.12),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,1)] ring-1 ring-slate-900/5 scale-102'
                            : 'text-slate-600 hover:text-[#001D3D] hover:bg-white/40 font-bold'"
                    >
                        <!-- Punto de Luz / Glow Activo Iluminado -->
                        <span 
                            v-if="seccionActiva === item.id" 
                            class="w-1.5 h-1.5 rounded-full bg-[#00B4B4] shadow-[0_0_8px_#00B4B4,0_0_2px_#00B4B4] flex-shrink-0 animate-pulse"
                        ></span>
                        <span>{{ item.label }}</span>
                    </button>
                </nav>

                <!-- Botones de Acción (CTAs) -->
                <div class="hidden md:flex items-center gap-3">
                    <RouterLink 
                        to="/login"
                        class="text-xs font-bold text-slate-600 hover:text-[#001D3D] px-4 py-2.5 rounded-xl hover:bg-white/60 transition-all"
                    >
                        Iniciar Sesión
                    </RouterLink>
                    <RouterLink 
                        to="/registro"
                        class="text-xs font-black text-white bg-gradient-to-r from-[#001D3D] via-[#002855] to-[#00B4B4] hover:opacity-95 px-5 py-2.5 rounded-xl shadow-md shadow-teal-900/10 hover:shadow-teal-900/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <span>Crear Cuenta Gratis</span>
                        <ArrowRight :size="14" />
                    </RouterLink>
                </div>

                <!-- Botón Hamburguesa Móvil -->
                <button 
                    @click="menuAbierto = !menuAbierto" 
                    class="md:hidden p-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-slate-700 shadow-xs cursor-pointer"
                    aria-label="Abrir menú"
                >
                    <component :is="menuAbierto ? X : Menu" :size="20" />
                </button>
            </div>

            <!-- Menú Desplegable Móvil (Liquid Glass) -->
            <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 -translate-y-4"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-4"
            >
                <div v-if="menuAbierto" class="md:hidden bg-white/90 backdrop-blur-2xl border-b border-slate-200/80 px-6 py-5 space-y-2 shadow-2xl">
                    <button 
                        v-for="item in navItems"
                        :key="item.id"
                        @click="irA(item.id)" 
                        class="w-full text-left text-sm py-2.5 px-4 rounded-2xl flex items-center justify-between transition-all"
                        :class="seccionActiva === item.id 
                            ? 'bg-[#001D3D] text-white font-black shadow-md shadow-slate-900/10' 
                            : 'text-slate-700 hover:text-[#001D3D] font-bold hover:bg-slate-100/70'"
                    >
                        <span>{{ item.label }}</span>
                        <span 
                            v-if="seccionActiva === item.id" 
                            class="w-2 h-2 rounded-full bg-[#00B4B4] shadow-[0_0_8px_#00B4B4]"
                        ></span>
                    </button>
                    
                    <div class="pt-4 border-t border-slate-200/60 flex flex-col gap-2.5">
                        <RouterLink to="/login" class="text-sm font-bold text-slate-700 py-3 px-4 rounded-xl border border-slate-200 text-center bg-white/50 hover:bg-white transition-all">
                            Iniciar Sesión
                        </RouterLink>
                        <RouterLink to="/registro" class="text-sm font-black text-white bg-gradient-to-r from-[#001D3D] to-[#00B4B4] py-3 px-4 rounded-xl text-center shadow-md">
                            Crear Cuenta Gratis
                        </RouterLink>
                    </div>
                </div>
            </Transition>
        </header>

        <!-- ══════════════════════════════════════ -->
        <!-- HERO SECTION                           -->
        <!-- ══════════════════════════════════════ -->
        <section class="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden">
            
            <!-- Fondos Ambientales -->
            <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#00B4B4]/15 via-teal-100/20 to-transparent blur-3xl pointer-events-none -z-10 rounded-full"></div>
            <div class="absolute top-1/3 -left-32 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10"></div>
            <div class="absolute bottom-10 -right-20 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    <!-- Copy Principal -->
                    <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
                        
                        <!-- Badge -->
                        <div class="inline-flex items-center gap-2.5 bg-white border border-teal-200/80 shadow-xs px-4 py-1.5 rounded-full">
                            <span class="flex h-2 w-2 relative">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00B4B4] opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-[#00B4B4]"></span>
                            </span>
                            <span class="text-xs font-black text-[#001D3D] tracking-wide">
                                Control de dinero y pagarés digitales
                            </span>
                            <span class="bg-[#00B4B4]/10 text-[#009291] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Fácil y Rápido</span>
                        </div>

                        <!-- Titular -->
                        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-[#001D3D] tracking-tight leading-[1.1]">
                            Tu tranquilidad empieza cuando tienes
                            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00B4B4] via-[#009291] to-[#001D3D]">
                                cuentas claras.
                            </span>
                        </h1>

                        <!-- Subtítulo -->
                        <p class="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Organiza tus ingresos, ahorra para tus metas y formaliza tus préstamos con 
                            <strong class="text-slate-800 font-black"> pagarés con firma en pantalla</strong>. Todo en una sola aplicación sencilla y sin enredos.
                        </p>

                        <!-- Botones de Conversión -->
                        <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                            <RouterLink 
                                to="/registro"
                                class="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#001D3D] hover:bg-[#002a57] text-white font-black text-sm px-8 py-4 rounded-2xl shadow-xl shadow-slate-900/15 hover:shadow-slate-900/25 active:scale-95 transition-all group"
                            >
                                <span>Empezar Gratis</span>
                                <ArrowRight :size="16" class="group-hover:translate-x-1 transition-transform" />
                            </RouterLink>

                            <button 
                                @click="irA('demo')"
                                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm px-6 py-4 rounded-2xl shadow-xs transition-all cursor-pointer"
                            >
                                <Sparkles :size="16" class="text-amber-500" />
                                <span>Ver Cómo Funciona</span>
                            </button>
                        </div>

                        <!-- Micro Trust Indicators -->
                        <div class="pt-6 border-t border-slate-200/70 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-bold text-slate-500">
                            <div class="flex items-center gap-2">
                                <CheckCircle2 :size="16" class="text-emerald-500 flex-shrink-0" />
                                <span>Sin tarjeta de crédito</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <Shield :size="16" class="text-teal-600 flex-shrink-0" />
                                <span>Tus datos 100% privados</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <Zap :size="16" class="text-amber-500 flex-shrink-0" />
                                <span>Listo en 1 minuto</span>
                            </div>
                        </div>

                    </div>

                    <!-- Mockup Dinámico (Columna Derecha) -->
                    <div class="lg:col-span-5 flex justify-center relative">
                        <div class="relative w-full max-w-sm sm:max-w-md">
                            
                            <!-- Tarjeta Principal: Dashboard Dark Navy -->
                            <div 
                                class="bg-gradient-to-b from-[#001D3D] to-[#001529] rounded-3xl p-6 sm:p-7 text-white shadow-2xl shadow-slate-900/30 border border-slate-700/50 transition-all duration-700"
                                :class="animado ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'"
                            >
                                <div class="flex justify-between items-start mb-6">
                                    <div>
                                        <p class="text-[11px] font-black uppercase tracking-widest text-[#00B4B4]">Balance Disponible</p>
                                        <p class="text-3xl sm:text-4xl font-black mt-1">$28,450.00 <span class="text-xs text-slate-400 font-bold">MXN</span></p>
                                    </div>
                                    <div class="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black flex items-center gap-1">
                                        <TrendingUp :size="13" />
                                        Buen control
                                    </div>
                                </div>

                                <!-- Mini Métricas Rápidas -->
                                <div class="grid grid-cols-2 gap-3 mb-5">
                                    <div class="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
                                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ingresos del Mes</p>
                                        <p class="text-base sm:text-lg font-black text-emerald-400 mt-0.5">$36,200</p>
                                    </div>
                                    <div class="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
                                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gastos Totales</p>
                                        <p class="text-base sm:text-lg font-black text-rose-400 mt-0.5">$7,750</p>
                                    </div>
                                </div>

                                <!-- Barra de Progreso de Salud Financiera -->
                                <div class="bg-white/5 border border-white/10 rounded-2xl p-4">
                                    <div class="flex justify-between text-xs font-bold mb-2">
                                        <span class="text-slate-300">Porcentaje de Ahorro</span>
                                        <span class="text-[#00B4B4] font-black">78.5% (Excelente)</span>
                                    </div>
                                    <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div class="h-full bg-gradient-to-r from-[#009291] via-[#00B4B4] to-emerald-400 rounded-full w-[78%]"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- Badge Flotante 1: Meta Activa con Barra -->
                            <div 
                                class="absolute -bottom-6 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-100 w-56 sm:w-64 transition-all duration-700 delay-200"
                                :class="animado ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
                            >
                                <div class="flex items-center gap-3 mb-2.5">
                                    <div class="w-9 h-9 bg-teal-50 text-[#009291] rounded-xl flex items-center justify-center font-black">
                                        <Target :size="18" />
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-xs font-black text-slate-800 truncate">Fondo de Emergencia</p>
                                        <p class="text-[10px] text-slate-400 font-bold">Meta: $20,000 MXN</p>
                                    </div>
                                </div>
                                <div class="flex justify-between text-[11px] font-black text-slate-700 mb-1">
                                    <span>$16,500 ahorrados</span>
                                    <span class="text-[#00B4B4]">82.5%</span>
                                </div>
                                <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-teal-400 to-[#009291] rounded-full w-[82.5%]"></div>
                                </div>
                            </div>

                            <!-- Badge Flotante 2: Pagaré Protegido -->
                            <div 
                                class="absolute -top-6 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-amber-200/80 transition-all duration-700 delay-300 flex items-center gap-3"
                                :class="animado ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'"
                            >
                                <div class="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 font-black">
                                    <FileSignature :size="18" />
                                </div>
                                <div>
                                    <span class="bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">Pagaré Firmado</span>
                                    <p class="text-xs font-black text-slate-800 mt-0.5">$5,000.00 MXN</p>
                                    <p class="text-[10px] font-bold text-slate-400">Vence: 30 de Septiembre</p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- ══════════════════════════════════════ -->
        <!-- SECCIÓN: DEMOSTRACIÓN INTERACTIVA       -->
        <!-- ══════════════════════════════════════ -->
        <section id="demo" class="py-20 bg-white border-y border-slate-200/70 relative">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div class="text-center max-w-3xl mx-auto mb-12">
                    <span class="text-xs font-black text-[#00B4B4] uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                        Cómo Funciona
                    </span>
                    <h2 class="text-3xl sm:text-4xl font-black text-[#001D3D] mt-3 mb-4">
                        Una aplicación pensada para hacerte la vida fácil
                    </h2>
                    <p class="text-slate-500 font-medium text-sm sm:text-base">
                        Elige una opción abajo para ver lo sencillo que es tener el control total de tu dinero.
                    </p>
                </div>

                <!-- Selector de Pestañas -->
                <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
                    <button 
                        v-for="tab in tabsDemo" 
                        :key="tab.id"
                        @click="tabActivaDemo = tab.id"
                        class="flex items-center gap-2.5 px-4 sm:px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all border cursor-pointer"
                        :class="tabActivaDemo === tab.id
                            ? 'bg-[#001D3D] text-white border-[#001D3D] shadow-lg shadow-slate-900/10 scale-102'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'"
                    >
                        <component :is="tab.icon" :size="16" :class="tabActivaDemo === tab.id ? 'text-[#00B4B4]' : 'text-slate-400'" />
                        <span>{{ tab.label }}</span>
                        <span 
                            class="text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase"
                            :class="tabActivaDemo === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'"
                        >
                            {{ tab.badge }}
                        </span>
                    </button>
                </div>

                <!-- Contenedor del Preview Interactivo -->
                <div class="bg-gradient-to-br from-slate-50 to-teal-50/20 border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-lg">
                    
                    <!-- TAB 1: METAS DE AHORRO -->
                    <div v-if="tabActivaDemo === 'metas'" class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div class="space-y-4">
                            <div class="w-12 h-12 bg-teal-100 text-[#009291] rounded-2xl flex items-center justify-center">
                                <Target :size="24" />
                            </div>
                            <h3 class="text-2xl font-black text-[#001D3D]">Ahorra para lo que de verdad quieres</h3>
                            <p class="text-slate-600 text-sm leading-relaxed font-medium">
                                Ya sea para tus vacaciones, arreglar la casa o tu fondo para emergencias, ponte una meta y mira cómo se llena la barra con cada dinero que guardas.
                            </p>
                            <ul class="space-y-2.5 text-xs font-bold text-slate-700">
                                <li class="flex items-center gap-2">
                                    <CheckCircle2 :size="16" class="text-[#00B4B4]" />
                                    <span>Te dice cuánto te falta y qué porcentaje llevas</span>
                                </li>
                                <li class="flex items-center gap-2">
                                    <CheckCircle2 :size="16" class="text-[#00B4B4]" />
                                    <span>Agregas abonos en segundos</span>
                                </li>
                            </ul>
                        </div>
                        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
                            <div class="flex justify-between items-center pb-3 border-b border-slate-100">
                                <span class="text-xs font-black text-slate-700 uppercase">Tus Metas Actuales</span>
                                <span class="text-xs font-bold text-[#009291] bg-teal-50 px-2 py-0.5 rounded-full">3 en progreso</span>
                            </div>
                            <div class="space-y-3">
                                <div>
                                    <div class="flex justify-between text-xs font-bold mb-1">
                                        <span class="text-slate-800">Viaje a la Playa 🏖️</span>
                                        <span class="text-[#00B4B4] font-black">$12,000 / $15,000 (80%)</span>
                                    </div>
                                    <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div class="h-full bg-gradient-to-r from-[#009291] to-[#00D4D4] rounded-full w-[80%]"></div>
                                    </div>
                                </div>
                                <div>
                                    <div class="flex justify-between text-xs font-bold mb-1">
                                        <span class="text-slate-800">Comprar Laptop 💻</span>
                                        <span class="text-indigo-600 font-black">$18,500 / $22,000 (84%)</span>
                                    </div>
                                    <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div class="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full w-[84%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- TAB 2: PAGARÉS CON FIRMA -->
                    <div v-if="tabActivaDemo === 'pagares'" class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div class="space-y-4">
                            <div class="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                                <FileSignature :size="24" />
                            </div>
                            <div class="flex items-center gap-2">
                                <h3 class="text-2xl font-black text-[#001D3D]">Pagarés con Firma en Pantalla</h3>
                                <span class="bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Premium</span>
                            </div>
                            <p class="text-slate-600 text-sm leading-relaxed font-medium">
                                Nunca más prestes dinero de palabra. Haz que la persona firme con su dedo directamente en tu pantalla y obtén un documento en PDF listo para guardar o imprimir.
                            </p>
                            <ul class="space-y-2.5 text-xs font-bold text-slate-700">
                                <li class="flex items-center gap-2">
                                    <CheckCircle2 :size="16" class="text-amber-500" />
                                    <span>Firma táctil desde el celular sin instalar nada extra</span>
                                </li>
                                <li class="flex items-center gap-2">
                                    <CheckCircle2 :size="16" class="text-amber-500" />
                                    <span>Documento PDF formal con fecha y cálculo de intereses</span>
                                </li>
                            </ul>
                        </div>
                        <div class="bg-white rounded-2xl p-6 border border-amber-200 shadow-md space-y-4">
                            <div class="flex justify-between items-center pb-3 border-b border-amber-100">
                                <span class="text-xs font-black text-slate-700 uppercase">Vista de Documento</span>
                                <span class="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Folio #PAG-2026-08</span>
                            </div>
                            <div class="p-3 bg-amber-50/40 rounded-xl border border-dashed border-amber-300 text-xs space-y-2">
                                <p class="text-slate-700 font-serif leading-relaxed italic">
                                    "Debo y pagaré incondicionalmente por este Pagaré a la orden de Cuentas Claras la cantidad de <strong>$8,500.00 MXN</strong>..."
                                </p>
                                <div class="pt-2 border-t border-amber-200 flex justify-between items-end">
                                    <div>
                                        <p class="text-[9px] font-bold text-slate-400 uppercase">Deudor: Roberto Gómez</p>
                                        <p class="text-[9px] font-bold text-slate-400">Interés: 5% Mensual</p>
                                    </div>
                                    <div class="px-3 py-1 bg-white rounded-lg border border-slate-200 text-[10px] font-mono font-bold text-emerald-600 flex items-center gap-1">
                                        <Check :size="12" /> Firmado
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- TAB 3: GASTOS & GRÁFICOS -->
                    <div v-if="tabActivaDemo === 'gastos'" class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div class="space-y-4">
                            <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                                <PieChart :size="24" />
                            </div>
                            <h3 class="text-2xl font-black text-[#001D3D]">Mira a dónde se va tu dinero</h3>
                            <p class="text-slate-600 text-sm leading-relaxed font-medium">
                                Descubre en qué estás gastando más mediante gráficas claras clasificadas por categorías (Comida, Casa, Transporte, Salidas).
                            </p>
                            <ul class="space-y-2.5 text-xs font-bold text-slate-700">
                                <li class="flex items-center gap-2">
                                    <CheckCircle2 :size="16" class="text-blue-500" />
                                    <span>Anota un gasto en dos toques de pantalla</span>
                                </li>
                                <li class="flex items-center gap-2">
                                    <CheckCircle2 :size="16" class="text-blue-500" />
                                    <span>Gráfica de pastel que se actualiza al instante</span>
                                </li>
                            </ul>
                        </div>
                        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
                            <div class="flex justify-between items-center mb-4">
                                <span class="text-xs font-black text-slate-700 uppercase">Gastos por Categoría</span>
                                <span class="text-xs font-black text-slate-800">$6,450.00 Total</span>
                            </div>
                            <div class="space-y-2.5 text-xs font-bold">
                                <div class="flex justify-between items-center p-2 rounded-xl bg-slate-50">
                                    <span class="flex items-center gap-2">
                                        <span class="w-3 h-3 rounded-full bg-[#00B4B4]"></span>
                                        Comida y Despensa
                                    </span>
                                    <span>$2,800 (43%)</span>
                                </div>
                                <div class="flex justify-between items-center p-2 rounded-xl bg-slate-50">
                                    <span class="flex items-center gap-2">
                                        <span class="w-3 h-3 rounded-full bg-blue-500"></span>
                                        Servicios y Casa
                                    </span>
                                    <span>$2,200 (34%)</span>
                                </div>
                                <div class="flex justify-between items-center p-2 rounded-xl bg-slate-50">
                                    <span class="flex items-center gap-2">
                                        <span class="w-3 h-3 rounded-full bg-violet-500"></span>
                                        Transporte y Gasolina
                                    </span>
                                    <span>$1,450 (23%)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- TAB 4: PRÉSTAMOS PERSONALES -->
                    <div v-if="tabActivaDemo === 'prestamos'" class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div class="space-y-4">
                            <div class="w-12 h-12 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center">
                                <CreditCard :size="24" />
                            </div>
                            <h3 class="text-2xl font-black text-[#001D3D]">Control de lo que prestas y te prestan</h3>
                            <p class="text-slate-600 text-sm leading-relaxed font-medium">
                                Lleva la cuenta exacta de a quién le prestaste y a quién le debes. Olvídate de los olvidos y marca como pagado con un solo toque.
                            </p>
                            <ul class="space-y-2.5 text-xs font-bold text-slate-700">
                                <li class="flex items-center gap-2">
                                    <CheckCircle2 :size="16" class="text-violet-500" />
                                    <span>Separación clara entre dinero por cobrar y por pagar</span>
                                </li>
                                <li class="flex items-center gap-2">
                                    <CheckCircle2 :size="16" class="text-violet-500" />
                                    <span>Botón de saldado en 1 clic</span>
                                </li>
                            </ul>
                        </div>
                        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-3">
                            <div class="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex justify-between items-center">
                                <div>
                                    <p class="text-[10px] font-black uppercase text-emerald-700">Me deben</p>
                                    <p class="text-xs font-bold text-slate-800">Carlos Ramírez (Cena)</p>
                                </div>
                                <span class="text-sm font-black text-emerald-600">+$650.00</span>
                            </div>
                            <div class="p-3 bg-rose-50 border border-rose-100 rounded-xl flex justify-between items-center">
                                <div>
                                    <p class="text-[10px] font-black uppercase text-rose-700">Debo</p>
                                    <p class="text-xs font-bold text-slate-800">Andrea López (Boletos)</p>
                                </div>
                                <span class="text-sm font-black text-rose-600">-$420.00</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>

        <!-- ══════════════════════════════════════ -->
        <!-- SIMULADOR INTERACTIVO DE AHORRO        -->
        <!-- ══════════════════════════════════════ -->
        <section id="simulador" class="py-24 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] relative">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div class="text-center max-w-2xl mx-auto mb-14">
                    <span class="text-xs font-black text-[#009291] uppercase tracking-widest bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">
                        Calculadora 50/30/20
                    </span>
                    <h2 class="text-3xl sm:text-4xl font-black text-[#001D3D] mt-3 mb-4">
                        Calcula cuánto podrías ahorrar cada mes
                    </h2>
                    <p class="text-slate-500 font-medium text-sm sm:text-base">
                        Mueve la barra para ver cómo se repartiría tu sueldo de forma sana y cuánto acumularías con el tiempo.
                    </p>
                </div>

                <div class="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl max-w-4xl mx-auto">
                    
                    <!-- Slider de Ingreso -->
                    <div class="space-y-4 mb-8">
                        <div class="flex justify-between items-center">
                            <label class="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
                                Tu Ingreso Mensual:
                            </label>
                            <span class="text-2xl sm:text-3xl font-black text-[#001D3D]">
                                ${{ ingresoMensual.toLocaleString("es-MX") }} <span class="text-xs text-slate-400 font-bold">MXN</span>
                            </span>
                        </div>
                        <input 
                            v-model.number="ingresoMensual" 
                            type="range" 
                            min="5000" 
                            max="100000" 
                            step="1000"
                            class="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#00B4B4]"
                        />
                        <div class="flex justify-between text-[11px] text-slate-400 font-bold">
                            <span>$5,000</span>
                            <span>$50,000</span>
                            <span>$100,000+</span>
                        </div>
                    </div>

                    <!-- Distribución 50/30/20 -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        
                        <div class="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-[10px] font-black uppercase text-slate-400">Necesidades (50%)</span>
                                <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                            </div>
                            <p class="text-xl font-black text-slate-800">${{ necesidadesMonto.toLocaleString("es-MX") }}</p>
                            <p class="text-[10px] text-slate-500 mt-1 font-medium">Casa, comida, servicios y transporte</p>
                        </div>

                        <div class="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-[10px] font-black uppercase text-slate-400">Gustos (30%)</span>
                                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                            </div>
                            <p class="text-xl font-black text-slate-800">${{ deseosMonto.toLocaleString("es-MX") }}</p>
                            <p class="text-[10px] text-slate-500 mt-1 font-medium">Salidas, compras y entretenimiento</p>
                        </div>

                        <div class="bg-teal-50 border border-teal-200 rounded-2xl p-4">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-[10px] font-black uppercase text-[#009291]">Ahorro (20%)</span>
                                <span class="w-2 h-2 rounded-full bg-[#00B4B4]"></span>
                            </div>
                            <p class="text-xl font-black text-[#009291]">${{ ahorroMensualMonto.toLocaleString("es-MX") }}</p>
                            <p class="text-[10px] text-teal-700 mt-1 font-medium">Tu fondo de seguridad o proyectos</p>
                        </div>

                    </div>

                    <!-- Proyecciones a Futuro -->
                    <div class="bg-gradient-to-r from-[#001D3D] to-[#002855] rounded-2xl p-6 text-white flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div>
                            <p class="text-xs font-bold text-teal-300 uppercase tracking-wider mb-1">
                                Proyección con Cuentas Claras
                            </p>
                            <h4 class="text-xl sm:text-2xl font-black">
                                Ahorrarías <span class="text-[#00D4D4]">${{ ahorroAnualMonto.toLocaleString("es-MX") }}</span> en 1 año
                            </h4>
                            <p class="text-xs text-slate-300 font-medium mt-0.5">
                                Y hasta ${{ ahorroCincoAnios.toLocaleString("es-MX") }} en 5 años de constancia.
                            </p>
                        </div>
                        <RouterLink 
                            to="/registro"
                            class="whitespace-nowrap px-6 py-3.5 bg-[#00B4B4] hover:bg-[#009291] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-900/30 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <span>Empezar este Plan</span>
                            <ArrowRight :size="14" />
                        </RouterLink>
                    </div>

                </div>

            </div>
        </section>

        <!-- ══════════════════════════════════════ -->
        <!-- HERRAMIENTAS (BENTO GRID)              -->
        <!-- ══════════════════════════════════════ -->
        <section id="features" class="py-24 bg-white border-t border-slate-200/70">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div class="text-center max-w-3xl mx-auto mb-16">
                    <span class="text-xs font-black text-[#00B4B4] uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                        Herramientas Principales
                    </span>
                    <h2 class="text-3xl sm:text-5xl font-black text-[#001D3D] mt-3 mb-4 tracking-tight">
                        Todo lo que necesitas para tu día a día
                    </h2>
                    <p class="text-slate-500 font-medium text-base">
                        Diseñado para personas que quieren orden, sencillez y no perder el rastro de su dinero.
                    </p>
                </div>

                <!-- Bento Grid Layout -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <!-- Tarjeta 1 (Grande): Pagarés con Firma -->
                    <div class="md:col-span-2 bg-gradient-to-br from-slate-900 to-[#001D3D] text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                        <div class="relative z-10 max-w-md">
                            <span class="bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                Plan Premium
                            </span>
                            <h3 class="text-2xl sm:text-3xl font-black mt-4 mb-2">
                                Pagarés con Firma en Pantalla y Descarga en PDF
                            </h3>
                            <p class="text-slate-300 text-sm font-medium leading-relaxed">
                                Si prestas dinero a amigos, familiares o clientes, haz que firmen directo en tu celular. El sistema genera un PDF listo con fecha y cobro de intereses si se atrasan.
                            </p>
                        </div>
                        <div class="pt-6 flex items-center gap-3 text-xs font-bold text-[#00B4B4]">
                            <span>Descarga en PDF al instante</span>
                            <ArrowRight :size="14" />
                        </div>
                        <div class="absolute -right-8 -bottom-8 w-60 h-60 bg-[#00B4B4]/10 rounded-full blur-2xl pointer-events-none"></div>
                    </div>

                    <!-- Tarjeta 2: Metas -->
                    <div class="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md hover:border-teal-200 transition-all flex flex-col justify-between">
                        <div>
                            <div class="w-12 h-12 bg-teal-50 text-[#009291] rounded-2xl flex items-center justify-center mb-5">
                                <Target :size="24" />
                            </div>
                            <h3 class="text-xl font-black text-[#001D3D] mb-2">Metas de Ahorro</h3>
                            <p class="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                                Ponle nombre a tus proyectos y mira cómo avanza la barra cada vez que ahorras.
                            </p>
                        </div>
                        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
                            <span>Avance 100% visual</span>
                            <CheckCircle2 :size="16" class="text-teal-500" />
                        </div>
                    </div>

                    <!-- Tarjeta 3: Categorías y Gráficos -->
                    <div class="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md hover:border-blue-200 transition-all flex flex-col justify-between">
                        <div>
                            <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5">
                                <PieChart :size="24" />
                            </div>
                            <h3 class="text-xl font-black text-[#001D3D] mb-2">Gráficas de Gastos</h3>
                            <p class="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                                Gráficas fáciles de entender que te muestran en qué categoría estás gastando tu sueldo.
                            </p>
                        </div>
                        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
                            <span>Gráfica de pastel interactiva</span>
                            <CheckCircle2 :size="16" class="text-blue-500" />
                        </div>
                    </div>

                    <!-- Tarjeta 4: Préstamos Personales -->
                    <div class="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md hover:border-violet-200 transition-all flex flex-col justify-between">
                        <div>
                            <div class="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-5">
                                <CreditCard :size="24" />
                            </div>
                            <h3 class="text-xl font-black text-[#001D3D] mb-2">Deudas y Préstamos</h3>
                            <p class="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                                Anota a quién le prestaste o a quién le debes para que nunca se te pase pagar ni cobrar.
                            </p>
                        </div>
                        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
                            <span>Marca como pagado con 1 clic</span>
                            <CheckCircle2 :size="16" class="text-violet-500" />
                        </div>
                    </div>

                    <!-- Tarjeta 5: Privacidad -->
                    <div class="bg-gradient-to-br from-teal-50 to-white rounded-3xl p-8 border border-teal-100 shadow-md flex flex-col justify-between">
                        <div>
                            <div class="w-12 h-12 bg-teal-100 text-[#009291] rounded-2xl flex items-center justify-center mb-5">
                                <Lock :size="24" />
                            </div>
                            <h3 class="text-xl font-black text-[#001D3D] mb-2">Máxima Privacidad</h3>
                            <p class="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                                Tu dinero y tus registros son privados. Tu cuenta está protegida y nadie más puede ver tu información.
                            </p>
                        </div>
                        <div class="mt-6 pt-4 border-t border-teal-100/60 flex items-center justify-between text-xs font-bold text-[#009291]">
                            <span>Tu información protegida</span>
                            <Shield :size="16" class="text-[#00B4B4]" />
                        </div>
                    </div>

                </div>

            </div>
        </section>

        <!-- ══════════════════════════════════════ -->
        <!-- PLANES Y PRECIOS TRANSPARENTES         -->
        <!-- ══════════════════════════════════════ -->
        <section id="precios" class="py-24 bg-[#F8FAFC] border-t border-slate-200/70">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div class="text-center max-w-3xl mx-auto mb-16">
                    <span class="text-xs font-black text-[#00B4B4] uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                        Precios Claros
                    </span>
                    <h2 class="text-3xl sm:text-5xl font-black text-[#001D3D] mt-3 mb-4 tracking-tight">
                        Empieza gratis, cambia a Premium cuando quieras
                    </h2>
                    <p class="text-slate-500 font-medium text-base">
                        Sin contratos forzosos. Sin letras chiquitas. Cancela cuando tú lo decidas.
                    </p>
                </div>

                <!-- Tarjetas de Precios -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
                    
                    <div 
                        v-for="plan in planesConfig" 
                        :key="plan.nombre"
                        class="rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 relative"
                        :class="plan.destacado
                            ? 'bg-[#001D3D] text-white shadow-2xl shadow-slate-900/25 ring-2 ring-[#00B4B4]'
                            : 'bg-white border border-slate-200 text-slate-800 shadow-sm'"
                    >
                        <!-- Badge Popular -->
                        <div v-if="plan.destacado" class="absolute -top-3.5 right-8 bg-gradient-to-r from-[#00B4B4] to-[#009291] text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                            ⭐ MÁS COMPLETO
                        </div>

                        <div>
                            <!-- Header de la Tarjeta -->
                            <div class="flex justify-between items-center mb-2">
                                <h3 class="text-xl font-black" :class="plan.destacado ? 'text-white' : 'text-[#001D3D]'">
                                    {{ plan.nombre }}
                                </h3>
                            </div>

                            <p class="text-xs font-medium mb-6" :class="plan.destacado ? 'text-slate-300' : 'text-slate-500'">
                                {{ plan.subtitulo }}
                            </p>

                            <!-- Precio -->
                            <div class="flex items-baseline gap-1 mb-8 pb-6 border-b" :class="plan.destacado ? 'border-white/10' : 'border-slate-200'">
                                <span class="text-4xl sm:text-5xl font-black" :class="plan.destacado ? 'text-white' : 'text-[#001D3D]'">
                                    {{ plan.precio }}
                                </span>
                                <span class="text-xs font-bold" :class="plan.destacado ? 'text-slate-400' : 'text-slate-400'">
                                    MXN {{ plan.periodo }}
                                </span>
                            </div>

                            <!-- Lista de Características -->
                            <ul class="space-y-3.5 mb-8">
                                <li 
                                    v-for="item in plan.items" 
                                    :key="item.texto"
                                    class="flex items-start gap-3 text-xs sm:text-sm font-medium"
                                >
                                    <div 
                                        class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                        :class="item.incluido
                                            ? (plan.destacado ? 'bg-[#00B4B4]/20 text-[#00B4B4]' : 'bg-teal-50 text-[#009291]' )
                                            : (plan.destacado ? 'bg-white/5 text-slate-600' : 'bg-slate-200 text-slate-400')"
                                    >
                                        <component :is="item.incluido ? Check : X" :size="12" stroke-width="3" />
                                    </div>
                                    <span :class="item.incluido
                                        ? (plan.destacado ? 'text-slate-200 font-semibold' : 'text-slate-700 font-semibold')
                                        : (plan.destacado ? 'text-slate-500 line-through' : 'text-slate-400 line-through')"
                                    >
                                        {{ item.texto }}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <!-- Botón CTA -->
                        <RouterLink 
                            :to="plan.ruta"
                            class="block w-full py-4 rounded-2xl font-black text-center text-sm shadow-md transition-all active:scale-95"
                            :class="plan.destacado
                                ? 'bg-gradient-to-r from-[#00B4B4] to-[#009291] hover:brightness-110 text-white shadow-teal-900/30'
                                : 'bg-white hover:bg-slate-100 text-[#001D3D] border border-slate-200'"
                        >
                            {{ plan.cta }}
                        </RouterLink>
                    </div>

                </div>

                <!-- Aviso de Seguridad -->
                <div class="mt-12 text-center flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
                    <Shield :size="15" class="text-teal-600" />
                    <span>Pagos seguros protegidos por Stripe. Cancela cuando quieras sin complicaciones.</span>
                </div>

            </div>
        </section>

        <!-- ══════════════════════════════════════ -->
        <!-- PREGUNTAS FRECUENTES (FAQ)             -->
        <!-- ══════════════════════════════════════ -->
        <section id="faq" class="py-24 bg-white border-t border-slate-200/70">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div class="text-center mb-14">
                    <span class="text-xs font-black text-[#009291] uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                        Dudas Comunes
                    </span>
                    <h2 class="text-3xl sm:text-4xl font-black text-[#001D3D] mt-3 mb-3">
                        Preguntas Frecuentes
                    </h2>
                    <p class="text-slate-500 text-sm font-medium">
                        Todo lo que necesitas saber de forma clara y sin enredos.
                    </p>
                </div>

                <div class="space-y-4">
                    <div 
                        v-for="(f, i) in faqs" 
                        :key="i"
                        class="bg-[#F8FAFC] rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
                    >
                        <button 
                            @click="toggleFaq(i)"
                            class="w-full p-5 text-left font-black text-sm sm:text-base text-[#001D3D] flex justify-between items-center gap-4 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            <span>{{ f.pregunta }}</span>
                            <component :is="faqAbierta === i ? ChevronUp : ChevronDown" :size="18" class="text-slate-400 flex-shrink-0" />
                        </button>
                        
                        <div v-show="faqAbierta === i" class="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-200 bg-white">
                            {{ f.respuesta }}
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <!-- ══════════════════════════════════════ -->
        <!-- BANNER FINAL DE CONVERSIÓN             -->
        <!-- ══════════════════════════════════════ -->
        <section class="py-20 bg-[#F8FAFC]">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="bg-gradient-to-br from-[#001D3D] via-[#002855] to-[#00B4B4] rounded-3xl p-8 sm:p-14 text-white text-center shadow-2xl relative overflow-hidden">
                    
                    <div class="relative z-10 max-w-2xl mx-auto space-y-6">
                        <span class="bg-white/10 text-teal-200 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
                            Comienza hoy mismo
                        </span>
                        
                        <h2 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                            ¿Listo para tener tus cuentas 100% claras?
                        </h2>
                        
                        <p class="text-slate-200 text-sm sm:text-base font-medium leading-relaxed">
                            Crea tu cuenta gratuita en menos de 1 minuto y empieza a organizar tus ingresos, tus ahorros y tus préstamos.
                        </p>

                        <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <RouterLink 
                                to="/registro"
                                class="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-[#001D3D] font-black text-sm rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <span>Crear Mi Cuenta Gratis</span>
                                <ArrowRight :size="16" />
                            </RouterLink>
                            <RouterLink 
                                to="/login"
                                class="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/15 text-white font-bold text-sm rounded-2xl border border-white/20 transition-all"
                            >
                                Iniciar Sesión
                            </RouterLink>
                        </div>
                    </div>

                    <!-- Círculos de Fondo -->
                    <div class="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                    <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-[#00B4B4]/20 rounded-full blur-2xl pointer-events-none"></div>
                </div>
            </div>
        </section>

        <!-- ══════════════════════════════════════ -->
        <!-- FOOTER                                 -->
        <!-- ══════════════════════════════════════ -->
        <footer class="bg-[#001529] text-slate-400 border-t border-slate-800">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                
                <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    
                    <!-- Marca -->
                    <div class="md:col-span-2 space-y-4">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-xl bg-[#00B4B4] p-1.5 flex items-center justify-center">
                                <img src="../../assets/LogoRecortado.png" alt="Cuentas Claras" class="h-full w-auto object-contain brightness-0 invert" />
                            </div>
                            <span class="font-black text-xl text-white">Cuentas Claras</span>
                        </div>
                        <p class="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">
                            Tu plataforma para organizar gastos, alcanzar tus metas de ahorro y formalizar préstamos con pagarés y firma en pantalla.
                        </p>
                        <div class="flex items-center gap-2 text-xs text-teal-400 font-bold">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>Servicios activos en la nube</span>
                        </div>
                    </div>

                    <!-- Enlaces de Navegación -->
                    <div>
                        <p class="text-xs font-black text-white uppercase tracking-widest mb-4">Secciones</p>
                        <ul class="space-y-2.5 text-xs font-medium">
                            <li><button @click="irA('demo')" class="hover:text-white transition-colors cursor-pointer">Cómo Funciona</button></li>
                            <li><button @click="irA('simulador')" class="hover:text-white transition-colors cursor-pointer">Simulador de Ahorro</button></li>
                            <li><button @click="irA('features')" class="hover:text-white transition-colors cursor-pointer">Herramientas</button></li>
                            <li><button @click="irA('precios')" class="hover:text-white transition-colors cursor-pointer">Planes y Precios</button></li>
                            <li><button @click="irA('faq')" class="hover:text-white transition-colors cursor-pointer">Preguntas Frecuentes</button></li>
                        </ul>
                    </div>

                    <!-- Acceso Rápido -->
                    <div>
                        <p class="text-xs font-black text-white uppercase tracking-widest mb-4">Acceso</p>
                        <ul class="space-y-2.5 text-xs font-medium">
                            <li><RouterLink to="/registro" class="hover:text-white transition-colors">Crear Cuenta Gratis</RouterLink></li>
                            <li><RouterLink to="/login" class="hover:text-white transition-colors">Iniciar Sesión</RouterLink></li>
                        </ul>
                    </div>

                </div>

                <!-- Copyright con año dinámico -->
                <div class="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500 font-medium">
                    <p>© {{ new Date().getFullYear() }} Cuentas Claras. Todos los derechos reservados.</p>
                    <p>Hecho para tu tranquilidad financiera.</p>
                </div>

            </div>
        </footer>

    </div>
</template>
