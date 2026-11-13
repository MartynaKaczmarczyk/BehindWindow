const { AI_PROMPTS } = require('../config/aiPrompts');

function buildPrompt(townName, featuredPlace, previousStories = []) {
    const context = featuredPlace
        ? `W pobliżu znajduje się ${featuredPlace.title}.`
        : '';
    const sourceUrlCity = `https://pl.wikipedia.org/wiki/${encodeURIComponent(townName.replaceAll(' ', '_'))}`;
    const sourceUrlPlace = featuredPlace
        ? `https://pl.wikipedia.org/wiki/${encodeURIComponent(featuredPlace.title.replaceAll(' ', '_'))}`
        : '';
    const previousStoriesInstruction = previousStories.length > 0
        ? `Nie powtarzaj tych wcześniejszych opowieści ani wykorzystanych w nich ciekawostek:\n${previousStories.map(story => `- ${story}`).join('\n')}`
        : 'Wybierz konkretną, mało oczywistą ciekawostkę i nie używaj oklepanych faktów.';
    const prompt = AI_PROMPTS.guideTrivia(townName, context, sourceUrlCity, sourceUrlPlace);

    return `${prompt}\n\n${previousStoriesInstruction}\nZa każdym razem napisz inną opowieść.`;
}

module.exports = { buildPrompt };