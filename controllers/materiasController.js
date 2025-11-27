const materiasModel = require('../models/materiasModels')

const criarMaterias = async(req, res) => {
    const { nome } = req.body;

    try {
        const materia = await materiasModel.criarMaterias(nome);
        res.json(materia)
    } catch (error) {
        res.status(500).json({erro: 'Erro ao buscar pagamentos', detalhe: error.message})
    }
}

const selecionarTodasMaterias = async(req, res) => {
    try {
        const materia = await materiasModel.selecionarTodasMaterias();
        res.json(materia)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar todas as matérias', detalhe: error.message})
    }
}

const selecionarPorId = async(req, res) => {
    const { id_materia } = req.params;
    try {
        const materia = await materiasModel.selecionarPorId(id_materia);
        if(!materia){
            return res.status(404).json({ erro: 'Erro ao buscar materia ', detalhe: error.message})
        }
        res.status(201).json(materia)
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar o ID da materia', detalhe: error.message})
    }
}

module.exports = {
    criarMaterias,
    selecionarTodasMaterias,
    selecionarPorId
}