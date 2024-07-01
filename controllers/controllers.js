const databaseConnection = require('../config/database');
const bcryptjs = require("bcryptjs");
const multer = require("multer");


const renderHome = (req, res) => {
    databaseConnection.query('SELECT * FROM card', (error, data) => {
        if (error) {
            console.log(error)
        } else {
            res.render("./index", {
                data
            })
        }
    })
    
}

const getForm = (req, res) => {
    res.render("./agregarcard");
};

const getDelete = (req, res) => {
    res.render("./eliminarcard")
};

const addNewProduct = (req, res) => {
    const imagen = req.file.originalname
    const { precio, zona } = req.body

    databaseConnection.query('INSERT INTO card (imagen , precio , zona )VALUES (?, ? ,? )', [imagen,precio, zona], (error, data) => {
        if (error) {
            console.log(error)
        }else{
            res.redirect("/inmobiliaria")
        }
    });
};

const deleteProduct = (req, res) => {
    const { id } = req.body

    databaseConnection.query('DELETE FROM card WHERE id = ?', [id], (error, data) => {
        if (error) {
            console.log(error)
        } else {
            res.redirect("/inmobiliaria")
        }
    });
};

const saveRegister = async (req, res) => {
    const nombre = req.body.nombre;
    const usuario = req.body.usuario;
    const password = req.body.password;

    let passwordHaash = await bcryptjs.hash(password, 8);

    databaseConnection.query('INSERT INTO usuarios SET ?', { nombre:nombre, usuario:usuario, password: passwordHaash }, async(error, data) => {
        if (error) {
            console.log(error)
        } else {
            res.render("./registro", {
                alert: true,
                alertTitle: "Registro",
                alertMessage: "Registrado correctamente",
                alertIcon: "success",
                showConfirmButton: false,
                timer: 1500,
                ruta: "./inmobiliaria/administrador"

            })
        }
    })
};


const authorized = async (req, res) => {
    const usuario = req.body.usuario;
    const password = req.body.password;

    let passwordHaash = await bcryptjs.hash(password, 8);

    if (usuario && password) {
        databaseConnection.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], async (error, data) => {
            if (data.length == 0 || !(await bcryptjs.compare(password, data[0].password))) {
                res.render("./administrador", {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o contraseña incorrectas",
                    alertIcon: "error",
                    showConfirmButton: false,
                    timer: 3500,
                    ruta: "./inmobiliaria/administrador"
                })
            } else {
                req.session.loggedin = true;
                req.session.nombre = data[0].nombre;
                res.render("./administrador", {
                    alert: true,
                    alertTitle: "Logeado correctamente",
                    alertMessage: "Bienvenido",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1700,
                    ruta: "./inmobiliaria/adminlog"
                })
            }
        })
    } else {
        res.render("./administrador", {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Porfavor complete los campos",
            alertIcon: "warning",
            showConfirmButton: false,
            timer: 3000,
            ruta: "./inmobiliaria/administrador"
        })
    }

};


const loguearse = (req, res) => {
    if (req.session.loggedin) {
        res.render("./adminlog", {
            login: true,
            nombre: req.session.nombre
        })
    } else {
        res.send("No Autorizado.")
    }
};

const loguearseAgregar = (req, res) => {
    if (req.session.loggedin) {
        res.render("./agregarcard", {
            login: true,
            nombre: req.session.nombre
        })
    } else {
        res.send("No Autorizado.")
    }
};

const loguearseEliminar = (req, res) => {
    if (req.session.loggedin) {
        res.render("./eliminarcard", {
            login: true,
            nombre: req.session.nombre
        })
    } else {
        res.send("No Autorizado.")
    }
};





module.exports = { renderHome, addNewProduct, getForm, getDelete, deleteProduct, saveRegister, authorized, loguearse, loguearseAgregar, loguearseEliminar };