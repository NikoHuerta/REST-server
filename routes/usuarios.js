const { Router } = require ('express');
const { check } = require('express-validator');

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');

const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/bd-validators');

const router = Router();

router.get('/',[
        check('limit', 'El limit debe ser numerico').isNumeric().optional({nullable: true}),
        check('desde', 'Parametro desde debe ser numerico').isNumeric().optional({nullable: true}),
        validarCampos
], usuariosGet);
 
router.put('/:id',[
        //check('id', 'No es un id válido').isMongoId(), --> error, unida a validacion custom existeUsuarioPorId
        check('id').custom(existeUsuarioPorId),
        check('rol').custom(esRoleValido),
        validarCampos // --> Verificar errores por middleware creado, express-validator
], usuariosPut);

router.post('/',[
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe de ser de más de 6 letras').isLength({ min:7 }),
        check('correo', 'El correo no es valido').isEmail(),
        check('correo').custom(emailExiste),
        check('rol').custom(esRoleValido),
        validarCampos // --> Verificar errores por middleware creado, express-validator
], usuariosPost); //url, middlewares, controlador

router.delete('/:id',[
        check('id').custom(existeUsuarioPorId),
        validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;