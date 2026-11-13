const database = require('../db/database');

function mapStory(row) {
    if (!row) return null;

    return {
        id: row.id,
        name: row.name,
        town: row.town,
        aiStory: row.ai_story,
        featuredPlace: row.featured_place_json ? JSON.parse(row.featured_place_json) : null,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

function createStory(story) {
    const result = database.prepare(`
        INSERT INTO stories (name, town, ai_story, featured_place_json)
        VALUES (?, ?, ?, ?)
    `).run(
        story.name,
        story.town,
        story.aiStory,
        story.featuredPlace ? JSON.stringify(story.featuredPlace) : null
    );

    return getStoryById(result.lastInsertRowid);
}

function getStories() {
    const rows = database.prepare(`
        SELECT * FROM stories ORDER BY created_at DESC, id DESC
    `).all();
    return rows.map(mapStory);
}

function getStoryById(id) {
    const row = database.prepare('SELECT * FROM stories WHERE id = ?').get(id);
    return mapStory(row);
}

function updateStory(id, updates) {
    const fields = [];
    const values = [];

    if (updates.name !== undefined) {
        fields.push('name = ?');
        values.push(updates.name);
    }
    if (updates.aiStory !== undefined) {
        fields.push('ai_story = ?');
        values.push(updates.aiStory);
    }

    if (fields.length === 0) return getStoryById(id);

    fields.push("updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')");
    database.prepare(`UPDATE stories SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);
    return getStoryById(id);
}

function deleteStory(id) {
    const result = database.prepare('DELETE FROM stories WHERE id = ?').run(id);
    return result.changes > 0;
}

module.exports = { createStory, getStories, getStoryById, updateStory, deleteStory };