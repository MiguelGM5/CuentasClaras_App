import { ref, nextTick, computed } from 'vue';
import Swal from 'sweetalert2';
import { jsPDF } from "jspdf";
import { API_URL } from '../../constants/api';
import { usePerfil } from '../usePerfil';
import { obtenerHoy } from '../../utils/date';

export function usePagares(props, emit) {
    // ── ESTADO ──────────────────────────────────────────────
    const fechaHoy = obtenerHoy();
    const pagares = ref([]);
    const modalPagare = ref(false);
    const formPagare = ref({ folio: '', deudor: '', monto_solicitado: '', fecha_vencimiento: '', interes_moratorio: '10', firma: '' });
    const canvasFirma = ref(null);
    let isDrawing = false;
    let ctx = null;
    const { nombreCompleto } = usePerfil();
    
    const pagaresAlCorriente = computed(() => {
        if (!props.pagares) return 0; // Si no hay datos, devolvemos 0
        return props.pagares.filter(p => {
            // Si viene nulo o vacío, asumimos 'al corriente'. Le quitamos espacios y lo hacemos minúscula.
            const estadoSeguro = (p.estado || 'al corriente').trim().toLowerCase();
            return estadoSeguro === 'al corriente';
        }).length;
    });

    const pagaresAtrasados = computed(() => {
        if (!props.pagares) return 0;
        return props.pagares.filter(p => {
            const estadoSeguro = (p.estado || '').trim().toLowerCase();
            return estadoSeguro === 'atrasado';
        }).length;
    });

    const totalProtegido = computed(() => {
        if (!props.pagares) return 0;
        return props.pagares.filter(p => {
            const estadoSeguro = (p.estado || '').trim().toLowerCase();
            return estadoSeguro !== 'liquidado'; // Suma todos los que NO estén liquidados
        }).reduce((acc, p) => acc + Number(p.monto_solicitado || 0), 0);
    });

    // ── CONFIGURACIÓN API ───────────────────────────────────
    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    const cargarPagares = async () => {
        try {
            const res = await fetch(`${API_URL}/api/finance/pagares`, { headers: getHeaders() });
            if (!res.ok) throw new Error('Error al cargar pagarés');
            pagares.value = await res.json();
        } catch (err) { console.error(err); }
    };

    const cambiarEstadoPagare = async (id, nuevoEstado) => {
        try {
            const res = await fetch(`${API_URL}/api/finance/pagares/${id}/estado`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ estado: nuevoEstado })
            });

            if (!res.ok) throw new Error('Fallo al actualizar');

            // Actualizamos la tabla visualmente en Vue (Mutamos el prop)
            const index = props.pagares.findIndex(p => p.id === id);
            if (index !== -1) {
                props.pagares[index].estado = nuevoEstado;
            }

            Swal.fire({ title: '¡Estado Actualizado!', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
        } catch (error) {
            Swal.fire({ title: 'Error', text: 'No se pudo cambiar el estado', icon: 'error', confirmButtonColor: '#f59e0b' });
        }
    };

    // ── LÓGICA DE UI Y CANVAS ───────────────────────────────
    const abrirCrear = async () => {
        formPagare.value = { folio: `PAG-${Date.now().toString().slice(-4)}`, deudor: '', monto_solicitado: '', fecha_vencimiento: '', interes_moratorio: '10', firma: '' };
        modalPagare.value = true;
        await nextTick();
        prepararCanvas();
    };

    const prepararCanvas = () => {
        const canvas = canvasFirma.value;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        ctx = canvas.getContext('2d');
        ctx.scale(2, 2); 
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#0f172a'; 
    };

    const obtenerCoordenadas = (e) => {
        const canvas = canvasFirma.value;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const empezarDibujo = (e) => {
        isDrawing = true;
        const { x, y } = obtenerCoordenadas(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const dibujar = (e) => {
        if (!isDrawing) return;
        const { x, y } = obtenerCoordenadas(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const terminarDibujo = () => {
        if (!isDrawing) return;
        isDrawing = false;
        ctx.closePath();
        formPagare.value.firma = canvasFirma.value.toDataURL('image/png');
    };

    const limpiarFirma = () => {
        if (!ctx || !canvasFirma.value) return;
        ctx.clearRect(0, 0, canvasFirma.value.width, canvasFirma.value.height);
        formPagare.value.firma = '';
    };

    const guardando = ref(false);

    // ── GUARDADO Y API ──────────────────────────────────────
    const guardarNuevoPagare = async () => {
        if (guardando.value) return;

        if(formPagare.value.fecha_vencimiento < fechaHoy){
            return Swal.fire({ title: 'Error', text: 'No se puede usar una fecha menor a la de hoy', icon: 'error', confirmButtonColor: '#f59e0b' });
        }
        
        if (!formPagare.value.deudor || !formPagare.value.monto_solicitado || !formPagare.value.fecha_vencimiento) {
            return Swal.fire({ title: 'Datos incompletos', text: 'El deudor, monto y fecha son obligatorios.', icon: 'warning', confirmButtonColor: '#f59e0b' });
        }
        if (!formPagare.value.firma) {
            return Swal.fire({ title: 'Firma requerida', text: 'El deudor debe firmar.', icon: 'error', confirmButtonColor: '#f59e0b' });
        }

        guardando.value = true;
        try {
            const response = await fetch(`${API_URL}/api/finance/pagares`, {
                method: 'POST', 
                headers: getHeaders(), 
                body: JSON.stringify(formPagare.value)
            });

            const resData = await response.json();

            Swal.fire({
                title: resData.title || 'Atención',
                text: resData.text || 'Operación procesada.',
                icon: resData.icon || 'info',
                confirmButtonColor: '#f59e0b',
                timer: response.ok ? 2000 : undefined,
                showConfirmButton: !response.ok
            });

            if (response.ok && resData.data) {
                pagares.value.push(resData.data);
                modalPagare.value = false;
                if(emit) emit('pagareCreado', resData.data);
            }
        } catch (error) {
            Swal.fire({ title: 'Sin conexión', text: 'No pudimos comunicarnos con el servidor.', icon: 'error', confirmButtonColor: '#f59e0b' });
        } finally {
            setTimeout(() => { guardando.value = false; }, 600);
        }
    };

    // ── LÓGICA PDF ───────────────────────────────────────────
    const formatearDinero = (m) => isNaN(m) ? "0.00" : Number(m).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    const formatearFechaFormatoLargo = (fechaStr) => {
        if (!fechaStr) return '';
        const [year, month, day] = fechaStr.split('T')[0].split('-');
        return new Date(year, month - 1, day).toLocaleDateString("es-MX", { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const descargarPDF = (pagare) => {
        const doc = new jsPDF({ orientation: "landscape" });
        
        // Autoría institucional obligatoria ante ausencia de un firmante explícito
        const prestador = nombreCompleto?.value || 'Sociedad Mexicana de Anestesiología';
        
        const deudor = pagare.deudor;
        const montoCapital = parseFloat(pagare.monto_solicitado);
        const interes = parseFloat(pagare.interes_moratorio || 0);

        const totalPagar = montoCapital + (montoCapital * (interes / 100));

        const strCapital = formatearDinero(montoCapital);
        const strTotal = formatearDinero(totalPagar);

        const partesFecha = pagare.fecha_vencimiento.split('-');
        const fVenc = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2]);
        const diaVenc = fVenc.getDate();
        const mesVenc = fVenc.toLocaleString('es-MX', { month: 'long' });
        const anioVenc = fVenc.getFullYear();

        const hoy = new Date();
        const hoyFmt = `${hoy.getDate()} de ${hoy.toLocaleString('es-MX', { month: 'long' })} de ${hoy.getFullYear()}`;

        // 1. TÍTULO Y FOLIO
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text("Pagaré", 148.5, 25, { align: "center" });

        // Evaluamos si el folio existe y no es un string vacío
        if (pagare.folio && pagare.folio.trim() !== '') {
            doc.setFontSize(12);
            // Alineado a la derecha, en la esquina superior
            doc.text(`Folio: ${pagare.folio.toUpperCase()}`, 275, 25, { align: "right" });
        }

        // 2. CABECERA ALINEADA A LA IZQUIERDA
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text(`Vencimiento: ${diaVenc} de ${mesVenc} de ${anioVenc}`, 25, 45);
        doc.text(`Capital: $${strCapital} MXN`, 125, 45);
        doc.text(`Interés: ${interes}%`, 215, 45);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.text(`Total, a pagar: $${strTotal} MXN`, 25, 58);

        // 3. PÁRRAFO PRINCIPAL
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14); 
        
        const textoLegal = `Por este PAGARÉ, yo ${deudor} prometo incondicionalmente pagar a ${prestador} la cantidad de: $${strTotal} MXN el día: ${diaVenc} del mes de ${mesVenc} del año ${anioVenc}. La suma que ampara este título causará el interés a razón de ${interes}% mensual en el caso de demora.`;
        
        const lineasCuerpo = doc.splitTextToSize(textoLegal, 245);
        doc.text(lineasCuerpo, 25, 80, { lineHeightFactor: 1.8 });

        // 4. LUGAR Y FECHA
        doc.setFontSize(15);
        doc.text(`Lugar y fecha: Ciudad de México a ${hoyFmt}`, 148.5, 130, { align: "center" });

        // 5. FIRMA Y LÍNEA
        if (pagare.firma) {
            doc.addImage(pagare.firma, 'PNG', 118.5, 135, 60, 35);
        }
        
        doc.setDrawColor(0, 0, 0); 
        doc.setLineWidth(0.5);
        doc.line(95, 172, 202, 172); 
        
        doc.setFontSize(15);
        doc.setFont("helvetica", "bold");
        doc.text(`Nombre y firma del prestatario: ${deudor}`, 148.5, 182, { align: "center" });

        // DESCARGAR (Usamos un fallback solo para el nombre del archivo si no hay folio)
        const nombreArchivoFolio = pagare.folio ? pagare.folio.replace(/\s+/g, '') : `PAG-${pagare.id || Date.now().toString().slice(-4)}`;
        doc.save(`Pagare_${nombreArchivoFolio}_${deudor.replace(/\s+/g, '_')}.pdf`);
    };

    return { 
        fechaHoy,
        pagares, 
        pagaresAlCorriente, 
        pagaresAtrasados,   
        totalProtegido,     
        modalPagare, formPagare, canvasFirma, guardando,
        cargarPagares, abrirCrear, empezarDibujo, dibujar, terminarDibujo, limpiarFirma, guardarNuevoPagare,
        descargarPDF, formatearDinero, 
        formatearFechaFormatoLargo, cambiarEstadoPagare
    };
}