import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { API_URL } from '../constants/api';
import { useAuth } from './auth/useAuth';

// Mapeo plan ↔ rol_id (debe coincidir con test.roles)
const PLAN_A_ROL_ID = { basic: 2, premium: 3, superAdmin: 1 };
const ROL_A_PLAN    = { basic: 'basic', premium: 'premium', superAdmin: 'superAdmin' };
const { token } = useAuth();

export function useAdmin() {

    // ─────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────
    const usuarios  = ref([]);
    const prestamos = ref([]);
    const gastos    = ref([]);
    const loading   = ref(false);
    const error     = ref(null);

    const getHeaders = () => {
        const tokenReal = localStorage.getItem('token');
        //console.log("Token que viaja al backend:", tokenReal);
        return{
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };

    // ─────────────────────────────────────────
    // CARGA INICIAL
    // ─────────────────────────────────────────
    const cargarDatos = async () => {
        

        loading.value = true;
        error.value   = null;
        try {
            const [usrRes, preRes, gasRes] = await Promise.all([
                fetch(`${API_URL}/api/admin/usuarios`,  { headers: getHeaders() }),
                fetch(`${API_URL}/api/admin/prestamos`, { headers: getHeaders() }),
                fetch(`${API_URL}/api/admin/gastos`,    { headers: getHeaders() }),
            ]);

            if (!usrRes.ok || !preRes.ok || !gasRes.ok)
                throw new Error('Error al cargar datos del panel admin');

            const rawUsuarios = await usrRes.json();

            // Agrega campo `plan` derivado del rol para compatibilidad con ModalUsuario
            usuarios.value = rawUsuarios.map(u => ({
                ...u,
                plan: ROL_A_PLAN[u.rol] ?? 'basic'
            }));

            prestamos.value = await preRes.json();
            gastos.value    = await gasRes.json();

        } catch (err) {
            error.value = err.message;
            console.error('useAdmin.cargarDatos:', err);
        } finally {
            loading.value = false;
        }
    };

    // ─────────────────────────────────────────
    // STATS COMPUTADAS
    // ─────────────────────────────────────────
    const clientesReales     = computed(() => usuarios.value.filter(u => u.rol !== 'superAdmin'));
    const totalUsuarios      = computed(() => clientesReales.value.length);
    const cntFree            = computed(() => clientesReales.value.filter(u => u.plan === 'basic').length);
    const cntPremium         = computed(() => clientesReales.value.filter(u => u.plan === 'premium').length);
    const cntActivos         = computed(() => clientesReales.value.filter(u => u.status === 1).length);

    const totalPrestamos     = computed(() => prestamos.value.length);
    const montoPrestado      = computed(() => prestamos.value.filter(p => p.tipo === 'prestado').reduce((a, p) => a + +p.monto, 0));
    const montoPedido        = computed(() => prestamos.value.filter(p => p.tipo === 'pedido').reduce((a, p)  => a + +p.monto, 0));
    const prestamosPendientes= computed(() => prestamos.value.filter(p => p.estado === 'Pendiente').length);

    const totalGastos        = computed(() => gastos.value.reduce((a, g) => a + +g.monto, 0));
    const promedioGasto      = computed(() => gastos.value.length ? Math.round(totalGastos.value / gastos.value.length) : 0);

    // ─────────────────────────────────────────
    // CRUD USUARIOS
    // ─────────────────────────────────────────

    /** Crea o edita un usuario. `modo` = 'create' | 'edit' */
    const guardarUsuarioDB = async (datos, modo) => {
        if (!datos.nombre || !datos.email) {
            Swal.fire({ title: 'Campos requeridos', text: 'Nombre y correo son obligatorios.', icon: 'warning', confirmButtonColor: '#00B4B4' });
            return false;
        }

        const payload = {
            nombre:          datos.nombre,
            apellidoPaterno: datos.apellidoPaterno || '',
            apellidoMaterno: datos.apellidoMaterno || '',
            email:           datos.email,
            rol_id:          PLAN_A_ROL_ID[datos.plan] ?? 3,
            status:          datos.status ?? 1,
        };

        try {
            if (modo === 'edit') {
                const res = await fetch(`${API_URL}/api/admin/usuarios/${datos.id}`, {
                    method:  'PUT',
                    headers: getHeaders(),
                    body:    JSON.stringify(payload)
                });
                if (!res.ok) {
                    const d = await res.json();
                    throw new Error(d.message);
                }
                // Actualizar estado local sin recargar todo
                const idx = usuarios.value.findIndex(u => u.id === datos.id);
                if (idx !== -1) usuarios.value[idx] = { ...usuarios.value[idx], ...datos };
                Swal.fire({ title: 'Usuario actualizado', icon: 'success', confirmButtonColor: '#00B4B4', timer: 1500, showConfirmButton: false });

            } else {
                // Para crear necesitamos password. Si no viene, pedirlo con Swal
                let password = datos.password;
                if (!password) {
                    const { value } = await Swal.fire({
                        title:             'Contraseña inicial',
                        text:              'Define la contraseña temporal para el nuevo usuario.',
                        input:             'password',
                        inputPlaceholder:  'Contraseña (min. 8 caracteres)',
                        confirmButtonColor:'#00B4B4',
                        showCancelButton:  true,
                        cancelButtonText:  'Cancelar',
                        inputValidator: v => (!v || v.length < 8) ? 'Mínimo 8 caracteres.' : null
                    });
                    if (!value) return false;
                    password = value;
                }

                const res  = await fetch(`${API_URL}/api/admin/usuarios`, {
                    method:  'POST',
                    headers: getHeaders(),
                    body:    JSON.stringify({ ...payload, password })
                });
                const created = await res.json();
                if (!res.ok) throw new Error(created.message);

                usuarios.value.unshift({
                    ...datos,
                    id:            created.id,
                    fechaRegistro: new Date().toISOString().split('T')[0],
                    plan:          datos.plan ?? 'basic'
                });
                Swal.fire({ title: '¡Usuario creado!', icon: 'success', confirmButtonColor: '#00B4B4', timer: 1500, showConfirmButton: false });
            }
            return true;

        } catch (err) {
            Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonColor: '#00B4B4' });
            return false;
        }
    };

    const eliminarUsuarioDB = async (user) => {
        const result = await Swal.fire({
            title:              '¿Eliminar usuario?',
            html:               `Se eliminará a <strong>${user.nombre} ${user.apellidoPaterno}</strong> permanentemente.`,
            icon:               'warning',
            showCancelButton:   true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor:  '#94a3b8',
            confirmButtonText:  'Sí, eliminar',
            cancelButtonText:   'Cancelar',
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch(`${API_URL}/api/admin/usuarios/${user.id}`, {
                method:  'DELETE',
                headers: getHeaders()
            });
            if (!res.ok) throw new Error('No se pudo eliminar');
            usuarios.value = usuarios.value.filter(u => u.id !== user.id);
            Swal.fire({ title: 'Eliminado', icon: 'success', confirmButtonColor: '#00B4B4', timer: 1200, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonColor: '#00B4B4' });
        }
    };

    /** Toggle local inmediato + sincroniza con la BD */
    const toggleStatusDB = async (user) => {
        const nuevoStatus = user.status === 1 ? 0 : 1;
        user.status = nuevoStatus;
        try {
            await fetch(`${API_URL}/api/admin/usuarios/${user.id}`, {
                method:  'PUT',
                headers: getHeaders(),
                body:    JSON.stringify({
                    nombre:          user.nombre,
                    apellidoPaterno: user.apellidoPaterno,
                    apellidoMaterno: user.apellidoMaterno,
                    email:           user.email,
                    rol_id:          PLAN_A_ROL_ID[user.plan] ?? 3,
                    status:          nuevoStatus
                })
            });
        } catch (err) {
            // Revertir si falla
            user.status = nuevoStatus === 1 ? 0 : 1;
            console.error('toggleStatus:', err);
        }
    };

    onMounted(cargarDatos);

    return {
        // Estado
        usuarios, prestamos, gastos,
        loading, error,

        // Stats
        totalUsuarios, cntFree, cntPremium, cntActivos,
        totalPrestamos, montoPrestado, montoPedido, prestamosPendientes,
        totalGastos, promedioGasto,

        // Acciones
        guardarUsuarioDB, eliminarUsuarioDB, toggleStatusDB,
        cargarDatos
    };
}