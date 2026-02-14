// =============================================================================
// api/fetch-results.js — Vercel Serverless Function
// Valida a senha contra o pass.json no repositório de dados,
// e se válida, retorna todos os arquivos JSON da pasta /results.
//
// Variáveis de ambiente necessárias (mesmas do save-result.js):
//   GITHUB_TOKEN      — Personal Access Token com permissão Contents: R+W
//   GITHUB_DATA_REPO  — "usuario/nome-do-repo"
// =============================================================================

module.exports = async function handler(req, res) {

  // ── Só aceita POST ──────────────────────────────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GITHUB_TOKEN     = process.env.GITHUB_TOKEN;
  const GITHUB_DATA_REPO = process.env.GITHUB_DATA_REPO;

  if (!GITHUB_TOKEN || !GITHUB_DATA_REPO) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  const headers = {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept':        'application/vnd.github+json',
    'User-Agent':    'ds-ethos-quiz',
  };

  // ── 1. Busca e valida a senha ───────────────────────────────────────────────
  try {
    const passRes = await fetch(
      `https://api.github.com/repos/${GITHUB_DATA_REPO}/contents/user/pass.json`,
      { headers }
    );

    if (!passRes.ok) {
      console.error('Could not fetch pass.json:', passRes.status);
      return res.status(401).json({ error: 'Auth failed' });
    }

    const passFile = await passRes.json();

    // GitHub retorna o conteúdo em Base64
    const passContent = JSON.parse(
      Buffer.from(passFile.content, 'base64').toString('utf-8')
    );

    if (password !== passContent.password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

  } catch (err) {
    console.error('Auth error:', err);
    return res.status(500).json({ error: 'Auth error' });
  }

  // ── 2. Lista todos os arquivos em /results ──────────────────────────────────
  let fileList;
  try {
    const listRes = await fetch(
      `https://api.github.com/repos/${GITHUB_DATA_REPO}/contents/results`,
      { headers }
    );

    if (!listRes.ok) {
      console.error('Could not list results:', listRes.status);
      return res.status(500).json({ error: 'Could not list results' });
    }

    fileList = await listRes.json();

  } catch (err) {
    console.error('List error:', err);
    return res.status(500).json({ error: 'List error' });
  }

  // ── 3. Busca o conteúdo de cada arquivo JSON ────────────────────────────────
  // Filtra só .json (ignora .gitkeep e outros)
  const jsonFiles = fileList.filter(f => f.name.endsWith('.json'));

  const results = [];

  for (const file of jsonFiles) {
    try {
      const fileRes = await fetch(file.url, { headers });
      if (!fileRes.ok) continue;

      const fileData = await fileRes.json();
      const content  = JSON.parse(
        Buffer.from(fileData.content, 'base64').toString('utf-8')
      );

      results.push(content);

    } catch (err) {
      // Falha em um arquivo não derruba tudo — só loga e continua
      console.error('Error reading file:', file.name, err);
    }
  }

  return res.status(200).json({ results });
};