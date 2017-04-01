/**
 * http://usejsdoc.org/
 */
// call the packages we need
var express = require('express'),
    cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var facebookStrategy = require('./config/passport'); // pass passport for configuration
var logger = require("./config/logger");

facebookStrategy(passport);

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/', express.static(__dirname + '/views'));

app.use(cors());
app.use(bodyParser.json({
    limit: '1mb'
}));

require('./routes.js')(app);


if (module === require.main) {
    // [START server]
    // Start the server
    var server = app.listen(process.env.PORT || 8080, function() {
        var host = server.address().address;
        var port = server.address().port;

        logger.debug('App listening at http://%s:%s', host, port);
    });
    // [END server]
}
module.exports = app;



