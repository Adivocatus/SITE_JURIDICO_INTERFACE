document.addEventListener("DOMContentLoaded", function () {


// ==========================================
// NAVEGAÇÃO
// ==========================================

const links = document.querySelectorAll(".navbar a");

links.forEach(function (link) {

    link.addEventListener("click", function (event) {

        event.preventDefault();

        const destino = link.getAttribute("href");

        if (destino === "#") {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            return;
        }

        const elemento = document.querySelector(destino);

        if (elemento) {
            elemento.scrollIntoView({
                behavior: "smooth"
            });
        }

    });

});


// ==========================================
// BOTÕES
// ==========================================

const btnLogin = document.querySelector(".btn-login");

const botoesPrimarios = document.querySelectorAll(".btn-primary");

const btnEspecialidades = document.querySelector(".btn-secondary");


// ==========================================
// FUNÇÃO PARA CRIAR MODAL
// ==========================================

function criarModal(conteudo) {

    const modal = document.createElement("div");

    modal.className = "modal";

    modal.innerHTML = `
        <div class="modal-conteudo">

            <button class="modal-fechar">&times;</button>

            ${conteudo}

        </div>
    `;

    document.body.appendChild(modal);

    // Abrir modal
    setTimeout(function () {
        modal.classList.add("ativo");
    }, 10);


    // Fechar pelo X
    const fechar = modal.querySelector(".modal-fechar");

    fechar.addEventListener("click", function () {
        fecharModal(modal);
    });


    // Fechar clicando fora
    modal.addEventListener("click", function (event) {

        if (event.target === modal) {
            fecharModal(modal);
        }

    });


    // Fechar com ESC
    document.addEventListener("keydown", function esc(event) {

        if (event.key === "Escape") {

            fecharModal(modal);

            document.removeEventListener("keydown", esc);

        }

    });


    return modal;
}


// ==========================================
// FECHAR MODAL
// ==========================================

function fecharModal(modal) {

    modal.classList.remove("ativo");

    setTimeout(function () {
        modal.remove();
    }, 300);

}


// ==========================================
// LOGIN
// ==========================================

if (btnLogin) {

    btnLogin.addEventListener("click", function () {

        const modal = criarModal(`

            <h2>Área do Cliente</h2>

            <p class="modal-descricao">
                Entre para acessar sua área de atendimento.
            </p>

            <form id="formLogin">

                <label>E-mail</label>

                <input 
                    type="email"
                    id="emailLogin"
                    placeholder="Digite seu e-mail"
                    required
                >

                <label>Senha</label>

                <input 
                    type="password"
                    id="senhaLogin"
                    placeholder="Digite sua senha"
                    required
                >

                <button type="submit" class="btn-primary modal-botao">
                    Entrar
                </button>

            </form>

        `);


        const formLogin = modal.querySelector("#formLogin");

        formLogin.addEventListener("submit", function (event) {

            event.preventDefault();

            const email = modal.querySelector("#emailLogin").value;
            const senha = modal.querySelector("#senhaLogin").value;

            if (email === "" || senha === "") {

                alert("Preencha todos os campos.");

                return;
            }

            alert(
                "Login realizado com sucesso!\n\n" +
                "E-mail: " + email
            );

            fecharModal(modal);

        });

    });

}


// ==========================================
// FORMULÁRIO DE CONSULTORIA
// ==========================================

function abrirConsultoria() {

    const modal = criarModal(`

        <h2>Solicitar Consultoria</h2>

        <p class="modal-descricao">
            Preencha seus dados e nossa equipe entrará em contato.
        </p>

        <form id="formConsultoria">

            <label>Nome</label>

            <input 
                type="text"
                id="nomeCliente"
                placeholder="Seu nome completo"
                required
            >


            <label>E-mail</label>

            <input 
                type="email"
                id="emailCliente"
                placeholder="seuemail@email.com"
                required
            >


            <label>Telefone</label>

            <input 
                type="tel"
                id="telefoneCliente"
                placeholder="(31) 99999-9999"
                required
            >


            <label>Área jurídica</label>

            <select id="areaCliente" required>

                <option value="">
                    Selecione uma área
                </option>

                <option value="Trabalhista">
                    Direito Trabalhista
                </option>

                <option value="Penal">
                    Direito Penal
                </option>

                <option value="Tributário">
                    Direito Tributário
                </option>

                <option value="Empresarial">
                    Direito Empresarial
                </option>

            </select>


            <label>Descreva brevemente seu caso</label>

            <textarea
                id="mensagemCliente"
                placeholder="Conte brevemente como podemos ajudar..."
                required
            ></textarea>


            <button 
                type="submit"
                class="btn-primary modal-botao"
            >
                Enviar Solicitação
            </button>

        </form>

    `);


    const form = modal.querySelector("#formConsultoria");


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const nome =
            modal.querySelector("#nomeCliente").value;

        const email =
            modal.querySelector("#emailCliente").value;

        const telefone =
            modal.querySelector("#telefoneCliente").value;

        const area =
            modal.querySelector("#areaCliente").value;

        const mensagem =
            modal.querySelector("#mensagemCliente").value;


        if (
            nome === "" ||
            email === "" ||
            telefone === "" ||
            area === "" ||
            mensagem === ""
        ) {

            alert("Preencha todos os campos.");

            return;

        }


        alert(
            "Solicitação enviada com sucesso!\n\n" +
            "Obrigado, " + nome + ".\n" +
            "Nossa equipe entrará em contato."
        );


        console.log("Dados da consultoria:");

        console.log({
            nome: nome,
            email: email,
            telefone: telefone,
            area: area,
            mensagem: mensagem
        });


        fecharModal(modal);

    });

}


// ==========================================
// BOTÕES PRINCIPAIS
// ==========================================

botoesPrimarios.forEach(function (botao) {

    botao.addEventListener("click", function () {

        abrirConsultoria();

    });

});


// ==========================================
// BOTÃO ESPECIALIDADES
// ==========================================

if (btnEspecialidades) {

    btnEspecialidades.addEventListener("click", function () {

        const especialidades =
            document.querySelector("#especialidades");

        if (especialidades) {

            especialidades.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

}


// ==========================================
// EFEITO NO HEADER AO ROLAR
// ==========================================

const header = document.querySelector(".header");

window.addEventListener("scroll", function () {

    if (window.scrollY > 50) {

        header.style.background = "rgba(0, 0, 0, 0.95)";

    } else {

        header.style.background = "rgba(0, 0, 0, 0.7)";

    }

});


});
