document.addEventListener("DOMContentLoaded", () => {
    // Inicializa os ícones Lucide
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    // ELEMENTOS
    const form = document.getElementById("formNovaAplicacao");
    const nomeInput = document.getElementById("nome");
    const repositorioInput = document.getElementById("repositorio");
    const mensagem = document.getElementById("mensagem");
    const botaoSalvar = document.getElementById("botaoSalvar");

    // PERFIL
    const nomePerfil = document.getElementById("nomePerfil");
    const avatar = document.getElementById("avatar");

    // Busca dados do usuário
    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );

    if (usuario) {
        const nome = usuario.nome || "Usuário";

        if (nomePerfil) {
            nomePerfil.textContent = nome;
        }

        if (avatar) {
            avatar.textContent = nome
                .charAt(0)
                .toUpperCase();
        }
    }

    // ENVIO DO FORMULÁRIO
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const nome = nomeInput.value.trim();
        const repositorio = repositorioInput.value.trim();

        // Limpa mensagem anterior
        mensagem.innerHTML = "";

        // VALIDAÇÃO DO NOME
        if (!nome) {
            mostrarMensagem(
                "Informe o nome da aplicação.",
                "erro"
            );

            nomeInput.focus();
            return;
        }

        // VALIDAÇÃO DO REPOSITÓRIO
        if (!repositorio) {
            mostrarMensagem(
                "Informe a URL do repositório.",
                "erro"
            );

            repositorioInput.focus();
            return;
        }

        // Valida URL
        try {
            new URL(repositorio);
        } catch {
            mostrarMensagem(
                "Informe uma URL de repositório válida.",
                "erro"
            );

            repositorioInput.focus();
            return;
        }

        // BOTÃO EM ESTADO DE CARREGAMENTO
        botaoSalvar.disabled = true;

        botaoSalvar.innerHTML = `
            <i data-lucide="loader-circle"></i>
            Salvando...
        `;

        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }

        // Busca aplicações existentes
        const aplicacoes = JSON.parse(
            localStorage.getItem("aplicacoes")
        ) || [];

        // Verifica se já existe uma aplicação com o mesmo nome
        const aplicacaoExistente = aplicacoes.some(
            (aplicacao) =>
                aplicacao.nome.toLowerCase() ===
                nome.toLowerCase()
        );

        if (aplicacaoExistente) {
            mostrarMensagem(
                "Já existe uma aplicação com esse nome.",
                "erro"
            );

            botaoSalvar.disabled = false;

            botaoSalvar.innerHTML = `
                <i data-lucide="plus"></i>
                Adicionar aplicação
            `;

            if (typeof lucide !== "undefined") {
                lucide.createIcons();
            }

            return;
        }

        // NOVA APLICAÇÃO
        const novaAplicacao = {
            id: Date.now(),
            nome: nome,
            repositorio: repositorio,
            status: "Ativa",
            vulnerabilidades: {
                critical: 0,
                high: 0,
                medium: 0
            },
            dataCriacao: new Date().toISOString()
        };

        // Adiciona ao array
        aplicacoes.push(novaAplicacao);

        // Salva no localStorage
        localStorage.setItem(
            "aplicacoes",
            JSON.stringify(aplicacoes)
        );

        // Mensagem de sucesso
        mostrarMensagem(
            "Aplicação adicionada com sucesso!",
            "sucesso"
        );

        // Redireciona
        setTimeout(() => {
            window.location.href = "aplicacao.html";
        }, 1000);
    });

    // FUNÇÃO PARA MOSTRAR MENSAGENS
    function mostrarMensagem(texto, tipo) {
        mensagem.innerHTML = `
            <div class="mensagem ${tipo}">
                ${texto}
            </div>
        `;
    }
});