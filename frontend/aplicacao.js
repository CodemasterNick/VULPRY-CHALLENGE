const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // USUÁRIO
    // =========================

    const usuarioSalvo = localStorage.getItem("usuario");

    if (!usuarioSalvo) {
        window.location.href = "login.html";
        return;
    }

    let usuario;

    try {
        usuario = JSON.parse(usuarioSalvo);
    } catch (erro) {
        console.error("Erro ao carregar usuário:", erro);

        localStorage.removeItem("usuario");
        window.location.href = "login.html";
        return;
    }

    // =========================
    // ID DA APLICAÇÃO DA URL
    // =========================

    const parametros = new URLSearchParams(
        window.location.search
    );

    const aplicacaoIdUrl = parametros.get("id");

    if (!aplicacaoIdUrl) {
        console.error(
            "ID da aplicação não encontrado na URL."
        );

        window.location.href = "dashboard.html";
        return;
    }

    console.log(
        "ID da aplicação informado na URL:",
        aplicacaoIdUrl
    );

    // ID real será definido depois que a API retornar a aplicação
    let aplicacaoIdReal = aplicacaoIdUrl;

    // =========================
    // ELEMENTOS
    // =========================

    const nomeAplicacao =
        document.getElementById("nomeAplicacao");

    const repositorioAplicacao =
        document.getElementById("repositorioAplicacao");

    const totalVulnerabilidades =
        document.getElementById("totalVulnerabilidades");

    const totalCritical =
        document.getElementById("totalCritical");

    const totalHigh =
        document.getElementById("totalHigh");

    const totalMedium =
        document.getElementById("totalMedium");

    const listaVulnerabilidades =
        document.getElementById("listaVulnerabilidades");

    const nomePerfil =
        document.getElementById("nomePerfil");

    const avatar =
        document.getElementById("avatar");

    // =========================
    // PERFIL
    // =========================

    if (nomePerfil && usuario.nome) {
        nomePerfil.textContent = usuario.nome;
    }

    if (avatar && usuario.nome) {
        avatar.textContent =
            usuario.nome.charAt(0).toUpperCase();
    }

    // =========================
    // ESCAPAR HTML
    // =========================

    function escaparHTML(texto) {

        if (
            texto === null ||
            texto === undefined
        ) {
            return "";
        }

        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // =========================
    // CARREGAR APLICAÇÃO
    // =========================

    async function carregarAplicacao() {

        try {

            const url =
                `${API_URL}/aplicacoes/${usuario.id}`;

            console.log(
                "Buscando aplicação em:",
                url
            );

            const resposta =
                await fetch(url);

            console.log(
                "Status aplicações:",
                resposta.status
            );

            if (!resposta.ok) {
                throw new Error(
                    `Erro HTTP: ${resposta.status}`
                );
            }

            const dados =
                await resposta.json();

            console.log(
                "Resposta aplicações:",
                dados
            );

            // =========================
            // A API RETORNA:
            //
            // {
            //   sucesso: true,
            //   aplicacao: {...}
            // }
            // =========================

            if (
                !dados.sucesso ||
                !dados.aplicacao
            ) {
                throw new Error(
                    "A API não retornou uma aplicação."
                );
            }

            const aplicacao = dados.aplicacao;

            console.log(
                "Aplicação encontrada:",
                aplicacao
            );

            // =========================
            // PEGAR ID REAL DO BANCO
            // =========================

            if (aplicacao.id !== undefined) {

                aplicacaoIdReal =
                    String(aplicacao.id);

                console.log(
                    "ID real da aplicação:",
                    aplicacaoIdReal
                );
            }

            // =========================
            // MOSTRAR DADOS
            // =========================

            if (nomeAplicacao) {
                nomeAplicacao.textContent =
                    aplicacao.nome ||
                    "Aplicação sem nome";
            }

            if (repositorioAplicacao) {
                repositorioAplicacao.textContent =
                    aplicacao.repositorio ||
                    "Repositório não informado";
            }

            // =========================
            // AGORA CARREGAR VULNERABILIDADES
            // COM O ID REAL
            // =========================

            await carregarVulnerabilidades();

        } catch (erro) {

            console.error(
                "ERRO AO CARREGAR APLICAÇÃO:",
                erro
            );

            if (nomeAplicacao) {
                nomeAplicacao.textContent =
                    "Erro ao carregar aplicação";
            }

            if (repositorioAplicacao) {
                repositorioAplicacao.textContent =
                    erro.message ||
                    "Não foi possível carregar os dados.";
            }

            if (listaVulnerabilidades) {
                listaVulnerabilidades.innerHTML = `
                    <div class="erro">
                        Não foi possível carregar as vulnerabilidades.
                    </div>
                `;
            }
        }
    }

    // =========================
    // RESUMO
    // =========================

    function atualizarResumo(vulnerabilidades) {

        const vulnerabilidadesAtivas =
            vulnerabilidades.filter(
                vulnerabilidade =>
                    Number(
                        vulnerabilidade.falso_positivo
                    ) !== 1
            );

        const critical =
            vulnerabilidadesAtivas.filter(
                vulnerabilidade =>
                    String(
                        vulnerabilidade.severidade
                    ).toUpperCase() === "CRITICAL"
            ).length;

        const high =
            vulnerabilidadesAtivas.filter(
                vulnerabilidade =>
                    String(
                        vulnerabilidade.severidade
                    ).toUpperCase() === "HIGH"
            ).length;

        const medium =
            vulnerabilidadesAtivas.filter(
                vulnerabilidade =>
                    String(
                        vulnerabilidade.severidade
                    ).toUpperCase() === "MEDIUM"
            ).length;

        if (totalVulnerabilidades) {
            totalVulnerabilidades.textContent =
                vulnerabilidadesAtivas.length;
        }

        if (totalCritical) {
            totalCritical.textContent =
                critical;
        }

        if (totalHigh) {
            totalHigh.textContent =
                high;
        }

        if (totalMedium) {
            totalMedium.textContent =
                medium;
        }
    }

    // =========================
    // CLASSE DA SEVERIDADE
    // =========================

    function obterClasseSeveridade(severidade) {

        if (!severidade) {
            return "medium";
        }

        return String(
            severidade
        ).toLowerCase();
    }

    // =========================
    // MOSTRAR VULNERABILIDADES
    // =========================

    function mostrarVulnerabilidades(
        vulnerabilidades
    ) {

        if (!listaVulnerabilidades) {
            return;
        }

        listaVulnerabilidades.innerHTML = "";

        if (
            !Array.isArray(vulnerabilidades) ||
            vulnerabilidades.length === 0
        ) {

            listaVulnerabilidades.innerHTML = `
                <div class="sem-vulnerabilidades">
                    Nenhuma vulnerabilidade encontrada nesta aplicação.
                </div>
            `;

            return;
        }

        vulnerabilidades
            .sort(
                (a, b) =>
                    Number(b.prioridade || 0) -
                    Number(a.prioridade || 0)
            )
            .forEach(vulnerabilidade => {

                const classeSeveridade =
                    obterClasseSeveridade(
                        vulnerabilidade.severidade
                    );

                const falsoPositivo =
                    Number(
                        vulnerabilidade.falso_positivo
                    ) === 1;

                const card =
                    document.createElement("article");

                card.className =
                    "vulnerabilidade-card";

                card.innerHTML = `
                    <div class="vulnerabilidade-topo">

                        <div class="vulnerabilidade-titulo">

                            <span
                                class="severidade ${classeSeveridade}"
                            >
                                ${escaparHTML(
                                    vulnerabilidade.severidade
                                )}
                            </span>

                            <h3>
                                ${escaparHTML(
                                    vulnerabilidade.titulo
                                )}
                            </h3>

                        </div>

                        <span class="prioridade">
                            Prioridade:
                            ${escaparHTML(
                                vulnerabilidade.prioridade || 0
                            )}
                        </span>

                    </div>

                    <p class="vulnerabilidade-descricao">
                        ${escaparHTML(
                            vulnerabilidade.descricao
                        )}
                    </p>

                    <div class="recomendacao">

                        <strong>
                            Recomendação:
                        </strong>

                        ${escaparHTML(
                            vulnerabilidade.recomendacao
                        )}

                    </div>

                    <div class="vulnerabilidade-footer">

                        <span class="status">

                            ${
                                falsoPositivo
                                    ? "Falso positivo"
                                    : escaparHTML(
                                        vulnerabilidade.status ||
                                        "Aberta"
                                    )
                            }

                        </span>

                        <button
                            class="botao-falso-positivo"
                            data-id="${vulnerabilidade.id}"
                            data-falso-positivo="${
                                falsoPositivo ? 1 : 0
                            }"
                        >

                            ${
                                falsoPositivo
                                    ? "Desmarcar falso positivo"
                                    : "Marcar como falso positivo"
                            }

                        </button>

                    </div>
                `;

                listaVulnerabilidades.appendChild(card);
            });

        adicionarEventosFalsoPositivo();
    }

    // =========================
    // EVENTOS FALSO POSITIVO
    // =========================

    function adicionarEventosFalsoPositivo() {

        const botoes =
            document.querySelectorAll(
                ".botao-falso-positivo"
            );

        botoes.forEach(botao => {

            botao.addEventListener(
                "click",
                async () => {

                    const vulnerabilidadeId =
                        botao.dataset.id;

                    const falsoPositivoAtual =
                        Number(
                            botao.dataset.falsoPositivo
                        );

                    const novoValor =
                        falsoPositivoAtual === 1
                            ? 0
                            : 1;

                    const textoOriginal =
                        botao.textContent;

                    try {

                        botao.disabled = true;

                        botao.textContent =
                            "Atualizando...";

                        const resposta =
                            await fetch(
                                `${API_URL}/vulnerabilidades/${vulnerabilidadeId}/falso-positivo`,
                                {
                                    method: "PATCH",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body:
                                        JSON.stringify({
                                            falso_positivo:
                                                novoValor
                                        })
                                }
                            );

                        const dados =
                            await resposta.json();

                        if (
                            !resposta.ok ||
                            !dados.sucesso
                        ) {
                            throw new Error(
                                dados.mensagem ||
                                "Erro ao atualizar vulnerabilidade."
                            );
                        }

                        await carregarVulnerabilidades();

                    } catch (erro) {

                        console.error(
                            "Erro ao atualizar falso positivo:",
                            erro
                        );

                        alert(
                            "Não foi possível atualizar a vulnerabilidade."
                        );

                        botao.disabled = false;

                        botao.textContent =
                            textoOriginal;
                    }
                }
            );
        });
    }

    // =========================
    // CARREGAR VULNERABILIDADES
    // =========================

    async function carregarVulnerabilidades() {

        try {

            if (!aplicacaoIdReal) {
                throw new Error(
                    "ID real da aplicação não encontrado."
                );
            }

            const url =
                `${API_URL}/vulnerabilidades/${aplicacaoIdReal}`;

            console.log(
                "Buscando vulnerabilidades em:",
                url
            );

            const resposta =
                await fetch(url);

            console.log(
                "Status vulnerabilidades:",
                resposta.status
            );

            if (!resposta.ok) {
                throw new Error(
                    `Erro HTTP: ${resposta.status}`
                );
            }

            const dados =
                await resposta.json();

            console.log(
                "Resposta vulnerabilidades:",
                dados
            );

            if (
                !dados.sucesso ||
                !Array.isArray(
                    dados.vulnerabilidades
                )
            ) {
                throw new Error(
                    "A API não retornou uma lista de vulnerabilidades."
                );
            }

            console.log(
                "Vulnerabilidades encontradas:",
                dados.vulnerabilidades
            );

            atualizarResumo(
                dados.vulnerabilidades
            );

            mostrarVulnerabilidades(
                dados.vulnerabilidades
            );

        } catch (erro) {

            console.error(
                "ERRO AO CARREGAR VULNERABILIDADES:",
                erro
            );

            if (listaVulnerabilidades) {

                listaVulnerabilidades.innerHTML = `
                    <div class="erro">
                        Não foi possível carregar as vulnerabilidades.
                    </div>
                `;
            }
        }
    }
    
    const botaoSair =
        document.querySelector(
            ".menu-item.sair"
        );

    if (botaoSair) {

        botaoSair.addEventListener(
            "click",
            event => {

                event.preventDefault();

                localStorage.removeItem(
                    "usuario"
                );

                window.location.href =
                    "login.html";
            }
        );
    }

    if (
        typeof lucide !== "undefined"
    ) {
        lucide.createIcons();
    }

    carregarAplicacao();

});