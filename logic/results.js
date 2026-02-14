// =============================================================================
// results.js — Renderização dos Resultados
// Lê o objeto salvo pelo quiz.js no localStorage e renderiza tudo:
//   - Página de resultados completa (personas, domínios, eixos)
//   - Card exportável (portrait, html2canvas → PNG)
//   - Stub para envio ao servidor (Vercel)
//
// Depende de: quiz_data.js (QUIZ_DATA)
//             html2canvas (carregado via CDN no results.html)
// =============================================================================


// -----------------------------------------------------------------------------
// LER RESULTADO DO LOCALSTORAGE
// O quiz.js já calculou tudo e salvou. A gente só lê.
// Se não tiver nada (alguém abriu results.html diretamente), redireciona.
// -----------------------------------------------------------------------------
const stored = localStorage.getItem('quizResult');

if (!stored) {
  // Sem resultado salvo — manda de volta pro início
  window.location.href = 'index.html';
}

const quizResult = JSON.parse(stored);
const { name, results, demographics, timestamp, duration } = quizResult;

// Atalhos úteis
const topPersonas = results.personas.slice(0, 3);   // top 3 personas
const allDomains  = results.domains;                 // já vem ordenado por score


// -----------------------------------------------------------------------------
// REFERÊNCIAS AO DOM
// -----------------------------------------------------------------------------
const personasContainer  = document.getElementById('personas-container');
const domainsContainer   = document.getElementById('domains-container');
const axesContainer      = document.getElementById('axes-container');
const heroName           = document.getElementById('hero-name');
const heroPersona        = document.getElementById('hero-persona');
const downloadBtn        = document.getElementById('download-btn');
const shareBtn           = document.getElementById('share-btn');
const shareCard          = document.getElementById('share-card');


// -----------------------------------------------------------------------------
// RENDERIZAR HERO
// Topo da página: nome do aluno + persona #1 em destaque
// -----------------------------------------------------------------------------
function renderHero() {
  if (heroName)   heroName.textContent   = name;
  if (heroPersona) heroPersona.textContent = topPersonas[0].name;
}


// -----------------------------------------------------------------------------
// RENDERIZAR PERSONAS
// Top 3 personas com tagline e descrição completa.
// Medals: 🥇 🥈 🥉
// -----------------------------------------------------------------------------
function renderPersonas() {
  if (!personasContainer) return;

  const medals = ['🥇', '🥈', '🥉'];

  personasContainer.innerHTML = topPersonas.map((p, i) => `
    <div class="persona-card" data-rank="${i + 1}">
      <div class="persona-header">
        <div class="persona-title-row">
          <span class="persona-medal">${medals[i]}</span>
          <h3 class="persona-name">${p.name}</h3>
          <span class="persona-score">${p.score}%</span>
        </div>
        <p class="persona-tagline">"${p.tagline}"</p>
      </div>
      <p class="persona-description">${p.description}</p>
    </div>
  `).join('');
}


// -----------------------------------------------------------------------------
// RENDERIZAR DOMÍNIOS
// Todos os 10 domínios com barra de progresso e percentual.
// Top 3 recebem a classe .top-domain para destaque visual via CSS.
// -----------------------------------------------------------------------------
function renderDomains() {
  if (!domainsContainer) return;

  domainsContainer.innerHTML = allDomains.map((d, i) => `
    <div class="domain-row ${i < 3 ? 'top-domain' : ''}">
      <div class="domain-label-row">
        <span class="domain-name">${d.name}</span>
        <span class="domain-score">${d.score}%</span>
      </div>
      <div class="domain-bar-track">
        <div class="domain-bar-fill" style="width: ${d.score}%"></div>
      </div>
    </div>
  `).join('');
}


// -----------------------------------------------------------------------------
// RENDERIZAR EIXOS
// Visualização dos 7 eixos com marcador deslizante.
// O marcador fica na posição leftVal% (0 = polo direito, 100 = polo esquerdo).
// Baseado diretamente no Obsidian — funcionou bem.
// -----------------------------------------------------------------------------
function renderAxes() {
  if (!axesContainer) return;

  axesContainer.innerHTML = Object.entries(QUIZ_DATA.axisDefinitions).map(([key, def]) => {
    const leftVal = results.axes[def.left]; 
    const leftDominant  = leftVal > 50;
    const rightDominant = leftVal < 50;

    // Lógica de cores baseada na intensidade
    let axisColor = 'var(--green-glow)'; // Padrão (30-65%)
    if (Math.round(leftVal) <= 45 || Math.round(leftVal) >= 65) {
      axisColor = 'var(--green-deep)';
    }
    if (Math.round(leftVal) <= 15 || Math.round(leftVal) >= 85) {
      axisColor = 'var(--green-bright)';
    } 

    const directionClass = rightDominant ? 'is-right' : 'is-left';

    return `
      <div class="axis-row">
        <div class="axis-labels">
          <span class="axis-pole ${leftDominant ? 'dominant' : ''}">${def.left}</span>
          <span class="axis-value" style="margin-right: 100px;" id="left">${Math.round(leftVal)}%</span>
          <span class="axis-value" style="margin-left: 100px;" id="right">${Math.round(100 - leftVal)}%</span>
          <span class="axis-pole ${rightDominant ? 'dominant' : ''}">${def.right}</span>
        </div>
        <div class="axis-track ${directionClass}" style="--dynamic-green: ${axisColor}">
          <div class="axis-marker" style="right: ${leftVal}%"></div>
        </div>
      </div>
    `;
  }).join('');
}


