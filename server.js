const express = require('express');
const path = require('path');

const controller = require('./controllers');
const helpers = require('./utils/helpers');
const exphbs  = require('express-handlebars');
const hbs = exphbs.create({helpers});
const sequelize = require('./config/connection');

const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: "Big super secret",
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    }),
};

const app = express();
const PORT = process.env.PORT || 3008;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(session(sess));

app.use('/',controller);

app.engine('handlebars',hbs.engine);
app.set('view engine','handlebars');

sequelize.sync({force: false}).then(()=>{
    app.listen(PORT,() => console.log(`Now Listening on Port ${PORT}`));
});
