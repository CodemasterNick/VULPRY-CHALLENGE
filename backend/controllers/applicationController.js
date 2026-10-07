const Application = require("../models/applicationModel");

function cadastrarAplicacao(req, res) {

    const { nome, repositorio, usuario_id } = req.body;

    // Verifica se todos os campos foram enviados
    if (!nome || !repositorio || !usuario_id) {

        return res.status(400).json({
            sucesso: false,
            mensagem: "Preencha todos os campos."
        });

    }

    Application.criarAplicacao(
        nome,
        repositorio,
        usuario_id,
        function (err) {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    sucesso: false,
                    mensagem: "Erro ao cadastrar aplicação."
                });

            }

            return res.status(201).json({
                sucesso: true,
                mensagem: "Aplicação cadastrada com sucesso!"
            });

        }
    );

}

function buscarAplicacao(req, res) {

    const { id } = req.params;

    Application.buscarPorId(id, (err, aplicacao) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao buscar aplicação."
            });
        }

        if (!aplicacao) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Aplicação não encontrada."
            });
        }

        return res.json({
            sucesso: true,
            aplicacao: aplicacao
        });

    });
}


function listarAplicacoes(req, res) {

    const { usuarioId } = req.params;

    Application.buscarAplicacoesPorUsuario(
        usuarioId,
        (err, aplicacoes) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    sucesso: false,
                    mensagem: "Erro ao buscar aplicações."
                });
            }

            return res.json({
                sucesso: true,
                aplicacoes: aplicacoes
            });
        }
    );
}

module.exports = {
    cadastrarAplicacao,
    listarAplicacoes,
    buscarAplicacao
};