import { useRouter } from "vue-router";
import { useAuth } from "./useAuth";
import Swal from "sweetalert2";

export function useLogout() {

	const router = useRouter();

	const manejadorLogout = async () => {
		const confirm = await Swal.fire({
			title: "¿Quieres Cerrar Sesion?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Si, cerrar sesion",
			cancelButtonText: "No, mantener mi sesion",
			confirmButtonColor: '#078101',
			cancelButtonColor: '#ff272a',
		});

		if(confirm.isConfirmed) {
			const { logoutSession } = useAuth();
			logoutSession();
			router.push("/");
		}
	};
	return{
		manejadorLogout
	}
}
