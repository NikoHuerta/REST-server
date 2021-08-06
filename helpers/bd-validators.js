const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async (rol = '') => {

    //Verificar que le role exista
    const existeRol = await Role.findOne({ rol });
    if(!existeRol){
            throw new Error(`El rol ${ rol } no esta registrado en la DB`); //--> error personalizado atrapado en el custom
    }
}

const emailExiste = async (correo = '') => {

    //Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if(existeEmail){
        throw new Error(`El mail ${ correo } ya esta registrado`);
    }
}

const existeUsuarioPorId = async (_id) => {

    if (_id.match(/^[0-9a-fA-F]{24}$/)) {
        //Verificar si el correo existe
        const existeUsuario = await Usuario.findById({ _id });
        if(!existeUsuario){
            throw new Error(`El ID ${ _id } no existe`);
        }
    } else {
        throw new Error(`El ID ${ _id } no es válido`);
    }

    
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}