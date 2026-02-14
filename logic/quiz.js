// =============================================================================
// quiz.js — Lógica do Quiz
// Responsável por renderizar as questões, coletar respostas,
// mostrar o formulário demográfico e salvar tudo no localStorage.
//
// Depende de: quiz_data.js (QUIZ_DATA, DEMOGRAPHICS_CONFIG)
//             math.js (calculateScores)
// =============================================================================


// -----------------------------------------------------------------------------
// ESTADO
// Um objeto simples que guarda tudo que acontece durante o quiz.
// Nada de frameworks, nada de reatividade — só um objeto que a gente atualiza.
// -----------------------------------------------------------------------------
const state = {
  userName:  localStorage.getItem('userName') || 'Participante',
  startTime: Date.now(),   // timestamp em ms, usado pra calcular duração
  answers:   {},           // { 1: "Concordo", 9: "Texto da opção", ... }
};


// -----------------------------------------------------------------------------
// REFERÊNCIAS AO DOM
// Três containers separados — um por tipo de questão.
// O CSS usa o data-type do container pai pra estilizar cada bloco diferente.
// -----------------------------------------------------------------------------
const containers = {
  likert:   document.getElementById('questions-likert'),
  scenario: document.getElementById('questions-scenario'),
  binary:   document.getElementById('questions-binary'),
};
const progressBar         = document.getElementById('progress-fill');
const progressLabel       = document.getElementById('progress-label');
const submitBtn           = document.getElementById('submit-btn');
const demographicsSection = document.getElementById('demographics-section');
const demographicsForm    = document.getElementById('demographics-form');


// -----------------------------------------------------------------------------
// RENDERIZAR QUESTÕES
// Cria um card HTML para cada questão e injeta no #questions-container.
// Cada card tem data-type="likert|scenario|binary" pro CSS diferenciar visualmente.
// -----------------------------------------------------------------------------
function renderQuestions() {
  // Limpa os três containers antes de renderizar
  Object.values(containers).forEach(c => c.innerHTML = '');

  QUIZ_DATA.questions.forEach((q, index) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.dataset.type = q.type;
    card.dataset.id = q.id;

    // Monta as opções dependendo do tipo
    let optionsHTML = '';

    if (q.type === 'likert') {
      // Likert sempre tem as mesmas 5 opções fixas, nessa ordem
      const likertOptions = [
        'Discordo Totalmente',
        'Discordo',
        'Neutro',
        'Concordo',
        'Concordo Totalmente',
      ];
      optionsHTML = likertOptions.map(label => `
        <button class="option-btn" data-val="${label}" data-qid="${q.id}">
          ${label}
        </button>
      `).join('');

    } else {
      // Scenario e Binary: opções vêm do array q.options
      // Usamos o campo .text como valor (é o que calculateScores espera)
      optionsHTML = q.options.map(opt => `
        <button class="option-btn" data-val="${opt.text}" data-qid="${q.id}">
          ${opt.text}
        </button>
      `).join('');
    }

    // Monta o HTML interno do card
    // data-type no card é o que o CSS usa pra colorir/estilizar por seção
    card.innerHTML = `
      <div class="question-header">
        <span class="question-number">Q${index + 1}</span>
        <span class="question-type-badge">${typeBadgeLabel(q.type)}</span>
      </div>
      <p class="question-text">${q.text}</p>
      <div class="options-container">
        ${optionsHTML}
      </div>
    `;

    // Rota o card pro container correto baseado no tipo da questão.
    // containers.likert   → #questions-likert
    // containers.scenario → #questions-scenario
    // containers.binary   → #questions-binary
    const target = containers[q.type];
    if (target) target.appendChild(card);
  });

  // Depois de renderizar tudo, adiciona os event listeners nas opções
  attachOptionListeners();
}


// -----------------------------------------------------------------------------
// LABEL DO BADGE DE TIPO
// Retorna o texto que aparece no canto do card indicando o tipo da questão.
// Puramente visual, não afeta a lógica.
// -----------------------------------------------------------------------------
function typeBadgeLabel(type) {
  const labels = {
    likert:   'Escala',
    scenario: 'Cenário',
    binary:   'Escolha',
  };
  return labels[type] || type;
}


