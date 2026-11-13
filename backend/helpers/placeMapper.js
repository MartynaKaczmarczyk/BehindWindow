function chooseFeaturedPlace(places) {
    if (places.length === 0) return null;
    return places[Math.floor(Math.random() * places.length)];
}

function mapPlace(place, imageUrls) {
    return {
        title: place.title,
        distanceMeters: place.dist,
        url: `https://pl.wikipedia.org/?curid=${place.pageid}`,
        imageUrl: imageUrls.get(place.pageid) || null
    };
}

function buildExploreResponse(townName, aiStory, featuredPlace, places, imageUrls) {
    return {
        status: 'success',
        town: townName,
        aiStory,
        featuredPlace: featuredPlace ? mapPlace(featuredPlace, imageUrls) : null,
        results: places.map(place => mapPlace(place, imageUrls))
    };
}

module.exports = { chooseFeaturedPlace, buildExploreResponse };