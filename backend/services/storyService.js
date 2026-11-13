const fetch = require('node-fetch');
const { buildPrompt } = require('../helpers/promptBuilder');
const { GROQ_API_URL, GROQ_MODEL, MAX_RECENT_STORIES } = require('../config/externalResources');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const recentStoriesByTown = new Map();

function getRecentStories(townName) {
    return recentStoriesByTown.get(townName) || [];
}

function rememberStory(townName, story) {
    const recentStories = [...getRecentStories(townName), story].slice(-MAX_RECENT_STORIES);
    recentStoriesByTown.set(townName, recentStories);
}

function getFallbackStory(townName) {
    return `Mijasz miejscowość: ${townName}.`;
}

async function requestStory(prompt) {
    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [{ role: 'user', content: prompt }]
        })
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content;
}

async function generateTravelStory(townName, featuredPlace) {
    if (!GROQ_API_KEY) return getFallbackStory(townName);

    const prompt = buildPrompt(townName, featuredPlace, getRecentStories(townName));
    try {
        const story = await requestStory(prompt);
        if (!story) return `Przejeżdżasz przez ${townName}.`;

        rememberStory(townName, story);
        return story;
    } catch {
        return `Mijamy ${townName}.`;
    }
}

module.exports = { generateTravelStory };