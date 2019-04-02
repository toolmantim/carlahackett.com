var express = require('express'),
    http = require('http'),
    path = require('path'),
    exphbs = require('express-handlebars'),
    compression = require('compression'),
    morgan = require('morgan'),
    currencyFormatter = require('currency-formatter'),
    errorHandler = require('errorhandler'),
    marked = require('marked'),
    dedent = require('dentist').dedent,
    handlebarsSvg = require('handlebars-helper-svg'),
    projects = require('./lib/projects');

var workshops = [
  {
    url: 'newyork-august-2017',
    city: 'New York',
    type: 'Two Day Beginner Workshop',
    date: '5th-6th August 2017',
    price: 400,
    currency: 'USD',
    soldOut: true,
    includesFreeLearnBrushLettering: true,
    hidden: true
  },
  {
    url: 'london-august-2017',
    city: 'London',
    type: 'Two Day Beginner Workshop',
    date: '12th-13th August 2017',
    price: 360,
    currency: 'GBP',
    soldOut: true,
    includesFreeLearnBrushLettering: true,
    hidden: true
  },
  {
    url: 'london-showcard-august-2017',
    city: 'London',
    type: 'Two Day Showcard Workshop',
    date: '19th-20th August 2017',
    price: 360,
    currency: 'GBP',
    soldOut: true,
    includesFreeLearnBrushLettering: true,
    hidden: true
  },
  {
    url: 'melbourne-may-2017',
    city: 'Melbourne',
    type: 'Two Day Beginner Workshop',
    date: '20th-21st May 2017',
    price: 430,
    currency: 'AUD',
    soldOut: true,
    hidden: true
  },
  {
    url: 'melbourne-july-2017',
    city: 'Melbourne',
    type: 'One Day Beginner Workshop',
    date: '1st July 2017',
    price: 250,
    currency: 'AUD',
    soldOut: true,
    hidden: true
  },
  {
    url: 'melbourne-showcard-july-2017',
    city: 'Melbourne',
    type: 'Two Day Showcard Workshop',
    date: '8th-9th July 2017',
    price: 430,
    currency: 'AUD',
    soldOut: true,
    hidden: true
  },
  {
    url: 'melbourne-nov-2017',
    city: 'Melbourne',
    type: 'Two Day Beginner Workshop',
    date: '4th-5th Nov 2017',
    price: 550,
    currency: 'AUD',
    soldOut: true,
    hidden: true
  },
  {
    url: 'melbourne-july-2018',
    city: 'Melbourne',
    type: 'One Day Beginner Workshop',
    date: '7th July 2018',
    price: 250,
    currency: 'AUD',
    soldOut: true,
    hidden: true
  },
  {
    url: 'melbourne-nov-2018',
    city: 'Melbourne',
    type: 'Two Day Beginner Workshop',
    date: '10th-11th Nov 2018',
    price: 550,
    currency: 'AUD',
    soldOut: false,
    hidden: true
  },
  {
    url: 'melbourne-mar-2019',
    city: 'Melbourne',
    type: 'Brush Up Sessions',
    date: '2nd-3rd Mar 2019',
    soldOut: false,
    hidden: true,
    priceOptions: [
      { label: 'Two Days', price: 340, currency: 'AUD', primary: true },
      { label: 'Saturday Only', price: 195, currency: 'AUD', secondary: true },
      { label: 'Sunday Only', price: 195, currency: 'AUD', secondary: true }
    ]
  },
  {
    url: 'melbourne-may-2019',
    city: 'Melbourne',
    type: 'Two Day Beginner Workshop',
    date: '18th-19th May 2019',
    price: 550,
    currency: 'AUD',
    soldOut: false,
    includesFreeLearnBrushLettering: true,
    hidden: false
  },
  {
    url: 'melbourne-july-2019',
    city: 'Melbourne',
    type: 'Two Day Beginner Workshop',
    date: '6th-7th July 2019',
    price: 550,
    currency: 'AUD',
    soldOut: false,
    includesFreeLearnBrushLettering: true,
    hidden: false
  },
];

