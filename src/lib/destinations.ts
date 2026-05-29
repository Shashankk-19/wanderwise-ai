// Curated list of popular travel destinations for autocomplete.
export const DESTINATIONS: string[] = [
  // India
  "Goa, India", "Manali, India", "Leh-Ladakh, India", "Jaipur, India", "Udaipur, India",
  "Jaisalmer, India", "Rishikesh, India", "Varanasi, India", "Mumbai, India", "Delhi, India",
  "Bengaluru, India", "Kerala Backwaters, India", "Munnar, India", "Alleppey, India",
  "Andaman Islands, India", "Pondicherry, India", "Hampi, India", "Coorg, India",
  "Darjeeling, India", "Gangtok, Sikkim", "Shillong, India", "Tawang, India", "Mussoorie, India",
  "Nainital, India", "Spiti Valley, India", "Kasol, India", "Ooty, India", "Mahabalipuram, India",
  "Khajuraho, India", "Agra, India", "Amritsar, India", "Mcleodganj, India",
  // Asia
  "Bali, Indonesia", "Tokyo, Japan", "Kyoto, Japan", "Osaka, Japan", "Bangkok, Thailand",
  "Phuket, Thailand", "Chiang Mai, Thailand", "Krabi, Thailand", "Singapore",
  "Kuala Lumpur, Malaysia", "Hanoi, Vietnam", "Ho Chi Minh City, Vietnam", "Hoi An, Vietnam",
  "Seoul, South Korea", "Jeju, South Korea", "Hong Kong", "Taipei, Taiwan",
  "Pokhara, Nepal", "Kathmandu, Nepal", "Thimphu, Bhutan", "Colombo, Sri Lanka",
  "Maldives", "Dubai, UAE", "Abu Dhabi, UAE", "Istanbul, Turkey", "Cappadocia, Turkey",
  // Europe
  "Paris, France", "Nice, France", "Rome, Italy", "Florence, Italy", "Venice, Italy",
  "Amalfi Coast, Italy", "Santorini, Greece", "Athens, Greece", "Mykonos, Greece",
  "Barcelona, Spain", "Madrid, Spain", "Lisbon, Portugal", "Porto, Portugal",
  "London, UK", "Edinburgh, UK", "Amsterdam, Netherlands", "Berlin, Germany",
  "Munich, Germany", "Vienna, Austria", "Prague, Czech Republic", "Budapest, Hungary",
  "Zurich, Switzerland", "Interlaken, Switzerland", "Reykjavik, Iceland",
  "Copenhagen, Denmark", "Stockholm, Sweden", "Oslo, Norway",
  // Americas
  "New York, USA", "San Francisco, USA", "Los Angeles, USA", "Las Vegas, USA",
  "Miami, USA", "Chicago, USA", "Toronto, Canada", "Vancouver, Canada", "Banff, Canada",
  "Mexico City, Mexico", "Cancun, Mexico", "Tulum, Mexico", "Havana, Cuba",
  "Rio de Janeiro, Brazil", "Buenos Aires, Argentina", "Machu Picchu, Peru", "Cusco, Peru",
  // Oceania & Africa
  "Sydney, Australia", "Melbourne, Australia", "Queenstown, New Zealand",
  "Auckland, New Zealand", "Cape Town, South Africa", "Marrakech, Morocco",
  "Cairo, Egypt", "Nairobi, Kenya", "Zanzibar, Tanzania",
];

export function searchDestinations(q: string, limit = 7): string[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const starts: string[] = [];
  const contains: string[] = [];
  for (const d of DESTINATIONS) {
    const l = d.toLowerCase();
    if (l.startsWith(query)) starts.push(d);
    else if (l.includes(query)) contains.push(d);
    if (starts.length >= limit) break;
  }
  return [...starts, ...contains].slice(0, limit);
}
