const express = require('express');
const {
    createStory,
    getStories,
    getStoryById,
    updateStory,
    deleteStory
} = require('../repositories/storyRepository');

const router = express.Router();

function parseStoryId(value) {
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

function validateFeaturedPlace(featuredPlace) {
    if (featuredPlace === undefined || featuredPlace === null) return true;
    return typeof featuredPlace === 'object'
        && isNonEmptyString(featuredPlace.title)
        && isNonEmptyString(featuredPlace.url)
        && (featuredPlace.imageUrl === null || typeof featuredPlace.imageUrl === 'string');
}

router.get('/', (req, res) => {
    res.json(getStories());
});

router.post('/', (req, res) => {
    const { name, town, aiStory, featuredPlace } = req.body || {};
    if (!isNonEmptyString(name) || !isNonEmptyString(town) || !isNonEmptyString(aiStory)) {
        return res.status(400).json({ error: 'Wymagane są pola name, town i aiStory.' });
    }
    if (!validateFeaturedPlace(featuredPlace)) {
        return res.status(400).json({ error: 'featuredPlace ma nieprawidłowy format.' });
    }

    const story = createStory({
        name: name.trim(),
        town: town.trim(),
        aiStory: aiStory.trim(),
        featuredPlace: featuredPlace || null
    });
    res.status(201).json(story);
});

router.get('/:id', (req, res) => {
    const id = parseStoryId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Nieprawidłowe ID opowieści.' });

    const story = getStoryById(id);
    if (!story) return res.status(404).json({ error: 'Nie znaleziono opowieści.' });
    res.json(story);
});

router.patch('/:id', (req, res) => {
    const id = parseStoryId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Nieprawidłowe ID opowieści.' });

    const { name, aiStory } = req.body || {};
    const updates = {};
    if (name !== undefined) {
        if (!isNonEmptyString(name)) return res.status(400).json({ error: 'Nazwa nie może być pusta.' });
        updates.name = name.trim();
    }
    if (aiStory !== undefined) {
        if (!isNonEmptyString(aiStory)) return res.status(400).json({ error: 'Treść opowieści nie może być pusta.' });
        updates.aiStory = aiStory.trim();
    }
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'Podaj name lub aiStory do zmiany.' });
    }

    const existingStory = getStoryById(id);
    if (!existingStory) return res.status(404).json({ error: 'Nie znaleziono opowieści.' });

    res.json(updateStory(id, updates));
});

router.delete('/:id', (req, res) => {
    const id = parseStoryId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Nieprawidłowe ID opowieści.' });
    if (!deleteStory(id)) return res.status(404).json({ error: 'Nie znaleziono opowieści.' });
    res.status(204).end();
});

module.exports = router;