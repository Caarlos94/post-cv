const prisma = require('../config/database');
const { extractText } = require('../services/parser.service');

/**
 * POST /api/cvs/upload
 * Sube un CV (PDF/DOCX), extrae el texto y lo guarda en la BD
 */
async function uploadCv(req, res) {
  try {
    // Multer ya validó el archivo antes de llegar aquí
    if (!req.file) {
      return res.status(400).json({
        error: 'No se envió ningún archivo. Envía un PDF o DOCX en el campo "cv".',
      });
    }

    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        error: 'El título del CV es requerido',
      });
    }

    // Determinar tipo de archivo
    const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'docx';

    // Extraer texto del archivo
    const originalContent = await extractText(req.file.buffer, req.file.mimetype);

    // Guardar en BD
    const cv = await prisma.cv.create({
      data: {
        title: title.trim(),
        originalContent,
        fileType,
        userId: req.userId,
      },
      select: {
        id: true,
        title: true,
        fileType: true,
        status: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: 'CV subido correctamente',
      cv,
    });
  } catch (error) {
    console.error('Error en uploadCv:', error);

    // Errores de extracción de texto (PDF escaneado, DOCX vacío, etc.)
    if (error.message.includes('No se pudo extraer')) {
      return res.status(422).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: 'Error al procesar el CV',
    });
  }
}

module.exports = { uploadCv };