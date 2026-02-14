const QUIZ_DATA = {
    // Definindo os polos: Esquerda (100%) vs Direita (0%)
    axisDefinitions: {
        'Abstrato/Concreto': { left: 'Abstrato', right: 'Concreto', maxPos: 69, maxNeg: 69 },
        'Visual/Estrutural': { left: 'Visual', right: 'Estrutural', maxPos: 48, maxNeg: 47 },
        'Humano/Sistema': { left: 'Humano', right: 'Sistema', maxPos: 46, maxNeg: 40 },
        'Preventivo/Reativo': { left: 'Preventivo', right: 'Reativo', maxPos: 44, maxNeg: 39 },
        'Exploratório/Controlado': { left: 'Exploratório', right: 'Controlado', maxPos: 32, maxNeg: 44 },
        'Visão Global/Detalhista': { left: 'Visão Global', right: 'Detalhista', maxPos: 41, maxNeg: 37 },
        'Experimental/Estruturado': { left: 'Experimental', right: 'Estruturado', maxPos: 30, maxNeg: 31 }
    },

    questions: [
        // --- LIKERT (8) ---
        {
            id: 1, type: 'likert',
            text: 'Gosto de trabalhar em coisas onde posso ver imediatamente o resultado do que fiz.',
            scoring: { 'Concordo Totalmente': { 'Concreto': 8, 'Visual': 7 }, 'Concordo': { 'Concreto': 4, 'Visual': 4 }, 'Neutro': {}, 'Discordo': { 'Abstrato': 4, 'Estrutural': 4 }, 'Discordo Totalmente': { 'Abstrato': 8, 'Estrutural': 7 } }
        },
        {
            id: 2, type: 'likert',
            text: 'Costumo pensar em como sistemas podem falhar antes que eles realmente falhem.',
            scoring: { 'Concordo Totalmente': { 'Preventivo': 9 }, 'Concordo': { 'Preventivo': 5 }, 'Neutro': {}, 'Discordo': { 'Reativo': 5 }, 'Discordo Totalmente': { 'Reativo': 9 } }
        },
        {
            id: 3, type: 'likert',
            text: 'Sinto mais satisfação em resolver problemas de lógica do que em melhorar a experiência do usuário.',
            scoring: { 'Concordo Totalmente': { 'Abstrato': 5, 'Sistema': 9 }, 'Concordo': { 'Abstrato': 3, 'Sistema': 5 }, 'Neutro': {}, 'Discordo': { 'Concreto': 3, 'Humano': 5 }, 'Discordo Totalmente': { 'Concreto': 5, 'Humano': 9 } }
        },
        {
            id: 4, type: 'likert',
            text: 'Gosto de experimentar abordagens diferentes, mesmo que elas possam não funcionar.',
            scoring: { 'Concordo Totalmente': { 'Experimental': 9, 'Exploratório': 4 }, 'Concordo': { 'Experimental': 5, 'Exploratório': 2 }, 'Neutro': {}, 'Discordo': { 'Estruturado': 5, 'Controlado': 2 }, 'Discordo Totalmente': { 'Estruturado': 9, 'Controlado': 4 } }
        },
        {
            id: 5, type: 'likert',
            text: 'Penso mais em como as partes se conectam do que nas peças individuais.',
            scoring: { 'Concordo Totalmente': { 'Visão Global': 9, 'Estrutural': 2, 'Abstrato': 2 }, 'Concordo': { 'Visão Global': 5, 'Estrutural': 1, 'Abstrato': 1 }, 'Neutro': {}, 'Discordo': { 'Detalhista': 5, 'Concreto': 1 }, 'Discordo Totalmente': { 'Detalhista': 9, 'Concreto': 2 } }
        },
        {
            id: 6, type: 'likert',
            text: 'Prefiro regras e processos claros a descobrir as coisas conforme vou fazendo.',
            scoring: { 'Concordo Totalmente': { 'Controlado': 8, 'Estruturado': 5 }, 'Concordo': { 'Controlado': 4, 'Estruturado': 3 }, 'Neutro': {}, 'Discordo': { 'Exploratório': 4, 'Experimental': 3 }, 'Discordo Totalmente': { 'Exploratório': 8, 'Experimental': 5 } }
        },
        {
            id: 7, type: 'likert',
            text: 'Sinto-me mais motivado a melhorar a experiência das pessoas do que a otimizar sistemas.',
            scoring: { 'Concordo Totalmente': { 'Humano': 9 }, 'Concordo': { 'Humano': 5 }, 'Neutro': {}, 'Discordo': { 'Sistema': 5 }, 'Discordo Totalmente': { 'Sistema': 9 } }
        },
        {
            id: 8, type: 'likert',
            text: 'Prefiro trabalhar com coisas que posso ver e tocar do que com conceitos abstratos.',
            scoring: { 'Concordo Totalmente': { 'Concreto': 8, 'Visual': 4 }, 'Concordo': { 'Concreto': 4, 'Visual': 2 }, 'Neutro': {}, 'Discordo': { 'Abstrato': 4, 'Estrutural': 2 }, 'Discordo Totalmente': { 'Abstrato': 8, 'Estrutural': 4 } }
        },
        // --- CENÁRIO (9) ---
        {
            id: 9, type: 'scenario',
            text: 'Em um projeto em grupo, você naturalmente acaba sendo a pessoa que:',
            options: [
                { text: 'Deixa a apresentação visualmente limpa e fácil de entender', scoring: { 'Visual': 8, 'Humano': 3, 'Concreto': 2 } },
                { text: 'Projeta como tudo deve ser estruturado e conectado', scoring: { 'Estrutural': 8, 'Visão Global': 6, 'Sistema': 4 } },
                { text: 'Verifica erros e casos extremos antes da entrega', scoring: { 'Detalhista': 5, 'Preventivo': 3, 'Controlado': 2 } },
                { text: 'Tenta ideias novas para fazer o projeto se destacar', scoring: { 'Experimental': 6, 'Reativo': 3, 'Visual': 2 } }
            ]
        },
        {
            id: 10, type: 'scenario',
            text: 'Quando está aprendendo algo novo, você prefere:',
            options: [
                { text: 'Seguir um guia passo a passo claro', scoring: { 'Controlado': 4, 'Estruturado': 5 } },
                { text: 'Mergulhar e descobrir tentando fazer', scoring: { 'Reativo': 5, 'Concreto': 3 } },
                { text: 'Entender primeiro a teoria por trás do funcionamento', scoring: { 'Abstrato': 6, 'Visão Global': 2 } },
                { text: 'Ver um exemplo real de uso', scoring: { 'Concreto': 5, 'Visual': 4, 'Humano': 2 } }
            ]
        },
        {
            id: 11, type: 'scenario',
            text: 'Quando algo quebra, seu primeiro instinto é:',
            options: [
                { text: 'Aplicar um remendo rápido para voltar a funcionar', scoring: { 'Reativo': 9, 'Concreto': 3 } },
                { text: 'Encontrar a causa raiz para que nunca mais aconteça', scoring: { 'Preventivo': 9, 'Estrutural': 5, 'Visão Global': 2 } },
                { text: 'Verificar se afeta os usuários e qual a gravidade', scoring: { 'Humano': 4, 'Concreto': 3 } },
                { text: 'Investigar todos os detalhes para entender exatamente o que houve', scoring: { 'Detalhista': 6, 'Controlado': 3 } }
            ]
        },
        {
            id: 12, type: 'scenario',
            text: 'Qual destas opções te dá mais satisfação?',
            options: [
                { text: 'Ver algo que você construiu sendo usado por pessoas', scoring: { 'Humano': 5, 'Concreto': 5, 'Visual': 3, 'Experimental': 2 } },
                { text: 'Projetar um sistema que funciona perfeitamente nos bastidores', scoring: { 'Sistema': 6, 'Estrutural': 5, 'Abstrato': 3 } },
                { text: 'Descobrir um padrão oculto ou insight', scoring: { 'Abstrato': 6, 'Exploratório': 6 } },
                { text: 'Tornar algo mais confiável e estável', scoring: { 'Preventivo': 5, 'Controlado': 3 } }
            ]
        },
        {
            id: 13, type: 'scenario',
            text: 'Você prefere trabalhar com:',
            options: [
                { text: 'Ferramentas visuais e interfaces que você pode interagir', scoring: { 'Visual': 6, 'Concreto': 3 } },
                { text: 'Diagramas, modelos ou mapas de arquitetura de sistemas', scoring: { 'Estrutural': 5, 'Abstrato': 5 } },
                { text: 'Checklists e frameworks de validação', scoring: { 'Controlado': 5, 'Preventivo': 3, 'Estruturado': 2 } },
                { text: 'Ferramentas práticas onde você pode testar coisas diretamente', scoring: { 'Concreto': 5, 'Reativo': 4 } }
            ]
        },
        {
            id: 14, type: 'scenario',
            text: 'Sua maior força em uma equipe é:',
            options: [
                { text: 'Tornar ideias compreensíveis e acessíveis para as pessoas', scoring: { 'Humano': 3, 'Visual': 2, 'Concreto': 2 } },
                { text: 'Garantir que tudo se conecte corretamente', scoring: { 'Estrutural': 6, 'Sistema': 6 } },
                { text: 'Identificar riscos e pontos fracos antes que virem problemas', scoring: { 'Preventivo': 4, 'Detalhista': 5 } },
                { text: 'Gerar novas abordagens criativas', scoring: { 'Experimental': 5, 'Visão Global': 3 } }
            ]
        },
        {
            id: 15, type: 'scenario',
            text: 'Ao começar algo novo, você tipicamente:',
            options: [
                { text: 'Começa a construir imediatamente e ajusta conforme aprende', scoring: { 'Reativo': 6, 'Concreto': 3 } },
                { text: 'Mapeia a arquitetura e as dependências primeiro', scoring: { 'Preventivo': 3, 'Estrutural': 2, 'Visão Global': 4, 'Abstrato': 2 } },
                { text: 'Pesquisa como outros resolveram problemas semelhantes', scoring: { 'Controlado': 5, 'Estruturado': 2 } },
                { text: 'Pensa na jornada e experiência do usuário', scoring: { 'Humano': 5, 'Visual': 4 } }
            ]
        },
        {
            id: 16, type: 'scenario',
            text: 'Qual tipo de trabalho drena sua energia mais rápido?',
            options: [
                { text: 'Trabalho puramente abstrato e invisível', scoring: { 'Concreto': 3, 'Visual': 2 } },
                { text: 'Trabalho confuso e desestruturado', scoring: { 'Controlado': 3, 'Estruturado': 5 } },
                { text: 'Trabalho que ignora o lado humano', scoring: { 'Humano': 3 } },
                { text: 'Trabalho que exige precisão pequena e constante', scoring: { 'Visão Global': 5, 'Detalhista': 2 } }
            ]
        },
        {
            id: 17, type: 'scenario',
            text: 'Você fica mais curioso sobre:',
            options: [
                { text: 'Como as pessoas interagem e respondem às coisas', scoring: { 'Humano': 3, 'Concreto': 2 } },
                { text: 'Como sistemas funcionam internamente e se conectam', scoring: { 'Sistema': 6, 'Abstrato': 5, 'Estrutural': 2 } },
                { text: 'Por que algo falhou e o que deu errado', scoring: { 'Preventivo': 5, 'Detalhista': 4 } },
                { text: 'Se algo poderia funcionar de maneiras completamente diferentes', scoring: { 'Abstrato': 5, 'Visão Global': 4, 'Exploratório': 6 } }
            ]
        },
        // --- BINÁRIA (4) ---
        {
            id: 18, type: 'binary',
            text: 'Qual frase mais se parece com você?',
            options: [
                { text: 'Mergulho e ajusto conforme vou fazendo', scoring: { 'Reativo': 3, 'Exploratório': 4 } },
                { text: 'Planejo cuidadosamente antes de começar', scoring: { 'Preventivo': 3, 'Controlado': 3, 'Abstrato': 2 } }
            ]
        },
        {
            id: 19, type: 'binary',
            text: 'O que é mais satisfatório?',
            options: [
                { text: 'Ver um resultado final com o qual você pode interagir', scoring: { 'Concreto': 5, 'Visual': 4, 'Experimental': 2 } },
                { text: 'Saber que um sistema complexo está funcionando corretamente nos bastidores', scoring: { 'Abstrato': 5, 'Estrutural': 3 } }
            ]
        },
        {
            id: 20, type: 'binary',
            text: 'Ao resolver um problema:',
            options: [
                { text: 'Tento um método novo, mesmo que seja arriscado', scoring: { 'Experimental': 3, 'Exploratório': 4 } },
                { text: 'Uso um método comprovado que sei que funciona', scoring: { 'Estruturado': 3, 'Controlado': 3, 'Abstrato': 2 } }
            ]
        },
        {
            id: 21, type: 'binary',
            text: 'Você prefere focar em:',
            options: [
                { text: 'A direção geral e como tudo se encaixa', scoring: { 'Visão Global': 6, 'Abstrato': 2 } },
                { text: 'Os pequenos detalhes e fazer cada parte corretamente', scoring: { 'Detalhista': 6 } }
            ]
        }
    ],

    domains: {
        'Frontend': { name: 'Desenvolvimento Front-end', description: 'Interfaces visuais, interação com o usuário, feedback imediato', formula: { 'Visual': 0.35, 'Concreto': 0.25, 'Humano': 0.25, 'Reativo': 0.07, 'Visão Global': 0.03, 'Experimental': 0.05 } },
        'Backend': { name: 'Desenvolvimento Back-end', description: 'Lógica de servidores, APIs, bancos de dados, escalabilidade', formula: { 'Estrutural': 0.35, 'Abstrato': 0.25, 'Sistema': 0.25, 'Visão Global': 0.08, 'Preventivo': 0.04, 'Controlado': 0.03 } },
        'Mobile': { name: 'Desenvolvimento Mobile', description: 'Apps iOS/Android, produtos finais', formula: { 'Visual': 0.30, 'Concreto': 0.20, 'Humano': 0.20, 'Estrutural': 0.10, 'Reativo': 0.10, 'Experimental': 0.10 } },
        'Embarcados': { name: 'Sistemas Embarcados', description: 'Hardware, IoT, robótica, baixo nível', formula: { 'Concreto': 0.30, 'Estrutural': 0.20, 'Detalhista': 0.20, 'Controlado': 0.15, 'Preventivo': 0.10, 'Sistema': 0.05 } },
        'Engenharia de Dados': { name: 'Engenharia de Dados', description: 'Pipelines, ETL, infraestrutura de dados', formula: { 'Estrutural': 0.30, 'Sistema': 0.25, 'Abstrato': 0.20, 'Preventivo': 0.10, 'Visão Global': 0.10, 'Estruturado': 0.05 } },
        'DevOps': { name: 'DevOps & Cloud', description: 'Automação, CI/CD, nuvem, confiabilidade', formula: { 'Sistema': 0.30, 'Preventivo': 0.20, 'Estrutural': 0.15, 'Visão Global': 0.15, 'Controlado': 0.10, 'Abstrato': 0.10 } },
        'Segurança': { name: 'Segurança (Cybersec)', description: 'Proteção, vulnerabilidades, defesa', formula: { 'Preventivo': 0.30, 'Detalhista': 0.25, 'Controlado': 0.20, 'Sistema': 0.15, 'Estrutural': 0.07, 'Abstrato': 0.03 } },
        'Ciência de Dados': { name: 'Ciência de Dados', description: 'Padrões, estatística, insights', formula: { 'Abstrato': 0.30, 'Exploratório': 0.20, 'Visão Global': 0.15, 'Detalhista': 0.15, 'Humano': 0.10, 'Experimental': 0.10 } },
        'IA/ML': { name: 'Inteligência Artificial', description: 'Treinamento de modelos, algoritmos inteligentes', formula: { 'Abstrato': 0.30, 'Experimental': 0.20, 'Exploratório': 0.15, 'Estrutural': 0.15, 'Visão Global': 0.10, 'Sistema': 0.10 } },
        'QA/Testes': { name: 'QA & Testes', description: 'Validação, automação, garantia de qualidade', formula: { 'Detalhista': 0.30, 'Preventivo': 0.25, 'Controlado': 0.20, 'Estrutural': 0.10, 'Sistema': 0.10, 'Concreto': 0.05 } }
    },

    personas: {
        'Builder': { name: 'Builder (Construtor)', tagline: 'Eu faço coisas que as pessoas usam', description: 'Resultados visíveis e tangíveis.', formula: { 'Concreto': 0.30, 'Visual': 0.20, 'Humano': 0.20, 'Reativo': 0.15, 'Visão Global': 0.10, 'Experimental': 0.05 } },
        'Architect': { name: 'Architect (Arquiteto)', tagline: 'Eu projeto o sistema que sustenta tudo', description: 'Elegância, estrutura e escala.', formula: { 'Estrutural': 0.30, 'Abstrato': 0.25, 'Sistema': 0.20, 'Visão Global': 0.15, 'Preventivo': 0.10 } },
        'Guardian': { name: 'Guardian (Guardião)', tagline: 'Nada quebra no meu turno', description: 'Confiabilidade e segurança.', formula: { 'Preventivo': 0.30, 'Controlado': 0.20, 'Detalhista': 0.20, 'Sistema': 0.15, 'Estrutural': 0.10, 'Estruturado': 0.05 } },
        'Detective': { name: 'Detective (Detetive)', tagline: 'Há um padrão aqui, vou achá-lo', description: 'Investigação e descoberta.', formula: { 'Abstrato': 0.25, 'Exploratório': 0.20, 'Detalhista': 0.20, 'Visão Global': 0.15, 'Experimental': 0.10, 'Sistema': 0.10 } },
        'Tinkerer': { name: 'Tinkerer (Hacker Prático)', tagline: 'Deixa eu mexer e ver o que acontece', description: 'Aprender quebrando e consertando.', formula: { 'Concreto': 0.25, 'Exploratório': 0.25, 'Reativo': 0.15, 'Detalhista': 0.15, 'Experimental': 0.10, 'Estrutural': 0.10 } },
        'Optimizer': { name: 'Optimizer (Otimizador)', tagline: 'Isso poderia ser mais eficiente', description: 'Performance e automação.', formula: { 'Estrutural': 0.25, 'Sistema': 0.20, 'Preventivo': 0.15, 'Visão Global': 0.15, 'Detalhista': 0.15, 'Controlado': 0.10 } },
        'Experimenter': { name: 'Experimenter (Cientista)', tagline: 'E se tentássemos diferente?', description: 'Inovação e iteração rápida.', formula: { 'Experimental': 0.30, 'Exploratório': 0.20, 'Reativo': 0.15, 'Abstrato': 0.15, 'Humano': 0.10, 'Visual': 0.10 } },
        'Quality Enforcer': { name: 'Quality Enforcer (Auditor)', tagline: 'Isso funciona em todos os casos?', description: 'Perfeccionismo e validação.', formula: { 'Detalhista': 0.30, 'Controlado': 0.20, 'Preventivo': 0.20, 'Estrutural': 0.10, 'Concreto': 0.10, 'Sistema': 0.10 } }
    }
};
// -----------------------------------------------------------------------------
// CONFIGURAÇÃO DEMOGRÁFICA
// Usada pelo quiz.js para renderizar o formulário demográfico ao final do questionário.
// -----------------------------------------------------------------------------
const DEMOGRAPHICS_CONFIG = {

  schoolYears: ["Ensino Fundamental","1° ano", "2° ano", "3° ano", "4° ano", "Ensino Superior", "Formação Técnica", "Outro"],

  genderOptions: [
    { value: "male",       label: "Masculino" },
    { value: "female",     label: "Feminino" },
    { value: "non-binary", label: "Não-binário" },
    { value: "prefer-not", label: "Prefiro não informar" },
  ],

  matchOptions: [
    { value: "yes",      label: "Sim, exatamente o que eu esperava" },
    { value: "mostly",   label: "Em grande parte — algumas surpresas" },
    { value: "somewhat", label: "Mais ou menos — mais surpresas do que esperava" },
    { value: "no",       label: "Não realmente — isso foi revelador" },
  ],

  // Checkboxes predefinidos de linguagens + um campo de texto livre para qualquer outra.
  knownLanguages: [
    "Python", "JavaScript", "Java", "C", "C++", "C#",
    "TypeScript", "PHP", "Ruby", "Swift", "Kotlin",
    "Go", "Rust", "SQL", "HTML/CSS",
  ],

  // Os 10 nomes de domínios, para os checkboxes de "domínios que você já conhecia".
  knownDomains: [
    "Desenvolvimento Front-end",
    "Desenvolvimento Back-end",
    "Desenvolvimento Mobile",
    "Sistemas Embarcados",
    "Engenharia de Dados",
    "DevOps e Infraestrutura em Nuvem",
    "Cibersegurança",
    "Ciência de Dados e Análise",
    "IA / Aprendizado de Máquina",
    "Engenharia de Qualidade e Testes",
  ],

};

// comentário importante: esse código foi SIM escrito com inteligência artificial, especificamente essa pagina.
// esse projeto já tinha sido validado em documentos, e esse arquivo é simplesmente *transcrito* do que já estava escrito, então não é como se a IA tivesse inventado algo novo aqui.
// esse é um dos usos corretos da ia, invés de fazer o famoso "vibe-code", você pode usar a ia para acelerar a transcrição de um documento já validado, e depois revisar o resultado para garantir que tudo esteja correto. isso economiza muito tempo de digitação, e ainda mantém o controle total sobre o conteúdo.
// após a ia gerar o codigo, eu conferi linha por linha para garantir que tudo estivesse fiel ao documento original e fiz ajustes minimos.