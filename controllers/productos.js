const { response, request } = require("express");

const { Producto } = require('../models');

const crearProducto = async (req, res) => {
    
    //attr obligatorios
    const nombre = req.body.nombre.toUpperCase();
    //attr opcionales
    const { categoria, precio, descripcion, disponible } = req.body; //3 ultimos opcionales

    const existeProductoDB = await Producto.findOne({nombre});
    if(existeProductoDB){
        return res.status(400).json({
            msg: `El producto ${existeProductoDB.nombre}, ya existe, no se puede añadir`
        });
    }

    const data = {
        nombre,
        categoria,
        "usuario": req.usuario._id
    };

    if (precio) data.precio = precio;
    if (descripcion) data.descripcion = descripcion;
    if (disponible) data.disponible = disponible; 
    
    const producto = new Producto(data);
    //Grabar data
    await producto.save();

    res.status(201).json(producto);
}

const obtenerProductos = async (req, res) => {
    
    const { limit = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find( query )
            .skip(Number(desde))
            .limit(Number(limit))
            .populate('usuario',['nombre','correo'])
            .populate('categoria', 'nombre')
    ]);

    res.json({
        total,
        productos,
    });


}

const obtenerProducto = async (req, res) => {
    
    const { id } = req.params;
    const producto = await Producto.findById(id)
                                .populate('usuario', ['nombre','correo'])
                                .populate('categoria', 'nombre');
    
    res.json({
        producto,
    });


}

const actualizarProducto = async (req, res) => {
   
    //atrr obligatorios
    const { id } = req.params;
    const {nombre, categoria, precio, descripcion, disponible} = req.body; //3 ultimos atrr opcionales


    //otra opcion es desestructurar req.body, para dejar afuera los que no necesitamos actualizar por seguridad --> estado, usuario , en lo anterior solo se saca del body lo que es necesario actualizar -> nombre

    const data = {
        nombre : nombre.toUpperCase(),
        categoria,
        usuario: req.usuario._id
    }

    
    if (precio) data.precio = precio;
    if (descripcion) data.descripcion = descripcion;
    if (disponible) data.disponible = disponible; 

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
        producto   
    });
}

const borrarProducto = async (req, res) => {
    
    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });
    
    res.json({
        producto
    });
}

module.exports = {
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    borrarProducto
}