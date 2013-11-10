var express = require('express'),
    http = require('http'),
    path = require('path'),
    exphbs = require('express3-handlebars'),
    marked = require('marked'),
    projects = require('./lib/projects');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('imageHost', process.env["IMAGE_HOST"] || "localhost:3000");
app.set('appHost', process.env["APP_HOST"] || "localhost:3000");
app.set('staticMaxAge', 3600 * 1000); // one hour

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    imageUrl: function() {
      return "http://" + app.get('imageHost') + Array.prototype.slice.call(arguments, 0,-1).join('');
    },
    markdown: function(options) {
      return marked(options.fn(this));
    }
  }
}));

app.set('view engine', 'handlebars');

app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(function(req, res, next) {
  res.locals.currentUrl = 'http://' + app.get('appHost') + req.originalUrl;
  next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public'), {maxAge:app.get('staticMaxAge')}));

express.static.mime.define({
  // Use application/font-woff rather than application/x-font-woff
  'application/font-woff': ['woff']
});

function findProject(slug) {
  return projects.all()
    .filter(function(project) {
      return project.slug == slug;
    })[0];
}

function nextProject(project) {
  var allProjects = projects.all();
  for (var i = 0; i < allProjects.length; i++) {
    var prev = allProjects[i-1];
    if (prev && prev.slug == project.slug) return allProjects[i];
  }
  return null;
}

function findProjectPhoto(project, filename) {
  return project.photos
    .filter(function(photo) {
      return photo.filename == filename;
    })[0];
}

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {
  res.header('Cache-Control', 'public, max-age=300'); // 5 minutes
  res.render('home', {
    title: 'Carla Hackett',
    projects: projects.all(),
    noHeaderLink: true
  });
});

app.get('/about', function(req, res) {
  res.header('Cache-Control', 'public, max-age=300'); // 5 minutes
  res.render('about', {
    title: 'About Carla Hackett'
  });
});

app.get('/projects', function(req, res) {
  res.redirect(302, '/');
});

app.get('/projects/:slug', function(req, res) {
  res.header('Cache-Control', 'public, max-age=300'); // 5 minutes
  var project = findProject(req.params.slug);
  if (!project) return res.send(404);
  var next = nextProject(project);
  res.render('project', {
    title: project.about.name + ' | Carla Hackett Lettering',
    project: project,
    nextProject: next,
    description: project.about.textWithoutLinks,
    image: "http://" + app.get('imageHost') + "/projects/" + project.slug + "/cover.jpg",
    preRender: next && ('/projects/' + next.slug)
  });
});

app.get('/projects/:slug/photos/:filename', function(req, res) {
  var project = findProject(req.params.slug);
  if (!project) return res.send(404);
  var photo = findProjectPhoto(project, req.params.filename);
  if (!photo) return res.send(404);
  res.sendfile(photo.filename, {root:project.dir, maxAge:app.get('staticMaxAge')});
});

app.get('/projects/:slug/cover.jpg', function(req, res) {
  var project = findProject(req.params.slug);
  if (!project) return res.send(404);
  res.sendfile("cover.jpg", {root:project.dir, maxAge:app.get('staticMaxAge')});
});

app.get('/desktops', function(req, res) {
  res.render('desktops', {
    title: 'Desktops from Carla Hackett Lettering',
    description: 'A selection of damn fine desktops, made just for you, with love.'
  });
});

var server = http.createServer(app);

server.on('error', function(err) {
  if (err.errno === 'EADDRINUSE')
    console.log("Website is already running at http://" + app.get('appHost') + '/');
  else
    console.log(err);

  process.exit(1);
});

server.listen(app.get('port'), function(){
  var url = 'http://' + app.get('appHost') + "/";
  console.log("Carla Hackett site running at " + url);
  if (process.env["OPEN_BROWSER"])
    require('child_process').spawn('open', [url]);
});