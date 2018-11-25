const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const helmet = require('helmet');
var compression = require('compression');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth');
const passport = require('passport');
const keys = require('./config/keys');
var app = express();
app.use(helmet());
app.use(compression());
mongoose.connect(keys.mongoURI)
    .then(() => console.log('MongoDB connected.'))
    .catch(error => console.log(error));

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('cors')());


app.use('/api/auth', authRouter);
app.use('/api/collection', require('./routes/pv-collections'));
app.use('/api/production', require('./routes/pv-production'));

app.use('/images', express.static('images'));
app.use('/js', express.static('js'));
app.use('/documents', express.static('documents'));

app.use(express.static('client/dist/client'));

app.get('*', (req, res)=>{
    res.sendFile(
        path.resolve(
            __dirname, 'client', 'dist', 'client', 'index.html'
        )
    );
})
module.exports = app;
