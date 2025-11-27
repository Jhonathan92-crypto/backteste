const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const { put } = require('@vercel/blob');

const criarUsuario = async(nome, email, senhaHash) => {
    const query = 'INSERT INTO usuarios (email, nome, senha) VALUES ($1, $2, $3) RETURNING *';
    const valores = [nome, email, senhaHash]
    const { rows } = await conexao.query(query, valores)
    return rows[0];
}

const buscarUsuarioPorEmail = async(email) => {
    const query = 'SELECT * FROM usuarios WHERE email = $1'
    const { rows } = await conexao.query(query, [email]);
    return rows[0];
}

const buscarUsuarioPorId = async(id_usuario) => {
    const query = 'SELECT * FROM usuarios WHERE id_usuario = $1'
    const { rows } = await conexao.query(query, [id_usuario]);
    return rows;
};

const selecionarTodosUsuarios = async() => {
    const query = 'SELECT * FROM usuarios';

    const { rows } = await conexao.query(query);
    return rows;
}

const deletarUsuarios = async(id_usuario) => {
    const query = 'DELETE FROM usuarios WHERE id_usuario = $1';
    const { rows } = await conexao.query(query, [id_usuario])
    return rows;
}

const selecionarProfessores = async() => {
    const query = 'SELECT * FROM professores_autorizados'

    const { rows } = await conexao.query(query)
    return rows;
}

const gerarSenhaHash = async(senha) => {
    console.log(bcrypt.hash(senha, 10));
    return bcrypt.hash(senha, 10);
}

const compararSenhas = async(senha, senhaHash) => {
    return bcrypt.compare(senha, senhaHash)
}

const uploadBase64ToStorage = async (dataUrl) => {
    if (!dataUrl || !dataUrl.startsWith('data:')) {
        throw new Error("Formato de Base64 inválido.");
    }

    const parts = dataUrl.split(';base64,');
    if (parts.length !== 2) {
        throw new Error("Base64 malformado.");
    }

    const mimeType = parts[0].split(':')[1];
    const base64Data = parts[1];
    const fileBuffer = Buffer.from(base64Data, 'base64');

    const extensaoMapeada = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/webp': 'webp',
        'image/svg+xml': 'svg',
    };
    const extensao = extensaoMapeada[mimeType] || 'bin';

    const nomeArquivo = `usuario-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extensao}`;

    const resultado = await put(nomeArquivo, fileBuffer, {
        access: 'public',
        contentType: mimeType
    });

    return resultado.url; // URL pública gerada
};

const salvarImagemUsuario = async (id_usuario, imagemUrl) => {
    const query = `
        UPDATE usuarios
        SET imagem = $1
        WHERE id_usuario = $2
        RETURNING *
    `;

    const { rows } = await conexao.query(query, [imagemUrl, id_usuario]);
    return rows[0];
};

module.exports = {
    criarUsuario,
    buscarUsuarioPorEmail,
    buscarUsuarioPorId,
    selecionarTodosUsuarios,
    deletarUsuarios,
    gerarSenhaHash,
    compararSenhas,
    selecionarProfessores,
    uploadBase64ToStorage,
    salvarImagemUsuario
}