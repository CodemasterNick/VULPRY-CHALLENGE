const db = require("../config/db");

function buscarPorEmail(email, callback) {

    db.get(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        callback
    );

}

function criarUsuario(nome, email, senha, callback) {

    db.run(
        "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
        [nome, email, senha],
        callback
    );

}

module.exports = {
    buscarPorEmail,
    criarUsuario
};