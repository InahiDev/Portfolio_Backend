const express= require('express')
const router = express.Router()
const projectCtrl = require('../controllers/project')
const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth')

router.get('/', projectCtrl.getAllProjects)
router.get('/overviews', projectCtrl.getSamples)
router.get('/:id', projectCtrl.getSpecific)
router.post('/', auth, multer, projectCtrl.createProject)
router.put('/:id', auth, multer, projectCtrl.editSpecific)
router.delete('/:id', auth, multer, projectCtrl.deleteProject)

module.exports = router