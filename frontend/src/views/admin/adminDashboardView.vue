<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Users, CreditCard, LayoutDashboard, Receipt, Import } from "lucide-vue-next";

import { useAdmin } from "../../composables/useAdmin.js";

//Componentes de la UI
import Sidebar from "../../components/layout/Sidebar.vue";
import ModalUsuario from "./components/ModalUsuario.vue";
import TabGastos from "./components/TabGastos.vue";
import TabOverview from "./components/TabOverview.vue";
import TabPrestamos from "./components/TabPrestamos.vue";
import TabUsuarios from "./components/TabUsuarios.vue";

const router = useRouter();

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
const usuarioSesion = JSON.parse(localStorage.getItem('user'));
const rolUsuario = usuarioSesion.rol;
const datosSidebar = {
    nombre: `${usuarioSesion.nombre} ${usuarioSesion.apellido_paterno}`,
    inicial: usuarioSesion.nombre.charAt(0).toUpperCase()
}

const menuAdmin = [
    { key: 'overview',  label: 'Dashboard',  icon: LayoutDashboard },
    { key: 'usuarios',  label: 'Usuarios',   icon: Users           },
    { key: 'prestamos', label: 'Préstamos',  icon: CreditCard      },
    { key: 'gastos',    label: 'Gastos',     icon: Receipt         },
];
const datosAdminLogueado = { nombre: 'Super Admin', email: 'admin@cuentasclaras.mx', inicial: 'A' };

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
	localStorage.removeItem("usuario");
	router.push("/");
};
</script>

<template>
	<div class="min-h-screen bg-slate-50 flex font-sans">

		<Sidebar 
			v-model="tabActivo" 
			subtitulo="rolUsuario" 
			:items="menuAdmin" 
			:usuario="datosSidebar" 
			@logout="cerrarSesion" 
			@irAPerfil="router.push('/admin/perfil')"
		/>

		<main class="ml-60 flex-1 p-8 min-h-screen">
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
                @eliminarUsuario="eliminarUsuario"
                @toggleStatus="toggleStatus"
            />
		</main>

		<ModalUsuario 
			v-model="modalUsuario" 
			:mode="modalModo" 
			:usuario="usuarioEnFoco"
			:totalPrestamos="prestamos.filter((p) => p.usuarioId === usuarioEnFoco?.id).length"
			:totalGastos="gastos.filter((g) => g.usuarioId === usuarioEnFoco?.id).length" @guardar="guardarUsuario"
			@cambiarAModoEditar="modalModo = 'edit'" 
		/>

	</div>
</template>