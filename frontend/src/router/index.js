import { createRouter, createWebHistory } from 'vue-router';

const LoginView = () => import('../views/Login.vue');
const PrestamosView = () => import('../views/PrestamosView.vue');
const RegisterView = () => import('../views/RegisterView.vue');

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
	}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router