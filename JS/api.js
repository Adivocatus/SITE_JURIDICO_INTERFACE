/* api.js — configuração e comunicação com a API Flask. Carregue ANTES dos demais scripts. */
const BC = { email: 'atvocatusjuris@gmail.com', whatsapp: '5531900000000' }; // TROQUE o WhatsApp (DDI+DDD+número)
const Api = {
  base: 'http://127.0.0.1:5000',
  async req(path, opt = {}) {
    const r = await fetch(Api.base + path, { headers: { 'Content-Type': 'application/json' }, ...opt });
    if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.description || j.erro || 'Erro ' + r.status); }
    return r.status === 204 ? null : r.json();
  },
  advogados: () => Api.req('/tabelaadvogadosassociados'),
  cadastrar: d => Api.req('/tabelacliente', { method: 'POST', body: JSON.stringify(d) }),
  login: d => Api.req('/login', { method: 'POST', body: JSON.stringify(d) }),            // a criar na API
  solicitar: d => Api.req('/solicitacoes', { method: 'POST', body: JSON.stringify(d) })  // a criar na API
};
const Sessao = {
  get() { try { return JSON.parse(sessionStorage.getItem('bc-user')); } catch { return null; } },
  set(u) { sessionStorage.setItem('bc-user', JSON.stringify(u)); },
  clear() { sessionStorage.removeItem('bc-user'); }
};
/* Envia a solicitação; se a API estiver fora, marca como "pendente" para envio por WhatsApp/e-mail. */
async function enviarSolicitacao(d) {
  d.protocolo = 'BC-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
  try { await Api.solicitar(d); d.status = 'enviada'; } catch (e) { d.status = 'pendente'; }
  try {
    const l = JSON.parse(localStorage.getItem('bc-solicitacoes') || '[]');
    l.unshift({ protocolo: d.protocolo, area: d.area, status: d.status, data: new Date().toLocaleString('pt-BR') });
    localStorage.setItem('bc-solicitacoes', JSON.stringify(l.slice(0, 30)));
  } catch {}
  return d;
}
