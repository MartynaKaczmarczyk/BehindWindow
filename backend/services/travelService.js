const { getLocationName } = require('./locationService');
const { getNearbyPlaces, getPlaceImages } = require('./wikipediaService');
const { generateTravelStory } = require('./storyService');
const { chooseFeaturedPlace, buildExploreResponse } = require('../helpers/placeMapper');

async function exploreLocation(lat, lon) {
    const [townName, places] = await Promise.all([
        getLocationName(lat, lon),
        getNearbyPlaces(lat, lon)
    ]);

    const featuredPlace = chooseFeaturedPlace(places);
    const [imageUrls, aiStory] = await Promise.all([
        getPlaceImages(places),
        generateTravelStory(townName, featuredPlace)
    ]);

    return buildExploreResponse(townName, aiStory, featuredPlace, places, imageUrls);
}

module.exports = { exploreLocation };