export const formatearDinero = (monto) => {
    if (isNaN(monto) || monto === null || monto === undefined) return "0.00";
    return Number(monto).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

export const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '';
    const [year, month, day] = fechaStr.split('T')[0].split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("es-MX", { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatearFechaFormatoLargo = (fechaStr) => {
    if (!fechaStr) return '';
    const [year, month, day] = fechaStr.split('T')[0].split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("es-MX", { year: 'numeric', month: 'long', day: 'numeric' });
};
