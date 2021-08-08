const { response, request } = require("express");

const { Categoria } = require('../models');


const obtenerCategorias = async (req = request, res = response) => { 
    
    const { limit = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
                Categoria.countDocuments(query),
                Categoria.find( query )
                    .skip(Number(desde))
                    .limit(Number(limit))
                    .populate('usuario',['nombre','correo'])
    ]);
    
    res.json({
        total,
        categorias,
    });
}

//obtenerCategoria - populate
const obtenerCategoria = async (req = request, res = response) => {
    
    const { id } = req.params;

    const categoria = await Categoria.findById(id)
                                .populate('usuario', ['nombre','correo']);
    

    res.json({
        categoria,
    });
}

//actualizarCategoria - guardando el ultimo id de quien realizo el update
const actualizarCategoria = async (req = request, res = response) => {
    
    const { id } = req.params;
    const nombre = req.body.nombre.toUpperCase();

    //otra opcion es desestructurar req.body, para dejar afuera los que no necesitamos actualizar por seguridad --> estado, usuario , en lo anterior solo se saca del body lo que es necesario actualizar -> nombre

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
        categoria   
    });
}

//borrarCategoria - estado:false
const borrarCategoria = async (req = request, res = response) => {
    

    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });
    
    
    res.json({
        categoria
    });
}

//crearCategoria - verifica que no halla una categoria igual
const crearCategoria = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });
    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe, no se puede añadir`
        });
    }

    //Generar data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    //Grabar data
    await categoria.save();
    

    res.status(201).json(categoria);

}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}