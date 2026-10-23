document.addEventListener("DOMContentLoaded", function () {

// NAVEGAÇÃO — só intercepta âncoras (#); links para outras páginas funcionam normalmente
document.querySelectorAll('.navbar a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
        event.preventDefault();
        const destino = link.getAttribute("href");
        if (destino === "#") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
        const el = document.querySelector(destino);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    });
});

// MODAL
function criarModal(conteudo) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `<div class="modal-conteudo"><button class="modal-fechar">&times;</button>${conteudo}</div>`;
    document.body.appendChild(modal);
    setTimeout(function () { modal.classList.add("ativo"); }, 10);
    modal.querySelector(".modal-fechar").addEventListener("click", function () { fecharModal(modal); });
    modal.addEventListener("click", function (e) { if (e.target === modal) fecharModal(modal); });
    document.addEventListener("keydown", function esc(e) {
        if (e.key === "Escape") { fecharModal(modal); document.removeEventListener("keydown", esc); }
    });
    return modal;
}
function fecharModal(modal) {
    modal.classList.remove("ativo");
    setTimeout(function () { modal.remove(); }, 300);
}

// LOGIN — agora leva para a Área do Cliente (login por CPF + senha)
const btnLogin = document.querySelector(".btn-login");
if (btnLogin && btnLogin.tagName === "BUTTON") {
    btnLogin.addEventListener("click", function () { location.href = "area-cliente.html"; });
}

// CONSULTORIA (modal rápido) — envia para a API via enviarSolicitacao()
function abrirConsultoria() {
    const modal = criarModal(`
        <h2>Solicitar Consultoria</h2>
        <p class="modal-descricao">Preencha seus dados e nossa equipe entrará em contato.</p>
        <form id="formConsultoria">
            <label>Nome</label><input type="text" id="nomeCliente" placeholder="Seu nome completo" required>
            <label>E-mail</label><input type="email" id="emailCliente" placeholder="seuemail@email.com" required>
            <label>Telefone</label><input type="tel" id="telefoneCliente" placeholder="(31) 99999-9999" required>
            <label>Área jurídica</label>
            <select id="areaCliente" required>
                <option value="">Selecione uma área</option>
                <option>Direito Trabalhista</option><option>Direito Penal</option><option>Direito Tributário</option>
                <option>Direito Empresarial</option><option>Direito Imobiliário</option><option>Direito Digital</option>
            </select>
            <label>Descreva brevemente seu caso</label>
            <textarea id="mensagemCliente" placeholder="Conte brevemente como podemos ajudar..." required></textarea>
            <button type="submit" class="btn-primary modal-botao">Enviar Solicitação</button>
        </form>`);
    modal.querySelector("#formConsultoria").addEventListener("submit", async function (event) {
        event.preventDefault();
        const g = function (id) { return modal.querySelector(id).value.trim(); };
        const d = { nome: g("#nomeCliente"), email: g("#emailCliente"), telefone: g("#telefoneCliente"), area: g("#areaCliente"), mensagem: g("#mensagemCliente") };
        if (Object.values(d).some(function (v) { return v === ""; })) { alert("Preencha todos os campos."); return; }
        const r = await enviarSolicitacao(d);
        alert(r.status === "enviada"
            ? "Solicitação enviada!\nProtocolo: " + r.protocolo
            : "Não conseguimos conectar ao servidor agora.\nProtocolo: " + r.protocolo + "\nUse a página Consultoria para enviar por WhatsApp ou e-mail.");
        fecharModal(modal);
    });
}
document.querySelectorAll('button.btn-primary[type="button"]').forEach(function (b) {
    b.addEventListener("click", abrirConsultoria);
});

// BOTÃO ESPECIALIDADES
const btnEsp = document.querySelector(".btn-secondary");
if (btnEsp) btnEsp.addEventListener("click", function () {
    const el = document.querySelector("#especialidades");
    if (el) el.scrollIntoView({ behavior: "smooth" });
});

// HEADER AO ROLAR
const header = document.querySelector(".header");
window.addEventListener("scroll", function () {
    if (header) header.style.background = window.scrollY > 50 ? "rgba(0,0,0,0.95)" : "rgba(0,0,0,0.7)";
});

});
