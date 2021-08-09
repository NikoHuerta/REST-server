const { response, request } = require("express");
const { ObjectId } = require('mongoose').Types;


const { Usuario, Categoria, Producto } = require('../models');



const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); //true, false
    if(esMongoID){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [ usuario ] : []
        });
    }
    
    //no es mongoID
    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({ 
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    return res.json({
        results: usuarios
    });
}

const buscarCategorias = async (termino = '', res = response) => {
   
    const esMongoID = ObjectId.isValid(termino); //true, false
    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [ categoria ] : []
        });
    }

    //no es mongoID
    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({
        $and: [{nombre: regex} , { estado: true }]
    });

    return res.json({
        results: categorias
    });
}

const buscarProductos = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); //true, false
    if(esMongoID){
        const producto = await Producto.findById(termino)
                                        .populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [ producto ] : []
        });
    }

    //no es mongoID
    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({
        $or: [{nombre: regex} , { descripcion: regex }],
        $and: [{ estado: true }]
    })
    .populate('categoria', 'nombre');;

    return res.json({
        results: productos
    });

}

const buscarPorCategoria = async (termino = '', res = response) => {
    
    const esMongoID =  ObjectId.isValid(termino);
    if(esMongoID){
        const producto = await Producto.find({ 
         $and: [{ categoria: ObjectId(termino) }, { estado: true }]   
        }).populate('categoria', 'nombre');

        return res.json({
            results: (producto) ? [ producto ] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({
        $and: [{nombre: regex} , { estado: true }]
        });
    
    const productos = await Producto.find({
        $or: [... categorias.map( categoria =>({  //Spread Operator, expands an array into a list
                    categoria: categoria._id
                })
            )],
        $and: [{ estado: true }]

    })
    .populate('categoria', 'nombre');
    
    return res.json({
        results: productos
    });
}


const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    switch(coleccion){
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;

        case 'categorias':
            buscarCategorias(termino, res);
        break;

        case 'productos':
            buscarProductos(termino, res);
        break;

        case 'porCategoria':
            buscarPorCategoria(termino, res);
        break;

        default:
            return res.status(500).json({
                msg: `La busqueda para la coleccion ${coleccion} no esta implementada, consultelo con el administrador`
            })
    }
}


module.exports = {
    buscar
}

