const { Categoria, Role, Usuario } = require('../models');



//validadores de usuario
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

//validadores de categorias

const existeCategoriaId = async (_id) => {
    //verificar si cumple la regla de id de mongo
    if (_id.match(/^[0-9a-fA-F]{24}$/)) {
        //Verificar si la categoria existe
        const existeCat = await Categoria.findById({ _id });

        if(!existeCat){
            throw new Error(`El ID de categoria ${ _id } no existe`);
        }

        //verificar si la categoria esta borrada
        if(!existeCat.estado)
        {
            throw new Error(`La categoria se encuentra deshabilitada`);    
        }

    } else {
        throw new Error(`El ID de categoria ${ _id } no es válido`);
    }

}

const existeCategoriaNombre = async (nombre = '') => {

    const existeCatNombre = await Categoria.findOne({nombre});
    console.log(existeCatNombre);
    if(existeCatNombre){
        throw new Error(`El nombre ${nombre} ya se encuentra registrado a una categoria, no se puede actualizar`);
    }
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaId,
    existeCategoriaNombre
}