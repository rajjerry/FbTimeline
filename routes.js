var passport = require('passport');
var authController = require('./controller/authenticationController');

module.exports = function (app) {
    app.post('/loginAdmin', authController.loginAdmin);
    app.post('/postmessage',authController.postMessage);
};
