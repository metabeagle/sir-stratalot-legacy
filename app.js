const throng = require('throng');
const WORKERS = process.env.WEB_CONCURRENCY || 1;
const PORT = process.env.PORT || 8000;

throng({
  workers: WORKERS,
  lifetime: Infinity
}, start);

function start() {

const   express           = require('express'),
        favicon           = require('serve-favicon'),
        cors              = require('cors'),
        compression       = require('compression'),
        helmet            = require('helmet'),
        path              = require('path'),
        bodyParser        = require('body-parser'),
        methodOverride    = require('method-override'),
        expressSanitizer  = require('express-sanitizer'),
        redis             = require('redis'),
        session           = require('express-session'), 
        RedisStore        = require('connect-redis')(session),
        flash             = require('connect-flash'),
        moment            = require('moment'),
        keys              = require('./config/keys'),
        mongoose          = require('./config/db'),
        passport          = require('passport'),
        passportService   = require('./services/passport'),
        app               = express();

// Redis
const client = redis.createClient(keys.redisStoreUrl, { no_ready_check: true });

client.on("connect", function (err) {
    if(err) {
      console.log('error: ' + err);
    } else {
      console.log('connected to redis store');
    }
});

client.on("error", function (err) {
    console.log("error " + err);
});
 
// Models
const   Maker           = require('./models/maker/maker'),
        Person          = require('./models/maker/maker-person'),
        Organization    = require('./models/maker/maker-organization'), 
        Source          = require('./models/source/source'),
        Link            = require('./models/link/link'),
        Single          = require('./models/link/link-single'),
        Book            = require('./models/link/link-book'),
        Feed            = require('./models/link/link-feed'),
        Resource        = require('./models/link/link-resource'),
        Tool            = require('./models/link/link-tool'),
        Extracurricular = require('./models/link/link-extra'),
        Tag             = require('./models/tag/tag'),
        User            = require('./models/user/user'),
        Nominee         = require('./models/nominee/nominee');

// Routes
const indexRoutes   = require('./routes/index'),
      apiRoutes     = require('./routes/api'),
      authRoutes    = require('./routes/auth'),
      makerRoutes   = require('./routes/makers'),
      sourceRoutes  = require('./routes/sources'),
      linkRoutes    = require('./routes/links'),
      bookRoutes    = require('./routes/books'),
      tagRoutes     = require('./routes/tags'),
      userRoutes    = require('./routes/users'),
      nomRoutes     = require('./routes/nominees');

// App config
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(__dirname + '/public'));

// Various required middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(expressSanitizer());
app.use(session({
  store: new RedisStore({ client: client }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 180
  },
  name: 'sirstratalot_sessionr',
  resave: false,
  saveUninitialized: false,
  secret: keys.cookieKey
}));
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:8000', 'https://www.sirstratalot.com']
}));
app.use(compression());

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.url = req.originalUrl;
  res.locals.referer = req.header('referer');
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.info = req.flash('info');
  next();
});

app.locals.moment = moment;

// Routes config
app.use('/', indexRoutes);
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/makers', makerRoutes);
app.use('/sources', sourceRoutes);
app.use('/links', linkRoutes);
app.use('/bookshelf', bookRoutes);
app.use('/tags', tagRoutes);
app.use('/users', userRoutes);
app.use('/nominees', nomRoutes);

// Default error handler
// https://github.com/expressjs/express/blob/master/examples/mvc/index.js
// https://gist.github.com/zcaceres/2854ef613751563a3b506fabce4501fd
app.use((req, res, next) => {
  res.status(404).render('pages/404', { url: req.originalUrl });
});
app.use((err, req, res, next) => {
  console.error(err.message); // Log error message in server console
  if(!err.statusCode){
    err.statusCode = 500; // If err has no specified code, set error code to 500/internal server error
  }
  res.status(err.statusCode).send(err.message); // Send back error with status code and message
});

// App server
app.listen(PORT, () => {
  console.log(`sir-stratalot listening on port ${PORT}`);
});

}
