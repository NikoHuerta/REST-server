const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    
    const token = req.header('api-key');
    if(!token){
        return res.status(401).json({
            msg: 'No hay token de autorización en request'
        });
    }

    try{

        const {uid, iat, exp} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        //leer usuario que esta haciendo uso del token
        const usuario = await Usuario.findById(uid);
        
        //verificar si el usuario existe en DB
        if(!usuario){
            return res.status(401).json({
                msg: 'Token no válido -- usuario no existe en DB'
            });
        }

        //verificar si el uid tiene estado en true, (no borrado)
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no válido -- estado: false'
            });
        }

        req.usuario = usuario;
        next();

    }catch(err){
        //console.log(token);
        return res.status(401).json({
            msg: 'Token no válido -- token invalido'
        });
    }

    

    
}

module.exports = {
    validarJWT
}