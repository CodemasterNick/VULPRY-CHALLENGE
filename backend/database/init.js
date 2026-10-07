const db = require("../config/db");

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP

        )
    `, (err) => {

        if (err) {

            console.error(
                "❌ Erro ao criar tabela usuarios:",
                err.message
            );

        } else {

            console.log(
                "✅ Tabela usuarios criada com sucesso!"
            );

        }

    });


    db.run(`
        CREATE TABLE IF NOT EXISTS aplicacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            repositorio TEXT NOT NULL,
            usuario_id INTEGER NOT NULL,
            data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id)
                REFERENCES usuarios(id)

        )
    `, (err) => {

        if (err) {

            console.error(
                "❌ Erro ao criar tabela aplicacoes:",
                err.message
            );

        } else {

            console.log(
                "✅ Tabela aplicacoes criada com sucesso!"
            );

        }

    });


    db.run(`
        CREATE TABLE IF NOT EXISTS vulnerabilidades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            aplicacao_id INTEGER NOT NULL,
            titulo TEXT NOT NULL,
            descricao TEXT,
            severidade TEXT NOT NULL,
            status TEXT DEFAULT 'aberta',
            falso_positivo INTEGER DEFAULT 0,
            recomendacao TEXT,
            prioridade INTEGER DEFAULT 0,
            data_encontrada DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (aplicacao_id)
            REFERENCES aplicacoes(id)
        )
    `, (err) => {
        if (err) {
            console.error(
                "❌ Erro ao criar tabela vulnerabilidades:",
                err.message
            );

        } else {

            console.log(
                "✅ Tabela vulnerabilidades criada com sucesso!"
            );

        }

    });

});


db.close((err) => {

    if (err) {
        console.error(
            "❌ Erro ao fechar o banco:",
            err.message
        );

    } else {
        console.log(
            "🔒 Conexão com o banco encerrada."
        );
    }
});