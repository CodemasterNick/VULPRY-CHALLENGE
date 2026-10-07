const bcrypt = require("bcrypt");

const User = require("../models/userModel");


// =========================
// CADASTRO
// =========================

async function cadastrar(req, res) {

    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {

        return res.status(400).json({
            sucesso: false,
            mensagem: "Preencha todos os campos."
        });

    }

    User.buscarPorEmail(email, async (err, usuario) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro no banco de dados."
            });

        }

        if (usuario) {

            return res.status(400).json({
                sucesso: false,
                mensagem: "Este e-mail já está cadastrado."
            });

        }

        try {

            // Criptografa a senha
            const senhaHash = await bcrypt.hash(senha, 10);

            // Salva o usuário
            User.criarUsuario(
                nome,
                email,
                senhaHash,
                function (err) {

                    if (err) {

                        console.error(err);

                        return res.status(500).json({
                            sucesso: false,
                            mensagem: "Erro ao cadastrar usuário."
                        });

                    }

                    return res.status(201).json({
                        sucesso: true,
                        mensagem: "Conta criada com sucesso!"
                    });

                }
            );

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao processar a senha."
            });

        }

    });

}


// =========================
// LOGIN
// =========================

async function login(req, res) {

    const { email, senha } = req.body;

    if (!email || !senha) {

        return res.status(400).json({
            sucesso: false,
            mensagem: "Preencha todos os campos."
        });

    }

    User.buscarPorEmail(email, async (err, usuario) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro no banco."
            });

        }

        if (!usuario) {

            return res.status(401).json({
                sucesso: false,
                mensagem: "E-mail ou senha inválidos."
            });

        }

        try {

            const senhaCorreta = await bcrypt.compare(
                senha,
                usuario.senha
            );

            if (!senhaCorreta) {

                return res.status(401).json({
                    sucesso: false,
                    mensagem: "E-mail ou senha inválidos."
                });

            }

           return res.json({
            sucesso: true,
            mensagem: `Bem-vindo, ${usuario.nome}!`,

            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
    }
});

        } catch (erro) {

            console.error(erro);

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao verificar a senha."
            });

        }

    });

}


module.exports = {
    cadastrar,
    login
};