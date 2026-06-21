<template>
    <div class="h-full flex flex-col">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-black text-slate-800 tracking-tight">Mis Préstamos</h1>
                <p class="text-sm text-slate-400 mt-1">Lleva la cuenta de quién te debe y a quién le debes</p>
            </div>

            <button
                @click="abrirCrear"
                class="flex items-center gap-2 bg-[#00B4B4] hover:bg-[#009291] text-white font-bold px-4 py-2.5 rounded-xl text-md shadow-md transition-all"
            >
                <Plus :size="20" /> Nuevo Préstamo
            </button>
        </div>

        <div v-if="isPremium" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm flex items-center gap-5">
                <div class="w-14 h-14 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock :size="26" stroke-width="2.5" />
                </div>
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Pendientes ({{ prestamosPendientes.length }})
                    </p>
                    <p class="text-3xl font-black text-slate-800">${{ formatearDinero(totalPendiente) }}</p>
                </div>
            </div>

            <div class="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex items-center gap-5">
                <div class="w-14 h-14 bg-emerald-50 text-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 :size="26" stroke-width="2.5" />
                </div>
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Saldados ({{ prestamosSaldados.length }})
                    </p>
                    <p class="text-3xl font-black text-slate-800">${{ formatearDinero(totalSaldado) }}</p>
                </div>
            </div>
        </div>

        <BaseDataTable
            titulo="Registro de Préstamos"
            placeholderBuscar="Buscar persona o concepto..."
            :headers="columnas"
            :items="prestamos"
            :searchFields="['deudor', 'concepto', 'folioPagare', 'numeroTarjeta']"
        >
            <template #tipo="{ row }">
                <span
                    :class="row.tipo === 'prestado' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-bold w-fit"
                >
                    {{ row.tipo === "prestado" ? "Yo presté" : "Me prestaron" }}
                </span>
            </template>

            <template #deudor="{ row }">
                <span class="font-bold text-slate-700">{{ row.deudor }}</span>
            </template>

            <template #concepto="{ row }">
                <span class="text-slate-400 text-xs">{{ row.concepto }}</span>
            </template>

            <template #numeroTarjeta="{ row }">
    <div class="flex flex-col gap-1">
        <span class="text-xs text-slate-500">
            {{ row.numeroTarjeta || 'No registrada' }}
        </span>

        <button
            @click="abrirTarjeta(row)"
            class="text-[11px] font-black text-[#00B4B4] hover:underline text-left"
        >
            {{ row.numeroTarjeta ? 'Editar tarjeta' : 'Agregar tarjeta' }}
        </button>
    </div>

<Transition name="modal">
    <div
        v-if="prestamoTarjeta"
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        @mousedown.self="prestamoTarjeta = null"
    >
        <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 class="font-black text-xl text-slate-800 mb-4">Cuenta o tarjeta</h3>

            <input
                v-model="nuevaTarjeta"
                type="text"
                placeholder="Número de cuenta o tarjeta"
                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            />

            <div class="flex gap-3 mt-6">
                <button @click="prestamoTarjeta = null" class="flex-1 border border-slate-200 py-3 rounded-xl">
                    Cancelar
                </button>
                <button @click="guardarTarjeta" class="flex-1 bg-[#00B4B4] text-white py-3 rounded-xl">
                    Guardar
                </button>
            </div>
        </div>
    </div>
</Transition>

<Transition name="modal">
    <div
        v-if="prestamoEvidencia"
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        @mousedown.self="prestamoEvidencia = null"
    >
        <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 class="font-black text-xl text-slate-800 mb-4">Subir evidencia de pago</h3>

            <input
                type="file"
                accept="image/*,.pdf"
                @change="seleccionarEvidencia"
                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            />

            <div class="flex gap-3 mt-6">
                <button @click="prestamoEvidencia = null" class="flex-1 border border-slate-200 py-3 rounded-xl">
                    Cancelar
                </button>
                <button @click="subirEvidencia" class="flex-1 bg-[#00B4B4] text-white py-3 rounded-xl">
                    Subir
                </button>
            </div>
        </div>
    </div>
</Transition>

