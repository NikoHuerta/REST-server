const { response, request} = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async (req = request, res = response) => {

    const { limit = 5, desde = 0 } = req.query;
    const query = { estado: true };

    // const usuarios = await Usuario.find(query)
    //                         .skip(Number(desde))
    //                         .limit(Number(limit));
    // const total = await Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find( query )
            .skip(Number(desde))
            .limit(Number(limit))
    ]);
                            
    res.json({
        total,
        usuarios
    });
}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, ...resto  } = req.body;

    //TODO: validar contra DB
    if(password){
        //Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.status(400).json({
        usuario
    });
}

const usuariosPost =  async (req, res = response) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol} ); //--> cualquier campo que se mande y no este dentro del modelo 'Usuario', mongoose lo ignorara =)

    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //Guardar en BD
    await usuario.save();

    res.status(201).json({
        usuario
    });
}

const usuariosPatch =  (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete =  async (req, res = response) => {
    
    const { id } = req.params;

    //Fisicamente borrado
    //const usuario = await Usuario.findByIdAndDelete(id);

    //Status borrado
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        usuario
    });
}
module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}