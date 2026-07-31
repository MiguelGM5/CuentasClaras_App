const db = require("../config/db");

const Admin = {
  getAllUsuarios: async () => {
    const [rows] = await db.execute(
      `SELECT u.id,
                    u.nombre,
                    u.apellido_paterno  AS apellidoPaterno,
                    u.apellido_materno  AS apellidoMaterno,
                    u.email,
                    u.status,
                    DATE_FORMAT(u.createdAt, '%Y-%m-%d') AS fechaRegistro,
                    r.nombre_rol        AS rol,
                    r.id                AS rol_id
             FROM usuarios u
             INNER JOIN roles r ON u.rol_Id = r.id
             ORDER BY u.createdAt DESC`,
    );
    return rows;
  },

  createUsuario: async ({
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    email,
    password,
    rol_id,
  }) => {
    const [result] = await db.execute(
      `INSERT INTO usuarios
                (nombre, apellido_paterno, apellido_materno, email, password, rol_Id)
             VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        apellidoPaterno || "",
        apellidoMaterno || "",
        email,
        password,
        rol_id || 3,
      ],
    );
    return result.insertId;
  },

  updateUsuario: async (
    id,
    { nombre, apellidoPaterno, apellidoMaterno, email, rol_id, status },
  ) => {
    await db.execute(
      `UPDATE usuarios
             SET nombre=?, apellido_paterno=?, apellido_materno=?, email=?, rol_Id=?, status=?
             WHERE id=?`,
      [
        nombre,
        apellidoPaterno || "",
        apellidoMaterno || "",
        email,
        rol_id,
        status,
        id,
      ],
    );
  },

  deleteUsuario: async (id) => {
    await db.execute("DELETE FROM usuarios WHERE id = ?", [id]);
  },

  // ─────────────────────────────────────────
  // TODOS LOS PRÉSTAMOS (todos los usuarios)
  // ─────────────────────────────────────────
  getAllPrestamos: async () => {
    const [rows] = await db.execute(
        `SELECT p.id,
            p.usuario_id AS usuarioId,
            CONCAT(u.nombre, ' ', u.apellido_paterno) AS usuarioNombre,
            p.tipo, p.deudor, p.concepto, p.monto, p.estado,
            DATE_FORMAT(p.fecha_pago, '%Y-%m-%d') AS fechaPago,
            DATE_FORMAT(DATE_SUB(p.createdAt, INTERVAL 6 HOUR), '%Y-%m-%d') AS fecha        
        FROM prestamos p
        INNER JOIN usuarios u ON p.usuario_id = u.id
        ORDER BY p.id DESC`,
    );
    return rows;
  },

  // ─────────────────────────────────────────
  // TODOS LOS GASTOS (movimientos tipo=gasto)
  // ─────────────────────────────────────────
  getAllGastos: async () => {
    const [rows] = await db.execute(
      `SELECT m.id,
                    m.usuario_id                                    AS usuarioId,
                    CONCAT(u.nombre,' ',u.apellido_paterno)         AS usuarioNombre,
                    m.categoria, m.monto, m.descripcion,
                    DATE_FORMAT(m.fecha, '%Y-%m-%d')                AS fecha
             FROM movimientos m
             INNER JOIN usuarios u ON m.usuario_id = u.id
             WHERE m.tipo = 'gasto'
             ORDER BY m.fecha DESC`,
    );
    return rows;
  },

  // ─────────────────────────────────────────
  // STATS para gráficas
  // ─────────────────────────────────────────
  getStats: async () => {
    // Distribución de usuarios por rol (excluyendo superAdmin del conteo)
    const [byRol] = await db.execute(
        `SELECT r.nombre_rol AS rol, COUNT(*) AS total
             FROM usuarios u
             INNER JOIN roles r ON u.rol_Id = r.id
             GROUP BY r.nombre_rol`,
    );

    // Préstamos registrados por día — últimos 7 días
    const [loansByDay] = await db.execute(
        `SELECT DATE_FORMAT(createdAt, '%Y-%m-%d') AS fecha, COUNT(*) AS total
             FROM prestamos
             WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
             GROUP BY DATE_FORMAT(createdAt, '%Y-%m-%d')
             ORDER BY fecha ASC`,
    );

    return { byRol, loansByDay };
  },
};

module.exports = Admin;
