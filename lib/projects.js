var fs = require('fs'),
    marked = require('marked'),
    projectsDir = __dirname + '/../projects';

function all() {
  return fs.readdirSync(projectsDir)
    .filter(isProjectDir)
    .map(readProject)
    .sort(function(p1, p2) {
      return p1.number > p2.number ? 1 : -1;
    });
}

function isProjectDir(entry) {
  return entry.match(/^\d+\-/);
}

function readProject(dirname) {
  var dir = expandProjectDir(dirname),
      match = dirname.match(/(\d+)\-(.*)/);
  return {
    number: match[1],
    slug: match[2],
    about: parseAbout(dir),
    photos: readPhotos(dir),
    dir: dir
  };
}

function expandProjectDir(dirname) {
  return projectsDir + "/" + dirname;
}

function parseAbout(dir) {
  var markdown = fs.readFileSync(dir + "/about.markdown", {encoding:'utf8'}),
      html = marked(markdown),
      title = html.match(/<h1>(.+?)<\/h1>/i)[1],
      text = html.replace(title,'');
  return {
    name: title,
    text: text
  };
}

function readPhotos(dir) {
  return fs.readdirSync(dir)
    .filter(isPhoto)
    .map(photoDetailsFromFilename)
    .sort(function(p1, p2) {
      return p1.number > p2.number ? 1 : -1;
    });
}

var photoFilenamePattern = /(\d+)[ -](.+?)[ -](.*)\.(jpg|png|gif)$/i;

function isPhoto(entry) {
  return entry.match(photoFilenamePattern);
}

function photoDetailsFromFilename(filename) {
  var match = filename.match(photoFilenamePattern);
  if (!match)
    throw "Photo filename not formatted correctly" + filename;
  return {
    number: parseInt(match[1]),
    filename: filename,
    size: match[2],
    title: match[3]
  };
}

exports.all = all;