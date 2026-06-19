import { ref, computed } from "vue";

const token = ref(localStorage.getItem('token'));
const user = ref(null);

try {
    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== 'null' && savedUser !== 'undefined') {
        user.value = JSON.parse(savedUser);
    }
} catch (e) {
    console.error("Error al revivir al usuario del localStorage:", e);
    user.value = null;
}

export function useAuth() {
   
    const isLoggedIn = computed(() => !!token.value);
    const userRole = computed(() => user.value?.rol ? String(user.value.rol) : '');
    const userProfile = computed(() => user.value);

    const loginSession = (newToken, newUser) => {
        token.value = newToken;
        user.value = newUser;
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const logoutSession = () => {
        token.value = null;
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('recentLogin');
    };

    return {
        token,
        user: userProfile,
        isLoggedIn,
        userRole,
        loginSession,
        logoutSession
    };
}