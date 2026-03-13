/**
 * SolarWise — Solar Irradiation Dataset
 * Peak Sun Hours (PSH) by city. Africa-focused + global cities.
 */

const solarData = [
  // ── Nigeria ──
  { city: 'Lagos', country: 'Nigeria', sunHours: 4.5 },
  { city: 'Abuja', country: 'Nigeria', sunHours: 5.5 },
  { city: 'Kano', country: 'Nigeria', sunHours: 6.0 },
  { city: 'Port Harcourt', country: 'Nigeria', sunHours: 4.0 },
  { city: 'Ibadan', country: 'Nigeria', sunHours: 4.8 },
  { city: 'Enugu', country: 'Nigeria', sunHours: 4.6 },
  { city: 'Kaduna', country: 'Nigeria', sunHours: 5.8 },
  { city: 'Benin City', country: 'Nigeria', sunHours: 4.5 },
  // ── Ghana ──
  { city: 'Accra', country: 'Ghana', sunHours: 5.0 },
  { city: 'Kumasi', country: 'Ghana', sunHours: 4.8 },
  { city: 'Tamale', country: 'Ghana', sunHours: 5.5 },
  // ── Kenya ──
  { city: 'Nairobi', country: 'Kenya', sunHours: 5.5 },
  { city: 'Mombasa', country: 'Kenya', sunHours: 5.8 },
  { city: 'Kisumu', country: 'Kenya', sunHours: 5.2 },
  // ── South Africa ──
  { city: 'Johannesburg', country: 'South Africa', sunHours: 5.5 },
  { city: 'Cape Town', country: 'South Africa', sunHours: 5.0 },
  { city: 'Durban', country: 'South Africa', sunHours: 4.8 },
  { city: 'Pretoria', country: 'South Africa', sunHours: 5.6 },
  // ── East Africa ──
  { city: 'Dar es Salaam', country: 'Tanzania', sunHours: 5.5 },
  { city: 'Kampala', country: 'Uganda', sunHours: 5.0 },
  { city: 'Kigali', country: 'Rwanda', sunHours: 4.8 },
  { city: 'Addis Ababa', country: 'Ethiopia', sunHours: 5.5 },
  // ── North Africa ──
  { city: 'Cairo', country: 'Egypt', sunHours: 6.0 },
  { city: 'Alexandria', country: 'Egypt', sunHours: 5.5 },
  { city: 'Casablanca', country: 'Morocco', sunHours: 5.5 },
  { city: 'Tunis', country: 'Tunisia', sunHours: 5.3 },
  { city: 'Algiers', country: 'Algeria', sunHours: 5.5 },
  // ── West Africa ──
  { city: 'Dakar', country: 'Senegal', sunHours: 5.5 },
  { city: 'Abidjan', country: 'Ivory Coast', sunHours: 4.8 },
  { city: 'Lomé', country: 'Togo', sunHours: 5.0 },
  { city: 'Cotonou', country: 'Benin', sunHours: 4.8 },
  { city: 'Bamako', country: 'Mali', sunHours: 6.0 },
  { city: 'Ouagadougou', country: 'Burkina Faso', sunHours: 5.8 },
  { city: 'Niamey', country: 'Niger', sunHours: 6.2 },
  { city: 'Conakry', country: 'Guinea', sunHours: 4.8 },
  // ── Southern Africa ──
  { city: 'Lusaka', country: 'Zambia', sunHours: 5.5 },
  { city: 'Harare', country: 'Zimbabwe', sunHours: 5.5 },
  { city: 'Maputo', country: 'Mozambique', sunHours: 5.3 },
  { city: 'Windhoek', country: 'Namibia', sunHours: 6.5 },
  { city: 'Gaborone', country: 'Botswana', sunHours: 6.0 },
  // ── Middle East ──
  { city: 'Dubai', country: 'UAE', sunHours: 6.5 },
  { city: 'Riyadh', country: 'Saudi Arabia', sunHours: 6.8 },
  // ── Asia ──
  { city: 'Mumbai', country: 'India', sunHours: 5.5 },
  { city: 'Delhi', country: 'India', sunHours: 5.5 },
  { city: 'Manila', country: 'Philippines', sunHours: 5.0 },
  { city: 'Bangkok', country: 'Thailand', sunHours: 5.0 },
  { city: 'Jakarta', country: 'Indonesia', sunHours: 4.8 },
  // ── Americas ──
  { city: 'Los Angeles', country: 'USA', sunHours: 5.5 },
  { city: 'Phoenix', country: 'USA', sunHours: 6.5 },
  { city: 'Miami', country: 'USA', sunHours: 5.2 },
  { city: 'Houston', country: 'USA', sunHours: 4.8 },
  { city: 'São Paulo', country: 'Brazil', sunHours: 4.5 },
  { city: 'Mexico City', country: 'Mexico', sunHours: 5.0 },
  // ── Europe ──
  { city: 'Madrid', country: 'Spain', sunHours: 5.0 },
  { city: 'Rome', country: 'Italy', sunHours: 4.5 },
  { city: 'Berlin', country: 'Germany', sunHours: 3.0 },
  { city: 'London', country: 'UK', sunHours: 2.5 },
  { city: 'Paris', country: 'France', sunHours: 3.2 },
  // ── Oceania ──
  { city: 'Sydney', country: 'Australia', sunHours: 5.0 },
  { city: 'Perth', country: 'Australia', sunHours: 5.8 },
];

// Country-level fallback averages
const countryAverages = {
  'Nigeria': 5.0,
  'Ghana': 5.0,
  'Kenya': 5.5,
  'South Africa': 5.2,
  'Tanzania': 5.5,
  'Uganda': 5.0,
  'Rwanda': 4.8,
  'Ethiopia': 5.5,
  'Egypt': 5.8,
  'Morocco': 5.5,
  'Senegal': 5.5,
  'India': 5.5,
  'USA': 5.0,
  'Brazil': 4.5,
  'Australia': 5.3,
  'UAE': 6.5,
};

const DEFAULT_SUN_HOURS = 5.0;

/**
 * Lookup sun hours by city name (case-insensitive, partial match)
 */
export function lookupSunHours(query) {
  if (!query) return { city: 'Unknown', country: 'Unknown', sunHours: DEFAULT_SUN_HOURS };
  
  const q = query.toLowerCase().trim();

  // Try exact city match
  const exact = solarData.find(d => d.city.toLowerCase() === q);
  if (exact) return { ...exact };

  // Try partial city match
  const partial = solarData.find(d => d.city.toLowerCase().includes(q) || q.includes(d.city.toLowerCase()));
  if (partial) return { ...partial };

  // Try country match
  const countryMatch = solarData.find(d => d.country.toLowerCase() === q);
  if (countryMatch) return { city: q, country: countryMatch.country, sunHours: countryAverages[countryMatch.country] || countryMatch.sunHours };

  // Try partial country match
  const countryPartial = solarData.find(d => d.country.toLowerCase().includes(q) || q.includes(d.country.toLowerCase()));
  if (countryPartial) return { city: q, country: countryPartial.country, sunHours: countryAverages[countryPartial.country] || countryPartial.sunHours };

  return { city: query, country: 'Unknown', sunHours: DEFAULT_SUN_HOURS };
}

/**
 * Get all available cities for autocomplete
 */
export function getAllCities() {
  return solarData.map(d => ({
    label: `${d.city}, ${d.country}`,
    city: d.city,
    country: d.country,
    sunHours: d.sunHours,
  }));
}

export default solarData;