// -----------------------------------------------------------------------------
// EVENT LISTENERS NAS OPÇÕES
// Delegamos um único listener por opção.
// Quando clicada: marca como selecionada, salva no state, atualiza progresso.
// -----------------------------------------------------------------------------
function attachOptionListeners() {
  // Pega todos os botões de opção de uma vez
  const allOptionBtns = document.querySelectorAll('.option-btn');

  allOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const qid = btn.dataset.qid;   // id da questão (ex: "1", "9")
      const val = btn.dataset.val;   // texto da resposta escolhida

      // Remove .selected de todos os botões da MESMA questão
      // (não queremos desmarcar opções de outras questões)
      document.querySelectorAll(`.option-btn[data-qid="${qid}"]`).forEach(b => {
        b.classList.remove('selected');
      });

      // Marca este botão como selecionado
      btn.classList.add('selected');

      // Salva a resposta no state
      // A chave é o id da questão (número), o valor é o texto da opção
      state.answers[qid] = val;

      // Marca o card pai como respondido (pro CSS mostrar feedback visual)
      const card = btn.closest('.question-card');
      card.classList.add('answered');

      // Atualiza a barra de progresso
      updateProgress();
    });
  });
}


// -----------------------------------------------------------------------------
// ATUALIZAR PROGRESSO
// Conta quantas questões foram respondidas e atualiza a barra.
// Quando todas estiverem respondidas, habilita o botão de enviar.
// -----------------------------------------------------------------------------
function updateProgress() {
  const totalQuestions = QUIZ_DATA.questions.length;           // 21
  const answeredCount  = Object.keys(state.answers).length;   // quantas respondidas

  const percentage = Math.round((answeredCount / totalQuestions) * 100);

  // Atualiza a largura da barra de progresso (o CSS faz a transição suave)
  progressBar.style.width = percentage + '%';

  // Atualiza o label de texto (ex: "14 / 21")
  progressLabel.textContent = `${answeredCount} / ${totalQuestions}`;

  // Habilita o botão de enviar quando todas forem respondidas
  if (answeredCount === totalQuestions) {
    submitBtn.disabled = false;
    submitBtn.classList.add('ready');
  }
}


// -----------------------------------------------------------------------------
// BOTÃO DE ENVIAR
// Quando clicado (e todas as questões respondidas):
//   1. Esconde o botão
//   2. Revela o formulário demográfico
//   3. Faz scroll suave até ele
// -----------------------------------------------------------------------------
submitBtn.addEventListener('click', () => {
  // Validação extra: garante que todas foram respondidas
  // (o botão já está disabled até isso, mas não custa checar)
  if (Object.keys(state.answers).length < QUIZ_DATA.questions.length) return;

  // Revela a seção de dados demográficos
  demographicsSection.classList.remove('hidden');

  // Scroll suave até o formulário
  demographicsSection.scrollIntoView({ behavior: 'smooth' });
});


// -----------------------------------------------------------------------------
// RENDERIZAR FORMULÁRIO DEMOGRÁFICO
// Injeta os campos do formulário usando DEMOGRAPHICS_CONFIG.
// Separado do HTML para facilitar alterações na configuração.
// -----------------------------------------------------------------------------
function renderDemographicsForm() {
  // Anos escolares — radio buttons
const schoolYearOptions = DEMOGRAPHICS_CONFIG.schoolYears.map(year => `
    <label class="choice-button">
      <input type="radio" name="schoolYear" value="${year}" />
      ${year}
    </label>
  `).join('');

  // Gênero — select
  const genderOptions = DEMOGRAPHICS_CONFIG.genderOptions.map(opt => `
    <option value="${opt.value}">${opt.label}</option>
  `).join('');

  // Expectativa — select
  const matchOptions = DEMOGRAPHICS_CONFIG.matchOptions.map(opt => `
    <option value="${opt.value}">${opt.label}</option>
  `).join('');

  // Linguagens conhecidas — checkbox grid
const languageCheckboxes = DEMOGRAPHICS_CONFIG.knownLanguages.map(lang => `
    <label class="choice-button">
      <input type="checkbox" name="knownLanguages" value="${lang}" />
      ${lang}
    </label>
  `).join('');

  // Domínios conhecidos — checkbox grid
const domainCheckboxes = DEMOGRAPHICS_CONFIG.knownDomains.map(domain => `
    <label class="choice-button">
      <input type="checkbox" name="knownDomains" value="${domain}" />
      ${domain}
    </label>
  `).join('');

  demographicsForm.innerHTML = `

    <div class="form-group">
      <label class="form-label">Nome</label>
      <input type="text" id="nameInput" value="${state.userName}" placeholder="Seu nome" />
    </div>

    <div class="form-group">
      <label class="form-label">Idade</label>
      <input type="number" id="ageInput" min="14" max="60" placeholder="Ex: 19" />
    </div>

   <div class="form-group">
      <label class="form-label">Ano escolar</label>
      <div class="radio-group">
        ${schoolYearOptions}
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Gênero</label>
      <select id="genderSelect">
        <option value="">Prefiro não informar</option>
        ${genderOptions}
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">Experiência</label>
      <label class="choice-button">
        <input type="checkbox" id="priorExperienceCheck" />
        Tenho experiência prévia com programação
      </label>
      
      <div id="experienceSinceGroup" class="hidden" style="margin-top: 15px;">
        <label class="form-label">Há quantos anos?</label>
        <input type="number" id="experienceSinceInput" min="0" max="20" placeholder="Ex: 3" />
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Linguagens que você conhece (pelo nome)</label>
      <div class="checkbox-grid">
        ${languageCheckboxes}
      </div>
      <input type="text" id="languageFreeTag" placeholder="Outra linguagem..." style="margin-top: 10px;" />
    </div>

    <div class="form-group">
      <label class="form-label">Áreas que você já conhecia antes do quiz</label>
      <div class="checkbox-grid">
        ${domainCheckboxes}
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">O quiz correspondeu ao que você esperava?</label>
      <select id="matchSelect">
        <option value="">Selecione...</option>
        ${matchOptions}
      </select>
    </div>


   <button type="button" id="finalSubmitBtn" class="btn-primary" style="width: 100%; margin-top: 40px;">
      Ver meus resultados →
    </button>

  `;

  // Toggle do campo "desde quando" quando experiência prévia é marcada
  document.getElementById('priorExperienceCheck').addEventListener('change', (e) => {
    const group = document.getElementById('experienceSinceGroup');
    // Se marcado, mostra o campo. Se desmarcado, esconde.
    group.classList.toggle('hidden', !e.target.checked);
  });

  // Listener do botão final
  document.getElementById('finalSubmitBtn').addEventListener('click', submitQuiz);
}


