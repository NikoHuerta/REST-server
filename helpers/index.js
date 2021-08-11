const dbValidators = require('./bd-validators');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');



module.exports = {
    ... dbValidators,
    ... generarJWT,
    ... googleVerify,
    ... subirArchivo
}