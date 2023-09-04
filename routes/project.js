const express= require('express')
const router = express.Router()
const projectCtrl = require('../controllers/project')
const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth')

router.get('/', projectCtrl.getAllProjects)
router.get('/overviews', projectCtrl.getSamples)
router.get('/:id', projectCtrl.getSpecific)
router.post('/', auth, projectCtrl.createProject)
router.post('/:id', auth, multer, projectCtrl.addPicture)
router.put('/:id', auth, multer, projectCtrl.editProject)
router.put('/:id/picture', auth, multer, projectCtrl.editProjectPicture)
router.delete('/:id', auth, multer, projectCtrl.deleteProject)

module.exports = router