async function sendToServer(data) {
  // TODO: substituir pela URL do seu endpoint Vercel
  const ENDPOINT = '/api/save-result';;

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    console.log('✅ Resultado enviado ao servidor.');

  } catch (err) {
    // Falha silenciosa — o aluno ainda vê os resultados normalmente
    // O dado está no localStorage se precisar recuperar depois
    console.warn('⚠️ Não foi possível enviar ao servidor:', err.message);
  }
}

// -----------------------------------------------------------------------------
// SUBMETER QUIZ
// Coleta os dados demográficos, monta o objeto final, salva no localStorage
// e redireciona para results.html.
// -----------------------------------------------------------------------------
async function submitQuiz() {

  // -- Coleta os dados demográficos --

  const name = document.getElementById('nameInput').value.trim() || 'Participante';
  const age  = parseInt(document.getElementById('ageInput').value) || null;

  // Radio buttons: pega o que está checked
  const schoolYearEl = document.querySelector('input[name="schoolYear"]:checked');
  const schoolYear   = schoolYearEl ? parseInt(schoolYearEl.value) : null;

  const gender = document.getElementById('genderSelect').value || null;

  const priorExperience = document.getElementById('priorExperienceCheck').checked;
  const experienceSinceEl = document.getElementById('experienceSinceInput');
  const experienceSince = priorExperience
    ? (parseInt(experienceSinceEl.value) || null)
    : null;

  // Checkboxes: pega todos os marcados e extrai seus valores
  const selectedLanguages = Array.from(
    document.querySelectorAll('input[name="knownLanguages"]:checked')
  ).map(el => el.value);

  const freeTagRaw = document.getElementById('languageFreeTag').value.trim();
  const freeTag    = freeTagRaw || null;

  const selectedDomains = Array.from(
    document.querySelectorAll('input[name="knownDomains"]:checked')
  ).map(el => el.value);

  const quizMatchedExpectation = document.getElementById('matchSelect').value || null;

  // -- Monta o objeto de resultado --
  const result = {
    name,
    timestamp: new Date().toISOString(),
    duration: Math.round((Date.now() - state.startTime) / 1000),  // em segundos

    demographics: {
      age,
      schoolYear,
      gender,
      priorExperience,
      experienceSince,
      knownLanguages: {
        selected: selectedLanguages,
        freeTag,
      },
      knownDomains: selectedDomains,
      quizMatchedExpectation,
    },

    answers: state.answers,

    // Calcula os scores aqui mesmo e já salva junto
    // O results.js só precisa ler, não recalcular
    results: calculateScores(state.answers),
  };

  // -- Salva no localStorage e redireciona --
  localStorage.setItem('quizResult', JSON.stringify(result));

  await sendToServer(result);

  window.location.href = 'results.html';
}


// -----------------------------------------------------------------------------
// INICIALIZAÇÃO
// Roda quando o script carrega. Renderiza tudo e deixa pronto.
// -----------------------------------------------------------------------------
function init() {
  // Preenche o nome no header da página se existir
  const nameDisplay = document.getElementById('user-name-display');
  if (nameDisplay) nameDisplay.textContent = state.userName;

  // Renderiza as 21 questões
  renderQuestions();

  // Renderiza o formulário demográfico (começa hidden via CSS)
  renderDemographicsForm();

  // Botão de enviar começa desabilitado
  submitBtn.disabled = true;
}

// Dispara quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);