
const multer = require('multer');
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

console.log('Cloudinary Object:', cloudinary);

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'products',
        allowed_formats:['jpg',"jpeg",'png'],
    },
});




const upload = multer({storage});

module.exports = upload;

// const multer = require('multer');

// const storage = multer.memoryStorage()

// const upload =  multer({
//     storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
//   })

// module.exports=upload;