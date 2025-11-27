const express = require('express')
const router = express.Router()
const usuariosController = require('../controllers/usuariosController')

router.post('/registrar', usuariosController.registrarUsuario);
router.post('/login', usuariosController.loginUsuario);
router.get('/buscarUsuariosPorId/:id_usuario', usuariosController.buscarUsuarioPorId);
router.get('/selecionarTodosUsuarios', usuariosController.selecionarTodosUsuarios);
router.delete('/deletarUsuarios/:id_usuario', usuariosController.deletarUsuarios);

router.get('/professores', usuariosController.selecionarProfessores);

router.put('/salvarImagem/:id_usuario', usuariosController.salvarImagemUsuario);

module.exports = router