</template>

            <template #monto="{ row }">
                <span class="font-black text-slate-800">
                    ${{ formatearDinero(row.monto) }}
                </span>
            </template>

            <template #pagare="{ row }">
                <div v-if="row.folioPagare" class="flex flex-col gap-1">
                    <span class="text-xs font-black text-slate-700">
                        {{ row.folioPagare }}
                    </span>

                    <span class="text-[11px] text-slate-400">
                        Vence: {{ formatearFecha(row.vencimientoPagare) }}
                    </span>

                    <button
                        @click="verPagare(row)"
                        class="text-[11px] font-black text-[#00B4B4] hover:underline text-left"
                    >
                        Ver / Descargar
                    </button>

                    <button
                        v-if="row.pagareId && !row.firmaPagare"
                        @click="abrirFirma(row)"
                        class="text-[11px] font-black text-indigo-500 hover:underline text-left"
                    >
                        Firmar pagaré
                    </button>
                    
                    <button
    @click="abrirEvidencia(row)"
    class="text-[11px] font-black text-indigo-500 hover:underline text-left"
>
    {{ row.evidenciaPago ? 'Cambiar evidencia' : 'Subir evidencia' }}
</button>

<a
    v-if="row.evidenciaPago"
    :href="`http://localhost:3000${row.evidenciaPago}`"
    target="_blank"
    class="text-[11px] font-bold text-emerald-600 hover:underline"
>
    Ver evidencia
</a>

                    <span
                        v-if="row.firmaPagare"
                        class="text-[11px] font-bold text-emerald-600"
                    >
                        Firmado
                    </span>
                </div>

                <span v-else class="text-xs text-slate-300">
                    Sin pagaré
                </span>
            </template>

            <template #estado="{ row }">
                <button
                    v-if="row.estado === 'Pendiente'"
                    @click="confirmarSaldar(row)"
                    title="Marcar como saldado"
                    class="bg-amber-50 text-amber-600 hover:bg-emerald-500 hover:text-white px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group"
                >
                    <Clock :size="12" class="group-hover:hidden" />
                    <CheckCircle2 :size="12" class="hidden group-hover:block" />
                    <span class="group-hover:hidden">Pendiente</span>
                    <span class="hidden group-hover:block">¡Saldar!</span>
                </button>

                <span
                    v-else
                    class="bg-slate-100 text-slate-400 px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 w-fit"
                >
                    <CheckCircle2 :size="12" /> Saldado
                </span>
            </template>

            <template #fechaPago="{ row }">
                <span class="text-xs text-slate-400">
                    {{ row.fechaPago ? formatearFecha(row.fechaPago) : 'Sin límite' }}
                </span>
            </template>
        </BaseDataTable>

        <!-- MODAL: CREAR PRÉSTAMO -->
        <Transition name="modal">
            <div
                v-if="modalPrestamo"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                @mousedown.self="modalPrestamo = false"
            >
                <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="font-black text-xl text-slate-800">Registrar Préstamo</h3>
                            <p class="text-xs text-slate-400 mt-0.5">Lleva la cuenta de préstamos informales</p>
                        </div>

                        <button
                            @click="modalPrestamo = false"
                            class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
                        >
                            <X :size="17" />
                        </button>
                    </div>

                    <div class="flex gap-3 mb-5">
                        <button
                            v-for="t in tiposPrestamo"
                            :key="t.key"
                            @click="formPrestamo.tipo = t.key"
                            :class="[
                                'flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border',
                                formPrestamo.tipo === t.key
                                    ? 'bg-[#00B4B4] text-white border-[#00B4B4] shadow-md shadow-teal-100'
                                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                            ]"
                        >
                            <component :is="t.key === 'prestado' ? ArrowUpRight : ArrowDownLeft" :size="16" />
                            {{ t.label }}
                        </button>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                                {{ formPrestamo.tipo === 'prestado' ? '¿A quién le prestaste? *' : '¿Quién te prestó? *' }}
                            </label>

                            <input
                                v-model="formPrestamo.deudor"
                                type="text"
                                placeholder="Nombre de la persona"
                                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors"
                            />
                        </div>

                        <div>
                            <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                                Concepto *
                            </label>

                            <input
                                v-model="formPrestamo.concepto"
                                type="text"
                                placeholder="¿Para qué fue?"
                                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors"
                            />
                        </div>

                        <div>
                            <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                                Cuenta o tarjeta
                            </label>

                            <input
                                v-model="formPrestamo.numeroTarjeta"
                                type="text"
                                placeholder="Número de cuenta o tarjeta"
                                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors"
                            />
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                                    Monto (MXN) *
                                </label>

                                <input
                                    v-model="formPrestamo.monto"
                                    type="number"
                                    min="1"
                                    placeholder="0.00"
                                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors"
                                />
                            </div>

                            <div>
                                <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                                    Fecha límite *
                                </label>

                                <input
                                    v-model="formPrestamo.fecha_pago"
                                    type="date"
                                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-3 mt-6">
                        <button
                            @click="modalPrestamo = false"
                            class="flex-1 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 text-sm transition-colors"
                        >
                            Cancelar
                        </button>

                        <button
                            @click="guardarNuevoPrestamo"
                            class="flex-1 bg-[#00B4B4] hover:bg-[#009291] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-100 transition-colors"
                        >
                            <Check :size="15" /> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- MODAL: FIRMAR PAGARÉ -->
        <Transition name="modal">
            <div
                v-if="pagareAFirmar"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                @mousedown.self="cerrarFirma"
            >
                <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="font-black text-xl text-slate-800">Firmar pagaré</h3>
                            <p class="text-xs text-slate-400 mt-0.5">
                                Escribe tu nombre completo como firma digital.
                            </p>
                        </div>

                        <button
                            @click="cerrarFirma"
                            class="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
                        >
                            <X :size="17" />
                        </button>
                    </div>

                    <div class="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-5 text-sm text-slate-600">
                        <p><strong>Folio:</strong> {{ pagareAFirmar.folioPagare }}</p>
                        <p><strong>Deudor:</strong> {{ pagareAFirmar.deudor }}</p>
                        <p><strong>Monto:</strong> ${{ formatearDinero(pagareAFirmar.montoPagare || pagareAFirmar.monto) }}</p>
                        <p><strong>Vencimiento:</strong> {{ formatearFecha(pagareAFirmar.vencimientoPagare || pagareAFirmar.fechaPago) }}</p>
                    </div>

                    <input
                        v-model="firmaTexto"
                        type="text"
                        placeholder="Nombre completo"
                        class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00B4B4] bg-slate-50 focus:bg-white transition-colors"
                    />

                    <div class="flex gap-3 mt-6">
                        <button
                            @click="cerrarFirma"
                            class="flex-1 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 text-sm transition-colors"
                        >
                            Cancelar
                        </button>

                        <button
                            @click="guardarFirma"
                            class="flex-1 bg-[#00B4B4] hover:bg-[#009291] text-white font-bold py-3 rounded-xl text-sm transition-colors"
                        >
                            Firmar
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from 'vue';
import { Plus, ArrowDownLeft, ArrowUpRight, X, Check, Clock, CheckCircle2 } from 'lucide-vue-next';
import Swal from 'sweetalert2';
import BaseDataTable from '../../../components/dashboard/BaseDataTable.vue';

