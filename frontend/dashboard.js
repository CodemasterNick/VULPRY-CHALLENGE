document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // LUCIDE ICONS
    // =========================

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }


    // =========================
    // ELEMENTOS
    // =========================

    const dashboardVazio = document.getElementById("onboarding");
    const dashboardReal = document.getElementById("dashboardReal");
    const listaAplicacoes = document.getElementById("listaAplicacoes");

    const nomePerfil = document.getElementById("nomePerfil");
    const avatar = document.getElementById("avatar");

    const totalAplicacoes = document.getElementById("totalAplicacoes");
    const totalCritical = document.getElementById("totalCritical");
    const totalHigh = document.getElementById("totalHigh");
    const totalMedium = document.getElementById("totalMedium");


    // =========================
    // DADOS DO USUÁRIO
    // =========================

    const nomeUsuario =
        localStorage.getItem("nomeUsuario") ||
        "Usuário";

    if (nomePerfil) {
        nomePerfil.textContent = nomeUsuario;
    }

    if (avatar) {
        avatar.textContent =
            nomeUsuario.charAt(0).toUpperCase();
    }


    // =========================
    // BUSCAR APLICAÇÕES
    // =========================

    let aplicacoes = [];

    try {

        const aplicacoesSalvas =
            localStorage.getItem("aplicacoes");

        if (aplicacoesSalvas) {

            aplicacoes =
                JSON.parse(aplicacoesSalvas);

        }

    } catch (erro) {

        console.error(
            "Erro ao carregar aplicações:",
            erro
        );

        aplicacoes = [];

    }


    // =========================
    // GARANTIR ARRAY
    // =========================

    if (!Array.isArray(aplicacoes)) {
        aplicacoes = [];
    }


    // =========================
    // VERIFICAR DASHBOARD
    // =========================

    if (aplicacoes.length === 0) {

        mostrarDashboardVazio();

    } else {

        mostrarDashboardReal();

        atualizarResumo();

        renderizarAplicacoes();

    }


    // =========================
    // DASHBOARD VAZIO
    // =========================

    function mostrarDashboardVazio() {

        if (dashboardVazio) {
            dashboardVazio.style.display = "block";
        }

        if (dashboardReal) {
            dashboardReal.style.display = "none";
        }

    }


    // =========================
    // DASHBOARD COM DADOS
    // =========================

    function mostrarDashboardReal() {

        if (dashboardVazio) {
            dashboardVazio.style.display = "none";
        }

        if (dashboardReal) {
            dashboardReal.style.display = "block";
        }

    }


    // =========================
    // ATUALIZAR RESUMO
    // =========================

    function atualizarResumo() {

        let critical = 0;
        let high = 0;
        let medium = 0;


        aplicacoes.forEach((aplicacao) => {

            const vulnerabilidades =
                aplicacao.vulnerabilidades || {};

            critical += Number(
                vulnerabilidades.critical ||
                vulnerabilidades.criticas ||
                0
            );

            high += Number(
                vulnerabilidades.high ||
                vulnerabilidades.altas ||
                0
            );

            medium += Number(
                vulnerabilidades.medium ||
                vulnerabilidades.medias ||
                0
            );

        });


        if (totalAplicacoes) {
            totalAplicacoes.textContent =
                aplicacoes.length;
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
    // RENDERIZAR APLICAÇÕES
    // =========================

    function renderizarAplicacoes() {

        if (!listaAplicacoes) {

            console.error(
                'Elemento "listaAplicacoes" não encontrado.'
            );

            return;

        }


        listaAplicacoes.innerHTML = "";


        aplicacoes.forEach((aplicacao, index) => {

            const nome =
                aplicacao.nome ||
                "Aplicação sem nome";

            const repositorio =
                aplicacao.repositorio ||
                "Repositório não informado";


            const vulnerabilidades =
                aplicacao.vulnerabilidades || {};


            const critical =
                Number(
                    vulnerabilidades.critical ||
                    vulnerabilidades.criticas ||
                    0
                );


            const high =
                Number(
                    vulnerabilidades.high ||
                    vulnerabilidades.altas ||
                    0
                );


            const medium =
                Number(
                    vulnerabilidades.medium ||
                    vulnerabilidades.medias ||
                    0
                );


            const total =
                critical +
                high +
                medium;


            const card =
                document.createElement("div");


            card.className =
                "card-aplicacao";


            card.innerHTML = `

                <div class="app-card-header">

                    <div class="app-icon">
                        <i data-lucide="boxes"></i>
                    </div>

                    <div class="app-info">

                        <h3>
                            ${escapeHtml(nome)}
                        </h3>

                        <p>
                            ${escapeHtml(repositorio)}
                        </p>

                    </div>

                </div>


                <div class="app-vulnerabilidades">

                    <div class="vulnerabilidade-resumo critical">

                        <span>Críticas</span>

                        <strong>
                            ${critical}
                        </strong>

                    </div>


                    <div class="vulnerabilidade-resumo high">

                        <span>Altas</span>

                        <strong>
                            ${high}
                        </strong>

                    </div>


                    <div class="vulnerabilidade-resumo medium">

                        <span>Médias</span>

                        <strong>
                            ${medium}
                        </strong>

                    </div>

                </div>


                <div class="app-footer">

                    <div class="app-status">

                        <span></span>

                        Monitorando

                    </div>


                    <div class="total-vulnerabilidades">

                        ${total}
                        vulnerabilidade${total !== 1 ? "s" : ""}

                    </div>

                </div>

            `;


       card.addEventListener("click", () => {

        window.location.href =
        `aplicacao.html?id=${aplicacao.id}`;

});

            listaAplicacoes.appendChild(card);

        });

        if (typeof lucide !== "undefined") {

            lucide.createIcons();

        }

    }


    function abrirAplicacao(index) {

        function abrirAplicacao(index) {

        const aplicacaoSelecionada = aplicacoes[index];

        localStorage.setItem(
        "aplicacaoSelecionada",
        JSON.stringify(aplicacaoSelecionada)
        );

        window.location.href = "aplicacao.html";
}

    }

    function escapeHtml(texto) {

        const div =
            document.createElement("div");

        div.textContent = texto;

        return div.innerHTML;

    }

});