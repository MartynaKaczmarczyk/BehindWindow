const fetch = require('node-fetch');
const { NOMINATIM_REVERSE_URL, NOMINATIM_USER_AGENT } = require('../config/externalResources');

function buildReverseGeocodingUrl(latitude, longitude) {
    const params = new URLSearchParams({
        format: 'json',
        lat: latitude,
        lon: longitude,
        zoom: 14,
        'accept-language': 'pl'
    });
    return `${NOMINATIM_REVERSE_URL}?${params}`;
}

function getTownName(address = {}) {
    return address.city || address.town || address.village || address.suburb || 'nieznana okolica';
}

async function getLocationName(latitude, longitude) {
    try {
        const response = await fetch(buildReverseGeocodingUrl(latitude, longitude), {
            headers: { 'User-Agent': NOMINATIM_USER_AGENT }
        });
        const data = await response.json();
        return getTownName(data.address);
    } catch {
        return 'okolica na trasie';
    }
}

module.exports = { getLocationName };