const { Router } = require ('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, tieneRole } = require('../middlewares');
const { crearCategoria, obtenerCategoria, obtenerCategorias, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');

const { existeCategoriaId, existeCategoriaNombre } = require('../helpers/bd-validators');

const router = Router();

/**
 *              {{url}}/api/categorias
 */


//obtener todas las categorias -- publico (get) 
router.get('/', [
    check('limit', 'Parametro limit debe ser numerico').isNumeric().optional({nullable: true}),
    check('desde', 'Parametro desde debe ser numerico').isNumeric().optional({nullable: true}),
    validarCampos
], obtenerCategorias);

//obtener una categoria por id -- publico (get)
router.get('/:id', [
    check('id').custom( existeCategoriaId ),
    validarCampos
], obtenerCategoria);
    

//crear categoria -- privado -- cualquier persona con token valido (post)
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos  
], crearCategoria);

//actualizar una categoria por id -- privado -- cualquiera con token valido(put)
router.put('/:id', [
    validarJWT,
    check('id').custom( existeCategoriaId ),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom( existeCategoriaNombre ),
    validarCampos
], actualizarCategoria);

//borrar una categoria por id -- privado -- admin role(delete)
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id').custom( existeCategoriaId ),
    validarCampos
], borrarCategoria);


module.exports = router;