const props = defineProps({
    prestamos: { type: Array, default: () => [] },
    isPremium: Boolean
});

const emit = defineEmits(['crearPrestamo', 'saldarPrestamo']);

const columnas = [
    { key: 'tipo', label: 'Tipo' },
    { key: 'deudor', label: 'Persona' },
    { key: 'concepto', label: 'Concepto' },
    { key: 'numeroTarjeta', label: 'Cuenta/Tarjeta' },
    { key: 'monto', label: 'Monto' },
    { key: 'pagare', label: 'Pagaré' },
    { key: 'estado', label: 'Estado' },
    { key: 'fechaPago', label: 'Límite' }
];

const tiposPrestamo = [
    { key: 'prestado', label: 'Yo presté' },
    { key: 'pedido', label: 'Me prestaron' }
];

const modalPrestamo = ref(false);

const formPrestamo = ref({
    tipo: 'prestado',
    deudor: '',
    concepto: '',
    monto: '',
    fecha_pago: ''
});

const prestamoTarjeta = ref(null);
const nuevaTarjeta = ref('');

const prestamoEvidencia = ref(null);
const archivoEvidencia = ref(null);

const abrirTarjeta = (prestamo) => {
    prestamoTarjeta.value = prestamo;
    nuevaTarjeta.value = prestamo.numeroTarjeta || '';
};

