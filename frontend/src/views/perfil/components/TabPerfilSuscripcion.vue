<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
    Sparkles, CheckCircle, ArrowUpRight, XCircle,
    Receipt, Calendar, CreditCard, Zap, Shield, Loader2 
} from 'lucide-vue-next';
import { API_URL } from '../../../constants/api';
import { getAuthHeaders } from '../../../utils/http';

const props = defineProps({
    perfil:         { type: Object, required: true },
    historialPagos: { type: Array,  default: () => [] },
    esPremium:      { type: Boolean, default: false }
});

const emit = defineEmits(['actualizar', 'cancelar']);

const confirmarCancelacion = ref(false);
const cargandoPago = ref(false); 
const route = useRoute();
const router = useRouter();
const mostrarToastExito = ref(false);

const historialPagosReal = ref([]);
const cargandoHistorial = ref(true);

const cargarHistorialPagos = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            cargandoHistorial.value = false;
            return;
        }

        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payloadDecodificado = JSON.parse(window.atob(base64));
        const userId = payloadDecodificado.id || payloadDecodificado.userId || payloadDecodificado.id_usuario;

        if (!userId) return;

        const response = await fetch(`${API_URL}/api/pagos/historial-pagos/${userId}`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            historialPagosReal.value = await response.json();
        }
    } catch (error) {
        console.error("Error al cargar facturas de Stripe:", error);
    } finally {
        cargandoHistorial.value = false;
    }
};

const handleCancelar = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payloadDecodificado = JSON.parse(window.atob(base64));
        const userIdDesdeToken = payloadDecodificado.id || payloadDecodificado.userId || payloadDecodificado.id_usuario;

        const response = await fetch(`${API_URL}/api/pagos/cancelar-suscripcion`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ userId: userIdDesdeToken })
        });

        if (!response.ok) throw new Error('Error al cancelar');

        const data = await response.json();

        if (data.success) {
            const userLocal = JSON.parse(localStorage.getItem('user') || '{}');
            userLocal.rol = data.rol;
            userLocal.nombre_rol = data.rol;
            userLocal.rol_Id = data.rol_Id;
            localStorage.setItem('user', JSON.stringify(userLocal));

            confirmarCancelacion.value = false;
            window.location.reload();
        }

    } catch (error) {
        console.error("Error cancelando suscripción:", error);
        alert("Hubo un problema al intentar cancelar tu suscripción.");
    }
};

onMounted(() => {
    cargarHistorialPagos();

    if (route.query.pago === 'exito') {
        mostrarToastExito.value = true;
        setTimeout(() => {
            mostrarToastExito.value = false;
        }, 5000);
        router.replace({ path: route.path, query: {} });
    }
});

const irAPagar = async () => {
    cargandoPago.value = true;
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Tu sesión expiró. Volvé a iniciar sesión.');
            return;
        }

        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payloadDecodificado = JSON.parse(window.atob(base64));
        
        const userIdDesdeToken = payloadDecodificado.id || payloadDecodificado.userId || payloadDecodificado.id_usuario;

        if (!userIdDesdeToken) {
            alert('No se pudo validar el ID de usuario desde la sesión. Volvé a iniciar sesión.');
            return;
        }

        const response = await fetch(`${API_URL}/api/pagos/crear-checkout`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ 
                userId: userIdDesdeToken 
            }) 
        });

        if (!response.ok) {
            throw new Error('Error al contactar al servidor');
        }

        const data = await response.json();

        if (data.url) {
            window.location.href = data.url;
        }
    } catch (error) {
        console.error('Error de pago:', error);
        alert('Hubo un problema al conectar con la pasarela de pago.');
    } finally {
        cargandoPago.value = false;
    }
};
</script>

