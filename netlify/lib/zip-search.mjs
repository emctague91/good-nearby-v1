// Distance tiers for ZIP search (miles from the searched ZIP's Census centroid).
export const NEARBY_MAX_MILES = 3;
export const REGIONAL_MAX_MILES = 10;
export const ZIP_PATTERN = /^\d{5}$/;

export function haversineMiles(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(a));
}

const TIER_ORDER = { IN: 0, NEARBY: 1, REGIONAL: 2 };

// IN = same ZIP, NEARBY = within 3 mi, REGIONAL = >3 to 10 mi. Anything farther is excluded.
export function rankByZip(places, zip, center) {
  const ranked = [];
  for (const place of places) {
    const hasCoords = Number.isFinite(place.latitude) && Number.isFinite(place.longitude);
    const distance = hasCoords ? haversineMiles(center.latitude, center.longitude, place.latitude, place.longitude) : null;
    let tier = null;
    if (place.postal_code === zip) tier = "IN";
    else if (distance !== null && distance <= NEARBY_MAX_MILES) tier = "NEARBY";
    else if (distance !== null && distance <= REGIONAL_MAX_MILES) tier = "REGIONAL";
    if (!tier) continue;
    ranked.push({ ...place, tier, distance_miles: distance === null ? null : Math.round(distance * 100) / 100 });
  }
  return ranked.sort((a, b) =>
    TIER_ORDER[a.tier] - TIER_ORDER[b.tier] ||
    (a.distance_miles ?? Infinity) - (b.distance_miles ?? Infinity) ||
    a.name.localeCompare(b.name));
}
