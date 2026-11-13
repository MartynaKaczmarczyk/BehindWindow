const fetch = require('node-fetch');
const { AI_PROMPTS } = require('../outside-resources');


const GROQ_API_KEY = process.env.GROQ_API_KEY;
const DEFAULT_PROMPT_TEMPLATE = 'Jesteś przewodnikiem podróżnym. Miejscowość: {{townName}}. {{context}} Opowiedz po polsku w 3-4 krótkich zdaniach ciekawostkę, bez powitań.';
const recentStoriesByTown = new Map();
const MAX_RECENT_STORIES = 5;


async function getLocationName(lat, lon) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&accept-language=pl`;
        const res = await fetch(url, { headers: { 'User-Agent': 'CoZaOknemApp/1.0' } });
        const data = await res.json();
        const addr = data.address || {};
        return addr.city || addr.town || addr.village || addr.suburb || "nieznana okolica";
    } catch {
        return "okolica na trasie";
    }
}

//function buildPrompt

async function generateTravelStory(townName, featuredPlace) {
    if (!GROQ_API_KEY) return `Mijasz miejscowość: ${townName}.`;
        const context = featuredPlace
            ? `W pobliżu znajduje się ${featuredPlace.title}.`
            : '';
        const previousStories = recentStoriesByTown.get(townName) || [];
        const promptTemplate = process.env.AI_PROMPT_TEMPLATE || DEFAULT_PROMPT_TEMPLATE;
        const previousStoriesInstruction = previousStories.length > 0
            ? `Nie powtarzaj tych wcześniejszych opowieści ani wykorzystanych w nich ciekawostek:\n${previousStories.map(story => `- ${story}`).join('\n')}`
            : 'Wybierz konkretną, mało oczywistą ciekawostkę i nie używaj oklepanych faktów.';
        
        const prompt = AI_PROMPTS.guideTrivia(
            townName,
            context,
            'https://pl.wikipedia.org/wiki/' + townName,
            'https://pl.wikipedia.org/wiki/' + featuredPlace.title
        );

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b", 
                messages: [{ role: "user", content: prompt }]
            })
        });
        
        const data = await response.json();
        const story = data.choices?.[0]?.message?.content;

        if (story) {
            const recentStories = [...previousStories, story].slice(-MAX_RECENT_STORIES);
            recentStoriesByTown.set(townName, recentStories);
            return story;
        }
        return `Przejeżdżasz przez ${townName}.`;
    } catch {
        return `Mijamy ${townName}.`;
    }
}

async function getPlaceImages(places) {
    if (places.length === 0) return new Map();

    try {
        const params = new URLSearchParams({
            action: 'query',
            prop: 'pageimages',
            piprop: 'thumbnail',
            pithumbsize: '640',
            pageids: places.map(place => place.pageid).join('|'),
            format: 'json'
        });
        const response = await fetch(`https://pl.wikipedia.org/w/api.php?${params}`);
        if (!response.ok) return new Map();

        const data = await response.json();
        return new Map(
            Object.values(data.query?.pages || {})
                .filter(page => page.thumbnail?.source)
                .map(page => [page.pageid, page.thumbnail.source])
        );
    } catch {
        return new Map();
    }
}

async function exploreLocation(lat, lon) {
    const [townName, wikiRes] = await Promise.all([
        getLocationName(lat, lon),
        fetch(`https://pl.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lon}&gsradius=5000&gslimit=4&format=json`)
    ]);

    const wikiData = await wikiRes.json();
    const places = wikiData.query?.geosearch || [];
    const featuredPlace = places.length > 0
        ? places[Math.floor(Math.random() * places.length)]
        : null;
    const [imageUrls, aiStory] = await Promise.all([
        getPlaceImages(places),
        generateTravelStory(townName, featuredPlace)
    ]);

    return {
        status: 'success',
        town: townName,
        aiStory,
        featuredPlace: featuredPlace ? {
            title: featuredPlace.title,
            distanceMeters: featuredPlace.dist,
            url: `https://pl.wikipedia.org/?curid=${featuredPlace.pageid}`,
            imageUrl: imageUrls.get(featuredPlace.pageid) || null
        } : null,
        results: places.map(place => ({
            title: place.title,
            distanceMeters: place.dist,
            url: `https://pl.wikipedia.org/?curid=${place.pageid}`,
            imageUrl: imageUrls.get(place.pageid) || null
        }))
    };
}

module.exports = { exploreLocation };