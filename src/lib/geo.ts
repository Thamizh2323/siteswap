/**
 * Converts latitude and longitude to PostGIS EWKT point string.
 * Note: PostGIS POINT order is (longitude latitude).
 */
export function toPointWKT(lat: number, lng: number): string {
  if (lat < -90 || lat > 90) throw new Error(`Invalid latitude: ${lat}`);
  if (lng < -180 || lng > 180) throw new Error(`Invalid longitude: ${lng}`);
  return `SRID=4326;POINT(${lng} ${lat})`;
}

/**
 * Calculates distance in kilometers between two coordinates via Haversine formula.
 */
export function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
