var express = require('express'),
    http = require('http'),
    path = require('path'),
    exphbs = require('express3-handlebars'),
    projects = require('./lib/projects');

var app = express();

app.set('port', process.env.PORT || 3000);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var allProjects = projects.all();

function findProject(slug) {
  return allProjects
    .filter(function(project) {
      return project.slug == slug;
    })[0];
}

function nextProject(project) {
  for (var i = 0; i < allProjects.length; i++) {
    var prev = allProjects[i-1];
    if (prev && prev.slug == project.slug) return allProjects[i];
  }
  return allProjects[0];
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
  res.render('home', {
    title: 'Foxglove Lettering',
    projects: allProjects,
    noHeaderLink: true
  });
});

app.get('/projects', function(req, res) {
  res.redirect(301, '/');
});

app.get('/projects/:slug', function(req, res) {
  var project = findProject(req.params.slug);
  if (!project) return res.send(404);
  res.render('project', {
    title: project.about.name + ' | Foxglove Lettering',
    project: project,
    nextProject: nextProject(project)
  });
});

app.get('/projects/:slug/photos/:filename', function(req, res) {
  var project = findProject(req.params.slug);
  if (!project) return res.send(404);
  var photo = findProjectPhoto(project, req.params.filename);
  if (!photo) return res.send(404);
  res.sendfile(photo.filename, {root:project.dir});
});

app.get('/projects/:slug/cover.jpg', function(req, res) {
  var project = findProject(req.params.slug);
  if (!project) return res.send(404);
  res.sendfile("cover.jpg", {root:project.dir});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Foxglove site running on http://localhost:" + app.get('port') + "/");
});