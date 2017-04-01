var httpRequest = require('request');
var passport = require('passport');
var logger = require('../config/logger');
var constant = require('../constants/constants');
var FB = require('fb');


module.exports = {
    loginAdmin: function (request, response) {
        var responseObj = new Object();
        var token = request.body.token;
        var clientId = request.body.clientId;
        logger.debug('>loginAdmin() clientId=%s', clientId);
        if (!token || !clientId) {
            responseObj.code = constant.ERROR_CODE_MISSING_PARAM;
            responseObj.description = constant.ERROR_DESC_MISSING_PARAM;
            logger.error("Missing parameter");
            logger.debug('<loginAdmin()');
            response.status(400).send(JSON.stringify(responseObj));
        } else {
            var facebookUrl = 'https://graph.facebook.com/me?access_token=' + token;
            httpRequest(
                facebookUrl,
                function (err, res, body) {
                    console.log('Response : ');
                    if (res.statusCode != 200) {
                        responseObj.code = constant.ERROR_CODE_INVALID_PARAM;
                        responseObj.description = constant.ERROR_DESC_INVALID_PARAM;
                        logger.error("Exception while validating token from facebook " + res.body);
                        logger.debug('<loginAdmin()');
                        response.status(400).send(JSON.stringify(responseObj));
                    } else {
                        var facebookValidRes = JSON.parse(res.body);
                        if (!facebookValidRes ||
                            clientId != facebookValidRes.id) {
                            logger.error("email ID mismatch in facebook response");
                            logger.debug("<loginAdmin");
                            responseObj.code = constant.ERROR_CODE_INVALID_PARAM;
                            responseObj.description = constant.ERROR_DESC_INVALID_PARAM;
                            response.status(401).send(JSON.stringify(responseObj));
                        } else if (facebookValidRes.id == clientId) {
                            responseObj.code = 0;
                            responseObj.name = facebookValidRes.name;
                            responseObj.token = token;
                            logger.debug("<loginAdmin success response=%s", responseObj);
                            response.status(200).send(JSON.stringify(responseObj));
                        }
                    }
                });
        }
    },
    postMessage: function (request, response) {
        var responseObj = new Object();
        var token = request.body.token;
        var message = request.body.message;
        logger.debug('>postmessage() message=%s', message);
        if (!token || !message) {
            responseObj.code = constant.ERROR_CODE_MISSING_PARAM;
            responseObj.description = constant.ERROR_DESC_MISSING_PARAM;
            logger.error("Missing parameter");
            logger.debug('<postmessage()');
            response.status(400).send(JSON.stringify(responseObj));
        } else {
            FB.api(
                "/me/feed",
                "POST",
                {
                    "access_token": token,
                    "message": message
                },
                (responseFacebook) => {
                    if (!responseFacebook || responseFacebook.error) {
                        responseObj.code = constant.ERROR_CODE_DUPLICATE_ENTRY;
                        responseObj.description = responseFacebook.error.message;
                        logger.error("Any error");
                        logger.debug('<loginAdmin()');
                        response.status(400).send(JSON.stringify(responseObj));
                    } else {
                        responseObj.code = 0;
                        response.status(200).send(JSON.stringify(responseObj));
                    }
                }
            );
        }
    }
};