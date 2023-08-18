const express = require('express')
const router = express.Router()
const cvCtrl = require('../controllers/cv')
const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth')

router.get('/', cvCtrl.getCvs)
router.get('/:id', cvCtrl.getSpecific)
router.post('/', auth, cvCtrl.createCv)
router.put('/:id', auth, cvCtrl.updateSpecific)
router.delete('/:id', auth, multer, cvCtrl.deleteSpecific)

module.exports = router