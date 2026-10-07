const db = require("../config/db");

function criarAplicacao(nome, repositorio, usuarioId, callback) {
    const sql = `
        INSERT INTO aplicacoes
        (nome, repositorio, usuario_id)
        VALUES (?, ?, ?)
    `;

    db.run(
        sql,
        [nome, repositorio, usuarioId],
        callback
    );
}

function buscarAplicacoesPorUsuario(usuarioId, callback) {
    const sql = `
        SELECT * FROM aplicacoes
        WHERE usuario_id = ?
        ORDER BY data_criacao DESC
    `;

    db.all(
        sql,
        [usuarioId],
        callback
    );
}

module.exports = {
    criarAplicacao,
    buscarPorId,
};

function buscarPorId(id, callback) {

    const sql = `
        SELECT *
        FROM aplicacoes
        WHERE id = ?
    `;

    db.get(sql, [id], callback);
}