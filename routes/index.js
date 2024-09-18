const express = require('express');
const routes = express.Router();
const controller = require('../controllers/mainController');
const passport = require("../middleware/auth");
const authenticateUser = require("../middleware/authMiddle");

routes.get('/', authenticateUser, controller.defaultController);
routes.get('/signIn', controller.signInController);
routes.get('/signUp', controller.signUpController);
routes.get('/form', controller.formController);
routes.get('/userBlog', controller.viewController);
routes.get('/editBlog/:id', controller.editController);
routes.get('/deleteBlog/:id', controller.deleteController);
routes.get("/myProfile", controller.myProfile);
routes.post('/editProfile', controller.editProfile);
routes.get('/allBlog', controller.allBlog);
routes.get("/changepassword", controller.changepassword);
routes.get("/forgetPass", controller.forgetPass);
routes.post("/findUser", controller.findUser);
routes.get("/otpValidation", controller.otpValidation);
routes.post("/submitOtp", controller.submitOtp);
routes.get("/resetPass", controller.resetPass);
routes.post("/newPass", controller.newPass);
routes.post('/add', controller.addBlog);
routes.post('/addProfile', controller.addProfile);
routes.post("/changePassword", controller.changePassword);
routes.post('/registerAdmin', controller.registerAdmin);
routes.post('/loginAdmin', passport.authenticate('local', { failureRedirect: '/signIn', successRedirect: '/' }));
routes.get('/logoutAdmin', controller.logoutAdmin);


module.exports = routes;