// -----------------------------------------------------------------------------
// RENDERIZAR CARD EXPORTÁVEL
// Portrait card que o html2canvas vai capturar.
// Fica fora do fluxo normal da página (position absolute ou num container hidden).
// CSS do card fica em styles.css na classe .share-card
// -----------------------------------------------------------------------------
function renderShareCard() {
  if (!shareCard) return;

  // Barras dos domínios dentro do card
  // Mais compactas que na página — sem descrição, só nome + barra + %
  const cardDomainBars = allDomains.map((d, i) => `
    <div class="card-domain-row ${i < 3 ? 'card-top-domain' : ''}">
      <span class="card-domain-name">${d.name}</span>
      <div class="card-domain-bar-track">
        <div class="card-domain-bar-fill" style="width: ${d.score}%"></div>
      </div>
      <span class="card-domain-score">${d.score}%</span>
    </div>
  `).join('');

  // Personas no card — só nome e score, sem descrição
  const cardPersonas = topPersonas.map((p, i) => `
    <div class="card-persona-row">
      <span class="card-persona-rank">#${i + 1}</span>
      <span class="card-persona-name">${p.name}</span>
      <span class="card-persona-score">${p.score}%</span>
    </div>
  `).join('');

  shareCard.innerHTML = `
    <div class="card-header">
      <span class="card-brand">DS Ethos Quiz</span>
    </div>

    <div class="card-name-section">
      <h2 class="card-student-name">${name}</h2>
    </div>

    <div class="card-personas-section">
      <p class="card-section-label">MINDSET</p>
      ${cardPersonas}
      <p class="card-tagline">"${topPersonas[0].tagline}"</p>
    </div>

    <div class="card-divider"></div>

    <div class="card-domains-section">
      <p class="card-section-label">ÁREAS</p>
      ${cardDomainBars}
    </div>

    <div class="card-footer">
      <span>${new Date(timestamp).getFullYear()} · DS Ethos Quiz</span>
    </div>
  `;
}


// -----------------------------------------------------------------------------
// EXPORTAR CARD
// Usa html2canvas pra capturar o #share-card e fazer download como PNG.
// html2canvas é carregado via CDN no results.html — não precisa instalar nada.
// -----------------------------------------------------------------------------
// --- Função Auxiliar: Gera o canvas da imagem ---
async function generateCanvas() {
  if (!shareCard) return null;
  
  const wasHidden = shareCard.classList.contains('card-hidden');
  if (wasHidden) shareCard.classList.remove('card-hidden');

  const canvas = await html2canvas(shareCard, {
    scale: 3, // Aumentei para 3x para o compartilhamento ficar mais nítido
    useCORS: true,
    backgroundColor: "#0a0a0a", // Garante o fundo escuro no compartilhamento
  });

  if (wasHidden) shareCard.classList.add('card-hidden');
  return canvas;
}

// --- Botão de Download (PNG) ---
async function handleDownload() {
  downloadBtn.textContent = 'Gerando...';
  downloadBtn.disabled = true;

  try {
    const canvas = await generateCanvas();
    const link = document.createElement('a');
    link.download = `${name.replace(/\s+/g, '_')}_ethos.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    downloadBtn.textContent = 'Baixar Card →'; // Mantendo seu texto original
  } catch (err) {
    console.error(err);
  } finally {
    downloadBtn.disabled = false;
  }
}

// --- Botão de Compartilhar (Imagem + Link) ---
async function handleShare() {
  shareBtn.textContent = 'Preparando...';
  shareBtn.disabled = true;

  try {
    const canvas = await generateCanvas();
    
    // Converte o canvas para Blob (arquivo)
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'meu-resultado-ethos.png', { type: 'image/png' });
      
      const shareData = {
        title: 'Meu Perfil DS Ethos',
        text: 'Confira meu resultado no DS Ethos Quiz! https://the-ethos-quiz.vercel.app',
        files: [file], // Aqui enviamos o arquivo real
      };

      // Verifica se o navegador suporta compartilhar ARQUIVOS
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share(shareData);
      } else {
        // Fallback: Se não der pra enviar a imagem, tenta enviar o texto/link
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: window.location.href 
        });
      }
    }, 'image/png');

  } catch (err) {
    console.log('Erro ao compartilhar:', err);
    // Fallback final: Copia o link
    navigator.clipboard.writeText(window.location.href);
    alert('Link copiado!');
  } finally {
    shareBtn.textContent = 'Compartilhar Card →';
    shareBtn.disabled = false;
  }
}

// -----------------------------------------------------------------------------
// ENVIAR PARA SERVIDOR (STUB)
// Quando você montar o backend no Vercel, descomenta e aponta pra URL certa.
// Por enquanto só loga no console.
//
// O objeto quizResult já tem tudo:
//   name, timestamp, duration, demographics, answers, results
// -----------------------------------------------------------------------------



// -----------------------------------------------------------------------------
// INICIALIZAÇÃO
// Roda tudo em sequência quando o DOM estiver pronto.
// -----------------------------------------------------------------------------
function init() {
  renderHero();
  renderPersonas();
  renderDomains();
  renderAxes();
  renderShareCard();

  if (downloadBtn) downloadBtn.addEventListener('click', handleDownload);
  if (shareBtn) shareBtn.addEventListener('click', handleShare);

  
}

document.addEventListener('DOMContentLoaded', init);