const guardarTarjeta = async () => {
    if (!nuevaTarjeta.value.trim()) {
        return Swal.fire('Dato requerido', 'Ingresa cuenta o tarjeta.', 'warning');
    }

    const res = await fetch(`http://localhost:3000/api/finance/prestamos/${prestamoTarjeta.value.id}/tarjeta`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ numeroTarjeta: nuevaTarjeta.value.trim() })
    });

    const data = await res.json();

    if (!res.ok) {
        return Swal.fire('Error', data.message || 'No se pudo actualizar', 'error');
    }

    prestamoTarjeta.value.numeroTarjeta = nuevaTarjeta.value.trim();
    prestamoTarjeta.value = null;

    Swal.fire('Listo', 'Cuenta o tarjeta actualizada.', 'success');
};

const abrirEvidencia = (prestamo) => {
    prestamoEvidencia.value = prestamo;
    archivoEvidencia.value = null;
};

const seleccionarEvidencia = (event) => {
    archivoEvidencia.value = event.target.files[0];
};

const subirEvidencia = async () => {
    if (!archivoEvidencia.value) {
        return Swal.fire('Archivo requerido', 'Selecciona una imagen o PDF.', 'warning');
    }

    const formData = new FormData();
    formData.append('evidencia', archivoEvidencia.value);

    const res = await fetch(`http://localhost:3000/api/finance/prestamos/${prestamoEvidencia.value.id}/evidencia`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
    });

    const data = await res.json();

    if (!res.ok) {
        return Swal.fire('Error', data.message || 'No se pudo subir evidencia', 'error');
    }

    prestamoEvidencia.value.evidenciaPago = data.evidenciaPago;
    prestamoEvidencia.value = null;

    Swal.fire('Listo', 'Evidencia subida correctamente.', 'success');
};
const pagareAFirmar = ref(null);
const firmaTexto = ref('');

const prestamosPendientes = computed(() =>
    props.prestamos.filter(p => p.estado === 'Pendiente')
);

const prestamosSaldados = computed(() =>
    props.prestamos.filter(p => p.estado === 'Saldado')
);

const totalPendiente = computed(() =>
    prestamosPendientes.value.reduce((acc, p) => acc + Number(p.monto || 0), 0)
);

const totalSaldado = computed(() =>
    prestamosSaldados.value.reduce((acc, p) => acc + Number(p.monto || 0), 0)
);

const formatearDinero = (monto) => {
    return Number(monto || 0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'Sin fecha';

    const limpia = String(fechaStr).split('T')[0];
    const [year, month, day] = limpia.split('-');

    if (!year || !month || !day) return fechaStr;

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const abrirCrear = () => {
    formPrestamo.value = {
        tipo: 'prestado',
        deudor: '',
        concepto: '',
        numeroTarjeta: '',
        monto: '',
        fecha_pago: ''
    };

    modalPrestamo.value = true;
};

const guardarNuevoPrestamo = () => {
    const { tipo, deudor, concepto, monto, fecha_pago } = formPrestamo.value;

    if (!tipo || !deudor || !concepto || !monto || !fecha_pago) {
        return Swal.fire({
            title: 'Campos incompletos',
            text: 'Tipo, persona, concepto, monto y fecha límite son requeridos.',
            icon: 'warning',
            confirmButtonColor: '#00B4B4'
        });
    }

    emit('crearPrestamo', {
        ...formPrestamo.value,
        monto: Number(formPrestamo.value.monto)
    });

    modalPrestamo.value = false;
};

const confirmarSaldar = (prestamo) => {
    const mensaje = prestamo.tipo === 'prestado'
        ? `¿Ya te devolvieron los $${formatearDinero(prestamo.monto)} del concepto "${prestamo.concepto}"?`
        : `¿Ya pagaste tu deuda de $${formatearDinero(prestamo.monto)} por "${prestamo.concepto}"?`;

    Swal.fire({
        title: '¿Marcar como Saldado?',
        text: mensaje,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#cbd5e1',
        confirmButtonText: 'Sí, saldado',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
    prestamo.estado = 'Saldado';
    prestamo.estadoPagare = 'Saldado';

    emit('saldarPrestamo', prestamo.id);
}
    });
};

const abrirFirma = (prestamo) => {
    pagareAFirmar.value = prestamo;
    firmaTexto.value = '';
};

const cerrarFirma = () => {
    pagareAFirmar.value = null;
    firmaTexto.value = '';
};

const guardarFirma = async () => {
    if (!firmaTexto.value.trim()) {
        return Swal.fire({
            title: 'Firma requerida',
            text: 'Escribe tu nombre completo como firma.',
            icon: 'warning',
            confirmButtonColor: '#00B4B4'
        });
    }

    try {
        const res = await fetch(`http://localhost:3000/api/finance/pagares/${pagareAFirmar.value.pagareId}/firma`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                firma: firmaTexto.value.trim()
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'No se pudo firmar el pagaré');
        }

        pagareAFirmar.value.firmaPagare = firmaTexto.value.trim();

        Swal.fire({
            title: 'Listo',
            text: 'Pagaré firmado correctamente.',
            icon: 'success',
            confirmButtonColor: '#00B4B4'
        });

        cerrarFirma();
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
            confirmButtonColor: '#00B4B4'
        });
    }
};

