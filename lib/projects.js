var fs = require('fs'),
    marked = require('marked'),
    projectsDir = __dirname + '/../projects';

function all() {
  return fs.readdirSync(projectsDir)
    .filter(isProjectDir)
    .sort()
    .map(readProject);
}

function isProjectDir(entry) {
  return entry.match(/^\d+\-/);
}

function readProject(dirname) {
  var dir = expandProjectDir(dirname);
  return {
    slug: dirname.match(/\d+\-(.*)/)[1],
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
      titleContentMatch = html.match(/<h1>(.+?)<\/h1>\s+(.+)/mi);
  return {
    name: titleContentMatch[1],
    text: titleContentMatch[2]
  };
}

function readPhotos(dir) {
  return fs.readdirSync(dir)
    .filter(isPhoto)
    .sort()
    .map(photoDetailsFromFilename);
}

function isPhoto(entry) {
  return entry.match(/^\d+.*\.jpg$/);
}

function photoDetailsFromFilename(filename) {
  var match = filename.match(/\d+\-(.+?) (.*)\.jpg$/);
  return {
    filename: filename,
    size: match[1],
    title: match[2]
  };
}

exports.all = all;