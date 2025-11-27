const usuarioModel = require('../models/usuariosModels')

const registrarUsuario = async(req, res) => {
    const {  email, nome, senha } = req.body;
    try{
        const senhaHash = await usuarioModel.gerarSenhaHash(senha);
        const usuario = await usuarioModel.criarUsuario(email, nome, senhaHash);
        res.status(201).json({mensagem: 'Usuario criado com sucesso', usuario});
    }catch(error) {
        res.status(500).json({ erro: 'Erro ao registrar usuário', detalhe:error.message})
    }
};

const loginUsuario = async(req, res) => {
    const { email, senha } = req.body;
    try{
        const usuario = await usuarioModel.buscarUsuarioPorEmail(email)
        if(!usuario){
            return res.status(401).json({ erro: 'Usuário não encontrado '});
        }
        const senhaValida = await usuarioModel.compararSenhas(senha, usuario.senha);
        if(!senhaValida){
            return res.status(401).json({ erro: 'Senha inválida',})
        }
        res.json({ mensagem: 'Login realizado com sucesso', usuario: { id: usuario.id_usuario, nome: usuario.nome, email: usuario.email}})
    }catch(error) {
        res.status(500).json({ erro: 'Erro no login', detalhe: error.message})
        
    }
};

const buscarUsuarioPorId = async(req, res) => {
    const { id_usuario } = req.params;
    try{
        const usuario = await usuarioModel.buscarUsuarioPorId(id_usuario)
        if(!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado', detalhe: error.message})
        }
        res.json(usuario)
    }catch(error){
        res.status(500).json({ erro: 'Erro ao buscar usuário ', detalhe: error.message });
    }
};

const selecionarTodosUsuarios = async(req, res) => {
    try {
        const usuarios = await usuarioModel.selecionarTodosUsuarios();
        res.status(201).json(usuarios)
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar usuários ', detalhe: error.message })
    }
}

const selecionarProfessores = async(req, res) => {
    try {
        const usuarios = await usuarioModel.selecionarProfessores()
        res.status(201).json(usuarios)
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar professores', detalhe: error.message })
    }
}

const deletarUsuarios = async(req, res) => {
    const { id_usuario } = req.params;
    try {
        await usuarioModel.deletarUsuarios(id_usuario);
        res.json({ mensagem: 'Usuário deletado'})
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar o usuário', detalhe: error.message})
    }
}

const salvarImagemUsuario = async (req, res) => {
    const { id_usuario } = req.params;
    const { imagem } = req.body;

    if (!imagem) {
        return res.status(400).json({ error: "A imagem é obrigatória." });
    }

    try {
        const finalImageUrl = await usuarioModel.uploadBase64ToStorage(imagem);
        const usuarioAtualizado = await usuarioModel.salvarImagemUsuario(id_usuario, finalImageUrl);

        if (!usuarioAtualizado) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        res.json({
            mensagem: "Imagem atualizada com sucesso!",
            usuario: usuarioAtualizado
        });
    } catch (error) {
        res.status(500).json({
            error: "Erro ao salvar a imagem do usuário.",
            detalhe: error.message
        });
    }
};

module.exports = {
    registrarUsuario,
    loginUsuario,
    buscarUsuarioPorId,
    selecionarTodosUsuarios,
    deletarUsuarios,
    selecionarProfessores,
    salvarImagemUsuario
}