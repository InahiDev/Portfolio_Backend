const multer = require("multer")

const MIME_TYPES = {
  'application/pdf': 'pdf',
  'application/zip': 'zip',
  'application/x-7z-compressed': '7z',
  'application/x-rar-compressed': 'rar',
  'application/octet-stream': 'arc',
  'application/msword': 'doc'
}

const storage = multer.memoryStorage()

module.exports = multer({ storage }).single('cv')