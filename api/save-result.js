// =============================================================================
// api/save-result.js — Vercel Serverless Function
// Recebe o resultado do quiz via POST e commita um arquivo JSON
// no repositório de dados no GitHub.
//
// Variáveis de ambiente necessárias (configurar no Vercel dashboard):
//   GITHUB_TOKEN      — Personal Access Token com permissão Contents: R+W
//   GITHUB_DATA_REPO  — "usuario/nome-do-repo", ex: "ana/ds-ethos-quiz-data"
// =============================================================================

module.exports = async function handler(req, res) {

  // ── Só aceita POST ──────────────────────────────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Lê as variáveis de ambiente ─────────────────────────────────────────────
  const GITHUB_TOKEN     = process.env.GITHUB_TOKEN;
  const GITHUB_DATA_REPO = process.env.GITHUB_DATA_REPO;

  if (!GITHUB_TOKEN || !GITHUB_DATA_REPO) {
    console.error('Variáveis de ambiente não configuradas.');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  // ── Lê e valida o body ──────────────────────────────────────────────────────
  const result = req.body;

  if (!result || !result.name) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  // ── Monta o nome do arquivo ─────────────────────────────────────────────────
  // Formato: results/nome_timestamp.json
  // O timestamp garante que dois alunos com o mesmo nome não se sobrescrevem.
  const safeName  = (result.name || 'anonimo')
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '_')   // remove caracteres especiais
    .slice(0, 40);                  // limita o tamanho

  const timestamp = Date.now();
  const fileName  = `results/${safeName}_${timestamp}.json`;

  // ── Converte o resultado pra Base64 ─────────────────────────────────────────
  // A GitHub API espera o conteúdo do arquivo em Base64.
  const content = Buffer.from(
    JSON.stringify(result, null, 2)   // JSON indentado, mais fácil de ler
  ).toString('base64');

  // ── Chama a GitHub Contents API ─────────────────────────────────────────────
  const apiUrl = `https://api.github.com/repos/${GITHUB_DATA_REPO}/contents/${fileName}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type':  'application/json',
        'User-Agent':    'ds-ethos-quiz',   // GitHub API exige um User-Agent
      },
      body: JSON.stringify({
        message: `resultado: ${safeName} (${new Date(timestamp).toISOString()})`,
        content,
      }),
    });

    // ── Trata a resposta do GitHub ───────────────────────────────────────────
    if (response.status === 201) {
      // 201 Created — arquivo commitado com sucesso
      return res.status(200).json({ ok: true, file: fileName });
    }

    // Qualquer outro status é erro — loga pra debug no Vercel
    const errorBody = await response.json();
    console.error('GitHub API error:', response.status, errorBody);
    return res.status(500).json({ error: 'GitHub API error', details: errorBody });

  } catch (err) {
    // Erro de rede ou outro erro inesperado
    console.error('Fetch error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}