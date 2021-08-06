const { Router } = require ('express');
const { check } = require('express-validator');


// const { validarJWT } = require('../middlewares/validar-jwt');
// const { validarCampos } = require('../middlewares/validar-campos');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
const {
        validarJWT,
        validarCampos,
        esAdminRole,
        tieneRole
} = require('../middlewares');

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/bd-validators');

const router = Router();

router.get('/',[
        validarJWT,
        check('limit', 'El limit debe ser numerico').isNumeric().optional({nullable: true}),
        check('desde', 'Parametro desde debe ser numerico').isNumeric().optional({nullable: true}),
        validarCampos
], usuariosGet);
 
router.put('/:id',[
        validarJWT,
        //check('id', 'No es un id válido').isMongoId(), --> error, unida a validacion custom existeUsuarioPorId
        check('id').custom(existeUsuarioPorId),
        check('rol').custom(esRoleValido),
        validarCampos // --> Verificar errores por middleware creado, express-validator
], usuariosPut);

router.post('/',[
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe de ser de más de 6 letras').isLength({ min:7 }),
        check('correo', 'El correo no es valido').isEmail(),
        check('correo').custom(emailExiste),
        check('rol').custom(esRoleValido),
        validarCampos // --> Verificar errores por middleware creado, express-validator
], usuariosPost); //url, middlewares, controlador

router.delete('/:id',[
        validarJWT,
        //esAdminRole,
        tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
        check('id').custom(existeUsuarioPorId),
        validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;