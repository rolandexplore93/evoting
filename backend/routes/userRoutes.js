const express = require('express');
const userRouter = express.Router();
const { validateNIN, signup, login, goToUserDashboard, emailOTP, verifyEmailOTP, logout } = require("../controllers/userController");
const multer = require('multer');

// MULTER: Filenames and storage location set up
// const upload = multer({ dest: 'uploads/' })
const storage = multer.diskStorage({ // Configure custom file name
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1000)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  });
  
const upload = multer({ storage: storage });

userRouter.post('/validatenin', validateNIN);
userRouter.post('/signup', 
    upload.fields([{ name: 'uploadID', maxCount: 1 }, { name: 'uploadSelfie', maxCount: 1 }]), 
    (req, res, next) => {
        next(); // Continue to signup controller
    },
    signup,
    (error, req, res, next) => { // Error handling middleware
        if (error) {
            console.log(error);
            res.status(500).send(error.message);
        }
    }
);

userRouter.post('/login', login);
userRouter.get("/userDashboard", goToUserDashboard);
userRouter.post('/emailOTP', emailOTP);
userRouter.post('/verifyEmailOTP', verifyEmailOTP)
userRouter.get('/logout', logout)

module.exports = userRouter;