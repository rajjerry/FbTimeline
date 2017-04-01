// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : process.env.clientID, // your App ID
        'clientSecret'    : process.env.clientSecret, // your App Secret
        'callbackURL'     : 'http://localhost:8080/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.8/me?fields=first_name,last_name,email'
    },
};
