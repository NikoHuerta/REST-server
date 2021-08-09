const { response, request } = require("express");

const { Producto } = require('../models');

const crearProducto = async (req, res) => {
    
    const {estado, usuario, ...body} = req.body; //en body: nombre, categoria, precio, descripcion, disponible

    const existeProductoDB = await Producto.findOne({ nombre: body.nombre.toUpperCase() });
    if(existeProductoDB){
        return res.status(400).json({
            msg: `El producto ${existeProductoDB.nombre}, ya existe, no se puede añadir`
        });
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    };
   
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
    const {estado, usuario, ...body} = req.body; //opcionales en ...body --> nombre, categoria, precio, descripcion, disponible

    if(!(body.nombre || body.categoria || body.precio || body.descripcion || body.disponible)) res.status(401).json({ msg: 'No hay datos que actualizar' });

    const data = {
        ...body,
        usuario: req.usuario._id
    }
    
    if (body.nombre) data.nombre = body.nombre.toUpperCase();

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