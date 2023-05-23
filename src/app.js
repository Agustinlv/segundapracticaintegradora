//Module imports
import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import session from 'express-session';

//File imports
import __dirname from './utils.js';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import sessionRouter from './routes/sessions.router.js'
import viewRouter from './routes/views.router.js';

const PORT = process.env.PORT || 8080;

const DB = 'ecommerce';

const MONGO = `mongodb+srv://agustinlv:yDRDk66z7ieHxvM@cluster0.nf2bvpp.mongodb.net/${DB}?retryWrites=true&w=majority`;

const app = express();

mongoose.connect(MONGO);

//Cookie Parser
app.use(cookieParser());

//Express
app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));

//Connect Mongo
app.use(session({
    store: new MongoStore({
        mongoUrl: MONGO,
        ttl: 3600
    }),
    secret: "SecretKey",
    resave: false,
    saveUninitialized: false
    })
);

//Handlebars
app.engine('handlebars', handlebars.engine());

app.set('views', __dirname + '/views');

app.set('view engine', 'handlebars');

//Rutas
app.use('/api/products', productRouter);

app.use('/api/carts', cartRouter);

app.use('/api/sessions', sessionRouter);

app.use('/', viewRouter);

app.listen(PORT, () => {console.log(`El servidor está corriendo en el puerto ${PORT}`)});