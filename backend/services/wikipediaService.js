const fetch = require('node-fetch');
const {
    WIKIPEDIA_API_URL,
    WIKIPEDIA_GEOSEARCH_RADIUS_METERS,
    WIKIPEDIA_GEOSEARCH_LIMIT,
    WIKIPEDIA_THUMBNAIL_SIZE
} = require('../config/externalResources');

function buildGeosearchUrl(latitude, longitude) {
    const params = new URLSearchParams({
        action: 'query',
        list: 'geosearch',
        gscoord: `${latitude}|${longitude}`,
        gsradius: WIKIPEDIA_GEOSEARCH_RADIUS_METERS,
        gslimit: WIKIPEDIA_GEOSEARCH_LIMIT,
        format: 'json'
    });
    return `${WIKIPEDIA_API_URL}?${params}`;
}

function buildThumbnailUrl(pageIds) {
    const params = new URLSearchParams({
        action: 'query',
        prop: 'pageimages',
        piprop: 'thumbnail',
        pithumbsize: WIKIPEDIA_THUMBNAIL_SIZE,
        pageids: pageIds.join('|'),
        format: 'json'
    });
    return `${WIKIPEDIA_API_URL}?${params}`;
}

async function getNearbyPlaces(latitude, longitude) {
    const response = await fetch(buildGeosearchUrl(latitude, longitude));
    const data = await response.json();
    return data.query?.geosearch || [];
}

function getImageEntries(pages) {
    return Object.values(pages)
        .filter(page => page.thumbnail?.source)
        .map(page => [page.pageid, page.thumbnail.source]);
}

async function getPlaceImages(places) {
    if (places.length === 0) return new Map();

    try {
        const pageIds = places.map(place => place.pageid);
        const response = await fetch(buildThumbnailUrl(pageIds));
        if (!response.ok) return new Map();

        const data = await response.json();
        return new Map(getImageEntries(data.query?.pages || {}));
    } catch {
        return new Map();
    }
}

module.exports = { getNearbyPlaces, getPlaceImages };