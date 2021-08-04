const { response, request} = require('express');

const usuariosGet = (req = request, res = response) => {

    const {q, nombre = 'No Name', apikey, page = 1, limit} = req.query;
    //http://localhost:8080/api/usuarios?q=12333asd&apikey=11sad233df34jcv22&page=2&limit=20
    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
}

const usuariosPut = (req, res = response) => {

    const { id } = req.params;

    res.status(400).json({
        msg: 'put API - controlador',
        id
    });
}

const usuariosPost =  (req, res = response) => {

    const { nombre, edad } = req.body;

    res.status(201).json({
        msg: 'post API - controlador',
        nombre,
        edad
    });
}

const usuariosPatch =  (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete =  (req, res = response) => {
    res.json({
        msg: 'delete API - controlador'
    });
}
module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}