const nonHiddenWorkshops = workshops.filter(function(w) { return !w['hidden']; });

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('imageHost', process.env["IMAGE_HOST"] || "http://localhost:3000");
app.set('appHost', process.env["APP_HOST"] || "http://localhost:3000");
app.set('staticMaxAge', 3600); // one hour

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    imageUrl: function() {
      return app.get('imageHost') + Array.prototype.slice.call(arguments, 0,-1).join('');
    },
    markdown: function(options) {
      return marked(dedent(options.fn(this)));
    },
    svg: handlebarsSvg,
    encodeURIComponent: encodeURIComponent,
    fullWorkshopDescription: function(workshop, label) {
      return workshop.city + ' ' + workshop.type + ', ' + workshop.date + (workshop.priceOptions ? ` (${label})` : '');
    },
    formatPrice: function(amount, currency) {
      return currencyFormatter.format(amount, {
        code: currency,
        precision: 0
      });
    },
    currencyNote: function(currency) {
      return currency == 'USD' ? ' USD' : '';
    },
    concat: function() {
      var args = [];
      for (var index in arguments) {
        var element = arguments[index];
        typeof element === 'string' ? args.push(element) : null;
      }
      return args.join('');
    }
  }
}));

app.set('view engine', 'handlebars');

app.use(morgan('combined'));
app.use(compression());
app.use(function(req, res, next) {
  res.locals.currentUrl = app.get('appHost') + req.originalUrl;
  next();
});
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
  app.use(errorHandler());
}

app.get('/', function(req, res) {
  var allProjects = projects.all();

  res.header('Cache-Control', 'public, max-age=300'); // 5 minutes
  res.render('home', {
    title: 'Carla Hackett',
    projects: allProjects,
    projectCount: allProjects.length + 1,
    noProjectsLink: true,
    navPortfolio: true
  });
});

app.get('/about', function(req, res) {
  res.header('Cache-Control', 'public, max-age=300'); // 5 minutes
  res.render('about', {
    title: 'About Carla Hackett',
    navAbout: true
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
    image: app.get('imageHost') + "/projects/" + project.slug + "/cover.jpg",
    preRender: next && ('/projects/' + next.slug),
    navPortfolio: true
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

app.get('/products', function(req, res) {
  res.redirect(302, '/products/jingle-bells-card');
});

app.get('/products/jingle-bells-card', function(req, res) {
  res.render('products/jingle-bells-card', {
    title: 'Jingle Bells Batman Smells by Carla Hackett',
    description: 'A hand-lettered, letterpressed Christmas card by Carla Hackett'
  });
});

// Misspell
app.get('/workshop', function(req, res) {
  res.redirect(302, '/workshops');
});

// Original page (with lots of SEO)
app.get('/workshops/brush-lettering', function(req, res) {
  res.redirect(302, '/workshops');
});

// Marketing links
app.get('/ny', function(req, res) {
  res.redirect(302, '/workshops/newyork-august-2017');
});
app.get('/nyc', function(req, res) {
  res.redirect(302, '/workshops/newyork-august-2017');
});

// Workshop pages

app.get('/workshops', function(req, res) {
  res.render('workshops', {
    title: 'Brush Lettering Workshops',
    navWorkshops: true,
    workshops: nonHiddenWorkshops
  });
});

for (var i in workshops) {
  (function(workshop) {
    app.get('/workshops/' + workshop.url, function(req, res) {
      res.render('workshops/' + workshop.url, {
        title: 'Brush Lettering Workshop, ' + workshop.city + ' ' + workshop.date,
        description: 'Learn your brush strokes from one of Australia’s most experienced letterers',
        image: app.get('imageHost') + "/images/workshops/brush-lettering/title.jpg",
        pinJs: true,
        navWorkshops: true,
        workshop: workshop,
        workshops: nonHiddenWorkshops.filter(function(w) { return w !== workshop })
      });
    });
  })(workshops[i]);
}

app.get('/workshops/booking-complete', function(req, res) {
  res.render('workshops/booking-complete', {
    title: 'Booking Complete',
    description: 'Your booking for a Carla Hackett brush lettering workshop is complete',
    noHeader: true,
    navWorkshops: true
  });
});

app.get('/online-course', function(req, res) {
  res.render('online-course', {
    title: 'Online Brush Lettering Course',
    navOnlineCourse: true
  });
});

var server = http.createServer(app);

server.on('error', function(err) {
  if (err.errno === 'EADDRINUSE')
    console.log("Website is already running at " + app.get('appHost') + '/');
  else
    console.log(err);

  process.exit(1);
});

server.listen(app.get('port'), function(){
  var url = app.get('appHost') + "/";
  console.log("Carla Hackett site running at " + url);
});
