const express = require('express')
const router = express.Router()
const cvCtrl = require('../controllers/cv')
const multer = require('../middleware/multer-blob')
const auth = require('../middleware/auth')

router.get('/', cvCtrl.getCvs)
router.get('/:id', cvCtrl.getSpecific)
router.post('/', auth, multer, cvCtrl.createCv)
router.put('/:id', auth, multer, cvCtrl.updateSpecific)
router.delete('/:id', auth, cvCtrl.deleteSpecific)

module.exports = router