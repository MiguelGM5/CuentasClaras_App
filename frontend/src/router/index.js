import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../composables/auth/useAuth.js';

const LoginView = () => import('../views/auth/Login.vue');
const RegisterView = () => import('../views/auth/RegisterView.vue');
const AdminDashboardView = () => import('../views/admin/adminDashboardView.vue');
const FreeDashboardView = () => import('../views/free/freeDashboardView.vue');
const PerfilView = () => import('../views/perfil/perfilView.vue');
const LandingPage = () => import('../views/landing/landing.vue');

const routes = [
	{
		path: '/',
		name: 'Landing',
		component: LandingPage
	},
	{
		path: '/login',
		name: 'Login',
		component: LoginView
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
		meta:{requiresAuth: true, rolesPermitidos: ["superAdmin"]}
	},
	{
		path: '/admin/perfil',
		name: 'PerfilAdmin',
		component: PerfilView,
		meta:{requiresAuth: true, rolesPermitidos: ["superAdmin"]}
	},
	{
		path: '/user/dashboard',
		name: 'Free',
		component: FreeDashboardView,
		meta:{requiresAuth: true}
	},
	{
		path: '/user/perfil',
		name: 'Perfil',
		component: PerfilView,
		 meta: { requiresAuth: true }
	}
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
})

router.beforeEach((to) => {
    const { isLoggedIn, userRole } = useAuth();

    if (to.meta.requiresAuth && !isLoggedIn.value) {
        return { name: 'Login' };
    }
    
    if (isLoggedIn.value && (to.name === 'Login' || to.name === 'Registro')) {
        return userRole.value === 'superAdmin' ? { name: 'Admin' } : { name: 'Free' };
    }

	if(to.path.startsWith('/admin') && userRole.value !== 'superAdmin'){
		return { name: 'Free' };
	}

    return true; 
});

export default router