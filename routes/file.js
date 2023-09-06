const express = require('express')
const router = express.Router()
const fileCtrl = require('../controllers/file')
const multer = require('../middleware/multer-blob')
const auth = require('../middleware/auth')

router.get('/', fileCtrl.getFiles)
router.get('/:id', fileCtrl.getFile)
router.post('/', auth, multer, fileCtrl.createFile)
router.put('/:id', auth, multer, fileCtrl.updateFile)
router.delete('/:id', auth, fileCtrl.deleteFile)

module.exports = router