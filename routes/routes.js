const express = require('express');
const routes = express.Router();
const { renderHome, addNewProduct, getForm, getDelete, deleteProduct, saveRegister, authorized, loguearse, addImage, loguearseAgregar, loguearseEliminar } = require('../controllers/controllers');


routes.get('/', renderHome);

routes.get('/pageHome', (req, res) => {
    res.render('./pageHome')
});

routes.get('/pageHome2', (req, res) => {
    res.render('./pageHome2')
});

routes.get('/registro', (req, res) => {
    res.render("./registro")
});

routes.post("/registro", saveRegister);

routes.get('/administrador', (req, res) => {
    res.render('./administrador')
});

routes.get("/agregarimagen", (req, res) => {
    res.render("./agregarimagen")
});

// routes.post("/agregarimagen");

routes.post("/administrador", authorized);

routes.get('/adminlog', loguearse);

routes.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect("./administrador")
    })
});

routes.get('/nuevacard',loguearseAgregar, getForm );

routes.post('/nuevacard', addNewProduct);

routes.get('/eliminarcard', loguearseEliminar, getDelete);

routes.post('/eliminarcard', deleteProduct);




module.exports = routes;