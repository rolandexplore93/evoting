const express = require('express');
const adminRouter = express.Router();
const multer = require('multer');
const { adminLogin } = require('../controllers/adminController');

// MULTER: Filenames and storage location set up
// const upload = multer({ dest: 'uploads/' })
const storage = multer.diskStorage({ // Configure custom file name
    destination: function (req, file, cb) {
      cb(null, 'uploadsForAdmin')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1000)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  });
  
const upload = multer({ storage: storage });

adminRouter.post('/adminLogin', adminLogin)
// adminRouter.post('/adminRegistration', adminRegistration)




module.exports = adminRouter;
