const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extrae texto de un archivo PDF
 * @param {Buffer} buffer - Bytes del archivo PDF
 * @returns {Promise<string>} Texto extraído
 */
async function extractFromPdf(buffer) {
  const data = await pdfParse(buffer);

  if (!data.text || data.text.trim().length === 0) {
    throw new Error('No se pudo extraer texto del PDF. Favor de validar nuevamente.');
  }

  return data.text.trim();
}

/**
 * Extrae texto de un archivo DOCX
 * @param {Buffer} buffer - Bytes del archivo DOCX
 * @returns {Promise<string>} Texto extraído
 */
async function extractFromDocx(buffer) {
  const result = await mammoth.extractRawText({ buffer });

  if (!result.value || result.value.trim().length === 0) {
    throw new Error('No se pudo extraer texto del DOCX. El archivo puede estar vacío.');
  }

  return result.value.trim();
}

/**
 * Extrae texto de un archivo según su tipo MIME
 * @param {Buffer} buffer - Bytes del archivo
 * @param {string} mimetype - Tipo MIME del archivo
 * @returns {Promise<string>} Texto extraído
 */
async function extractText(buffer, mimetype) {
  if (mimetype === 'application/pdf') {
    return extractFromPdf(buffer);
  }

  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return extractFromDocx(buffer);
  }

  throw new Error('Formato de archivo no soportado');
}

module.exports = { extractText };