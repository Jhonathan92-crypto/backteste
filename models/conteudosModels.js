// const { uploadBase64ToStorage } = require('../controllers/conteudosController');
const conexao = require('../conexao');
const {put, del } = require('@vercel/blob');

const adicionarConteudos = async(dados) => {
    const { fk_materia, titulo, link, finalImageUrl, finalPdfUrl } = dados

    console.log(fk_materia);
    console.log(fk_materia.id_materia)

    const query = 'INSERT INTO conteudos(fk_materia, titulo, link, imagem, arquivo) VALUES($1, $2, $3, $4, $5) RETURNING *';
    const values =  [fk_materia, titulo, link, finalImageUrl, finalPdfUrl];
    
    const rows  = await conexao.query(query,values);

    console.log("gravou o conteúdo");
    return rows;
}

const uploadBase64ToStorage = async(dataUrl) => {
    if (!dataUrl || !dataUrl.startsWith('data:')) {
        console.log("entrou no erro");
        throw new Error("Formato de Base64 inválido.");
    }

    const parts = dataUrl.split(';base64,');
    
    if (parts.length !== 2) {
        throw new Error("Base64 malformado.");
    }
    const mimeType = parts[0].split(':')[1];
    const base64Data = parts[1];

    const fileBuffer = Buffer.from(base64Data, 'base64');

    // Nomes de variáveis 
    const extensaoMapeada = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'application/pdf': 'pdf',
        'image/svg+xml': 'svg',
    };
    const extensao = extensaoMapeada[mimeType] || 'bin';
    
    // Gera nome de arquivo único (chave única no Vercel Blob)
    const NomeArquivo = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extensao}`;

    // Salva no Vercel Blob
    const resultado = await put(NomeArquivo, fileBuffer, {
        access: 'public', // Permite acesso público via URL
        contentType: mimeType // Define o tipo de conteúdo
    });
   
    // Retorna a URL pública gerada pelo Vercel Blob
    return resultado.url;
};


const alterarConteudo = async(id_conteudo, dados) => {
    const { fk_materia, titulo, link, imagem, arquivo } = dados
    const query = `
        UPDATE conteudos
        SET fk_materia = $1, titulo = $2, link = $3, imagem = $4, arquivo = $5
        WHERE id_conteudo = $6 RETURNING *
    `
    const { rows } = await conexao.query(query, [fk_materia, titulo, link, imagem, arquivo, id_conteudo])
    return rows[0]
}


const selecionarTodosConteudos = async () => {
    const query = 'SELECT * FROM conteudos';

    const { rows } = await conexao.query(query);
    return rows;
}

const deletarConteudo = async (id_conteudo) => {
    const query = `DELETE FROM conteudos WHERE id_conteudo = $1 RETURNING *`;
    await conexao.query(query, [id_conteudo])
}

const getConteudosPorIdMateria = async(dados) => {
    const { fk_materia } = dados;

    const query = `SELECT * FROM conteudos WHERE fk_materia = $1`

    const { rows } = await conexao.query(query, [fk_materia]);
    return rows;
}

const selecionarConteudoPorId = async(id_conteudo) => {
    const query = 'SELECT DISTINCT m.nome AS nome FROM conteudos c JOIN materias m ON c.fk_materia = m.id_materia WHERE c.id_conteudo = $1'
    const { rows } = await conexao.query(query, [id_conteudo]);
    return rows
}

module.exports = {
    adicionarConteudos,
    alterarConteudo,
    selecionarTodosConteudos,
    deletarConteudo,
    getConteudosPorIdMateria,
    uploadBase64ToStorage,
    selecionarConteudoPorId
}