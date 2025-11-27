const { json } = require('express');
const conteudosModel = require('../models/conteudosModels');


const adicionarConteudos = async(req, res) => {
    const { fk_materia ,titulo, link, imagem, arquivo } = req.body;
    
    if (!titulo || !fk_materia) {
        return res.status(400).json({ error: "Todos os campos (fk_materia) são obrigatórios." });
    }
    
    try {
        let finalImageUrl, finalPdfUrl;

        finalImageUrl = await conteudosModel.uploadBase64ToStorage(imagem);
        finalPdfUrl = await conteudosModel.uploadBase64ToStorage(arquivo);
    
        const ProdutoFormatado = {
            fk_materia: fk_materia,
            titulo: titulo,
            link: link,
            imagem: finalImageUrl,
            arquivo: finalPdfUrl
        };
    
        const conteudo = await conteudosModel.adicionarConteudos({ fk_materia, titulo, link, finalImageUrl, finalPdfUrl })
        res.json(conteudo, ProdutoFormatado);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar o conteúdo', detalhe: error.message})
    }
}

const alterarConteudo = async(req, res) => {
    const { id_conteudo } = req.params
    const { fk_materia, titulo, link, imagem, arquivo } = req.body

    try {
        const conteudo = await conteudosModel.alterarConteudo(id_conteudo, { fk_materia, titulo, link, imagem, arquivo })
        res.json(conteudo)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao alterar o conteúdo', detalhe: error.message})
    }
}

const selecionarTodosConteudos = async(req, res) => {
    try {
        const conteudo = await conteudosModel.selecionarTodosConteudos();
        res.json(conteudo)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar todos os conteúdos', detalhe: error.message});
    }
}

const deletarConteudo = async(req, res) => {
    const { id_conteudo } = req.params;
    try {
        await conteudosModel.deletarConteudo(id_conteudo);
            res.json({ mensagem: 'Conteúdo apagado'})
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar o conteúdo', detalhe: error.message})
    }
}

const getConteudosPorIdMateria = async(req, res) => {
    const { fk_materia } = req.params;
    try {
        const conteudo = await conteudosModel.getConteudosPorIdMateria({fk_materia})
        res.json(conteudo);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o conteudo por id da matéria', detalhe: error.message})
    }
}

const selecionarConteudoPorId = async(req, res) => {
    const { id_conteudo } = req.params;
    try {
        const conteudo = await conteudosModel.selecionarConteudoPorId(id_conteudo)
        res.json(conteudo)
        if(!conteudo){
            return res.status(404).json({ erro: 'Erro ao buscar conteúdo ', detalhe: error.message})
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o conteudo pelo id', detalhe: error.message})
    }
}

module.exports = {
    adicionarConteudos,
    alterarConteudo,
    selecionarTodosConteudos,
    deletarConteudo,
    getConteudosPorIdMateria,
    selecionarConteudoPorId
}