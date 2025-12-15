export interface Destination {
    id: string;
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    deals: string;
    location: string;
    popularWith: string[];
    keywords: string[];
    attractions: string[];
}

export const destinations: Destination[] = [
    {
        id: "1",
        name: "Sigiriya",
        slug: "sigiriya",
        description: "Ancient Lion Rock, 5th-century rock fortress with breathtaking views",
        imageUrl: "/images/destinations/Taxi Sri Lanka - Sigiriya.jpg",
        deals: "15 + Deals",
        location: "Central Province",
        popularWith: ["History Lovers", "Adventure Seekers", "Photographers"],
        keywords: ["sigiriya rock", "lion rock", "ancient fortress", "unesco world heritage"],
        attractions: ["Lion Rock Fortress", "Sigiriya Museum", "Pidurangala Rock"]
    },
    {
        id: "2",
        name: "Nuwara Eliya",
        slug: "nuwara-eliya",
        description: "Hill country tea plantations, misty valleys and colonial charm",
        imageUrl: "/images/destinations/Taxi Sri Lanka - Nuwara Eliya.jpg",
        deals: "8 + Deals",
        location: "Central Province",
        popularWith: ["Nature Lovers", "Tea Enthusiasts", "Couples"],
        keywords: ["tea plantations", "hill country", "little england", "tea estates"],
        attractions: ["Tea Plantations", "Gregory Lake", "Horton Plains"]
    },
    {
        id: "3",
        name: "Negombo",
        slug: "negombo",
        description: "Vibrant beach town near the airport, ideal for lagoon tours and island life",
        imageUrl: "/images/destinations/Taxi Sri Lanka - Negombo.jpg",
        deals: "12 + Deals",
        location: "Western Province",
        popularWith: ["Beach Lovers", "Water Sports", "Relaxation"],
        keywords: ["negombo beach", "lagoon", "fishing village", "water sports"],
        attractions: ["Negombo Beach", "Dutch Canal", "Fish Market"]
    },
    {
        id: "4",
        name: "Trincomalee",
        slug: "trincomalee",
        description: "Pristine coral reefs, whale watching paradise and Nilaveli beach",
        imageUrl: "/images/destinations/Taxi Sri Lanka - Trincomalee.jpg",
        deals: "6 + Deals",
        location: "Eastern Province",
        popularWith: ["Divers", "Beach Lovers", "Wildlife Enthusiasts"],
        keywords: ["trincomalee beach", "nilaveli", "whale watching", "snorkeling"],
        attractions: ["Nilaveli Beach", "Pigeon Island", "Koneswaram Temple"]
    },
    {
        id: "5",
        name: "Hikkaduwa",
        slug: "hikkaduwa",
        description: "Calm blue seas and coral reefs, the perfect snorkeling paradise",
        imageUrl: "/images/destinations/Taxi Sri Lanka - Hikkaduwa.webp",
        deals: "7 + Deals",
        location: "Southern Province",
        popularWith: ["Surfers", "Snorkelers", "Party Lovers"],
        keywords: ["hikkaduwa beach", "coral reef", "surfing", "beach parties"],
        attractions: ["Hikkaduwa Beach", "Coral Sanctuary", "Turtle Hatchery"]
    },
    {
        id: "6",
        name: "Colombo",
        slug: "colombo",
        description: "Explore dynamic city where the adventure begins and culture begins",
        imageUrl: "/images/destinations/Taxi Sri Lanka - Colombojpg.jpg",
        deals: "18 + Deals",
        location: "Western Province",
        popularWith: ["City Explorers", "Shoppers", "Food Lovers"],
        keywords: ["colombo city", "shopping", "nightlife", "cultural tours"],
        attractions: ["Galle Face Green", "Gangaramaya Temple", "Pettah Market"]
    },
    {
        id: "7",
        name: "Mirissa",
        slug: "mirissa",
        description: "Did you find the world-famous lagoon? Spot the secret sunset bay",
        imageUrl: "/images/destinations/Taxi Sri Lanka - Mirissa.JPG",
        deals: "6 + Deals",
        location: "Southern Province",
        popularWith: ["Whale Watchers", "Beach Lovers", "Surfers"],
        keywords: ["mirissa beach", "whale watching", "sunset", "surfing"],
        attractions: ["Mirissa Beach", "Whale Watching", "Secret Beach"]
    },
    {
        id: "8",
        name: "Yala",
        slug: "yala",
        description: "Come witness the elusive leopard in Yala's wild safari",
        imageUrl: "/images/destinations/Taxi Sri Lanka - Yala.webp",
        deals: "9 + Deals",
        location: "Southern Province",
        popularWith: ["Wildlife Enthusiasts", "Photographers", "Adventure Seekers"],
        keywords: ["yala national park", "leopard safari", "wildlife", "jungle safari"],
        attractions: ["Yala National Park", "Leopard Safari", "Elephant Herds"]
    },
    {
        id: "9",
        name: "Udawalawe",
        slug: "udawalawe",
        description: "Watch elephants graze freely—your moment of pure joy",
        imageUrl: "/images/destinations/Taxi Sri Lanka -Udawalawa.jpg",
        deals: "4 + Deals",
        location: "Sabaragamuwa Province",
        popularWith: ["Wildlife Lovers", "Families", "Photographers"],
        keywords: ["udawalawe national park", "elephant safari", "wildlife", "elephant orphanage"],
        attractions: ["Udawalawe National Park", "Elephant Transit Home", "Safari Tours"]
    },
    {
        id: "10",
        name: "Ella",
        slug: "ella",
        description: "Misty mountain trails, tea plantations and iconic Nine Arch Bridge",
        imageUrl: "/images/destinations/Taxi Sri Lanka - Ella.jpg",
        deals: "10 + Deals",
        location: "Uva Province",
        popularWith: ["Hikers", "Nature Lovers", "Backpackers"],
        keywords: ["ella rock", "nine arch bridge", "little adam's peak", "train journey"],
        attractions: ["Nine Arch Bridge", "Ella Rock", "Little Adam's Peak"]
    },
    {
        id: "11",
        name: "Galle",
        slug: "galle",
        description: "Historic Dutch fort, colonial architecture and coastal charm",
        imageUrl: "/images/destinations/Taxi Sri Lanka - Galle.webp",
        deals: "14 + Deals",
        location: "Southern Province",
        popularWith: ["History Buffs", "Photographers", "Couples"],
        keywords: ["galle fort", "dutch fort", "unesco heritage", "colonial architecture"],
        attractions: ["Galle Fort", "Lighthouse", "Dutch Reformed Church"]
    },
    {
        id: "12",
        name: "Kandy",
        slug: "kandy",
        description: "Sacred Temple of the Tooth, cultural shows and scenic lake views",
        imageUrl: "/images/destinations/Taxi Sri Lanka - Kandy.webp",
        deals: "16 + Deals",
        location: "Central Province",
        popularWith: ["Culture Enthusiasts", "Pilgrims", "Families"],
        keywords: ["temple of the tooth", "kandy lake", "cultural triangle", "buddhist temple"],
        attractions: ["Temple of the Tooth", "Kandy Lake", "Royal Botanical Gardens"]
    }
]
