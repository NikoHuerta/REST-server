const { Categoria, Role, Usuario, Producto } = require('../models');



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
    //si no es nulo el valor
    if(_id){
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
}

const existeCategoriaNombre = async (nombre = '') => {

    const existeCatNombre = await Categoria.findOne({nombre});
    //console.log(existeCatNombre);
    if(existeCatNombre){
        throw new Error(`El nombre ${existeCatNombre.nombre} ya se encuentra registrado a una categoria, no se puede actualizar`);
    }
}


//verificadores de producto

const existeProductoId = async (_id) => {
    //verificar si cumple la regla de id de mongo
    if (_id.match(/^[0-9a-fA-F]{24}$/)) {

        //Verificar si el producto existe
        const existeProd = await Producto.findById({ _id });

        if(!existeProd){
            throw new Error(`El ID de producto ${ _id } no existe`);
        }

        //verificar si el producto esta borrada
        if(!existeProd.estado)
        {
            throw new Error(`El producto se encuentra deshabilitado`);    
        }

    } else {
        throw new Error(`El ID de producto ${ _id } no es válido`);
    }

}


const existeProductoNombre = async (nombre = '') => {
    
    const existeProdNombre = await Producto.findOne({ nombre: nombre.toUpperCase() });
    if(existeProdNombre){
        throw new Error(`El producto ${ existeProdNombre.nombre } ya se encuentra registrado, no se puede actualizar`);
    }
}

//validar colecciones permitidas
const coleccionesPermitidas = ( coleccion='', colecciones = [] ) => {
    const incluida = colecciones.includes(coleccion);
    if(!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida, permitidas ${colecciones}`);
    }

    return true;
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    
    existeCategoriaId,
    existeCategoriaNombre,

    existeProductoId,
    existeProductoNombre,

    coleccionesPermitidas
}