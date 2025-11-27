const express = require('express');
const router = express.Router();
const conteudosController = require('../controllers/conteudosController');

router.post('/adicionarConteudos', conteudosController.adicionarConteudos);
router.put('/alterarConteudo/:id_conteudo', conteudosController.alterarConteudo);
router.delete('/deletarConteudo/:id_conteudo', conteudosController.deletarConteudo);
router.get('/selecionarTodosConteudos', conteudosController.selecionarTodosConteudos);
router.get('/getConteudosPorIdMateria/:fk_materia', conteudosController.getConteudosPorIdMateria);
router.get('/selecionarConteudoPorId/:id_conteudo', conteudosController.selecionarConteudoPorId)

module.exports = router