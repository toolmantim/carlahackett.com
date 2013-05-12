var express = require('express'),
    http = require('http'),
    path = require('path'),
    exphbs = require('express3-handlebars');

var app = express();

app.set('port', process.env.PORT || 3000);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {
  res.render('home', {title:'Foxglove Lettering'});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Foxglove site running on http://localhost:" + app.get('port') + "/");
});
