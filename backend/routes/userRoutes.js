const express = require('express');
const userRouter = express.Router();
const { validateNIN, signup } = require("../controllers/userController");

userRouter.post('/validatenin', validateNIN);

module.exports = userRouter;