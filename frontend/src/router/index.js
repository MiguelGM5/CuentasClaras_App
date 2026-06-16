import { createRouter, createWebHistory } from 'vue-router';

const LoginView = () => import('../views/auth/Login.vue');
const PrestamosView = () => import('../views/PrestamosView.vue');
const RegisterView = () => import('../views/auth/RegisterView.vue');
const AdminDashboardView = ()=> import('../views/admin/adminDashboardView.vue');
const FreeDashboardView = ()=> import('../views/free/freeDashboardView.vue');
const PremiumDashboardView = ()=> import('../views/premium/premiumDashboardView.vue');
const PerfilView = () => import('../views/perfil/perfilView.vue');


const routes = [
	{
		path: '/',
		name: 'Login',
		component: LoginView
	},
  	{
    	path: '/prestamos',
		name: "Prestamos",
    	component: PrestamosView
  	},
	{
		path: '/registro',
		name: 'Registro',
		component: RegisterView
	},
	{
		path: '/admin/dashboard',
		name: 'Admin',
		component: AdminDashboardView,
		//meta:{requiresAuth: true, rolesPermitidos: ["super_admin"]}
	},
	{
		path: '/premium/dashboard',
		name: 'Premium',
		component: PremiumDashboardView,
		//meta:{requiresAuth: true, rolesPermitidos: ["premium", "super_admin"]}
	},
	{
		path: '/user/dashboard',
		name: 'Free',
		component: FreeDashboardView,
		//meta:{requiresAuth: true, rolesPermitidos: ["user", "premium", "super_admin"]}
	},
	{
		path: '/perfil',
		name: 'Perfil',
		component: PerfilView,
		// meta: { requiresAuth: true }
	}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/* router.beforeEach((to, from, next) => {
	const loggedUser = JSON.parse(localStorage.getItem('usuario')) || null;
	
}); */

export default router