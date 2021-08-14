const { response } = require("express");
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require("../helpers/google-verify");

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


const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;
    
    try{ 
        const {nombre, correo, img} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            //Hay que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //si el usuario existe en DB hay que verificar su estado.
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        //GENERAR EL JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    }catch(err){
        return res.status(400).json({
            msg: 'Token de Google no válido'
        });
    }

    
}

const renovarToken = async (req, res = response) => {
    
    const { usuario } = req;
    //GENERAR EL JWT
    const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token
    });
};


module.exports = {
    login,
    googleSignIn,
    renovarToken
}