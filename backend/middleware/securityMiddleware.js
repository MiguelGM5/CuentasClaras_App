// Middleware de cabeceras de seguridad y limitador de peticiones en memoria

// 1. Cabeceras de Seguridad HTTP (Hardening)
const securityHeaders = (req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
};

// 2. Limitador de peticiones por IP (Rate Limiter anti-bruteforce)
const requestCounts = new Map();
const CLEANUP_INTERVAL = 60 * 1000; // Limpieza cada 1 min

setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of requestCounts.entries()) {
        if (now - data.startTime > 15 * 60 * 1000) {
            requestCounts.delete(ip);
        }
    }
}, CLEANUP_INTERVAL);

const rateLimiter = (options = {}) => {
    const windowMs = options.windowMs || 15 * 60 * 1000; // 15 min por defecto
    const max = options.max || 25; // Máximo 25 intentos por ventana por defecto

    return (req, res, next) => {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const now = Date.now();

        if (!requestCounts.has(ip)) {
            requestCounts.set(ip, { count: 1, startTime: now });
            return next();
        }

        const data = requestCounts.get(ip);
        if (now - data.startTime > windowMs) {
            requestCounts.set(ip, { count: 1, startTime: now });
            return next();
        }

        data.count++;
        if (data.count > max) {
            return res.status(429).json({
                error: 'Demasiados intentos desde esta dirección IP. Por favor intenta más tarde.'
            });
        }

        next();
    };
};

// 3. Manejador de Errores Centralizado (Global Error Handler)
const errorHandler = (err, req, res, next) => {
    console.error(`[SERVER ERROR] ${req.method} ${req.url}:`, err.stack || err.message || err);
    
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'Ocurrió un error interno en el servidor. Por favor intenta más tarde.'
            : err.message || 'Error de servidor'
    });
};

module.exports = {
    securityHeaders,
    rateLimiter,
    errorHandler
};
