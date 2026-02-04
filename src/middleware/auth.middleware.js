const { verifyToken } = require('../utils/jwt.utils');

/**
 * Middleware de autenticación
 * Verifica el JWT token en el header Authorization
 * Si es válido, adjunta userId y userEmail al request
 */
function authMiddleware(req, res, next) {
  try {
    // Obtener el header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Token de autenticación requerido',
      });
    }

    // Formato esperado: "Bearer <token>"
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        error: 'Formato de token inválido. Usa: Bearer <token>',
      });
    }

    const token = parts[1];

    // Verificar el token
    const decoded = verifyToken(token);

    // Adjuntar datos del usuario al request
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userPlan = decoded.plan;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado. Por favor inicia sesión de nuevo.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido',
      });
    }

    console.error('Error en authMiddleware:', error);
    return res.status(500).json({
      error: 'Error de autenticación',
    });
  }
}

module.exports = {
  authMiddleware,
};
