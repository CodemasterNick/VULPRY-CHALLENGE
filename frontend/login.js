const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) => {

    event.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {

        const resposta = await fetch("http://localhost:3000/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                senha
            })

        });

        const dados = await resposta.json();

      if (dados.sucesso) {
        localStorage.setItem(
            "usuario",
            JSON.stringify(dados.usuario)
        );
            window.location.href = "dashboard.html";
        } else {
            alert(dados.mensagem);
        }

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao conectar com o servidor.");
    }

});