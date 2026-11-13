const AI_PROMPTS = {
  guideTrivia: (townName, context = '', sourceUrlCity = '', sourceUrlPlace = '') => 
    `Jesteś przewodnikiem. Miejscowość: ${townName}. ${context} 
    Więcej informacji źródłowych: ${sourceUrlCity} i ${sourceUrlPlace}.
    Opowiedz po polsku ciekawostkę o tym mieście i miejscu w 3-4 krótkich zdaniach.`
};

module.exports = { AI_PROMPTS };