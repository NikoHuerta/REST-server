const { response, request } = require("express")

const { Producto } = require('../models');

const esPropioUpdate = async (req, res = response, next) =>{

    
    const { id } = req.params;
    const nombreProducto = req.body.nombre.toUpperCase();
    const [productoById, productoByName] = await Promise.all([ 
                                                    Producto.findById(id),
                                                    Producto.findOne({nombre: nombreProducto})
                                                    ]);

    //validar si el id a actualizar y el nombre son iguales, si son iguales dejar actualizar
    console.log("productoById: ",productoById);
    console.log("productoByName: ",productoByName);
    
    try{
        //verificar si son el mismo registro por nombre
        if(productoById._id.toString() === productoByName._id.toString()){
            next();
        }else{ //son diferentes, hay que devolver error.
            return res.status(401).json({
                msg: `El nombre de producto ${productoByName.nombre} ya esta en uso, no se puede actualizar`
            });
        }
    }catch(err){ //no pudo obtener productoByName._id, por lo tanto no existe el registro a actualizar
        next();
    }

}


module.exports = {
    esPropioUpdate
}