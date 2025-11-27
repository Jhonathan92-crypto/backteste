const conexao = require('../conexao')

const criarMaterias = async(nome) => {
    const query = 'INSERT INTO materias(nome) VALUES($1) RETURNING *'

    const valores = [nome]

    const { rows } = await conexao.query(query, valores)
    return rows;
}

const selecionarTodasMaterias = async() => {
    const query = 'SELECT * FROM materias'

    const { rows } = await conexao.query(query)
    return rows
}

const selecionarPorId = async(id_materia) => {
    const query = 'SELECT id_materia, nome FROM materias WHERE id_materia = $1'
    const { rows } = await conexao.query(query, [id_materia]);
    return rows;
}

module.exports = {
    criarMaterias,
    selecionarTodasMaterias,
    selecionarPorId
}