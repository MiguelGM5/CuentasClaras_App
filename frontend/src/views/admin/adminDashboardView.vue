<script setup>
import { ref, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import { Users, CreditCard, LayoutDashboard, Receipt, Menu } from "lucide-vue-next";

import { useAdmin } from "../../composables/useAdmin.js";

// Componentes de la UI
import Sidebar from "../../components/layout/Sidebar.vue";
import TabOverview from "./components/TabOverview.vue";
const TabUsuarios = defineAsyncComponent(() => import("./components/TabUsuarios.vue"));
const TabPrestamos = defineAsyncComponent(() => import("./components/TabPrestamos.vue"));
const TabGastos = defineAsyncComponent(() => import("./components/TabGastos.vue"));
const ModalUsuario = defineAsyncComponent(() => import("./components/ModalUsuario.vue"));

const router = useRouter();
const sidebarAbierto = ref(false);

const {
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
} = useAdmin();

// NAVEGACIÓN Y CONFIGURACIÓN GLOBAL
const tabActivo = ref("overview");
const tabsConfig = {
    overview: TabOverview,
    usuarios: TabUsuarios,
    prestamos: TabPrestamos,
    gastos: TabGastos
};
const usuarioSesion = JSON.parse(localStorage.getItem('user') || '{}');
const rolUsuario = usuarioSesion.rol || 'superAdmin';
const datosSidebar = {
    nombre: `${usuarioSesion.nombre || 'Super'} ${usuarioSesion.apellido_paterno || 'Admin'}`,
    inicial: (usuarioSesion.nombre || 'S').charAt(0).toUpperCase()
}

const menuAdmin = [
    { key: 'overview',  label: 'Dashboard',  icon: LayoutDashboard },
    { key: 'usuarios',  label: 'Usuarios',   icon: Users           },
    { key: 'prestamos', label: 'Préstamos',  icon: CreditCard      },
    { key: 'gastos',    label: 'Gastos',     icon: Receipt         },
];

const modalUsuario = ref(false);
const modalModo = ref("create"); 
const usuarioEnFoco = ref({ nombre: "", apellidoPaterno: "", email: "", rol: "user", plan: "free", status: 1 });

const abrirCrear = () => {
	modalModo.value = "create";
	usuarioEnFoco.value = { nombre: "", apellidoPaterno: "", email: "", rol: "user", plan: "free", status: 1 };
	modalUsuario.value = true;
};

const abrirEditar = (user) => {
	modalModo.value = "edit";
	usuarioEnFoco.value = { ...user };
	modalUsuario.value = true;
};

const abrirVer = (user) => {
	modalModo.value = "view";
	usuarioEnFoco.value = { ...user };
	modalUsuario.value = true;
};

const procesarGuardado = (datos) => {
    const exito = guardarUsuarioDB(datos, modalModo.value);
    if (exito) modalUsuario.value = false; 
};

const cerrarSesion = () => {
	localStorage.removeItem("user");
	localStorage.removeItem("token");
	router.push("/login");
};
</script>

<template>
    <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">

        <Sidebar 
            v-model="tabActivo" 
            :subtitulo="rolUsuario" 
            :items="menuAdmin" 
            :usuario="datosSidebar" 
            :isOpen="sidebarAbierto"
            @logout="cerrarSesion" 
            @irAPerfil="router.push('/admin/perfil')"
            @close="sidebarAbierto = false"
        />

        <div class="flex-1 flex flex-col min-h-screen min-w-0 md:ml-60">
            <!-- Header Móvil Admin -->
            <header class="md:hidden bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                <div 
                    @click="tabActivo = 'overview'" 
                    class="flex items-center gap-2 cursor-pointer group"
                    title="Ir a Dashboard"
                >
                    <img src="../../assets/LogoRecortado.png" alt="Admin" class="h-8 w-auto object-contain group-hover:scale-105 transition-transform" />
                    <span class="font-black text-[#001D3D] text-lg group-hover:text-[#00B4B4] transition-colors">Panel Admin</span>
                </div>
                <button 
                    @click="sidebarAbierto = true"
                    class="p-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                    aria-label="Abrir menú"
                >
                    <Menu :size="24" />
                </button>
            </header>

            <main class="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
                <keep-alive>
                    <component 
                        :is="tabsConfig[tabActivo]"
                        :usuarios="usuarios"
                        :prestamos="prestamos"
                        :gastos="gastos"
                        :totalUsuarios="totalUsuarios"
                        :cntFree="cntFree"
                        :cntPremium="cntPremium"
                        :cntActivos="cntActivos"
                        :totalPrestamos="totalPrestamos"
                        :prestamosPendientes="prestamosPendientes"
                        :montoPrestado="montoPrestado"
                        :montoPedido="montoPedido"
                        :totalGastos="totalGastos"
                        :promedioGasto="promedioGasto"
                        @cambiarTab="tabActivo = $event"
                        @abrirCrear="abrirCrear"
                        @abrirVer="abrirVer"
                        @abrirEditar="abrirEditar"
                        @eliminarUsuario="eliminarUsuarioDB" 
                        @toggleStatus="toggleStatusDB" 
                    />
                </keep-alive>
            </main>
        </div>

        <ModalUsuario 
            v-model="modalUsuario" 
            :mode="modalModo" 
            :usuario="usuarioEnFoco"
            :totalPrestamos="prestamos.filter((p) => p.usuarioId === usuarioEnFoco?.id).length"
            :totalGastos="gastos.filter((g) => g.usuarioId === usuarioEnFoco?.id).length" 
            @guardar="procesarGuardado"
            @cambiarAModoEditar="modalModo = 'edit'" 
        />

    </div>
</template>