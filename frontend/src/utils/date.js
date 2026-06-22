export const obtenerHoy = () => {
    const fecha = new Date();
    // Ajuste de zona horaria para que no te tire el día anterior si es de noche
    fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset());
    return fecha.toISOString().split('T')[0]; // Devuelve 'YYYY-MM-DD'
};