import { ref, computed } from 'vue';
import Swal from 'sweetalert2';

export function useAdmin(){
    //Data Hardcodeada
    const usuarios = ref([
        { id: 1, nombre: "Miguel", apellidoPaterno: "Gómez", email: "miguel@ipn.mx", rol: "superAdmin", plan: "superAdmin", status: 1, fechaRegistro: "2026-01-15" },
        { id: 2, nombre: "Rocío", apellidoPaterno: "Pérez", email: "rocio@gmail.com", rol: "premium", plan: "premium", status: 1, fechaRegistro: "2026-02-20" },
        { id: 3, nombre: "Juan", apellidoPaterno: "Pérez", email: "juan@outlook.com", rol: "user", plan: "free", status: 1, fechaRegistro: "2026-03-10" },
        { id: 4, nombre: "Lucas", apellidoPaterno: "Pereyra", email: "lucas@gmail.com", rol: "user", plan: "free", status: 0, fechaRegistro: "2026-04-05" },
        { id: 5, nombre: "Ana", apellidoPaterno: "Torres", email: "ana@gmail.com", rol: "premium", plan: "premium", status: 1, fechaRegistro: "2026-05-12" },
        { id: 6, nombre: "Carlos", apellidoPaterno: "Mendoza", email: "carlos@hotmail.com", rol: "user", plan: "free", status: 1, fechaRegistro: "2026-05-28" },
        { id: 7, nombre: "Sofía", apellidoPaterno: "Ramírez", email: "sofia.ramirez@gmail.com", rol: "premium", plan: "premium", status: 1, fechaRegistro: "2026-06-01" }
    ]);

    const prestamos = ref([
        { id: 1, usuarioId: 2, usuarioNombre: "Rocío Pérez", tipo: "prestado", monto: 1500, concepto: "Préstamo comida familiar", estado: "Pendiente", fecha: "2026-06-02", fechaPago: "2026-06-15" },
        { id: 2, usuarioId: 2, usuarioNombre: "Rocío Pérez", tipo: "pedido", monto: 600, concepto: "Gasolina viaje Acapulco", estado: "Saldado", fecha: "2026-06-03", fechaPago: "2026-06-10" },
        { id: 3, usuarioId: 3, usuarioNombre: "Juan Pérez", tipo: "prestado", monto: 800, concepto: "Herramientas taller", estado: "Pendiente", fecha: "2026-06-04", fechaPago: "2026-06-20" },
        { id: 4, usuarioId: 5, usuarioNombre: "Ana Torres", tipo: "pedido", monto: 2000, concepto: "Reparación auto", estado: "Pendiente", fecha: "2026-06-05", fechaPago: "2026-07-01" },
        { id: 5, usuarioId: 5, usuarioNombre: "Ana Torres", tipo: "prestado", monto: 500, concepto: "Comida colega trabajo", estado: "Saldado", fecha: "2026-06-05", fechaPago: "2026-06-08" },
        { id: 6, usuarioId: 7, usuarioNombre: "Sofía Ramírez", tipo: "prestado", monto: 3000, concepto: "Emergencia médica familiar", estado: "Pendiente", fecha: "2026-06-06", fechaPago: "2026-07-06" },
        { id: 7, usuarioId: 6, usuarioNombre: "Carlos Mendoza", tipo: "pedido", monto: 450, concepto: "Pasaje camión mensual", estado: "Saldado", fecha: "2026-06-07", fechaPago: "2026-06-07" },
        { id: 8, usuarioId: 3, usuarioNombre: "Juan Pérez", tipo: "pedido", monto: 1200, concepto: "Renta mes adelantado", estado: "Pendiente", fecha: "2026-06-08", fechaPago: "2026-06-30" }
    ]);

    const gastos = ref([
        { id: 1, usuarioId: 2, usuarioNombre: "Rocío Pérez", categoria: "Alimentación", monto: 2500, descripcion: "Supermercado semanal", fecha: "2026-06-01" },
        { id: 2, usuarioId: 2, usuarioNombre: "Rocío Pérez", categoria: "Transporte", monto: 800, descripcion: "Gasolina del mes", fecha: "2026-06-02" },
        { id: 3, usuarioId: 3, usuarioNombre: "Juan Pérez", categoria: "Servicios", monto: 1200, descripcion: "Internet + luz", fecha: "2026-06-03" },
        { id: 4, usuarioId: 5, usuarioNombre: "Ana Torres", categoria: "Entretenimiento", monto: 400, descripcion: "Streaming + apps", fecha: "2026-06-04" },
        { id: 5, usuarioId: 5, usuarioNombre: "Ana Torres", categoria: "Alimentación", monto: 1800, descripcion: "Restaurantes semana", fecha: "2026-06-05" },
        { id: 6, usuarioId: 7, usuarioNombre: "Sofía Ramírez", categoria: "Salud", monto: 950, descripcion: "Medicamentos mes", fecha: "2026-06-06" },
        { id: 7, usuarioId: 6, usuarioNombre: "Carlos Mendoza", categoria: "Transporte", monto: 1100, descripcion: "Uber semana", fecha: "2026-06-07" },
        { id: 8, usuarioId: 3, usuarioNombre: "Juan Pérez", categoria: "Educación", monto: 2200, descripcion: "Curso de certificación", fecha: "2026-06-08" }
    ]);
    /********************************************************/

    // STATS COMPUTADAS
    const clientesReales = computed(() => usuarios.value.filter((u) => u.plan !== "superAdmin"));
    const totalUsuarios = computed(() => clientesReales.value.length);
    const cntFree = computed(() => clientesReales.value.filter((u) => u.plan === "free").length);
    const cntPremium = computed(() => clientesReales.value.filter((u) => u.plan === "premium").length);
    const cntActivos = computed(() => clientesReales.value.filter((u) => u.status === 1).length);

    const totalPrestamos = computed(() => prestamos.value.length);
    const montoPrestado = computed(() => prestamos.value.filter((p) => p.tipo === "prestado").reduce((a, p) => a + p.monto, 0));
    const montoPedido = computed(() => prestamos.value.filter((p) => p.tipo === "pedido").reduce((a, p) => a + p.monto, 0));
    const prestamosPendientes = computed(() => prestamos.value.filter((p) => p.estado === "Pendiente").length);

    const totalGastos = computed(() => gastos.value.reduce((a, g) => a + g.monto, 0));
    const promedioGasto = computed(() => gastos.value.length ? Math.round(totalGastos.value / gastos.value.length) : 0);  

    const guardarUsuarioDB = (datos, modo) => {
        if (!datos.nombre || !datos.email) {
            Swal.fire({ title: "Campos requeridos", text: "Nombre y correo son obligatorios.", icon: "warning", confirmButtonColor: "#00B4B4" });
            return false;
        }
        
        if (modo === "edit") {
            const idx = usuarios.value.findIndex((u) => u.id === datos.id);
            if (idx !== -1) usuarios.value[idx] = { ...datos };
            Swal.fire({ title: "Usuario actualizado", icon: "success", confirmButtonColor: "#00B4B4", timer: 1500, showConfirmButton: false });
        } else {
            const newId = Math.max(...usuarios.value.map((u) => u.id), 0) + 1;
            usuarios.value.push({ ...datos, id: newId, fechaRegistro: new Date().toISOString().split('T')[0] });
            Swal.fire({ title: "¡Usuario creado!", icon: "success", confirmButtonColor: "#00B4B4", timer: 1500, showConfirmButton: false });
        }
        return true;
    };

    const eliminarUsuarioDB = async (user) => {
        const result = await Swal.fire({
            title: "¿Eliminar usuario?",
            html: `Se eliminará a <strong>${user.nombre} ${user.apellidoPaterno}</strong> permanentemente.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#94a3b8",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        
        if (result.isConfirmed) {
            usuarios.value = usuarios.value.filter((u) => u.id !== user.id);
            Swal.fire({ title: "Eliminado", icon: "success", confirmButtonColor: "#00B4B4", timer: 1200, showConfirmButton: false });
        }
    };

    const toggleStatusDB = (user) => {
        user.status = user.status === 1 ? 0 : 1;
    };

    return {
        usuarios, 
        prestamos, 
        gastos,
        totalUsuarios, 
        cntFree, 
        cntPremium, 
        cntActivos,
        totalPrestamos, 
        montoPrestado, 
        montoPedido, 
        prestamosPendientes,
        totalGastos, 
        promedioGasto,
        guardarUsuarioDB, 
        eliminarUsuarioDB, 
        toggleStatusDB
    };
}