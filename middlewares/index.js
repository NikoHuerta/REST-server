

const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validarJSON = require('../middlewares/validar-json');
const validaRoles = require('../middlewares/validar-roles');


module.exports = {
    ... validarCampos,
    ... validarJWT,
    ... validarJSON,
    ... validaRoles
}


// En este middleware se exporta un objeto que incluye las funciónes validarCampos() etc., entonces al importar es necesario usar la desestructuración con el operador ...