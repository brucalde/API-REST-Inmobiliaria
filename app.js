const express = require('express');
const { access } = require('fs');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const databaseConnection = require('./config/database');
const routes = require('./routes/routes');
const session = require('express-session');
const multer = require('multer');


app.set('port', process.env.PORT || 4040);


// Conf Multer

const storage = multer.diskStorage({
    destination: "public/imagenes",
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

// Express session

app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));


// Coneccion database
databaseConnection.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

// Multer

app.use(multer({
    storage,
    dest: "public/imagenes"

}).single("image"));


app.use('/inmobiliaria', routes );


server.listen(app.get("port"), () => {
    console.log("Servidor creado en el puerto: " + app.get("port"))
});