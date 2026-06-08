
<script setup>
    import { ref, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import BaseDataTable from '../../components/dashboard/BaseDataTable.vue';
    import Swal from 'sweetalert2';

    const router = useRouter();

    const columnasAdmin = [
    { key: 'nombre', label: 'Usuario' },
    { key: 'email', label: 'Correo Electrónico' },
    { key: 'rolId', label: 'Rol (TINYINT)' },
    { key: 'status', label: 'Estado' },
    { key: 'acciones', label: 'Acciones' } // Columna comodín para tus botones
    ];


    const listaUsuarios = ref([
    { id: 1, nombre: 'Miguel Gómez', email: 'miguel.gomez@ipn.mx', rolId: 1, status: 1 },
    { id: 2, nombre: 'Rocio Perez', email: 'rocio.v@gmail.com', rolId: 2, status: 1 },
    { id: 3, nombre: 'Juan Pérez', email: 'juan.perez@outlook.com', rolId: 3, status: 1 },
    { id: 4, nombre: 'Lucas Pereyra', email: 'lucas.p@gmail.com', rolId: 3, status: 0 }
    ]);

    // 📊 COMPUTADAS PARA CONTADORES
    const totalPremium = computed(() => listaUsuarios.value.filter(u => u.rolId === 2).length);
    const totalActivos = computed(() => listaUsuarios.value.filter(u => u.status === 1).length);

    // 🔍 MODAL LOGIC
    const modalAbierto = ref(false);
    const usuarioSeleccionado = ref(null);
    const movimientosUsuario = ref([]);

    // 💵 MOVIMIENTOS MOCK (Simulando los préstamos informales del sistema)
    const deudasMock = {
    2: [
        { id: 101, tipo: 'presté', concepto: 'Préstamo para comida familiar', monto: '1,500', vence: '15/06/2026', estado: 'Pendiente' },
        { id: 102, tipo: 'pedí', concepto: 'Gasolina viaje Acapulco', monto: '600', vence: '10/06/2026', estado: 'Saldado' }
    ],
    3: [
        { id: 103, tipo: 'presté', concepto: 'Préstamo herramientas taller', monto: '800', vence: '20/06/2026', estado: 'Pendiente' }
    ]
    };

    // 🛠️ MÉTODOS INTERACTIVOS SIMULADOS
    const cambiarRolSimulado = (user) => {
    Swal.fire({
        title: 'Rol Actualizado',
        text: `El usuario ${user.nombre} ahora tiene el rolId: ${user.rolId}`,
        icon: 'success',
        confirmButtonColor: '#00B4B4'
    });
    };

    const toggleStatusSimulado = (user) => {
    user.status = user.status === 1 ? 0 : 1;
    const accion = user.status === 1 ? 'activado' : 'bloqueado';
    
    Swal.fire({
        title: `Usuario ${accion}`,
        text: `Se modificó el status a ${user.status}. (deletedAt registrado en backend)`,
        icon: 'info',
        confirmButtonColor: '#00B4B4'
    });
    };

    const abrirMovimientos = (user) => {
    usuarioSeleccionado.value = user;
    movimientosUsuario.value = deudasMock[user.id] || [];
    modalAbierto.value = true;
    };

    const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    router.push('/login');
    };
</script>

<template>
    <div class="min-h-screen bg-slate-50 p-6 font-sans">
    
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 class="text-3xl font-black text-slate-800 tracking-tight">Panel de Administración</h1>
                <p class="text-sm text-slate-500 mt-1">Gestioná los usuarios, roles y auditoría de Cuentas Claras</p>
            </div>
            <button @click="cerrarSesion" class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors">
                Cerrar Sesión
            </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Usuarios</p>
                <p class="text-2xl font-black text-slate-800 mt-1">{{ listaUsuarios.length }}</p>
            </div>
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <p class="text-xs font-bold text-teal-500 uppercase tracking-wider">Usuarios Premium</p>
                <p class="text-2xl font-black text-slate-800 mt-1">{{ totalPremium }}</p>
            </div>
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <p class="text-xs font-bold text-green-500 uppercase tracking-wider">Cuentas Activas</p>
                <p class="text-2xl font-black text-slate-800 mt-1">{{ totalActivos }}</p>
            </div>
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <p class="text-xs font-bold text-red-400 uppercase tracking-wider">Cuentas Bloqueadas</p>
                <p class="text-2xl font-black text-slate-800 mt-1">{{ listaUsuarios.length - totalActivos }}</p>
            </div>
        </div>

        <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        
            <div class="overflow-x-auto">
                <BaseDataTable 
                    titulo="Control Maestro de Usuarios" 
                    :headers="columnasAdmin" 
                    :items="listaUsuarios"
                >
                    <template #rolId="{ row }">
                        <span class="text-xs font-bold font-mono bg-slate-100 px-2 py-1 rounded-lg text-slate-600">
                            ID: {{ row.rolId }}
                        </span>
                    </template>

                    <template #status="{ row }">
                        <span :class="row.status === 1 ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'" class="px-2 py-0.5 rounded-full text-xs font-semibold">
                            {{ row.status === 1 ? 'Activo' : 'Inactivo' }}
                        </span>
                    </template>

                    <template #acciones="{ row }">
                        <div class="flex gap-2">
                            <button @click="verMovimientos(row)" class="bg-[#00B4B4] text-white text-xs px-3 py-1.5 rounded-xl font-bold">
                                Espiar
                            </button>
                        </div>
                    </template>
                </BaseDataTable>
            </div>
        </div>

        <div v-if="modalAbierto" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div class="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl transform scale-100 transition-all">
                <div class="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                    <div>
                        <h3 class="font-black text-xl text-slate-800">Historial Financiero</h3>
                        <p class="text-xs text-slate-400 mt-0.5">Usuario: {{ usuarioSeleccionado.nombre }}</p>
                    </div>
                    <button @click="modalAbierto = false" class="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
                </div>

                <div class="space-y-3 max-h-96 overflow-y-auto pr-1">
                    <div 
                        v-for="mov in movimientosUsuario" 
                        :key="mov.id" 
                        class="flex justify-between items-center p-4 rounded-2xl border border-slate-100 bg-slate-50/50"
                    >
                        <div>
                            <span 
                                :class="mov.tipo === 'presté' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'"
                                class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border inline-block mb-1"
                            >
                                {{ mov.tipo === 'presté' ? 'Prestó dinero' : 'Pidió Prestado' }}
                            </span>
                            <p class="font-bold text-sm text-slate-700">{{ mov.concepto }}</p>
                            <p class="text-xs text-slate-400">Fecha límite: {{ mov.vence }}</p>
                        </div>

                        <div class="text-right">
                            <p :class="mov.tipo === 'presté' ? 'text-emerald-600' : 'text-amber-600'" class="font-black text-base">
                                {{ mov.tipo === 'presté' ? '+' : '-' }}${{ mov.monto }}
                            </p>
                            <p class="text-[11px] font-bold text-slate-400 uppercase mt-0.5">{{ mov.estado }}</p>
                        </div>
                    </div>
                    <p v-if="movimientosUsuario.length === 0" class="text-center text-xs text-slate-400 py-6"> Este usuario no registra movimientos aún.</p>
                </div>
            </div>
        </div>
    </div>
</template>