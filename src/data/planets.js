export const AU = 1; // shrunken scene scale (cartoon)

export const PLANETS = [
  {
    id: 'earth',
    name: 'Earth',
    color: '#4aa3ff',
    radius: 1.0,
    distanceAU: 4.0,   // cartoon distance so it's visible next to Sun
    yearDays: 365,
    info: { type: 'Terrestrial', radiusKm: 6371, massKg: '5.97e24', orbit: '365 days', day: '24h' },
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    color: '#d7c1a7',
    radius: 11.21 * 0.25, // scaled down so it fits the scene
    distanceAU: 8.0,      // cartoon distance (further out than Earth)
    yearDays: 4333,       // ~11.9 years
    info: { type: 'Gas Giant', radiusKm: 69911, massKg: '1.90e27', orbit: '~11.9 years', day: '~10h' },
  },
];
