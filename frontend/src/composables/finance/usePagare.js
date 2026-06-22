import { ref, nextTick, computed } from 'vue';
import Swal from 'sweetalert2';
import { jsPDF } from "jspdf";
import { API_URL } from '../../constants/api';
import { usePerfil } from '../usePerfil';

export function usePagares(emit) {
    // ── ESTADO ──────────────────────────────────────────────
    const pagares = ref([]);
    const modalPagare = ref(false);
    const formPagare = ref({ folio: '', deudor: '', monto_solicitado: '', fecha_vencimiento: '', interes_moratorio: '10', firma: '' });
    const canvasFirma = ref(null);
    let isDrawing = false;
    let ctx = null;
    const { nombreCompleto } = usePerfil();
    const pagaresAlCorriente = computed(() => pagares.value.filter(p => p.estado === 'Al corriente').length);
    const pagaresAtrasados = computed(() => pagares.value.filter(p => p.estado === 'Atrasado').length);
    const totalProtegido = computed(() => pagares.value.filter(p => p.estado !== 'liquidado').reduce((acc, p) => acc + Number(p.monto_solicitado), 0));

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

    // ── GUARDADO Y API ──────────────────────────────────────
    const guardarNuevoPagare = async () => {
        if (!formPagare.value.deudor || !formPagare.value.monto_solicitado || !formPagare.value.fecha_vencimiento) {
            return Swal.fire({ title: 'Datos incompletos', text: 'El deudor, monto y fecha son obligatorios.', icon: 'warning', confirmButtonColor: '#f59e0b' });
        }
        if (!formPagare.value.firma) {
            return Swal.fire({ title: 'Firma requerida', text: 'El deudor debe firmar.', icon: 'error', confirmButtonColor: '#f59e0b' });
        }

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
                if(emit) emit('pagareCreado', resData.data); // Opcional si usas el push local
            }
        } catch (error) {
            Swal.fire({ title: 'Sin conexión', text: 'No pudimos comunicarnos con el servidor.', icon: 'error', confirmButtonColor: '#f59e0b' });
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
        const prestador = nombreCompleto.value || 'Sociedad Mexicana de Anestesiología';
        
        const deudor = pagare.deudor;
        const monto = formatearDinero(pagare.monto_solicitado);
        const vencimiento = formatearFechaFormatoLargo(pagare.fecha_vencimiento);
        const interes = pagare.interes_moratorio || "0";
        const folio = pagare.folio || `PAG-${pagare.id || Date.now().toString().slice(-4)}`;
        const hoy = new Date().toLocaleDateString("es-MX", { year: 'numeric', month: 'long', day: 'numeric' });

        doc.setDrawColor(245, 158, 11);
        doc.setLineWidth(2);
        doc.rect(10, 10, 277, 190); 
        doc.setFont("helvetica", "bold");
        doc.text("Vencimiento:", 18, 27);
        doc.setFont("helvetica", "normal");
        doc.text(vencimiento, 50, 27);
        doc.rect(100, 15, 80, 20);
        doc.setFont("helvetica", "bold");
        doc.text("Capital $", 103, 27);
        doc.setFont("helvetica", "normal");
        doc.text(monto, 125, 27);
        doc.rect(185, 15, 100, 20);
        doc.text(`Interés: ${interes}%`, 188, 27);
        
        doc.setFontSize(14);
        doc.text(`Por este PAGARÉ, yo ${deudor} prometo pagar a ${prestador}`, 15, 55);
        doc.rect(15, 90, 270, 40);
        doc.text(`La cantidad de $ ${monto} el día ${vencimiento}. Interés: ${interes}% mensual.`, 18, 105);
        doc.text(`Ciudad de México, a ${hoy}`, 150, 145);
        doc.rect(80, 155, 130, 40);
        doc.text("Firma del prestatario", 85, 190);
        
        if (pagare.firma) {
            doc.addImage(pagare.firma, 'PNG', 110, 140, 80, 45);
        }

        doc.save(`Pagare_${folio}_${deudor.replace(/\s+/g, '_')}.pdf`);
    };

    return { 
        pagares, 
        pagaresAlCorriente, 
        pagaresAtrasados,   
        totalProtegido,     
        modalPagare, formPagare, canvasFirma,
        cargarPagares, abrirCrear, empezarDibujo, dibujar, terminarDibujo, limpiarFirma, guardarNuevoPagare,
        descargarPDF, formatearDinero, formatearFechaFormatoLargo
    };
}