<template>
    <div class="space-y-6">

        <!-- CARD 1: ESTADO ACTUAL DEL PLAN -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 class="font-black text-slate-800 text-base">Tu Suscripcion</h3>
                    <p class="text-xs text-slate-400 mt-0.5">Estado actual de tu plan en Cuentas Claras</p>
                </div>
                <div :class="esPremium ? 'bg-teal-50' : 'bg-slate-50'" class="w-9 h-9 rounded-xl flex items-center justify-center">
                    <component :is="esPremium ? Sparkles : Shield" :size="16" :class="esPremium ? 'text-[#00B4B4]' : 'text-slate-400'" />
                </div>
            </div>

            <div class="p-6">
                <!-- Badge del plan activo -->
                <div class="flex items-center gap-4 p-4 rounded-2xl mb-6"
                    :class="esPremium ? 'bg-gradient-to-r from-[#001D3D] to-[#003366]' : 'bg-slate-50 border border-slate-100'"
                >
                    <div :class="esPremium ? 'bg-[#00B4B4]' : 'bg-slate-200'"
                        class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0">
                        <component :is="esPremium ? Sparkles : Shield" :size="20" class="text-white" />
                    </div>
                    <div>
                        <p :class="esPremium ? 'text-white' : 'text-slate-700'" class="font-black text-lg leading-tight">
                            Plan {{ esPremium ? 'Premium' : 'Gratuito' }}
                        </p>
                        <p :class="esPremium ? 'text-slate-400' : 'text-slate-400'" class="text-xs mt-0.5">
                            {{ esPremium ? 'Tienes acceso completo a todas las funciones' : 'Acceso a funciones basicas' }}
                        </p>
                    </div>
                    <span v-if="esPremium" class="ml-auto px-3 py-1 bg-[#00B4B4] text-white text-[11px] font-black rounded-full">
                        ACTIVO
                    </span>
                    <span v-else class="ml-auto px-3 py-1 bg-white border border-slate-200 text-slate-500 text-[11px] font-bold rounded-full">
                        GRATIS
                    </span>
                </div>

                <!-- Comparacion de planes -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- Plan Free -->
                    <div :class="!esPremium ? 'border-[#00B4B4] bg-teal-50/30' : 'border-slate-100'"
                        class="rounded-2xl border-2 p-5 transition-all">
                        <div class="flex items-center justify-between mb-3">
                            <p class="font-black text-slate-700">Gratuito</p>
                            <span class="text-xl font-black text-slate-800">$0<span class="text-xs font-normal text-slate-400">/mes</span></span>
                        </div>
                        <ul class="space-y-2 text-xs text-slate-500">
                            <li class="flex items-center gap-2"><CheckCircle :size="13" class="text-emerald-400 flex-shrink-0" /> Metas de ahorro</li>
                            <li class="flex items-center gap-2"><CheckCircle :size="13" class="text-emerald-400 flex-shrink-0" /> Registro de gastos</li>
                            <li class="flex items-center gap-2"><CheckCircle :size="13" class="text-emerald-400 flex-shrink-0" /> Prestamos informales</li>
                            <li class="flex items-center gap-2"><XCircle :size="13" class="text-slate-300 flex-shrink-0" /> Historico completo</li>
                            <li class="flex items-center gap-2"><XCircle :size="13" class="text-slate-300 flex-shrink-0" /> Reportes exportables</li>
                            <li class="flex items-center gap-2"><XCircle :size="13" class="text-slate-300 flex-shrink-0" /> Analisis con IA</li>
                        </ul>
                    </div>

                    <!-- Plan Premium -->
                    <div :class="esPremium ? 'border-[#00B4B4] bg-teal-50/30' : 'border-slate-100'"
                        class="rounded-2xl border-2 p-5 transition-all">
                        <div class="flex items-center justify-between mb-3">
                            <p class="font-black text-slate-700 flex items-center gap-1.5">
                                <Sparkles :size="13" class="text-[#00B4B4]" /> Premium
                            </p>
                            <span class="text-xl font-black text-slate-800">$99<span class="text-xs font-normal text-slate-400">/mes</span></span>
                        </div>
                        <ul class="space-y-2 text-xs text-slate-500">
                            <li class="flex items-center gap-2"><CheckCircle :size="13" class="text-emerald-400 flex-shrink-0" /> Todo lo del plan Free</li>
                            <li class="flex items-center gap-2"><CheckCircle :size="13" class="text-emerald-400 flex-shrink-0" /> Historico completo</li>
                            <li class="flex items-center gap-2"><CheckCircle :size="13" class="text-emerald-400 flex-shrink-0" /> Reportes exportables</li>
                            <li class="flex items-center gap-2"><CheckCircle :size="13" class="text-emerald-400 flex-shrink-0" /> Analisis con IA</li>
                            <li class="flex items-center gap-2"><CheckCircle :size="13" class="text-emerald-400 flex-shrink-0" /> Soporte prioritario</li>
                            <li class="flex items-center gap-2"><CheckCircle :size="13" class="text-emerald-400 flex-shrink-0" /> Multiples monedas</li>
                        </ul>
                    </div>
                </div>

                <!-- Botones de accion segun plan -->
                <div class="mt-5 flex flex-wrap gap-3">
                    <button v-if="!esPremium"
                        @click="irAPagar"
                        :disabled="cargandoPago"
                        :class="cargandoPago ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#009291]'"
                        class="flex items-center gap-2 bg-[#00B4B4] text-white font-black px-5 py-2.5 rounded-xl text-sm shadow-md shadow-teal-100 transition-all"
                    >
                        <Zap :size="14" /> 
                        {{ cargandoPago ? 'Conectando...' : 'Actualizar a Premium' }}
                    </button>

                    <button v-if="esPremium"
                        @click="confirmarCancelacion = true"
                        class="flex items-center gap-2 border border-red-200 text-red-400 hover:bg-red-50 font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
                    >
                        <XCircle :size="14" /> Cancelar suscripcion
                    </button>
                </div>
            </div>
        </div>

        <!-- CARD 2: HISTORIAL DE PAGOS (AHORA ES DINÁMICA SIEMPRE) -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 class="font-black text-slate-800 text-base">Historial de Pagos</h3>
                    <p class="text-xs text-slate-400 mt-0.5">Registro oficial de tus facturas de Stripe</p>
                </div>
                <div class="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
                    <Receipt :size="16" class="text-violet-500" />
                </div>
            </div>

            <!-- ESTADO 1: CARGANDO -->
            <div v-if="cargandoHistorial" class="p-12 text-center flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 class="animate-spin text-[#00B4B4]" :size="28" />
                <p class="text-xs font-bold tracking-wide uppercase">Consultando servidores de Stripe...</p>
            </div>

            <!-- ESTADO 2: VACÍO (Usuario sin pagos) -->
            <div v-else-if="historialPagosReal.length === 0" class="p-12 text-center text-slate-400">
                <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-300">
                    <Receipt :size="24" />
                </div>
                <p class="text-sm font-bold text-slate-600">No hay pagos registrados</p>
                <p class="text-xs mt-1 max-w-xs mx-auto text-slate-400">Cuando te suscribas al plan Premium, tus comprobantes de pago aparecerán aquí.</p>
            </div>

            <!-- ESTADO 3: CON FACTURAS REALES -->
            <div v-else class="divide-y divide-slate-50">
                <div v-for="pago in historialPagosReal" :key="pago.id"
                    class="flex items-center justify-between px-6 py-4 hover:bg-slate-50/40 transition-colors">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <CreditCard :size="15" class="text-slate-400" />
                        </div>
                        <div>
                            <p class="text-sm font-bold text-slate-700">{{ pago.concepto }}</p>
                            <p class="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Calendar :size="10" /> {{ pago.fecha }}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="font-black text-slate-800 text-sm">${{ pago.monto }} <span class="text-[10px] text-slate-400 font-normal">MXN</span></span>
                        <span
                            :class="pago.estado === 'Pagado' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-500'"
                            class="px-2.5 py-1 rounded-full text-[11px] font-bold"
                        >
                            {{ pago.estado }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL: Confirmar cancelacion -->
        <div v-if="confirmarCancelacion"
            class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl text-center">
                <div class="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <XCircle :size="26" class="text-red-400" />
                </div>
                <h3 class="font-black text-slate-800 text-lg mb-2">Cancelar suscripcion</h3>
                <p class="text-sm text-slate-400 mb-6">
                    Perderás acceso a las funciones Premium al final del ciclo de facturacion. Podras volver cuando quieras.
                </p>
                <div class="flex gap-3">
                    <button @click="confirmarCancelacion = false"
                        class="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold py-2.5 rounded-xl text-sm transition-colors">
                        Conservar plan
                    </button>
                    <button @click="handleCancelar"
                        class="flex-1 bg-red-400 hover:bg-red-500 text-white font-black py-2.5 rounded-xl text-sm transition-colors">
                        Si, cancelar
                    </button>
                </div>
            </div>
        </div>

        <!-- TOAST DE ÉXITO -->
        <transition
            enter-active-class="transform ease-out duration-300 transition"
            enter-from-class="translate-y-10 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div v-if="mostrarToastExito" 
                 class="fixed bottom-6 right-6 z-50 flex items-center gap-4 bg-[#001D3D] text-white px-5 py-4 rounded-2xl shadow-2xl border border-[#00B4B4]/30">
                <div class="bg-[#00B4B4] rounded-full p-1.5 flex-shrink-0">
                    <CheckCircle :size="20" class="text-white" />
                </div>
                <div>
                    <p class="font-black text-sm">¡Pago exitoso!</p>
                    <p class="text-xs text-slate-300">Ya estás suscrito al plan Premium.</p>
                </div>
                <button @click="mostrarToastExito = false" class="ml-2 text-slate-400 hover:text-white transition-colors">
                    <XCircle :size="18" />
                </button>
            </div>
        </transition>

    </div>
</template>