const verPagare = (prestamo) => {
    const firmaHtml = prestamo.firmaPagare
        ? `<p><strong>Firma digital:</strong> ${prestamo.firmaPagare}</p>`
        : `<p><strong>Firma digital:</strong> Pendiente de firma</p>`;

    const nombreUsuario = prestamo.nombreUsuario || 'Usuario';

const deudorPagare = prestamo.tipo === 'pedido'
    ? nombreUsuario
    : prestamo.deudor;

const acreedorPagare = prestamo.tipo === 'pedido'
    ? prestamo.deudor
    : nombreUsuario;
    
    
        const contenido = `
        <html>
            <head>
                <title>Pagaré ${prestamo.folioPagare || ''}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 40px;
                        color: #1e293b;
                    }

                    h1 {
                        text-align: center;
                        margin-bottom: 30px;
                    }

                    .box {
                        border: 1px solid #cbd5e1;
                        border-radius: 12px;
                        padding: 24px;
                    }

                    p {
                        font-size: 16px;
                        line-height: 1.7;
                    }

                    .firma {
                        margin-top: 70px;
                        text-align: center;
                    }

                    .btn {
                        margin-top: 30px;
                        background: #00B4B4;
                        color: white;
                        border: none;
                        border-radius: 10px;
                        padding: 12px 18px;
                        font-weight: bold;
                        cursor: pointer;
                    }

                    @media print {
                        .btn {
                            display: none;
                        }
                    }
                </style>
            </head>

            <body>
                <h1>PAGARÉ</h1>

                <div class="box">
                    <p><strong>Folio:</strong> ${prestamo.folioPagare || 'Sin folio'}</p>
                    <p><strong>Tipo:</strong> ${prestamo.tipo === 'prestado' ? 'Yo presté' : 'Me prestaron'}</p>
                    <p><strong>Deudor:</strong> ${deudorPagare}</p>
                    <p><strong>Acreedor:</strong> ${acreedorPagare}</p>
                    <p><strong>Monto:</strong> $${formatearDinero(prestamo.montoPagare || prestamo.monto)}</p>
                    <p><strong>Cuenta o tarjeta:</strong> ${prestamo.numeroTarjeta || 'No registrada'}</p>
                    <p><strong>Fecha de vencimiento:</strong> ${prestamo.vencimientoPagare || prestamo.fechaPago || 'Sin fecha'}</p>
                    <p><strong>Estado:</strong> ${prestamo.estadoPagare || prestamo.estado || 'Pendiente'}</p>
                    <br>

                    <p>
                        Por medio del presente pagaré, la persona registrada como deudor se compromete
                        a liquidar la cantidad indicada en este documento en la fecha de vencimiento establecida.
                    </p>

                    <div class="firma">
                        ${firmaHtml}
                        <p>______________________________</p>
                        <p>Firma del deudor</p>
                    </div>
                </div>

                <button class="btn" onclick="window.print()">Descargar / Imprimir PDF</button>
            </body>
        </html>
    `;

    const ventana = window.open('', '_blank');

    if (!ventana) {
        return Swal.fire({
            title: 'Ventana bloqueada',
            text: 'Permite ventanas emergentes para ver el pagaré.',
            icon: 'warning',
            confirmButtonColor: '#00B4B4'
        });
    }

    ventana.document.write(contenido);
    ventana.document.close();
};

const verificarAccesoRapido = () => {
    if (localStorage.getItem('abrir_modal_prestamo') === 'true') {
        localStorage.removeItem('abrir_modal_prestamo');
        abrirCrear();
    }
};

onMounted(verificarAccesoRapido);
onActivated(verificarAccesoRapido);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
    transform: scale(0.96) translateY(8px);
    transition: transform 0.2s ease;
}
</style>