const { response } = require("express");
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try{

        //VERIFICAR SI EL EMAIL EXISTE
        const usuario = await Usuario.findOne({ correo });
        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos -- email'
            });
        }

        //VERIFICAR SI EL USUARIO ESTA ACTIVO
        if( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos -- status:false'
            });
        }

        //VERIFICAR LA CONTRASEÑA
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos -- password'
            });
        }

        //GENERAR EL JWT
        const token = await generarJWT(usuario.id);


        res.json({
            msj: 'Login OK',
            usuario,
            token
        });


    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg: 'Algo salio mal con su login, hable con el administrador'
        });
    }
}


module.exports = {
    login
}