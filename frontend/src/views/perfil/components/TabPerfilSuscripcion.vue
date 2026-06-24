<script setup>
import { ref } from 'vue';
import {
    Sparkles, CheckCircle, ArrowUpRight, XCircle,
    Receipt, Calendar, CreditCard, Zap, Shield
} from 'lucide-vue-next';
import { API_URL } from '../../../constants/api';

const props = defineProps({
    perfil:         { type: Object, required: true },
    historialPagos: { type: Array,  default: () => [] },
    esPremium:      { type: Boolean, default: false }
});

const emit = defineEmits(['actualizar', 'cancelar']);

const confirmarCancelacion = ref(false);
const cargandoPago = ref(false); // Para deshabilitar el botón mientras carga

const handleCancelar = () => {
    emit('cancelar');
    confirmarCancelacion.value = false;
};

// ──NUEVA FUNCIÓN CON FETCH NATIVO ────────────────────────
const irAPagar = async () => {
    cargandoPago.value = true;
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Tu sesión expiró. Volvé a iniciar sesión.');
            return;
        }

        //TRUCO DE SENIOR: Desestructuramos el JWT nativamente para sacar el ID
        // Un JWT se compone de: Header.Payload.Signature. Agarramos el Payload (posición 1)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payloadDecodificado = JSON.parse(window.atob(base64));
        
        // Buscamos el ID dentro del token descifrado
        // NOTA: Si en tu backend guardaste el ID en el token como 'id_usuario' o 'userId', cambialo acá abajo:
        const userIdDesdeToken = payloadDecodificado.id || payloadDecodificado.userId || payloadDecodificado.id_usuario;

        console.log("ID recuperado del JWT con éxito:", userIdDesdeToken);

        if (!userIdDesdeToken) {
            alert('No se pudo validar el ID de usuario desde la sesión. Volvé a iniciar sesión.');
            return;
        }

        const response = await fetch(`${API_URL}/api/pagos/crear-checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                userId: userIdDesdeToken // Mandamos el ID real y verificado
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

        <!-- CARD: ESTADO ACTUAL DEL PLAN -->
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

        <!-- CARD: HISTORIAL DE PAGOS (solo visible si fue o es premium) -->
        <div v-if="historialPagos.length > 0" class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 class="font-black text-slate-800 text-base">Historial de Pagos</h3>
                    <p class="text-xs text-slate-400 mt-0.5">Registro de tus facturas y cobros</p>
                </div>
                <div class="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
                    <Receipt :size="16" class="text-violet-500" />
                </div>
            </div>

            <div class="divide-y divide-slate-50">
                <div v-for="pago in historialPagos" :key="pago.id"
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
                        <span class="font-black text-slate-800 text-sm">${{ pago.monto }}</span>
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

    </div>
</template>
