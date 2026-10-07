const form = document.getElementById("cadastroForm");
const botao = document.getElementById("cadastroBtn");

form.addEventListener("submit", async (event) => {

event.preventDefault();

const nome = document.getElementById("nome").value.trim();
const email = document.getElementById("email").value.trim();
const senha = document.getElementById("senha").value;
const confirmarSenha = document.getElementById("confirmarSenha").value;

if (senha !== confirmarSenha) {
    alert("As senhas não coincidem.");
    return;
}

if (senha.length < 8) {
    alert("A senha deve possuir pelo menos 8 caracteres.");
    return;
}

botao.disabled = true;
botao.textContent = "Criando conta...";

try {

    const resposta = await fetch(
        "http://localhost:3000/registrar",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                nome,
                email,
                senha
            })
        }
    );

    const dados = await resposta.json();

    if (dados.sucesso) {

        alert(dados.mensagem);

        window.location.href = "login.html";

    } else {

        alert(dados.mensagem);

    }

} catch (erro) {

    console.error("Erro:", erro);

    alert("Erro ao conectar com o servidor.");

} finally {

    botao.disabled = false;
    botao.textContent = "Criar Conta";

}


});
