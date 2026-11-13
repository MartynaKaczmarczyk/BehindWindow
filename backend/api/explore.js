const express = require('express');
const { exploreLocation } = require('../services/travelService');

const router = express.Router();

router.get('/', async (req, res) => {
    const lat = parseFloat(req.query.lat) || 54.3520;
    const lon = parseFloat(req.query.lon) || 18.6466;

    try {
        const result = await exploreLocation(lat, lon);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Błąd radaru." });
    }
});

module.exports = router;