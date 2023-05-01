const express = require('express');
const session = require('express-session');
const cors = require('cors');
const api = require('./routers');
const port = 3001;

const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'PUT', 'GET', 'DELETE'],
    credentials: true
}));

const {Client} = require('pg');
const conObject = {
    user: 'postgres',
    database: 'postgres',
    password: 'postgres'
};

const client = new Client(conObject);
client.connect();

const PgStore = new (require('connect-pg-simple')(session))({
    conObject,
});

app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true,
    store: PgStore,
    unset: 'destroy',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use('/api', api);

app.listen(port, () => {
    console.log(`Server has started on http://localhost:${port}`);
})