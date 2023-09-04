const fs = require('fs')

function handleImageDeletion(req, res, resMessage) {
  const uploadedImage = `${req.protocol}://${req.get('host')}/images/${req.files[0].filename}`
  const filename = uploadedImage.split('/images/')[1]
  fs.unlink(`images/${filename}`, () => {
    res.status(200).json({ message: resMessage })
  })
}

module.exports = { handleImageDeletion }