const { Router } = require ('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, tieneRole, esPropioUpdate } = require('../middlewares');
const { crearProducto, obtenerProducto, obtenerProductos, actualizarProducto, borrarProducto } = require('../controllers/productos');

const { existeCategoriaId, existeProductoId, existeProductoNombre  } = require('../helpers/bd-validators');

/**
 *      {{url}}/api/productos
 */
 const router = Router();

//crear producto -- privado -- cualquier persona con token valido (post)
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','La categoria es obligatoria').not().isEmpty(),
    check('categoria').custom( existeCategoriaId ),
    check('disponible').isBoolean().optional({nullable: true}),
    check('precio').isNumeric().optional({nullable: true}),
    validarCampos 
], crearProducto);


//obtener todos los productos -- publico (get) 
router.get('/', [
    check('limit', 'Parametro limit debe ser numerico').isNumeric().optional({nullable: true}),
    check('desde', 'Parametro desde debe ser numerico').isNumeric().optional({nullable: true}),
    validarCampos
], obtenerProductos);


//obtener un producto por id -- publico (get)
router.get('/:id', [
    check('id').custom( existeProductoId ),
    validarCampos
], obtenerProducto);


//actualizar un producto por id -- privado -- cualquiera con token valido(put)
router.put('/:id', [
    validarJWT,
    check('id').custom( existeProductoId ),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    esPropioUpdate,
    //check('nombre').custom( existeProductoNombre ),
    check('categoria','La categoria es obligatoria').not().isEmpty(),
    check('categoria').custom( existeCategoriaId ),
    check('disponible').isBoolean().optional({nullable: true}),
    check('precio').isNumeric().optional({nullable: true}),
    validarCampos
], actualizarProducto);


//borrar un producto por id -- privado -- admin role(delete)
router.delete('/:id', [
    validarJWT,
    check('id').custom( existeProductoId ),
    tieneRole('ADMIN_ROLE'),
    validarCampos
], borrarProducto);



module.exports = router;