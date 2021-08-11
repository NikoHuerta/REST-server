

const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validarJSON = require('../middlewares/validar-json');
const validaRoles = require('../middlewares/validar-roles');
const validaColeccion = require('../middlewares/validar-coleccion');
const validaArchivo = require('../middlewares/validar-archivo');


module.exports = {
    ... validarCampos,
    ... validarJWT,
    ... validarJSON,
    ... validaRoles,
    ... validaColeccion,
    ... validaArchivo,
}


// En este middleware se exporta un objeto que incluye las funciónes validarCampos() etc., entonces al importar es necesario usar spread operator -> ...