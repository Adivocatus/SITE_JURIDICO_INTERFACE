/* extras.js — comportamentos comuns + lógica das páginas internas (body[data-page]). */
(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toast = t => { let e = $('.toast') || document.body.appendChild(Object.assign(document.createElement('div'), { className: 'toast' })); e.textContent = t; e.classList.add('show'); setTimeout(() => e.classList.remove('show'), 3500); };
  const erroApi = e => /fetch/i.test(e.message) ? 'Servidor indisponível. Verifique se a API está rodando.' : e.message;
  const cpfOk = v => { const d = v.replace(/\D/g, ''); if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
    for (let t = 9; t < 11; t++) { let s = 0; for (let i = 0; i < t; i++) s += d[i] * (t + 1 - i); if ((s * 10 % 11) % 10 != d[t]) return false; } return true; };
  const mask = {
    cpf: v => v.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2'),
    tel: v => { const d = v.replace(/\D/g, '').slice(0, 11); return d.length > 10 ? d.replace(/(\d\d)(\d{5})(\d{4})/, '($1) $2-$3') : d.replace(/(\d\d)(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, ''); }
  };
  const validate = (f, rules) => { let ok = true;
    for (const [k, fn] of Object.entries(rules)) { const el = f.elements[k], r = fn(el.type === 'checkbox' ? el.checked : el.value.trim()), box = el.closest('.field');
      box.classList.toggle('err', r !== true); $('.msg-err', box).textContent = r === true ? '' : r; if (r !== true) ok = false; }
    return ok; };
  const bindMasks = () => $$('[data-mask]').forEach(i => i.oninput = () => i.value = mask[i.dataset.mask](i.value));
  const field = (id, label, extra = '', tag = 'input') => `<div class="field"><label for="${id}">${label}</label><${tag} id="${id}" name="${id}" ${extra}>${tag === 'input' ? '' : `</${tag}>`}<span class="msg-err"></span></div>`;
  const AREAS = ['Direito Trabalhista', 'Direito Penal', 'Direito Tributário', 'Direito Empresarial', 'Direito Imobiliário', 'Direito Digital'];
  const root = $('#root'), page = document.body.dataset.page;

  /* ---------- comuns ---------- */
  const header = $('.header'), nav = $('.navbar');
  if (header && nav) { const b = Object.assign(document.createElement('button'), { className: 'menu-toggle', type: 'button', textContent: '☰' });
    b.setAttribute('aria-label', 'Abrir menu'); b.onclick = () => nav.classList.toggle('open'); header.append(b);
    nav.addEventListener('click', e => e.target.closest('a') && nav.classList.remove('open')); }
  document.addEventListener('click', e => { const q = e.target.closest('.acc-q'); q && q.parentElement.classList.toggle('open'); });
  const up = Object.assign(document.createElement('button'), { className: 'up', type: 'button', textContent: '↑', onclick: () => scrollTo({ top: 0 }) });
  up.setAttribute('aria-label', 'Voltar ao topo'); document.body.append(up);
  addEventListener('scroll', () => up.classList.toggle('show', scrollY > 600), { passive: true });
  document.body.insertAdjacentHTML('beforeend', `<a class="wa" target="_blank" rel="noopener" href="https://wa.me/${BC.whatsapp}">WhatsApp</a>`);
  const co = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; co.unobserve(e.target);
    const end = +e.target.dataset.count; let n = 0; const st = () => { n += Math.max(1, end / 40); e.target.textContent = Math.min(end, Math.round(n)); n < end && requestAnimationFrame(st); }; st(); }));
  $$('[data-count]').forEach(el => co.observe(el));
  try { if (!localStorage.getItem('bc-cookies')) { const c = document.createElement('div'); c.className = 'cookie';
    c.innerHTML = '<span>Usamos apenas cookies essenciais e armazenamento local para o funcionamento do site, conforme a LGPD.</span><button class="btn-primary" type="button">Entendi</button>';
    $('button', c).onclick = () => { localStorage.setItem('bc-cookies', 1); c.remove(); }; document.body.append(c); } } catch {}
  bindMasks();

  /* ---------- áreas de atuação ---------- */
  if (page === 'areas') {
    const D = [
      ['Direito Trabalhista', 'Orientação a trabalhadores e empresas nas relações de emprego.', ['Rescisão e verbas rescisórias', 'Horas extras e adicionais', 'Reconhecimento de vínculo', 'Prevenção de passivo trabalhista']],
      ['Direito Penal', 'Defesa técnica em todas as fases, do inquérito ao julgamento.', ['Acompanhamento em delegacia', 'Defesa em processo criminal', 'Habeas corpus e liberdade provisória', 'Recursos']],
      ['Direito Tributário', 'Planejamento e defesa fiscal para pessoas e empresas.', ['Planejamento tributário', 'Defesa em autuações', 'Recuperação de tributos pagos a maior', 'Parcelamentos']],
      ['Direito Empresarial', 'Estrutura jurídica para abrir, organizar e proteger o negócio.', ['Contratos empresariais', 'Societário e alterações contratuais', 'Compliance', 'Cobrança e recuperação de crédito']],
      ['Direito Imobiliário', 'Segurança jurídica em compra, venda, locação e regularização.', ['Análise de matrícula e contratos', 'Locação', 'Usucapião e regularização', 'Promessa de compra e venda']],
      ['Direito Digital', 'Internet, proteção de dados e tecnologia.', ['Adequação à LGPD', 'Crimes digitais', 'Remoção de conteúdo', 'Contratos de tecnologia']]];
    root.innerHTML = `<div class="section-title"><span>Especialidades</span><h2>Áreas de Atuação</h2></div>
      <div class="grid">${D.map(([n, d, s]) => `<article class="card"><h3>${n}</h3><p>${d}</p><ul>${s.map(i => `<li>${i}</li>`).join('')}</ul><a class="btn-secondary btn-link" href="consultoria.html?area=${encodeURIComponent(n)}">Consultar esta área</a></article>`).join('')}</div>
      <div class="section-title" style="margin:90px 0 30px"><h2>Perguntas Frequentes</h2></div><div class="faq">
      ${[['Como funciona a consultoria online?', 'Você descreve o caso, a triagem encaminha ao advogado da área adequada e ele retorna o contato.'], ['Meus dados estão protegidos?', 'Os dados são tratados conforme a LGPD e usados apenas para analisar o seu caso.'], ['Qual o horário de atendimento?', 'Segunda à sexta, das 08:00 às 18:00.']].map(([q, a]) => `<div class="acc"><button class="acc-q" type="button">${q}</button><div class="acc-a">${a}</div></div>`).join('')}</div>`;
  }

  /* ---------- advogados (API com fallback) ---------- */
  if (page === 'equipe') (async () => {
    let L = [['Bernardo Carter', 'Direito Empresarial', 'Consultoria corporativa e contratos empresariais.'], ['Flávio Bristol', 'Direito Tributário', 'Planejamento tributário e defesa fiscal.'], ['Gustavo Luiz', 'Direito Penal', 'Defesa criminal com atendimento personalizado.'], ['Thales Vieira', 'Direito Digital', 'Internet, proteção de dados e tecnologia.'], ['Vitor', 'Direito Imobiliário', 'Imóveis e direitos reais.']].map(([nome, esp, txt]) => ({ nome, esp, txt }));
    try { const r = await Api.advogados(); if (r.length) L = r.map(a => ({ nome: a.NomeAdvogadosAssociados, esp: a.DadosJuridicosAdvogadosAssociados, reg: a.RegistroAdvogadosAssociados })); } catch {}
    const esps = [...new Set(L.map(l => l.esp))]; let cat = 'Todos';
    root.innerHTML = `<div class="section-title"><span>Equipe Jurídica</span><h2>Nossos Advogados</h2></div><input class="search" type="search" placeholder="Buscar por nome ou área" aria-label="Buscar advogado">
      <div class="bar">${['Todos', ...esps].map((c, i) => `<button type="button" class="chip${i ? '' : ' on'}">${esc(c)}</button>`).join('')}</div><div class="grid" id="lista"></div>`;
    const draw = () => { const q = $('.search').value.toLowerCase(); const r = L.filter(l => (cat === 'Todos' || l.esp === cat) && (l.nome + l.esp).toLowerCase().includes(q));
      $('#lista').innerHTML = r.map(l => `<article class="card"><span class="tag">${esc(l.esp)}</span><h3>${esc(l.nome)}</h3>${l.reg ? `<p>OAB/Registro: ${esc(l.reg)}</p>` : `<p>${esc(l.txt)}</p>`}<a class="btn-secondary btn-link" style="margin-top:18px" href="consultoria.html?area=${encodeURIComponent(l.esp)}">Falar com ${esc(l.nome.split(' ')[0])}</a></article>`).join('') || '<p class="note">Nenhum advogado encontrado.</p>'; };
    $('.search').oninput = draw; $$('.chip').forEach(b => b.onclick = () => { cat = b.textContent; $$('.chip').forEach(x => x.classList.toggle('on', x === b)); draw(); }); draw();
  })();

  /* ---------- artigos ---------- */
  if (page === 'artigos') {
    const A = [['Trabalhista', 'Rescisão: quais verbas devo receber?'], ['Tributário', 'Planejamento tributário para pequenas empresas'], ['Imobiliário', 'Documentos essenciais na compra de um imóvel'], ['Digital', 'LGPD: o que sua empresa precisa fazer'], ['Penal', 'Meus direitos ao ser abordado ou preso'], ['Empresarial', 'Contrato social: o que não pode faltar']];
    let cat = 'Todos';
    root.innerHTML = `<div class="section-title"><span>Conteúdo Jurídico</span><h2>Artigos e Orientações</h2></div><input class="search" type="search" placeholder="Buscar artigo" aria-label="Buscar artigo">
      <div class="bar">${['Todos', ...new Set(A.map(a => a[0]))].map((c, i) => `<button type="button" class="chip${i ? '' : ' on'}">${c}</button>`).join('')}</div><div class="grid" id="lista"></div>`;
    const draw = () => { const q = $('.search').value.toLowerCase(); $('#lista').innerHTML = A.filter(a => (cat === 'Todos' || a[0] === cat) && a[1].toLowerCase().includes(q))
      .map(a => `<article class="card"><span class="tag">${a[0]}</span><h3>${a[1]}</h3><p>Texto do artigo — substitua pelo conteúdo real.</p></article>`).join('') || '<p class="note">Nenhum artigo encontrado.</p>'; };
    $('.search').oninput = draw; $$('.chip').forEach(b => b.onclick = () => { cat = b.textContent; $$('.chip').forEach(x => x.classList.toggle('on', x === b)); draw(); }); draw();
  }

  /* ---------- consultoria (triagem) ---------- */
  if (page === 'consultoria') {
    root.innerHTML = `<div class="section-title"><span>Consultoria</span><h2>Conte o seu caso</h2></div><div class="two">
      <form id="f" class="card" novalidate>${field('nome', 'Nome completo', 'autocomplete="name"')}${field('email', 'E-mail', 'type="email"')}${field('telefone', 'Telefone / WhatsApp', 'data-mask="tel" inputmode="tel" placeholder="(31) 99999-9999"')}
      <div class="field"><label for="area">Área jurídica</label><select id="area" name="area"><option value="">Selecione</option>${[...AREAS, 'Não sei informar'].map(a => `<option>${a}</option>`).join('')}</select><span class="msg-err"></span></div>
      <div class="field"><label for="urgencia">Urgência</label><select id="urgencia" name="urgencia"><option>Normal</option><option>Prazo próximo</option><option>Urgente</option></select><span class="msg-err"></span></div>
      ${field('mensagem', 'Descreva o caso', 'rows="5"', 'textarea')}
      <div class="field"><label class="check"><input type="checkbox" name="lgpd" style="margin-top:4px"> Autorizo o uso dos meus dados para análise do caso (LGPD).</label><span class="msg-err"></span></div>
      <button class="btn-primary" type="submit">Enviar solicitação</button></form>
      <aside class="card"><h3>Como funciona</h3><ol class="passos"><li>Você descreve o caso.</li><li>A triagem encaminha ao advogado da área.</li><li>Ele retorna o contato em horário comercial.</li></ol><p class="note">Não envie senhas nem documentos por este formulário.</p></aside></div><div id="res"></div>`;
    bindMasks(); const f = $('#f'), p = new URLSearchParams(location.search).get('area'); if (p) f.area.value = p;
    f.onsubmit = async e => { e.preventDefault();
      if (!validate(f, { nome: v => v.split(/\s+/).length >= 2 || 'Informe nome e sobrenome.', email: v => /\S+@\S+\.\S+/.test(v) || 'E-mail inválido.', telefone: v => v.replace(/\D/g, '').length >= 10 || 'Telefone inválido.',
        area: v => !!v || 'Escolha uma área.', mensagem: v => v.length >= 30 || 'Descreva com pelo menos 30 caracteres.', lgpd: v => v || 'É necessário autorizar.' })) return;
      const btn = $('button[type=submit]', f); btn.disabled = true;
      const d = await enviarSolicitacao({ nome: f.nome.value.trim(), email: f.email.value.trim(), telefone: f.telefone.value, area: f.area.value, urgencia: f.urgencia.value, mensagem: f.mensagem.value.trim() });
      const txt = `Protocolo ${d.protocolo}\nNome: ${d.nome}\nTelefone: ${d.telefone}\nÁrea: ${d.area}\nUrgência: ${d.urgencia}\n\n${d.mensagem}`;
      $('#res').innerHTML = `<div class="card" style="margin-top:30px"><h3>${d.status === 'enviada' ? 'Solicitação enviada' : 'Solicitação registrada, falta enviar'}</h3><p>Protocolo <strong>${d.protocolo}</strong>.${d.status === 'enviada' ? ' Retornaremos em breve.' : ' O servidor está indisponível; envie agora por um dos canais:'}</p>
        ${d.status === 'enviada' ? '' : `<p style="margin-top:16px"><a class="btn-primary btn-link" target="_blank" rel="noopener" href="https://wa.me/${BC.whatsapp}?text=${encodeURIComponent(txt)}">WhatsApp</a> <a class="btn-secondary btn-link" href="mailto:${BC.email}?subject=${encodeURIComponent('Consultoria ' + d.protocolo)}&body=${encodeURIComponent(txt)}">E-mail</a></p>`}</div>`;
      f.reset(); btn.disabled = false; $('#res').scrollIntoView({ behavior: 'smooth' }); };
  }

  /* ---------- área do cliente ---------- */
  if (page === 'cliente') {
    const render = () => { const u = Sessao.get(); u ? painel(u) : acesso(); };
    const acesso = () => { root.innerHTML = `<div class="section-title"><span>Área do Cliente</span><h2>Acompanhe seus atendimentos</h2></div>
      <div class="card" style="max-width:560px;margin:auto"><div class="tabs"><button type="button" class="on" data-t="l">Entrar</button><button type="button" data-t="c">Criar conta</button></div>
      <form id="fl" novalidate>${field('cpf', 'CPF', 'data-mask="cpf" inputmode="numeric" placeholder="000.000.000-00"')}${field('senha', 'Senha', 'type="password" autocomplete="current-password"')}<button class="btn-primary" type="submit">Entrar</button></form>
      <form id="fc" novalidate hidden>${field('nome', 'Nome completo', '')}${field('cpf', 'CPF', 'data-mask="cpf" inputmode="numeric"')}${field('senha', 'Senha (até 20 caracteres)', 'type="password" maxlength="20" autocomplete="new-password"')}${field('endereco', 'Endereço', 'maxlength="100"')}${field('contato', 'Telefone ou e-mail', 'maxlength="50"')}${field('dados', 'Resumo do seu caso (opcional)', 'maxlength="200" rows="3"', 'textarea')}
      <div class="field"><label class="check"><input type="checkbox" name="lgpd" style="margin-top:4px"> Autorizo o tratamento dos meus dados (LGPD).</label><span class="msg-err"></span></div><button class="btn-primary" type="submit">Criar conta</button></form></div>`;
      bindMasks(); const fl = $('#fl'), fc = $('#fc');
      $$('.tabs button').forEach(b => b.onclick = () => { $$('.tabs button').forEach(x => x.classList.toggle('on', x === b)); fl.hidden = b.dataset.t !== 'l'; fc.hidden = b.dataset.t !== 'c'; });
      fl.onsubmit = async e => { e.preventDefault(); if (!validate(fl, { cpf: v => cpfOk(v) || 'CPF inválido.', senha: v => !!v || 'Informe a senha.' })) return;
        try { const r = await Api.login({ cpf: fl.cpf.value, senha: fl.senha.value }); Sessao.set({ nome: r.NomeCliente || r.nome, contato: r.ContatoCliente || r.contato || '' }); render(); }
        catch (er) { toast(erroApi(er)); } };
      fc.onsubmit = async e => { e.preventDefault(); if (!validate(fc, { nome: v => v.split(/\s+/).length >= 2 || 'Informe nome e sobrenome.', cpf: v => cpfOk(v) || 'CPF inválido.', senha: v => v.length >= 6 || 'Mínimo de 6 caracteres.', endereco: v => v.length >= 5 || 'Informe o endereço.', contato: v => v.length >= 8 || 'Informe um contato.', lgpd: v => v || 'É necessário autorizar.' })) return;
        try { await Api.cadastrar({ NomeCliente: fc.nome.value.trim(), SenhaCliente: fc.senha.value, CPF_Cliente: fc.cpf.value, EnderecoClientes: fc.endereco.value.trim(), ContatoCliente: fc.contato.value.trim(), DadosJuridicosClientes: fc.dados.value.trim() || '-' });
          toast('Conta criada! Agora é só entrar.'); fc.reset(); $('.tabs button').click(); } catch (er) { toast(erroApi(er)); } }; };
    const painel = u => { let l = []; try { l = JSON.parse(localStorage.getItem('bc-solicitacoes') || '[]'); } catch {}
      root.innerHTML = `<div class="section-title"><span>Área do Cliente</span><h2>Olá, ${esc(u.nome.split(' ')[0])}</h2></div><div class="two"><section class="card"><h3>Suas solicitações neste aparelho</h3>
        ${l.length ? `<table class="tbl"><tr><th>Protocolo</th><th>Área</th><th>Data</th><th>Status</th></tr>${l.map(s => `<tr><td>${esc(s.protocolo)}</td><td>${esc(s.area)}</td><td>${esc(s.data)}</td><td>${esc(s.status)}</td></tr>`).join('')}</table>` : '<p>Nenhuma solicitação ainda.</p>'}</section>
        <aside class="card"><h3>Seus dados</h3><p>${esc(u.nome)}</p><p>${esc(u.contato)}</p><p style="margin-top:22px"><a class="btn-primary btn-link" href="consultoria.html">Nova solicitação</a> <button class="btn-secondary btn-link" type="button" id="sair">Sair</button></p></aside></div>`;
      $('#sair').onclick = () => { Sessao.clear(); render(); }; };
    render();
  }
})();
