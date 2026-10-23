/* layout.js — injeta cabeçalho e rodapé nas páginas internas (#site-header / #site-footer). */
(() => {
  const h = document.getElementById('site-header'), f = document.getElementById('site-footer');
  const cur = location.pathname.split('/').pop() || 'index.html';
  const links = [['index.html', 'Início'], ['areas.html', 'Áreas de Atuação'], ['equipe.html', 'Advogados'], ['artigos.html', 'Artigos'], ['consultoria.html', 'Consultoria'], ['area-cliente.html', 'Área do Cliente']];
  if (h) h.outerHTML = `<header class="header"><a class="logo" href="index.html" style="text-decoration:none;color:inherit"><span class="logo-bc">BC</span><div class="logo-text"><h1>Bristol &amp; Carter</h1><p>Consultoria Jurídica Online</p></div></a>
    <nav class="navbar">${links.map(([u, t]) => `<a href="${u}"${u === cur ? ' style="color:var(--gold)"' : ''}>${t}</a>`).join('')}</nav>
    <div class="header-buttons"><a class="btn-login" href="area-cliente.html" style="text-decoration:none">Entrar</a><a class="btn-primary" href="consultoria.html" style="text-decoration:none">Falar com Especialista</a></div></header>`;
  if (f) f.outerHTML = `<footer class="footer" id="contato"><div class="footer-content"><div><h3>Bristol &amp; Carter</h3><p>Sistema de Consultoria Jurídica Online</p></div>
    <div><h4>Páginas</h4>${links.slice(1).map(([u, t]) => `<p><a href="${u}" style="color:inherit;text-decoration:none">${t}</a></p>`).join('')}</div>
    <div><h4>Contato</h4><p>${BC.email}</p><p>Contagem - MG</p><p>Segunda à Sexta, 08:00 às 18:00</p></div></div>
    <div class="footer-bottom"><p>© 2026 Bristol &amp; Carter — Todos os direitos reservados.</p></div></footer>`;
})();
