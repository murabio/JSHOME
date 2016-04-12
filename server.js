var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(2080, function(){
    console.log('Server running on 2080...');
});
