export interface ServiceLocation {
  id: string
  name: string
  slug: string
  province: string
  district: string
  category: 'major' | 'beach' | 'cultural' | 'hill-country' | 'wildlife' | 'city'
}

export const serviceLocations: ServiceLocation[] = [
  // Major Cities
  { id: "1", name: "Colombo", slug: "colombo", province: "Western", district: "Colombo", category: "city" },
  { id: "2", name: "Kandy", slug: "kandy", province: "Central", district: "Kandy", category: "cultural" },
  { id: "3", name: "Galle", slug: "galle", province: "Southern", district: "Galle", category: "beach" },
  { id: "4", name: "Negombo", slug: "negombo", province: "Western", district: "Gampaha", category: "beach" },
  { id: "5", name: "Anuradhapura", slug: "anuradhapura", province: "North Central", district: "Anuradhapura", category: "cultural" },
  
  // Beach Destinations
  { id: "6", name: "Bentota", slug: "bentota", province: "Southern", district: "Galle", category: "beach" },
  { id: "7", name: "Hikkaduwa", slug: "hikkaduwa", province: "Southern", district: "Galle", category: "beach" },
  { id: "8", name: "Mirissa", slug: "mirissa", province: "Southern", district: "Matara", category: "beach" },
  { id: "9", name: "Unawatuna", slug: "unawatuna", province: "Southern", district: "Galle", category: "beach" },
  { id: "10", name: "Weligama", slug: "weligama", province: "Southern", district: "Matara", category: "beach" },
  { id: "11", name: "Arugam Bay", slug: "arugam-bay", province: "Eastern", district: "Ampara", category: "beach" },
  { id: "12", name: "Tangalle", slug: "tangalle", province: "Southern", district: "Hambantota", category: "beach" },
  { id: "13", name: "Beruwala", slug: "beruwala", province: "Western", district: "Kalutara", category: "beach" },
  { id: "14", name: "Ahungalla", slug: "ahungalla", province: "Southern", district: "Galle", category: "beach" },
  { id: "15", name: "Wadduwa", slug: "wadduwa", province: "Western", district: "Kalutara", category: "beach" },
  { id: "16", name: "Trincomalee", slug: "trincomalee", province: "Eastern", district: "Trincomalee", category: "beach" },
  { id: "17", name: "Pasikudah", slug: "pasikudah", province: "Eastern", district: "Batticaloa", category: "beach" },
  { id: "18", name: "Kalpitiya", slug: "kalpitiya", province: "North Western", district: "Puttalam", category: "beach" },
  
  // Cultural Triangle
  { id: "19", name: "Sigiriya", slug: "sigiriya", province: "Central", district: "Matale", category: "cultural" },
  { id: "20", name: "Dambulla", slug: "dambulla", province: "Central", district: "Matale", category: "cultural" },
  { id: "21", name: "Polonnaruwa", slug: "polonnaruwa", province: "North Central", district: "Polonnaruwa", category: "cultural" },
  { id: "22", name: "Habarana", slug: "habarana", province: "North Central", district: "Anuradhapura", category: "cultural" },
  
  // Hill Country
  { id: "23", name: "Nuwara Eliya", slug: "nuwara-eliya", province: "Central", district: "Nuwara Eliya", category: "hill-country" },
  { id: "24", name: "Ella", slug: "ella", province: "Uva", district: "Badulla", category: "hill-country" },
  { id: "25", name: "Bandarawela", slug: "bandarawela", province: "Uva", district: "Badulla", category: "hill-country" },
  { id: "26", name: "Haputale", slug: "haputale", province: "Uva", district: "Badulla", category: "hill-country" },
  { id: "27", name: "Hatton", slug: "hatton", province: "Central", district: "Nuwara Eliya", category: "hill-country" },
  
  // Wildlife
  { id: "28", name: "Yala", slug: "yala", province: "Southern", district: "Hambantota", category: "wildlife" },
  { id: "29", name: "Udawalawe", slug: "udawalawe", province: "Sabaragamuwa", district: "Ratnapura", category: "wildlife" },
  { id: "30", name: "Tissamaharama", slug: "tissamaharama", province: "Southern", district: "Hambantota", category: "wildlife" },
  { id: "31", name: "Kataragama", slug: "kataragama", province: "Southern", district: "Hambantota", category: "wildlife" },
  
  // Additional Cities
  { id: "32", name: "Matara", slug: "matara", province: "Southern", district: "Matara", category: "city" },
  { id: "33", name: "Ratnapura", slug: "ratnapura", province: "Sabaragamuwa", district: "Ratnapura", category: "city" },
  { id: "34", name: "Kurunegala", slug: "kurunegala", province: "North Western", district: "Kurunegala", category: "city" },
  { id: "35", name: "Batticaloa", slug: "batticaloa", province: "Eastern", district: "Batticaloa", category: "city" },
  { id: "36", name: "Jaffna", slug: "jaffna", province: "Northern", district: "Jaffna", category: "city" },
  { id: "37", name: "Hambantota", slug: "hambantota", province: "Southern", district: "Hambantota", category: "city" },
  { id: "38", name: "Chilaw", slug: "chilaw", province: "North Western", district: "Puttalam", category: "city" },
  { id: "39", name: "Kalutara", slug: "kalutara", province: "Western", district: "Kalutara", category: "city" },
  { id: "40", name: "Moratuwa", slug: "moratuwa", province: "Western", district: "Colombo", category: "city" },
  { id: "41", name: "Kegalle", slug: "kegalle", province: "Sabaragamuwa", district: "Kegalle", category: "city" },
  { id: "42", name: "Badulla", slug: "badulla", province: "Uva", district: "Badulla", category: "city" },
  { id: "43", name: "Matale", slug: "matale", province: "Central", district: "Matale", category: "city" },
  { id: "44", name: "Ampara", slug: "ampara", province: "Eastern", district: "Ampara", category: "city" },
  { id: "45", name: "Monaragala", slug: "monaragala", province: "Uva", district: "Monaragala", category: "city" },
  { id: "46", name: "Katunayake", slug: "katunayake", province: "Western", district: "Gampaha", category: "city" },
  { id: "47", name: "Panadura", slug: "panadura", province: "Western", district: "Kalutara", category: "city" },
  { id: "48", name: "Gampaha", slug: "gampaha", province: "Western", district: "Gampaha", category: "city" },
  { id: "49", name: "Ambalangoda", slug: "ambalangoda", province: "Southern", district: "Galle", category: "beach" },
  { id: "50", name: "Aluthgama", slug: "aluthgama", province: "Western", district: "Kalutara", category: "beach" },
]

export const airportRoutes = serviceLocations.map(location => ({
  from: "Bandaranaike International Airport (BIA)",
  to: location.name,
  slug: `airport-to-${location.slug}`,
  route: `Airport to ${location.name}`,
  description: `Professional taxi service from Colombo Airport (BIA) to ${location.name}. Fixed rates, English-speaking drivers, 24/7 available.`
}))
