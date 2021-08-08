const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
    
});


CategoriaSchema.methods.toJSON = function(){  //funcion normal para llamar a this de esta instancia, si fuera funcion de flecha llamar al this apunta a la instancia fuera de la misma
    const { __v, _id, estado, ... categoria } = this.toObject();
    
    categoria.catId = _id;
    //const { estado, google, _id:_idUser, password, __v:__vUser, ... restoUser  } = usuario;
    //categoria.ByUsuario = restoUser;

    return categoria;
}

module.exports = model('Categoria', CategoriaSchema);