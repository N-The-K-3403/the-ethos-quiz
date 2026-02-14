
function calculateScores(answers) {
    // A. Acumular pontos brutos
    let rawPoints = {};
    // Inicializar todos os pontos possíveis com 0
    Object.values(QUIZ_DATA.axisDefinitions).forEach(def => {
        rawPoints[def.left] = 0;
        rawPoints[def.right] = 0;
    });

    Object.entries(answers).forEach(([qId, answerText]) => {
        const q = QUIZ_DATA.questions.find(x => x.id == qId);
        let scoring = {};
        
        if (q.type === 'likert') scoring = q.scoring[answerText];
        else {
            const opt = q.options.find(o => o.text === answerText);
            scoring = opt ? opt.scoring : {};
        }

        if (scoring) {
            Object.entries(scoring).forEach(([axis, points]) => {
                if (rawPoints[axis] !== undefined) rawPoints[axis] += points;
            });
        }
    });

    // B. Normalizar Eixos (0 a 100)
    // 0 = Totalmente Direita, 100 = Totalmente Esquerda, 50 = Neutro
    const normalizedAxes = {};

    Object.entries(QUIZ_DATA.axisDefinitions).forEach(([axisName, def]) => {
        const leftScore = rawPoints[def.left];
        const rightScore = rawPoints[def.right];
        const netScore = leftScore - rightScore; // Positivo = Esquerda, Negativo = Direita

        let percentage = 50;
        if (netScore > 0) {
            percentage = 50 + ((netScore / def.maxPos) * 50);
        } else if (netScore < 0) {
            percentage = 50 - ((Math.abs(netScore) / def.maxNeg) * 50);
        }
        
        // Clamp 0-100
        normalizedAxes[def.left] = Math.max(0, Math.min(100, percentage));
        // O valor do direito é simplesmente o inverso
        normalizedAxes[def.right] = 100 - normalizedAxes[def.left];
    });

    // C. Calcular Domínios
    const domainScores = [];
    Object.entries(QUIZ_DATA.domains).forEach(([key, data]) => {
        let total = 0;
        Object.entries(data.formula).forEach(([trait, weight]) => {
            const val = normalizedAxes[trait] || 50;
            total += val * weight;
        });
        domainScores.push({ key, ...data, score: Math.round(total) });
    });

    // D. Calcular Personas
    const personaScores = [];
    Object.entries(QUIZ_DATA.personas).forEach(([key, data]) => {
        let total = 0;
        Object.entries(data.formula).forEach(([trait, weight]) => {
            const val = normalizedAxes[trait] || 50;
            total += val * weight;
        });
        personaScores.push({ key, ...data, score: Math.round(total) });
    });

    return {
        axes: normalizedAxes,
        domains: domainScores.sort((a,b) => b.score - a.score),
        personas: personaScores.sort((a,b) => b.score - a.score)
    };
}