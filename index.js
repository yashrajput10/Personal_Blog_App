const express = require('express');
const bodyaParser = require("body-parser");
const app = express();
const port = 4000;
const routes = require('./routes/index');
const db = require('./config/db');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyaParser.json());
app.use(bodyaParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/', routes);


app.listen(port, () => {
    console.log("Server running port on", port);
})