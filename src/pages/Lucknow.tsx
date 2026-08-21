import {
	Calendar,
	Clock,
	Copy,
	Map as MapIcon,
	Printer,
	Share2,
	Sparkles,
	Users,
	X
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import type { HighlightSlide } from "../components/HighlightSlideBar";
import HighlightSlideBar from "../components/HighlightSlideBar";

type Section = {
	id: string;
	title: string;
	goal: string;
	status: "Not started" | "Planned" | "In progress" | "Ready";
	tasks: string[];
};

type FoodItem = {
	name: string;
	description: string;
	place: string;
	image: string;
	history: string;
};

type StreetItem = {
	name: string;
	area: string;
	highlights: string;
	shopsCount: string;
	image: string;
	history: string;
};

type MonumentItem = {
	name: string;
	area: string;
	info: string;
	image: string;
	history: string;
};

type ParkItem = {
	name: string;
	area: string;
	features: string;
	image: string;
	hours: string;
};

type ReligiousItem = {
	name: string;
	faith: string;
	area: string;
	visitInfo: string;
	image: string;
	history: string;
};

type FestivalItem = {
	name: string;
	month: string;
	areas: string;
	highlights: string;
	image: string;
	history: string;
};

type Destination = {
	name: string;
	area: string;
	category: string;
	highlights: string;
	routes: string[];
	image?: string;
};

type StayOption = {
	name: string;
	tag: "Premium" | "Mid-range" | "Budget";
	rating: number;
	price: string;
	image: string;
	area?: string;
	link?: string;
};

type CityEntryOption = {
	id: string;
	name: string;
	area: string;
	mapsQuery: string;
	note?: string;
};

type CityTargetOption = {
	id: string;
	name: string;
	area: string;
	category: string;
	mapsQuery: string;
	stops: string[];
};

type CityRoutePlan = {
	summary: string;
	note?: string;
	stops: string[];
};

type ItineraryStop = {
	time: string;
	title: string;
	description: string;
	tip?: string;
	duration: string;
	transit: string;
	cost: string;
};

type ItineraryDay = {
	id: string;
	title: string;
	summary: string;
	stats: string;
	dailyBudget: string;
	stops: ItineraryStop[];
};

const stayTagStyles: Record<StayOption["tag"], string> = {
	Premium: "bg-purple-50 text-purple-700 border border-purple-200",
	"Mid-range": "bg-blue-50 text-blue-700 border border-blue-200",
	Budget: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const heroSlides = [
	{
		title: "Lucknow, where grace meets street life",
		subtitle: "Slow mornings, fragrant kebabs, chikankari lanes, and poetic evenings by the Gomti.",
		image: "https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=270,height=180,dpr=2/tour_img/9a2a61849fc18d2c9671e37ae15f48637eed62cdd9016af2520ffba4191295eb.jpeg",
	},
	{
		title: "Nawabi arches, bazaars",
		subtitle: "Blend heritage strolls at Rumi Darwaza with late-night tokri chaat in Chowk.",
		image: "https://tripcosmos.co/wp-content/uploads/2025/06/lucknow.jpg.webp",
	},
	{
		title: "Festivals, flavours, and streets",
		subtitle: "Plan around Bada Mangal feasts, Awadhi kebabs, and neon lanes of Chowk.",
		image: "https://www.lavacanza.in/imghandler.ashx?image=/UserUploads/Blog/2015/02/Chhota_imambara_Lucknow.jpg&width=1400&height=0",
	},
];

const stayOptions: StayOption[] = [
	{
		name: "Taj Mahal Hotel",
		tag: "Premium",
		rating: 4.9,
		price: "₹12,500",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKfXZxet5SbHcOCffqZVWxQPUrp5Z3nl4qnA&s",
		link: "https://www.google.com/maps/search/Taj+Mahal+Hotel+Lucknow",
	},
	{
		name: "Lebua Lucknow",
		tag: "Mid-range",
		rating: 4.7,
		price: "₹6,500",
		image: "data:image/jpeg;base64,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",
		link: "https://www.google.com/maps/search/Lebua+Lucknow",
	},
	{
		name: "Homestay Avadh",
		tag: "Budget",
		rating: 4.3,
		price: "₹2,200",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTye-4-wbt_YNoNSE-WxPJ0cDfaje5rSc4oDQ&s",
		link: "https://www.google.com/maps/search/Homestay+Lucknow",
	},
];

const cityEntryOptions: CityEntryOption[] = [
	{
		id: "charbagh",
		name: "Charbagh Railway Station",
		area: "Charbagh / central",
		mapsQuery: "Charbagh Railway Station, Lucknow",
		note: "Best for metro link and short autos to old city & Hazratganj",
	},
	{
		id: "airport",
		name: "Chaudhary Charan Singh Airport",
		area: "Amausi",
		mapsQuery: "Chaudhary Charan Singh International Airport, Lucknow",
		note: "Metro to Charbagh, cabs for Gomti Nagar night runs",
	},
	{
		id: "alambagh",
		name: "Alambagh Bus Stand",
		area: "Alambagh",
		mapsQuery: "Alambagh Bus Stand, Lucknow",
		note: "Quick autos to Aminabad / Chowk food lanes",
	},
	{
		id: "taj",
		name: "Taj / Hazratganj hotel belt",
		area: "Hazratganj",
		mapsQuery: "Taj Mahal Hotel Lucknow",
		note: "If you’re already in central hotels, head straight to nearby markets",
	},
];

const cityTargetOptions: CityTargetOption[] = [
	{
		id: "imambara",
		name: "Bara & Chota Imambara",
		area: "Chowk / Old City",
		category: "Heritage + tokri chaat",
		mapsQuery: "Bara Imambara, Lucknow",
		stops: ["Aminabad - Tunday Kababi", "Tokri Chaat at Royal Café or Chowk", "Rumi Darwaza gateway", "Prakash Kulfi"],
	},
	{
		id: "hazratganj",
		name: "Hazratganj + Riverfront",
		area: "Central",
		category: "Shopping + sunset walk",
		mapsQuery: "Hazratganj, Lucknow",
		stops: ["Royal Café basket chaat", "Janeshwar Mishra Park", "Gomti Riverfront / Marine Drive"],
	},
	{
		id: "gomtinagar",
		name: "Gomti Nagar Nights",
		area: "Gomti Nagar",
		category: "Malls + late food",
		mapsQuery: "Phoenix Palassio, Lucknow",
		stops: ["Patrakarpuram street food", "One Awadh / Summit nightlife", "Marine Drive late walk"],
	},
	{
		id: "kapoorthala",
		name: "Kapoorthala Food Trail",
		area: "Aliganj / Kapoorthala",
		category: "Quick eats + markets",
		mapsQuery: "Kapoorthala, Lucknow",
		stops: ["JJ Bakers Aliganj", "Chandralok chaat street", "Nirala Nagar cafés"],
	},
];

const cityRoutePresets: Record<string, CityRoutePlan> = {
	"charbagh-imambara": {
		summary: "Shortest old city run",
		note: "Metro/auto → Aminabad kebabs → Rumi Darwaza → Imambara",
		stops: ["Charbagh Station", "Aminabad - Tunday Kababi", "Rumi Darwaza", "Bara Imambara"],
	},
	"charbagh-hazratganj": {
		summary: "Metro two stops → stroll",
		note: "Charbagh metro → Hazratganj → basket chaat → riverfront",
		stops: ["Charbagh Station", "Hazratganj", "Royal Café basket chaat", "Gomti Riverfront"],
	},
	"airport-hazratganj": {
		summary: "Fastest cab + metro fallback",
		note: "Amausi → Charbagh (metro) → Hazratganj",
		stops: ["CCS Airport", "Charbagh metro change", "Hazratganj", "Royal Café basket chaat"],
	},
	"airport-gomtinagar": {
		summary: "Direct cab / expressway",
		note: "Cab via Shaheed Path, stop at Phoenix Palassio for food",
		stops: ["CCS Airport", "Shaheed Path", "Phoenix Palassio", "Gomti Nagar"],
	},
	"alambagh-imambara": {
		summary: "Auto via Aminabad",
		note: "Bus stand → Aminabad kebabs → Chowk → Imambara",
		stops: ["Alambagh", "Aminabad", "Chowk tokri chaat", "Bara Imambara"],
	},
	"taj-hazratganj": {
		summary: "Walkable central loop",
		note: "Hotel belt → Hazratganj arcades → Riverfront",
		stops: ["Taj Hotel", "Hazratganj arcades", "Royal Café basket chaat", "Gomti Riverfront"],
	},
};

const interestOptions = ["Food", "History", "Shopping", "Parks", "Festivals", "Nightlife"];

const itineraryDays: ItineraryDay[] = [
	{
		id: "day-1",
		title: "Day 1: Food Highlights",
		summary: "Walk 2.4 km | Auto 3 | Cab 1",
		stats: "Daily Budget ₹3,000",
		dailyBudget: "₹3,000",
		stops: [
			{
				time: "8:00 AM",
				title: "Breakfast: Tunday Kababi (Aminabad)",
				description: "Iconic galouti kebabs and sheermal to begin your Lucknow mornings.",
				tip: "Ask for the melt-in-mouth galouti on sheermal combo.",
				duration: "75 min",
				transit: "15 min auto from Charbagh",
				cost: "₹250",
			},
			{
				time: "9:30 AM",
				title: "Morning: Bara Imambara & Bhool Bhulaiyaa",
				description: "18th century marvel with maze, Asafi mosque, stepwell.",
				tip: "Hire the ASI guide at the gate for maze navigation.",
				duration: "2 hrs",
				transit: "15 min cab from Aminabad",
				cost: "₹500",
			},
			{
				time: "12:30 PM",
				title: "Lunch: The Idly Room",
				description: "Vegetarian South Indian breakfast when you want light fare.",
				tip: "Ideal monsoon fallback when you want indoor seating.",
				duration: "50 min",
				transit: "Walkable from Hazratganj metro",
				cost: "₹180",
			},
			{
				time: "2:30 PM",
				title: "Afternoon: Hazratganj Heritage Walk",
				description: "Victorian arcades, chikankari boutiques, Royal Café basket chaat.",
				tip: "Closed for deep cleaning on Sunday mornings; visit post 3 PM if Sunday.",
				duration: "2 hrs",
				transit: "Walkable circuit",
				cost: "₹400",
			},
			{
				time: "6:00 PM",
				title: "Evening: Rumi Darwaza Sunset",
				description: "Sunset hues over the 60-foot gate, breezy Tokri chaat nearby.",
				tip: "Carry a wide lens for the gateway silhouette.",
				duration: "90 min",
				transit: "Rickshaw from Imambara complex",
				cost: "₹150",
			},
			{
				time: "8:30 PM",
				title: "Dinner: Aminabad Night Bites",
				description: "Walk the gullies for kebabs, kulfi, and Suleimani chai.",
				tip: "Best experienced after 8 PM when grills are fired up.",
				duration: "2 hrs",
				transit: "Short auto circuit",
				cost: "₹350",
			},
		],
	},
	{
		id: "day-2",
		title: "Day 2: History Highlights",
		summary: "Walk 3.6 km | Auto 2 | Cab 1",
		stats: "Daily Budget ₹3,000",
		dailyBudget: "₹3,000",
		stops: [
			{
				time: "8:00 AM",
				title: "Breakfast: Raheem's Nihari Kulcha",
				description: "Slow-cooked nihari with khameeri roti near Akbari Gate.",
				tip: "Perfect for winter mornings; reaches peak flavour before 9 AM.",
				duration: "60 min",
				transit: "10 min auto from Aminabad",
				cost: "₹220",
			},
			{
				time: "9:30 AM",
				title: "Morning: Chota Imambara",
				description: "Intricate chandeliers and tazias, shines during Muharram.",
				tip: "Avoid Friday noon prayers to skip crowds.",
				duration: "75 min",
				transit: "Shared auto from Bara Imambara",
				cost: "₹300",
			},
			{
				time: "12:30 PM",
				title: "Lunch: Idrees Biryani",
				description: "Copper-deg biryani loved by old Lucknow.",
				tip: "Closed on Mondays; takeaway only spot.",
				duration: "60 min",
				transit: "Walkable inside Chowk",
				cost: "₹280",
			},
			{
				time: "2:30 PM",
				title: "Afternoon: Janeshwar Mishra Park Cycling",
				description: "Asia's second-largest garden with dedicated cycling tracks.",
				tip: "Rent cycles at gate no. 1 before 4 PM.",
				duration: "2 hrs",
				transit: "Cab from Hazratganj (20 min)",
				cost: "₹200",
			},
			{
				time: "6:00 PM",
				title: "Evening: UP State Museum",
				description: "Indoor galleries with Avadhi artefacts and Nawabi arms.",
				tip: "Monday closed; perfect monsoon fallback.",
				duration: "90 min",
				transit: "Walkable from Residency",
				cost: "₹100",
			},
			{
				time: "8:30 PM",
				title: "Dinner: Royal Café (Basket Chaat)",
				description: "Layered tokri chaat with rooftop seating in Hazratganj.",
				tip: "Reserve rooftop tables on weekends.",
				duration: "90 min",
				transit: "Walk within Hazratganj",
				cost: "₹400",
			},
		],
	},
	{
		id: "day-3",
		title: "Day 3: Shopping Highlights",
		summary: "Walk 2.4 km | Auto 3 | Cab 3",
		stats: "Daily Budget ₹3,000",
		dailyBudget: "₹3,000",
		stops: [
			{
				time: "8:00 AM",
				title: "Breakfast: Sharma Ji Ki Chai",
				description: "Milk tea, bun-maska, and samosa in Lalbagh.",
				tip: "Reach before 9 AM to avoid queues.",
				duration: "45 min",
				transit: "Shared auto from Hazratganj",
				cost: "₹120",
			},
			{
				time: "9:30 AM",
				title: "Morning: The Residency Ruins Walk",
				description: "1857 siege site with storyboards and quiet lawns.",
				tip: "Audio guide available at ticket counter.",
				duration: "2 hrs",
				transit: "Cab/auto from Hazratganj",
				cost: "₹300",
			},
			{
				time: "12:30 PM",
				title: "Lunch: The Idly Room",
				description: "Vegetarian South Indian breakfast when you want light fare.",
				tip: "Ideal monsoon fallback when you want indoor seating.",
				duration: "50 min",
				transit: "Walkable from Hazratganj metro",
				cost: "₹180",
			},
			{
				time: "2:30 PM",
				title: "Afternoon: Chowk Heritage & Perfume Trail",
				description: "Attar shops at Nazirabad, ustaad kite makers, and chikankari workshops.",
				tip: "Friday afternoons bustle with Jumma shoppers.",
				duration: "2.5 hrs",
				transit: "Guided walk (recommend rickshaw start)",
				cost: "₹450",
			},
			{
				time: "6:00 PM",
				title: "Evening: Gomti Riverfront Musical Fountain",
				description: "LED lit promenade with nightly musical fountain.",
				tip: "Best in winter post 7 PM.",
				duration: "90 min",
				transit: "Cab from Hazratganj",
				cost: "₹200",
			},
			{
				time: "8:30 PM",
				title: "Dinner: Marine Drive Night Vibes",
				description: "Cafe hop along Riverfront with skate boarders and music.",
				tip: "Great for high-budget evenings with artisan gelato kiosks.",
				duration: "2 hrs",
				transit: "Cab from Hazratganj",
				cost: "₹450",
			},
		],
	},
	{
		id: "day-4",
		title: "Day 4: Food Highlights",
		summary: "Walk 3.6 km | Auto 1 | Cab 1",
		stats: "Daily Budget ₹3,000",
		dailyBudget: "₹3,000",
		stops: [
			{
				time: "8:00 AM",
				title: "Breakfast: Tunday Kababi (Aminabad)",
				description: "Iconic galouti kebabs and sheermal to begin your Lucknow mornings.",
				tip: "Ask for the melt-in-mouth galouti on sheermal combo.",
				duration: "75 min",
				transit: "15 min auto from Charbagh",
				cost: "₹250",
			},
			{
				time: "9:30 AM",
				title: "Morning: 1857 Residency Interpretation Centre",
				description: "Indoor galleries narrating 1857 uprising with AR exhibits.",
				duration: "60 min",
				transit: "Within Residency campus",
				cost: "₹100",
			},
			{
				time: "12:30 PM",
				title: "Lunch: The Idly Room",
				description: "Vegetarian South Indian breakfast when you want light fare.",
				tip: "Ideal monsoon fallback when you want indoor seating.",
				duration: "50 min",
				transit: "Walkable from Hazratganj metro",
				cost: "₹180",
			},
			{
				time: "2:30 PM",
				title: "Afternoon: Hazratganj Chikankari Boutiques",
				description: "Capoor & Sons, Ada, and SEWA for curated chikankari.",
				tip: "Closed Sunday until 3 PM.",
				duration: "2 hrs",
				transit: "Walking circuit",
				cost: "₹500",
			},
			{
				time: "6:00 PM",
				title: "Evening: Prakash Kulfi & Malai Makkhan",
				description: "Seasonal winter dessert and saffron kulfi in Aminabad.",
				tip: "Malai makkhan only Nov-Feb mornings.",
				duration: "45 min",
				transit: "Walk within Aminabad",
				cost: "₹180",
			},
			{
				time: "8:30 PM",
				title: "Dinner: The Urban Terrace",
				description: "Sky dining near Aashiana with live Sufi evenings.",
				tip: "Reserve ahead for weekends; rooftop covered for monsoon.",
				duration: "2 hrs",
				transit: "Cab from Gomti Nagar",
				cost: "₹900",
			},
		],
	},
	{
		id: "day-5",
		title: "Day 5: History Highlights",
		summary: "Walk 2.4 km | Auto 1 | Cab 3",
		stats: "Daily Budget ₹3,000",
		dailyBudget: "₹3,000",
		stops: [
			{
				time: "8:00 AM",
				title: "Breakfast: Tunday Kababi (Aminabad)",
				description: "Iconic galouti kebabs and sheermal to begin your Lucknow mornings.",
				tip: "Ask for the melt-in-mouth galouti on sheermal combo.",
				duration: "75 min",
				transit: "15 min auto from Charbagh",
				cost: "₹250",
			},
			{
				time: "9:30 AM",
				title: "Morning: Dilkusha Kothi Ruins",
				description: "Gothic-style hunting lodge remains with quiet lawns.",
				tip: "Great golden hour photography spot.",
				duration: "1.5 hrs",
				transit: "Cab from Hazratganj",
				cost: "₹200",
			},
			{
				time: "12:30 PM",
				title: "Lunch: The Idly Room",
				description: "Vegetarian South Indian breakfast when you want light fare.",
				tip: "Ideal monsoon fallback when you want indoor seating.",
				duration: "50 min",
				transit: "Walkable from Hazratganj metro",
				cost: "₹180",
			},
			{
				time: "2:30 PM",
				title: "Afternoon: Hunar Haat Cultural Village",
				description: "Seasonal handicraft fair with drone shows on weekends.",
				tip: "Check live schedule for cultural troupe timings.",
				duration: "2.5 hrs",
				transit: "Cab from Gomti Nagar",
				cost: "₹300",
			},
			{
				time: "6:00 PM",
				title: "Evening: Hazratganj Heritage Walk",
				description: "Victorian arcades, chikankari boutiques, Royal Café basket chaat.",
				tip: "Closed for deep cleaning on Sunday mornings; visit post 3 PM if Sunday.",
				duration: "2 hrs",
				transit: "Walkable circuit",
				cost: "₹400",
			},
			{
				time: "8:30 PM",
				title: "Dinner: The Drowning Street",
				description: "Microbrewery with Nawabi tapas near Alambagh.",
				tip: "Happy hours 5-7 PM weekdays.",
				duration: "2.5 hrs",
				transit: "Cab (20 min) from Hazratganj",
				cost: "₹950",
			},
		],
	},
];

const highlightSlides: HighlightSlide[] = [
	{
		id: "historical",
		title: "Bara Imambara arches",
		description: "Labyrinth walks, vaulted halls, and panoramic views over Husainabad.",
		badge: "Historical",
		type: "historical",
		link: "/travelhub?search=Bara%20Imambara",
		color: "teal",
		lat: 26.8683,
		lon: 80.9127,
	},
	{
		id: "culture",
		title: "Chikankari ateliers",
		description: "Workshops in Chowk and Hazratganj where artisans hand-embroider heirloom pieces.",
		badge: "Culture",
		type: "culture",
		link: "/travelhub?search=Chikankari",
		color: "sky",
		lat: 26.852,
		lon: 80.944,
	},
	{
		id: "famous-place",
		title: "Rumi Darwaza twilight",
		description: "Iconic gateway framed by evening lights and street snacks nearby.",
		badge: "Famous place",
		type: "place",
		link: "/travelhub?search=Rumi%20Darwaza",
		color: "indigo",
		lat: 26.8696,
		lon: 80.9129,
	},
	{
		id: "event",
		title: "Ganjing carnival nights",
		description: "Pedestrian-only Hazratganj evenings with music, stalls, and late café hours.",
		badge: "Event",
		type: "event",
		link: "/travelhub?search=Hazratganj",
		color: "rose",
		lat: 26.8523,
		lon: 80.9459,
	},
	{
		id: "food",
		title: "Tokri chaat trail",
		description: "Royal Cafe classics plus street-side twists across Aminabad and Hazratganj.",
		badge: "Food",
		type: "food",
		link: "/travelhub?search=Tokri%20Chaat",
		color: "orange",
		lat: 26.8506,
		lon: 80.9462,
	},
	{
		id: "restaurant",
		title: "Tunday Kababi seats",
		description: "Iconic galouti spot with evening rush—plan for wait times and takeaway.",
		badge: "Restaurant",
		type: "restaurant",
		link: "/travelhub?search=Tunday%20Kababi",
		color: "amber",
		lat: 26.8468,
		lon: 80.9121,
	},
];

const sections: Section[] = [
	{
		id: "foods",
		title: "Foods",
		goal: "20+ dishes · 5–10 techniques · 30+ restaurants · 100+ photos",
		status: "In progress",
		tasks: [
			"List 20+ traditional dishes with short descriptions",
			"Document 5–10 cooking techniques unique to Awadhi cuisine",
			"Gather 30+ restaurant/street-food recommendations with price cues",
			"Collect or link ~100 food photos (optimized)"
		]
	},
	{
		id: "streets",
		title: "Historic Streets",
		goal: "8–10 streets · ~100 shops each · 150+ photos",
		status: "Planned",
		tasks: [
			"Profile key streets (Hazratganj, Chowk, Aminabad, etc.)",
			"List ~100 shops/landmarks per street with categories",
			"Add historical blurbs and navigation links",
			"Collect ~150 street photos"
		]
	},
	{
		id: "monuments",
		title: "Monuments",
		goal: "15–20 sites · hours/fees/guides · 200+ photos",
		status: "In progress",
		tasks: [
			"Document significance and eras for 15–20 monuments",
			"Add visitor info: hours, ticket fees, guide availability",
			"Attach geo/map links per site",
			"Collect ~200 monument photos"
		]
	},
	{
		id: "parks",
		title: "Parks",
		goal: "5–10 parks · facilities · 80+ photos",
		status: "Planned",
		tasks: [
			"List parks with facilities (play areas, jogging, boating)",
			"Add timings and entry notes",
			"Collect ~80 park photos"
		]
	},
	{
		id: "religious",
		title: "Religious Places",
		goal: "20–30 sites · timings/rules · 100+ photos",
		status: "Planned",
		tasks: [
			"Catalog temples, mosques, gurdwaras, churches",
			"Add worship timings and visitor rules",
			"Collect ~100 photos"
		]
	},
	{
		id: "festivals",
		title: "Festivals",
		goal: "10–15 festivals · dates/events · 80+ photos",
		status: "Planned",
		tasks: [
			"List major festivals with month/date context",
			"Add typical events/locations per festival",
			"Collect ~80 festival photos"
		]
	}
];

const statusColor: Record<Section["status"], string> = {
	"Not started": "bg-slate-100 text-slate-600",
	"Planned": "bg-amber-100 text-amber-700",
	"In progress": "bg-blue-100 text-blue-700",
	"Ready": "bg-emerald-100 text-emerald-700"
};

const statusProgress: Record<Section["status"], number> = {
	"Not started": 0,
	"Planned": 25,
	"In progress": 60,
	"Ready": 100
};

const foodItems: FoodItem[] = [
	{
		name: "Galouti Kebab",
		description: "Melt-in-mouth kebab finished on a tawa with light spice",
		place: "Tunday Kababi, Aminabad",
		image: "https://i0.wp.com/savorytales.com/wp-content/uploads/2022/04/IMG_6354-scaled.jpg?w=1200&ssl=1",
		history: "Created for a Nawab who had lost his teeth; perfected in Lucknow kitchens."
	},
	{
		name: "Kakori Kebab",
		description: "Silky seekh kebab with saffron and kewra perfume",
		place: "Kakori area stalls",
		image: "https://m.media-amazon.com/images/I/61hWjGe9cHL._AC_UF350,350_QL80_.jpg",
		history: "Named after Kakori village; a refinement over seekh kebabs for royal banquets."
	},
	{
		name: "Awadhi Biryani",
		description: "Fragrant dum biryani layered with stock-soaked rice",
		place: "Idrees, Chowk",
		image: "https://i.pinimg.com/564x/d0/da/fb/d0dafb19ad68d32d322a7237ac162852.jpg",
		history: "Evolved in royal kitchens using yakhni; emphasizes aroma over heat."
	},
	{
		name: "Nihari Kulcha",
		description: "Slow-cooked shank curry served with fluffy kulcha",
		place: "Rahim's, Chowk",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQErjXJXQ77wpQnNJdIlKjqoDV6nnozItZn4A&s",
		history: "Breakfast ritual from Mughal courts; simmered overnight for depth."
	},
	{
		name: "Sheermal",
		description: "Saffron milk bread brushed with ghee",
		place: "Nazakat Sheermal, Old City",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuq8qSW7824PSzDM6TYW-glYeepBDAWbjvaA&s",
		history: "Persian-inspired flatbread adopted into Awadhi feasts."
	},
	{
		name: "Tokri Chaat",
		description: "Crispy potato basket loaded with chutneys and yogurt",
		place: "Royal Cafe, Hazratganj",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzJeSxEaI9nH3fM3AIwIReuo4gFJBoRjRUng&s",
		history: "Modern Lucknow street classic; balances sweet, tangy, and crunch."
	},
	{
		name: "Kulfi",
		description: "Saffron kulfi with rose syrup and vermicelli",
		place: "Prakash Kulfi, Aminabad",
		image: "https://media-assets.swiggy.com/swiggy/image/upload/f_auto,q_auto,fl_lossy/wec4hyjzajvya6fyxiva",
		history: "Dessert with Mughal roots; carried through generations of halwais."
	},
];

const streetItems: StreetItem[] = [
	{
		name: "Hazratganj",
		area: "Central Lucknow",
		highlights: "Colonial arcades, cafés, bookstores, chikan emporiums",
		shopsCount: "90–110 shops",
		image: "https://lucknowtourism.co.in/images/places-to-visit/header/hazratganj-lucknow-tourism-entry-fee-timings-holidays-reviews-header.jpg",
		history: "Laid in 1820s, modeled after Queen Street; evening ‘ganjing’ stroll culture."
	},
	{
		name: "Chowk",
		area: "Old Lucknow",
		highlights: "Itar, zardozi, kebab houses, silverware lanes",
		shopsCount: "100–130 shops",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0mYO5sN35JhcyYJw-JTBi0_4K2Ggh3Y79ag&s",
		history: "Historic market since Nawabi era; narrow gullies with specialty bazaars."
	},
	{
		name: "Aminabad",
		area: "Old city core",
		highlights: "Textiles, jewelry, street snacks, kurta bazaars",
		shopsCount: "120–140 shops",
		image: "https://cdn1.tripoto.com/media/filter/nl/img/2380291/Image/1702044131_main_qimg_c77e37360519d135de7ecb326f0bcee0_c.jpg.webp",
		history: "19th-century bazaar expanded under Nawab Amjad Ali Shah; famed for late-night shopping."
	},
	{
		name: "Nakhas",
		area: "Old Lucknow",
		highlights: "Sunday bird market, timber, brass, perfumes",
		shopsCount: "80–100 shops",
		image: "https://things2.do/blogs/wp-content/uploads/2024/09/1-11.png",
		history: "Over 200-year-old wholesale zone; retains Mughal layouts and craft clusters."
	},
	{
		name: "Alambagh",
		area: "Southwest hub",
		highlights: "Transport hub, eateries, budget shopping",
		shopsCount: "90–120 shops",
		image: "https://i.pinimg.com/736x/09/19/1c/09191c7c5b6bbabde8fbfa5edcb525bc.jpg",
		history: "Developed around a British-era garden house; grew with railway connectivity."
	},
	{
		name: "Husainabad",
		area: "Heritage stretch",
		highlights: "Rumi Darwaza, Imambadas, lamps, crafts",
		shopsCount: "70–90 shops",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxjjS_mBusvVLZ0iwCLUDnd5NnIDXxOYNr7Q&s",
		history: "Ceremonial route lined with Shia heritage; evening lighting draws visitors."
	}
];

const monumentItems: MonumentItem[] = [
	{
		name: "Bara Imambara",
		area: "Husainabad",
		info: "Hours 6am–6pm · ₹50/₹500 · Guides available",
		image: "https://static.toiimg.com/photo/103890972.cms",
		history: "Built 1784 by Asaf-ud-Daula; famed for Bhool Bhulaiyaa labyrinth."
	},
	{
		name: "Rumi Darwaza",
		area: "Husainabad",
		info: "24x7 exterior · Free · Iconic gate",
		image: "data:image/jpeg;base64,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",
		history: "1784 Awadhi gateway modeled on Istanbul’s Bab-i Humayun."
	},
	{
		name: "Chota Imambara",
		area: "Husainabad",
		info: "Hours 6am–6pm · ₹25/₹300",
		image: "data:image/jpeg;base64,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",
		history: "1838 by Muhammad Ali Shah; chandelier-lit interiors, reflecting pool."
	},
	{
		name: "Residency",
		area: "Kaiserbagh",
		info: "Hours 10am–5pm · ₹25/₹300",
		image: "data:image/jpeg;base64,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",
		history: "Ruins from 1857 uprising; museum documents Siege of Lucknow."
	},
	{
		name: "La Martiniere College",
		area: "Gomti riverfront",
		info: "Exterior walk-bys · Heritage campus",
		image: "data:image/jpeg;base64,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",
		history: "1793 Indo-French baroque by Claude Martin; featured on ₹20 note."
	}
];

const parkItems: ParkItem[] = [
	{
		name: "Janeshwar Mishra Park",
		area: "Gomti Nagar",
		features: "Jogging loops, lake, cycling, play zones",
		image: "data:image/jpeg;base64,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",
		hours: "5am–9pm"
	},
	{
		name: "Gautam Buddha Park",
		area: "Husainabad",
		features: "Boating, rides, family lawns",
		image: "data:image/jpeg;base64,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",
		hours: "10am–7pm"
	},
	{
		name: "Lohia Park",
		area: "Gomti Nagar",
		features: "Jogging, open gyms, fountains",
		image: "https://lucknowtourism.co.in/images/places-to-visit/header/dr-ram-manohar-lohiya-park-lucknow-header-lucknow-tourism.jpg.jpg",
		hours: "6am–9pm"
	},
	{
		name: "Ambedkar Memorial Park",
		area: "Gomti Nagar",
		features: "Sandstone plazas, statues, night lighting",
		image: "data:image/jpeg;base64,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",
		hours: "11am–9pm"
	},
	{
		name: "Eco Garden",
		area: "Kanpur Road",
		features: "Museums, lawns, events",
		image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGRsaGRcXGR4fHxofGiAaGhobHh4eICggGx4lICAaIjEiJSorLi4uHx8zODMsNygtLisBCgoKDg0OGxAQGy8mICY3NzIvNS0tNTUtLy0tLTItLy0vKzUtLS81LS01Ly0tLS0tLy0tLy8tLy8tLS0tLS0tLf/AABEIAKcBLQMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAEBQIDBgABB//EAEQQAAIBAgQEBAMFBgQDCAMAAAECEQMhAAQSMQUiQVETYXGBBjKRQqGxwfAUI1Ji0eEVM3LxJIKiBxZDU5KywtJjg+L/xAAaAQADAQEBAQAAAAAAAAAAAAACAwQBAAUG/8QANhEAAQMCAwYFAwMDBQEAAAAAAQACEQMhEjFBEyJRYXHwBJGhscEy0eEzgcIjQnIUgqKy8TT/2gAMAwEAAhEDEQA/AFNfOgPLlTYKSAbFbzbciOs+k7EMdcc2kB1MAkEiwGkGCAG1XEgahMWlTnNSybG4LFJIiwJAOmbxvA64YZPK0hAra4gjSi6ShaQNa9DJBU3HzG4N/I8QwQyeAXz7GTM8U1ylMl10tUDwolZGonVqJJ7KCBcjzAF85naTFkdVOp4QKQCTHyWgqNtIuTfc40GWyfKW1mVU6RI5ZhSSSSSZgkTFjEziGYyYem70liqgNWWbUWKRUcMDLapSxgCSQTJERMqtD4GWSOmQXJLmWkCmPFNdmfxNzCiCBMgOSDsANgL6hgr4b4aM1nKGXB5FEkjUJ+1YOTcKAAQBfodyVwrIUXzFfUznVlzXptqBJaAzaipANizaSOgtaDX8Joi0q1WsBqqEqNZiARqcAEyTt0hbGRafRaI3gqW0wDiK+10sgFVAWMoIsIBFrFRaOgHTFyZpTsRjOfC3F6pmm81FVVK1LliHEgNuGMAtqUkdOklxnqdMBmZyswSdW0dvzHXDNuC2W+q9JjwW4mpX8T10Cz4fiE6QVJIurAgETMA3IiDAnCnhedYAValRm1FQHIIJVfMiPcdT0kQP8TIzDxUY1FJ02sPsiCQwMGYGnaR1ONJw2nTEI+nxDBFMnVptuCdjAiRjzn061WqTMDS9uXmpg4uqFZXitPxpp5akAq6kdwEhFC80XljLAFTGzC0yMcnCKz1ajAIzoupiWsNAaVIuHEop/wCYb7j6xxTh6UwCqcly+liCzRA1HYbAE9bAkCQc/TWjS0KtFlC6lVV+W+okkiAgJBPQXI9WEDw7cOvv5rKjb7y+XZCsymuRpgllMWAkzb0t5DvbGk+HsitSvUJaK3jOqLZZDLc6jF4OqN7CAZOFeaoj9oqF7gOztpsILByokX+Zvlnceo0fwbmEq+KlVUdi8lGAI0nTeDywSGB9RfYGt7oGIclkIfifDmy+bqUVfVUZVKHYSSVG3ygW6mPrhrwfK1xVP7Qzoz6QNOhdSgNUcB10lQA0cskFiTNzij4akcYFJmLrT1pTndUUEoD1OkRc3tucbjjdf96mkqqICWcWcG0BHvpH8QAvcbasGSxu8Tb3RtYDvJV8R8G8TTTFMswy7kmVHMACGKhzPNAJF9rsAcYFeJaqC0WFpDatrLMDsRLMe/4Y+q1c3OYo1EmoHUgKkAQQCX1mBU6DSCR8piRf5JRyheutFSJ8Q0x5amiTHbfDsQKN4vZbn4P4EpyT1tANdixpE7jSIET1nVY2NpthpnuJzQXxF50KEjoIAKh4DTeREEE7GbgbhHC0QEF6ugciku0OndlHKBMwDNoB8leW4YVrurgM4WVKUwV6/wAQhCBeFBGwnul3iR/asJIAhMeH8YYZpg7Kx1FXduVbzEc4WOUdDf8AiscA8Qq6azqz6iHDlQwUazB5iZJ33EDyW2JUeBVlqKFcgGSWUuNv4tABFj3EmwjfBXGOHcy1NRLGPmZiBMwFFyF3JJLR2PXNsCYQnFCIo8Q1nQJ5oXStMKBBN5UvtcyAeu2NHkeHFG0yppxdTqny3JBH6iwhbw3JU2VGrLdbC8huW4AgWuIO9gJthhSSqz6g0AA2v1MXBM2j1kn3cypbimNGpTamgAAAgDYYkWwNRrWkmegj8MeZpzaBP9cOxWTSbInxMRergYZjqd98U184Jsen6GMxIC+FXXr8zLOFWdramj7/APbEM7mOck/wkn6R+YxJ0apAVb+XWNIM++9u+Ccckh+9khkoyqBTBJaT0gzBMfr6YV/EuSeiyv0sR1Bi/wCcXw7pZ/wvmAGoABona1vO0x5DCfi9Zqwg6iLqCRsBck/r+87qga6ZWboKYf8AeCkugqCdcF9Wyk9ouWn8zgbMcQTMVagB5XXTPcGQIknb8pxksuWZgLmZsPLytJifwwz4Y5XMFXB1ADc3sSfz8/fC6xMEfuuJORSPP1SyjXcqFRR/p7/fgHg1UrVViJFwZ6g2vY98MPiFSlSrYwGJG4G4Nr9uuFLPBBBi8x/DP5bXwwHEzqjGSszdFRmNBPKGiVvbcAT67z1vgzh/B/Hpg2tNg0H1NiY6DYWPninwBUdYYWp8zTOkhmEntbT7EezrgXDqb5dGqgwS2mN7G/2Tbb3nAVHltIxxHyp6t6reh+Ej41mQatRgCpvP8x3sWNlm9ogCBhZRrxUZKjFkMgtLAAzY7A2a89z64ZZ3MozkqToiJvMAzaepiLzucANlyC5idoIUk7QbGSCd5H+8tR4hsj+0KCm8XTjLceILCjKhtw7alaPMjeOwWeUbxgSkPEaSdckQGJ3sOgMXgWjcgyCYGbh9iQpgCA0ydVhcKSTeBaYkTgilkAih9UTfeAQSCJiDYjyOqO2JtwHFFytL8iUi4g7qRQmShKBh1EmNidxeB364f5fKutJvC8OuSJcBZ0qArawxAFmHMJkMFEHmhBnKpNSrWjUS+kM1pMQdu39MPOB5HXXNRFHh2ILAXHLrsOsajC3EcvSfQBsFc7II7hPGKhZYYg2CuSEhQSwAUtBFyJJgC3njdPl6VYJW8cArp5SGtBhgLglWI3gmJuZwm4fwFHFSutNWYEk6BCinuNHNOoCB102i0RXw7h61XgZhSpJZQQxBgLC6oMEAgxfVCi25nNnyBM5TKFjS3SQU+yqzVWkwjmLqVAXVJUiNbfxS0EbwINzhR8SZuqtY1mYMimFIAswMXg8pI1dxa8G2AuOcQqVK6qaZbwwFGksSYHUlVMeZAg364ryy1KTFG1gkRuVDyBCk6jO+47e+Aq123aRPfwuc+bDJO/8AGjWpAVHPKdUBlkDYSBEgdiQencYqzWaFR0VZiCQWMg9LjvY72+sYB4RkvE5qp0SwXUtx0IkSRcjcdhMWOGTBaLQoFVZDFdNoMlpEQH5U7mCbCbSbDauxl3qiBLmyVieIcOC12VajQVUlnPUySoMCFDco7Rc7jBfDeDv4FTNUiRXy9QkqLkrCECLzYtHTeew84jQarWd9AWQo3iYkAjrEQu3QY23/AGeV6KZWsKhUHxXDTuQFQ+4g49Jrhhu4QmsAJWV4PWCcRerY0yhqBzJARwkGAReGFpkT16vOMZpWKtTBYBpDVCxhlJKkCyqSRGlVv1nGX4JnWyteuVTxMspcQ0EaTU0qpm1xJBNp8jfWcOyxqUTWZAQpOlVETEFiR3kbW69Bgaoc0Bre7LrkQEXneKmnTFd2YlKdQgifmYrpB2kSAPKbzGMR8H0mfMoFuwDNe/2SJP13vE7HDj4zqMMvSQkXJmGJkcpuBAiY2tKzhf8AB7FFrONIZoVWIsFEE7XEz9wwui4s8OXTmiJjNbWmugkh0apcQY3MSIJAHWNQJ+sY8qZl1VB4WkcwmIIboeUGAbx7eRx5l+II7inUkGJVgZB6iZUQAPrB9yM0xvqdXmTpdlABggwwXpINie3bC6LQRD58ltosVb8OVahVi8MrEaahY7fat0vB36+WL84iPIO/UhZmInrEC1t7YWZ/MpTKrpZFE2AIWetjY2k2N8UMZpsVC6SeVrDlNxIHawMemNc0u+mABktxwITRqa0wTTIOqGm9vK0iT0H5Yd8LroVBX3+/3J/VtsZ7J5tmp6FIkQAdJYDbzmB/ER1HY4K4Y1VEhgFtYwLXuNgPpONpeILCSe+aJhEyEwzOfBkdLmYt5X2Ji8Y9GfZlU2A3k/Qe/nGFeboprBJIm0i8DeABt7dvLDNMqHUhGBII3Bj9fXFdOq59wbrt4kq46bFzzmwG++23v9+BM3dgVgQpJtvFh9dhF8VZYMtNgEZdJPMbztAuNvSbC+E2cz5d4US2wjrE3EYa6o6YIS3ugZIrOVUJT7Osw8Qfb0/pibZ+GgARf5GJJO0ki2k2/r0wpo1jVNPUD4YcajHKApE32vtPpi2lxUGqxgKhMaQLgLYCbROMdUIbKGbSjDnl0Kgu4Mtsd5ge0D7sUJmWA1sTEMSBY3mwF/174X0KlE1mUE6Y0uTa5b/qA/Ie5nE0CGEmTtHykj3gG1wLX9sS12A3GaxzisvTIFZZtNQD12DHYzv922Pc1miuaVmO5Kmd4+Wfr+GBs4+nMCxBFRekbEE26R+ZxH4hqh8wBC2OkxAE9TbsSZ9MPIJeDGYRAT5I/wCK6LOEqEXamQYFtS+XT9e+Uq6dKQTPMCeltvXfGvUpXoELAcDUHPUg3EfU7deuMXUXliDqUk3NotaPzwVA2g6LWXCecByDFyDYkVL2tGgdd5BIA7naxk3g3FRSoIJe+rlRZi55iSDvtH8vWbV8Hzr06gOmVq2m87A7ySeo39xhGmYqoo8MQDuQN/WbW8sDicWumNP5Kap+qOh+ENTaoo+Vi/8ADpbYCTYXI0gkn1OKMxlqjHWJ+1KlpOk9ieZhpM2JvJ6xjR8EyyiuUB+weZWHKYFywMT33ie4wRW4SfEZ8yZUMpUAyO0RdTMrfy7kYRWrNa5vGApaQzPNK+G8PNVDW1VFZZ0tssLdixE9AAJN7jzAOfZwzCrVIZVlg1OwBggEQIMaR1gL0gYbI1JHKO/IQxUqFDSotMggsBp33G974V8cyn/CtWGiYpqWUiSIghv476bwNlPUY6m7ERa3JVUwwgCEJTytMIAaxgapISfm0yTLWtadr+cEzL8Tp0YXxmq0/shVKhTPQEyNgJi8+eE/DaBqjuukoYI1RElhbeQbkQMGZfhlKmSazFwikHTKiGLQLajqnSb2gRvh7yxtnZptXZizlrqHxyFo6IJMQrWm8k7AzIYiCO18Jn+J0BOosGEkAWBO5Bjae8E+2MvZizUo0lm0oG5lkcoM9INvTvgZ1SBUa07qykyesCRvaOm58saabHQTpksLWmJW1yPxEtPSaQZahDEsNPWBcjpbaIse2J8Q+J1IJdU0g2UKGuJG5Njb3t5RgXcxqUGJ29Lz9fz7YoXNExPSwvtfG/6ZjjKIUgclvE+LBSUKtNQGElTqIaJAJ5wDJBHlHrJGX+Oio1GnSM6jdSCbQDKvqkAkA7/l89/aZ3uYi/YXjHj1TGw2wQ8JSBnCi2IX0tuJPmK7OVRIK04SYOgkljPW4v3wvpcZNMNSYLzOWLEExISRIbbkFo73xVwEmXj/AMxzfzYAem3XCDj1QiqQeqr904U2m17yCFmGTC0vDeIBBVJRTTdGLKV3AbSV6ROrpsYjbB/wt8VVaCsisGDmR4kXPKJJtBIEWN9ItjLFnWnpbY0DU9mZP19fXFWRNlYTyrPpzNfDtmCCiwxdaj4rzr1ZL6QxGy7cnY/6TPvGF9LjqCilLw4C2N9yblrzeSRtt6CFPEc21o8iPWFn/wBowNVq3kRBv6dx7H7oPXHU6DQwNIRYMQutjlviREcMA5tEEkCOtlIkSNhG+HFf4ponl8IXEyNj2tIMwTeeuPnIrHy64IWsbH1H9MafD0zouFICwW2y/HAx00w0aSfmiP8A7bxfvtgteLh6ZRQSoAa3zGZEz6zbvEYwtGuRB+sev+2CMvmypYjYyI+n4Y3YMzAWbILa5f4hSmZUNImAWgW8gOu+/XB9b43VgB4YJ7kG333+7rj52cySZPv9IOLaVYn78Z/p6ZuQjDIFlvqvxUjqJpISJ7g/UNbfBHC/jDTfTaPlmAevUEyDPX88fP8ALZkQPf8AtiVLMX2wxtJrcguw6r6LnfjMVU06AB5OZuCDPL5jCz/HkOrSNINyGY/iBMDePLyxkBXt+OIGvjTTaTJWFk5lbE8dRaZoiIMiQNutu4knfAVTidMwZhoYEhYDdjE2b+mM2tWbAHFlakeUCLqDabb7/rrjHMbkVmEZSnXDc8gJhiGHtsPKZ74Jr8S1NepMC0yPYTbGX8FiCw21afcgn8MOaHCwAg+aWHPcLcTpuBFj37YVUpsNylvY3VULQZ8wsXgqSewt069vPBNXwqbLbUbwSASepIBJAkEm0e+AlqhM0QIvqB3hQL+sQCPvwtqufEkzcQLHrsL+uFPpl5ubQhIJMTZaDIZhkblAAIuBuDsLCxuZjrt3wkr5XRXq0/s3HqOUid+l/rhxQyLU6mtlPN8swNXU2nVAjeIFu4hb8Toy1kdr+IqkmwBKnSdthpg4CmRigHMLqZMJnksuVU6gVsQYgAJcgwb2FvMfTC/hmYQLDLJHUsB3NpYfngrgpQa1XTDllgWsRB36/dtjLZ3OQQoGwvvcmT0I6R39urG0zUY5vMfKTVGKqOh+E8ymSqUqxRQGJBJFxK9RYyDYTcRftjTK4dCSkVAC4SwOlTAXV9rvFyYtvOEFHUlUs78xQtKnqWAAm0D1Hsd8OBxQeIoFIK7I7PqfTAnltAWSCSBsYPTEPiLlpdoB+VPTvKQVq9F9KuoUAagil2JIkAsxMiILWvc2jFfHM7SqZN6IXwypWnLsFAKtcECRPKIjSIjvI7NV1qNIJUNUZZgTIC3gbbwDNzJgGcZn4lymhkeDULoGIuLyQdUXG0el8MosGICVQwSYTj4eyGulGs0mUkKUFyxVjdiSUWJGomDJG1secRc06xVm1HQigkgmDDI/2uYCLfZO0Ye185po6abN4bZcAKEQAl5hjeUkMNhJkzB1TjeI0mSpUcrpC6OUaVAkG2kbgDaNo9Bg6Z2kkrjD5AUa6lSUQFSW0ht7L0joJgnYYHzaGATDDULAm5AkwbnuJ/Hp4maDNrOoAi+nv08u/wBdsRrZkIQoEqvNBHfcd9++KWtIWtaQUNnaSpADNquT/KCSL9z92AqzSZt7W+7BtXNWk7ja1mv1M3+/YYAqNJkmScPZOqppA6qVPceuG75K0+X9P64VZX51/wBQ/EY1LLeP19nA1XxCoAlPeAUVipJAPiQBtOx/E4zHHUHjDtA/EzjY8Dp3sACzCbfX7uuMvx4E1mn9c398S0Xf1CkNG+uqOW1SFH/Dt8pJ3qA3k9owNRpyo8l226n6zv74J4e003uSdB6+a9PWcRWkpcAg8oH3w3tvikGLItFRWQkmb3P4xiVKhizLXA3Pr0krgvTA26fljseiYGmFUuW/X1/piX7Nv+vLBip5d/8A5YuCWPn/AFXAbRFhS1MqZn7sGZXLrpbUTMW9fPFlO/T9QMWOttv1fGl5KwBDpQXmloI2HfefyxNad/r+YwQ1Lr1/ucco/X0xu0laGkFLQ0E+pGCsus4X1mh2/wBR/E4OyNYA4omy2EXVy5AxDJZF6r6EBJ8hhhxHiYqBRCjSoFhEx1PniXw1U53EwDpJ9pwuo8taSl1N0SE5y/CkUCkgDFgGL/aNoZZOw1WgdB1OyHiNJgmXfcOhUbfZMEb+Y374+k5FFqUXr0wpcNCHYAJywdXcat7w3pj53x7P/uKFMDS1JqhBG8Mdp63BwhoIfJOaSBrxUhXUZFQFHLW1lovBhYmY64PrcTfw/ELEKEURJWQogEDqbNJ2O3aM/TdWpVUBIbdR3Bhj6QB7z9W/DstUq0LuqrDJzHc8ywtr7Ee+F1rCXG0+iU7F6pHlmmqxkzpY9t5Ez6Yv4IVGYQG8OG7CV5rkxa3phNRqjSCb2P3Xj0j8cPfgekzZymFAY89jEfKwM+V74e9pgoyFouKVay5hyo8WlSonUKd9CvyyZiRykyomN9jCn4no+JlqTgg+G2kkH+MXgTYSEHue2NZlKTnx64o628RUKq0NqUDeRY63M7xB6YVrlTVpVaTppdwzqAwgEQVFok6r+3lGIowYXxCEZrOcCoa4YPEDURG57d5mIwgrcNeoxKwbC3NIGw+UGJIP0wZl801EllPzBgVPQjv5g9B54bZHLhaQdS2p2bVHQLpC9D/MffFmLBTc6dR8pNV0PB5H4QNAOrAsEqMBIhgQbWnVAN7EER17HDekrVEq1ac04KWp8sg6oMajCyIhZvcHtmmZqYJ06WVjYGYtYzsbe2Lv2zSIQkqZ1coE6SI0kkyRIB3mexxNXaTh6BIpiAepT/LhGNXQqTo2cEsPINq5YteJH822MywGZrio6lr6lBkgopgtaAGtYDbcjBuVz2lCdZg/Mx+YgX0gzyi2wEWwHQyjZYqy1CdaI6oAJO5JIuIgDqd8TU2luK99ETTDTe6rzXEGEpIZxfbYDa21l2gd+wwEzTINSRUIn5ZOi4U3GljHn748zlIu4PMniKQ0bGSz6REswsm8wTfawNPTTVgYkkRIEiw+1JAv2xaxoAtmntaALLuIGodRKwNQadIUlmHQ7sBc9e/nijLq0GQT1kGzdBPkP6Ynmavyhw0SSD0g7CI2Hcb/AIjrqnSJO3l93XtOHiYTBJF1bUAZbKL26GAOg7dcBVKYHW/SPzvbBNeAY6QI/XrOBTvgmqhjYVuSX94n+tfxGNVUS/v/APTGb4ev7yn/AK1/EY1TqJAkWIkeuk/lhFd0EJwIAkmE84S40A7mVtMW5ZuL/wC2M1xEfvGI6bf+oRh9kWhZB2K3taVp9z63xnuIOAziTP1vb6XEfXE9L6iUgEBxJVvCaJHiLYgUhB7htDg/Qj6Y6vK1GIuoAB9QoH4iMT4XXEMPtCiQx/5hF/QqvTb61uRLkXksbEWvN+222HycRlFIwwrsqJAMdZ9pXBLrYHy/JsCZfMKFQGZtsPJcXPmViAZjcfUYAuuiNamLSjGWG9z+JxYLj9fyYFFdTBNpmx9cEHMpp+bmjafT+mBlaa9PInuFYiwo/XTHtYW/X8wxRTzSlRzWmPuOLFzK7T1/Mn8DjMYlYK9PKVcBIH6+0P64rUwY9P8A44qoZpP4tuv0x37QkwGkx+AH9MEHIzXp5yk+etUb/V/fHU3vjzi7RUb/AJT/ANKnFc/r64sad0LXZlM6QU09ZZrGCAoMSDBuwt+eGXBhDkIWOpJgiLAxeCZi59sKuGVY1yJEEkdwAZHl69DB6YKy7lKtPSwKslmIBkM7dOjDY9jhL3GSCge2Wrb1JoUyj1EXxFLBUY8ykbaRTIGxIJiwMmxxmeOIyJpY6aikllYXPNBFrHqT/ptviAzZWSyKx0GWJMtq8QSTO426RMYH4rVDUy/hiZqd7DV29SD77xhNpAhTkDDl3KFok6SwEzTaSBt8yxHlO8YM+H2lDBEXJkM19wDERJEXPXY9BeHZk1IiARyz0Jmb+o6db4F4W2kMDtMCeukwfe+HH6TIS3/SZCWGqQAPX/qEfhh/8PcUOXreImnVpIA3uRHsT29cZ2geZV7GIw94XlGrVNCTLgxA63IEHbr92G1HQEdSwX07h/Gg9JcvTcSy6djqJeNTMQY1E6zqMCTjN52tLWfW6rB57raBebkXmCRuAcJuF5ipSrlFtVVWDq0gK+pII7zplT1BHfFuY4a4pJUMrqOoTZmmEA/nsZBWN6m8kYiqEv8Aq0U+JxIxJXxrKQ4XmICAjvDamnyvOG3DlLUxFQrBPLqUDvI1A7/kMDfEMKKTDUoEoYsTZWG4+WJ6Yjw3MRqGsptsAZ+uCcSfDEjiPlLrziEcD7hK8xWCKSphTa0m24A3MWGKKlQALLzJYgCB0ME76T6wCI2xfXY06SxE6FnWJuVBJ2iZ/H2wp8IAkFtABGqCYANiLSIIJggX6DDHts3oENNmY5outnU0FxrE7E6QZsvMF3sWP0i4wTThVBd5IW7M0WJlRzj1JWJt3GBM5SWlQXwyNWoHUDEibSsm+87C4t27g4q5qsQhVDsahYKNiAoIg35pi3fpIBsi2SeGbtspQOcVg4DApeyxJA+yFv1Mjp188BZfM2K2AY2nuPP36bxh7xXhlehyEU4u2pZNtiGLKJIN5AgQY3MZvWQSCIO8EdxuBt6W9MUNCY0AhW1qUQbjsZ9I8xa+DeC5b91WrO3QpTE3LhGqM3eFVfq64XIzNCASSQAANyYAA9dsanii06aLQFxQWujH+J/AL1WHlqfSPJRhdZ5EN1PsOwFXSaIus7xBYZR/In4DA4p7frvh5mRQ8Q+JpMQL1GGwFjC4snKaipRJEyPEq/Zkn7PQA44VSBke/wB06BxSjKDnTyM/S+GmZR2bUAR/T64pzGbywE01QN/K9QnzsygYgvGv5f19ccQXXjzS3AGxWo4c8Uzq3XRf0p0529sZ/Pgs0i1hPqJn67++HuXqhqGvqxoix7opj/pj7sZzO5khys79Y7yP74VSEuKXhEongdMy9vs3uP4qZOC8odMi5EXgxBIuDe3af9iPwuoUeoAQf3UyNpbwwR9TGLeGsC5nY9LRIbT/APGcMdqVxVCZZ5JAN43i3riz9gc/774CqcVYEi9iR06e2PF4y3n9f7YLC/kiwtmYTc8OYwe1t+/tjwcPa4kepj+mATx9ygSDvM6v/wCcQ/xt/wBf7YzA/kuLGnMeyYHJPPT+uJpkHudW/n/bCtuMPiP+NVPLBYH8lmBg0TX/AA9up+/+2L8vlGUkyCYO94kQfuwgPF37/j/XEf8AF38vv/rjdm/ktwt4I/jSw0k3IH3AAfdip6g/H9ffj3h3F3BPKCT/ADoot5uCMMzxZ4HKpn/89CxvAnTewnGOc5sCPVMbBzQ/C35nHdSP/UwX88H5CoGp0UJAlWKt/CytEz/CRAPaFP2cQp8WbWAQApYXNajET80AC3W2K6fHnhJAkpVJ23QOegvsNsJfjdp68iigJm1cisyk6mjTpqRAIamNMAiImN9vfDXJZFM0DT1LSMDSSSOcUwItAJbeTvPc4z7cSqVqa6BNVVBKyBqSSoYHuhEH+WD9k4qyHFmQzU6ypVYYkMBMTytKmIB64ymwkidFNUDQM+/NL8hnCp2MiDfcEGCI9zhrks7SNWopUQNZE6YJbSRaCCRcja4nCfOVf3rmDLEsJPR7wbnueuKss58YiQCRvJ7G35YeWyCkkgtgId201Dp6MY/Efdjd/wDZ5xCEzA0q7VGpiGiAF13uRtqEb4+fVnlyfPp5CMar4aqMA1MGQ1iu0kQZUnY/MPT7urOwslZVdDJTXitN6eaNbwTUWoBrVRJBF0I032K+Vj5Td8R8YyjUIoNPhosAnSdVmshJM6t5jaxsMHeLCojUyAWSLxqKnWnMflC8oAHYWuce/FaUczTuACgWCAJ2M3gnve3rGIjWpggX0ySGuBzSTjY1ZZnkkq6Ag3mTp1d9UECewwBSa5vG20+eGmTR6mRclR/lbWmUiI9wBb3whzCtNv19x88U0o2ThzHsVou9vQ+4Rma4Q0pSIUsqq0/Mo0iZgGGEW3698KszWVqaUjTAqBn1LLBVXUdIF7n5F8gAe+G9bMuG1QACIAJsVIIGq563vthXWmuVJGt4NwBaCWiRFt7foYXvbhB4BLpPiRzSnNO5GhmLBJ37kgGT9qABc4bfBGtVlW0ln1gktcJymI6zIkSROF/FKpCsSIYiIgyNO8g7HaR3wy+F8sGpyNQ07dTzhoJGwDGQOtjjnn+mqnyKYC3T5mq4AzCBqZMciGRYKjBivlGk2vsDGMhxvwa1SE0qiLAQg80TtaAbgC4uZ2NrsvVrMFqFhyXAuGaCrS0b3IG/S/cicP4koGkIULc3iKBMX0iCYUWBnsIiL4WwE3JukAuN1Xw/h9OmamZo6m8BeVIJBqsP3WmwYlTqMbjQN5vRnaBYsIaAa6sVWTP7PQXa0k3tN8a3N1PAIUWKg1X2BDuUU7R8qkLYiCG7yFwMDMjwmctXqaYcr8vhjfSZkqReNjhLKpccfl07v+69BhIbGuqzmTV2b/x2iWP/AAiDUBciZNyAcW0PG52/4s7D/IAJmTIvJ+WP+bDPiGUDuT4boGtauoWx1BoKC5kr2ER3wFxDg6IpRVDgQ18woJLRIAI6QpvFj7YfiBMW9E4Hu6ScWrVNIVvHveKyaZjqL3wpAwy4hl0VlCBltzKSGAb+VgTqBGm9vfALU4MYrZkhK33wuNWWoyJGu8nszJAG3bGe+I6Q8amR9pFJ9ZIP4YffDeXK5ZCINgRNrtUZo2uOnvhTxjLg1NTMOQRA63PX8cR0yNq66AkAyhMkYZwT0Tr/ADpH3kYM4bVCqxIYkOwBB2iT+LHqMMPhPgC5oZtzU0GgiuwiZALOIttKQTPXbrgfN5I5evoU+IrrqYRFyzhgLdCCPO/kcUPyhZbJZzPqRUb1/uPuxUWw+41w792mYjTqc09JnoJBiIvzCx+z54UNQHUEi1l3vtGDa8QjGSHBHlj0H0w74lwJKWXpVpqTVVzDRA0NoAjSLlvPHcN4TSfLiofFNTXUkLGnSiqR0JknVfaI7HGioCJCDaCJSWfTEHIxtV+FsuKy0W8QNEsxYQPlBgBbxJO/YTucK87wWkKdUgMCiFgS3VRMG0Ena3ntF9FVsodq1Z2cSXE8hR1lgZsjt/6QT+WJpTt+v10wwuhGvKdc6hcG/VQ0ecGx9Dh9lKbOAArkEjSf2KnpBJHNZrwAf0IwuoZVHqAKuhbaiSTtuff+nmcOM9SoCoUppTdWgM71uYEQDdnmT2Ee0iUVTOS4PAdhVWYyT3lHldyclTMxpUKIbpB9vaZ5XJSU1K4/zR/lBBzoALKSNib2HniuppnWKdOepGZUQeYKBzWsJEHt2xxApuGUJAiD+1JBjexj9RhUmI+yNwKLqKaTUHpxqSnUCmNyq1XEjYgxcefY47iVKKlOoda06pmWktSYFS9MmLALdZBMCejYbcQ4fSoplAWJc1H0jTBakyOrEjUbg6IuAdRiLnC5+J0YEBly9RnpsCdTAcpV5kyy6j/qBYWBxhBaZHeamI3YKQcSzAdgwJJMySANjAgCw5dNhsZwO1mUzJZZ95PcX+/+jDjPDmohkJEAqwC3UgqBrB66hB6b9cLNU6b7SPz/ADOKWOBEhCy6nTq852NyBjU0K7UqJqIvNpN42AY6rxAix367jGQYS7R3P44c0a9RgaKAtqkkTZRYSegH0/DC6zMUIaokBbbL5rx9C65ZW3diLNAIExqNvtE+WDs9kqdRCaQLuQRpmTCrygQQEgDp5XnGZyebCWPzErIYza89dIsINxECeuNhkviACmAEp8yGbzY36GAbkxPXvjzYDHb0xopAYs5IPhv/ACzReCys8TfctMRvYge+M0+Y0sd9hsAf1/fGk4HxBamYzBUAa31COmpEDAe4Jt2xlM3Aa/WOg7X6+mL6UYX9R8pjf1B0PwiatRWVDJYApZgBMRaJIi/TzxdWzq6yVEki7ASNMCNwSDG56+uK8xl2RQlRYMmRDDTIYWm5v9fPFf7QqI7ArOhtMlpn5QIBi12kAn0xlVoJb0CXSAIPUpTxmsGp64+YlgNiAYiR3gA+5w64JlYy1UhmITTIUWccsjURYwvLM7di0puNL+7QwQNMAb2jv7ffvvh1lswxp06aPoJ7O4Gozcj5QTe4HpA2FxhghV1TDWgIrhlEousFip0ql5OkMQ3qAAgiP/EEbThxkKVPUajCaeWTWbAXEgJ3Iab+4mN0OTpMq1UWNSEjmIsCwnSZInVqO/cXw4p5ZqGXalIWqyNVqd1Glloi5tHM9+/0j8QTGEHP219PVLY2XycgqKq+ODrrAaqWo+RaqGZpsBMAbjp2wub/ADaxSnRJeqxBNZee5Ia1Ub9owZUyrGm0KaiihTUBA9zqVt4na4G/eMLclkWlmGSfULgP4tyAW6gTtHqRgqVgT3pzCqYJz1+/QorIqoclUywgACKocst3IP74CQZuR9wxChX0VDUUZUsWi1UGQogEDx4JPoDgmjQdFOjK/YNitUbm6kF72LQPLFL02pUxqoKonm0ltQEiCCahE+x7bXx2IE+nd017AA48vaOSQ8aA8WdATVBKi17zb7NxthPUGG3Ea5qMCYGkBQAIgAkgR7nC7Mi+LqdhC6nOAErZ8FrH9mRT/Ch9gzxH0OKK2cUq9M01dGZGJ080BwDpboDMEAXv2x3Bqg8Gn3Av1MBaZA8gSZxGvR1JUKrMtSRSJBBcsy2i4Oj1Fu9pQBjPVAcl3wzm/wBnzNdZjxaTUwBBALqzKL2YWi/fAXxPRCVwFJIgGTAJ1MzTaQN9h2GKM1RdKkk8w0tvNxMXxZx9C1RbyxVQCYnc/S0YoBOIXXZOChneJ1XpChLaA6sQCb9BI3Jv+GI5BlFQMwkc1p66Tp3Bi8dME55zTLMgWNKqXUk7GJk3kk36bYp4dUXxE1AlQZMb2FsZMCwTD9JTT40MZPICIJWtfaVFQRbtN/rg34XpUqfgq4qlv3bmmCFGkw+qTBJ8QGAZEFYIjC7/ALQM8lSrRpUyWTL0VpSQQSw+ex8xv1ubzhlSzOl20OWmlSpgH7P+bPWbXaIi99rgHmnTH7+/5U9U4GhGcTK5uu9SmzUkqCtpYwIXTTAaAbzov6iTjIZfMaVrZerJdFqBSt5sZk7kRJ22PSMOuVf2ceISNJmIXSdDg36iAL/0wDxfgzVaK11EHS9QyfsgwidwYUwLSbYIVATva/dA1wJgpH8OUQ9V1YkDwqtwCbhGK2G8kAe+Lkyx8E1T/GqfVWaf/aPfHfCtcpXJBglGHlzQL+xONlVy9Fcu2Xn5tQW5syAMJEz82vyJ1HfBeJr7NwEZ9lNfUDDdZuiuikxUS+gux5SAuhXEiLEEkEza2x32lT4YpeFTzJ0j9ySrJBDVArk1NMfbJUSQTCKSQb4xlR2Sk6aYJoQ4IiJYFRaLmQb9d8aSrmqn7PRXkE0tgRzcqiYuNV/4TvbGPe4C2qSXwZSWpVVWu1EKQDzZd5L6YtFLo5YA9o8wYU6i8yF8tq+QfuTCgEs8nwojfyuTOLM1nKhbR4iKqsNOukGsdrik0XMC42M4or5k7jM0RACu3gXLNqJP+TeR/fCwO+wrcwQraWdarVpF69JoqLEI4O4XTPhjsBBMWGAMnpbKgSBFSLj+WmLEbWU7+fUTgjN5ozqp5pFW+mKJHy9fkF/TrMYlXRTl9QYMS66iBpJJV7x3t26YMWv3ryCnq5R37pjm0NdKmXjmSDSn7SsNZpf6hLMnY6h1xjlgqI77+V/7Y0tMfv6ZkgstHa1yiXJPURIjt9V/FUFWicykKxYCug2Woftjsr3P+qR1AxtB2CG6GPM/f36om3lK6T8xPnP340fCGg60XVUBAt2IMCB5ge8Yy6G/th/wiuwmOhTfrO33wPph1bJJrfQU1yLqdbsqrFQXDAfMtTUACSDNvSBAucO6VKh4NRqnLKoAwiA09rCDabSIB7wkswIYgc06rREQSZIlrC3UE98Qyte5JqEgQoIEA9F84sOv94XEk4goHPyKJ4FURc2UpsWVlHMQBJUkEgSbX9wfXCbNVQr3LCwNgPPv7fTyw54jmwM5SYBOZWFzzEkIZcibzJHl071cV4ezUqDoRJDqQTGzEg7eZ+mKaTgKZcdY/kqGXe2OB+ELmc94KOQfEgFJ7agO++lj93vhPXrhk06JKqTPYWJJBEmBHb7sMOKUgKSBFMEqb9S8sT6SYn8MBGiSDq02XTtcyGHr0n0wx4aMJ5BZTADSeZXcZq6gF0xESANyevr+r4bLkmbSCCTtAUtqUzJsZiQRA8xvhFmswXf5QNdRVA6CCB+BEn88aXOuytpU84dx35QINwZZdQAJAIsPTE9SWhoCfXMFoVvD+HOM2KdQgLoNSswKkClTIqMZUkESxUT3GLs5nzVq1q5kA5dXIBjT4oGm/cCRM4GyebY1syI0p+yVS62klIADMZI2I7H64M8OrrrNISn4FEqCUAlgsCGIRVlXEEQJ2OxkfepLs4+RPn8JrG7g5/lK+J6G8PV4sGmhCoqGP3a3LPUEj1HQxgall8uEC/vG1sGU6VW6yCvM8fa3+/DykzVHJatQYKoIpoaBbboZhVEgSSbRY9RHqZhiwp5ikZ0FQtSjbULgQT12w0OIAE+v4TaQkkwfL8qiqmXNOmrJU5hIJZV+XWCLKbkNiylVpslNlVlWWmSH1C0iNAuSB9+2C6Yrs2r9rUppWdL7MQoIGkbTqwP4L1EXxKniOgfn8QxMqLMYiI8rjC2uuL+vVFXEUyeAj2WczlNASqNIER5QSY9cB5gfr6YN4nlyr2IJAie+/Xr64GJ1ieo6YvHFCwnCE7+HssSgB+2WIA7co/EDGl4XkQi1r/8AkuJEkFKujtf5zv5YX5Claiqif3FIt6uarEesaB9MN0pNDEzATSVBEt++oACJ0yC1t7dcR1HHGRK7RZv4jhChMklb2jYkR9MLeL1ta0AJU84J1bQ2j22J9zg7j9fxKbEAwlQbiI8QWFjtyN+jhNTXVV0RI1mPK9/9sUURDZKwXvwR+dyA0sKZLQilhB2kSQR+jirLPohxHKfr+r4nxHNVApF1EhSQT1mRuQZE/U98eNR5dwZGxPmN7445CU1osocbbVmnN7lOv8qD64f5Jh+1aQgYFFGxOosWMmLzPQgdjjJUSxdSdyw3723w+p5gUCtSptUpMLqDZmWCQQfsg9Zv7Y6oyRCk8Q0mAOCuzpqeIilWLPUbUCsR/mBwJiJWbWgYs4hnXrGoTAEAAQYMKWBjsNXoCSfRPxfOkOoXUIYtJNxy6SPpt69cCCvUqkUEsGImTuT1Ldpx2zkAlLDC5oOiY/DlKjSFOpU1FzLaRsRcKD3HLrNxt2wXxHjANaqVEaWDIBuCJWfO3Q9Tiv8AwvWAHYh6Q8FNIMu0HQdvljTHmd7XK4dwWHSnUUU2Rg1SrPeBAkxLEyCBtffdFR1MuL3GT8Z99Ut7g4mV3xJlG/ZRWZr1KlNSu5Qgct9tRGvV1uo6HFGbK06aE3YuyliQIC8gAAJA23PnFrYZcH4osPQrgOGeCyjZgzEkWkAANfznGb+IswGaIWNRuux0yCR6k+XTBeHLv03DL2/CJgBIamr55QTSkAtobmUMp69QbCAfUfWBQwA1XKBQurSyUoLEEKY8MEC8fX0wFmEl1a0eGvUTte28bD3PbB1dKRKA5UuwAlldgDIG8KZNgN8ZkBHDl8q8EA24/lQqLGoPXylgAgNOnafSlbe3SwtjtFRVh6uWg9CkaotbTSGwJEjaTcEjBNMioUqfsX7wu2kF3iRBEmwEk9bWxSuXBRD+x9jBNa2o3tqvEdYtG2Na7iP+v3QPEiZy6/ZTqvprUWEEFUAEyCCWQEEmeUwb9/OMLeHVxTr5qQXpgPqSfnTWJE2vBkG1wDbBtYMVDeC1PwwOjwVVtUEsx2N+s+2F2cphc1mlBkGlVvtfRqI9iCPbBtggjl7FLpEYrKjjnDvBdIOpagL06nR0MaT67gjoQcE5GNN7EQCQLi0qdx9cX8BpmvQOWciQQ2XZvsu2rknolQiP9Wk4O4bl9FUTIAVNaxeF5GECLhrdOt+mCdVsWOzHrz71WVhuSEsavFtZ7kztPr19v7MajAw1KxgF4GoEzOzfo+mB8nTVmUaoAAknZiraZkkgCSJ6bbycMOIJTpVAFcPqIEqswbW+aWJ9o29FVImAvPqNg2S/iikClXLpqNUDwohgInUZHykW7bY3fwvw5KtEaosSOZZ6m4+4e2PmnGEAVAH1Q8aSLj5rxeRYeePqHwa6ik0jr0gd9+/TD3//AD34j5RyQ5pHA+4WBXORTDlCFa0NJ5bhTfoVAwfmMuFysJRBD1HHiwJPNqVNieVVRIJFwd4wRx4UqjzTHhoEW1NgYCrpgmIELEi8R9Kv2ceAEAdUo030Tp+z9rSGJDFt4EEke4+IqjcA5LqT24iAdViq6wygkghhMjrMfQHGn4hnGcGoWWmaakCHCnUWJIVQS110b7fQDNZ+iTWRDuxUWvuQLDr6egxqq/wpTYoPGMlh4hJMCBcRBOq0RMedowVZzBhLlTWItKp+C8w2rN1Zl/2cka4OptS6Z1Wa0i+D8znKRr16brVYuKasUVQqhAryTve4NttsNuHZOlQo5xRTDL4ZJWCNUuFCkFvIbx7YW16tT9rrBcsIGsCr+zAzKaRL7spJgwLrI6Y8/G19VxHvGWEhOaQWA96oYJQUGsorMq1JZQ6bqw+YaPlEggTsbdcUcM/ZVqvopV2KjUAKqaeRgbfu9vyOH/B8nULoPBpLRIbxYyygkLdYBSxJsJB7zipBmB4jJlEXS5QTlFlkjb5Ljb1vjjUmR8p1KxaB1Q1TNZdCKQp1x4gDECtTiA2oT+6P2iP1OBc+k0zUpaQUmEEwwJAcSftCBfqSY3EXZutmIpE5Wmq6F1EZSmCnkGCDREfh3wISB4UkqpeqpIP8TGB5THS+CptuI+/FdVO4496JZmQrQQbFQRJ3kH6CZHqMLag0uW79PqMMc/lTSYJ0IDAHdQxXl9ASwHcQcLsyO36iMXMWNjZgBaD4fzd2uYAUi+wXkjyiRbDnMZhhrj7SiDtzeNRJ7AWGMvwvMFfE07lJHcc6kkecAnB+crl6COy/aW/pafPVv9MJfT35WBV5qZrCJ1Aagp6GorAx/wBO/facAZHUMwSFk6zeDa87AGfLDvh+eIp1EBgliSJ3/wAoLY9QSx2v1nTGFNcCnVJqWleWwE2ifMWF+/1BsNiEtjt8hXZum70apleUq0AHUQIBJm/2tzvF8DM/L7jfp1w2yNalUy1anpKEQddQwiagFWSJN2g7dOmFNO63/DsMaOYT2ZIPLUy0EC8iPfaMWcUfWC1gAtNVv5sbCf4dM7Y6hWKLqmw0mPQg4rNEVcxoSFUtvsBeJ7RsJw0ZylvG8CdFVmKr5hwLWFh6AdtzYYL4TW0lXU3DC0EzMg/Lfab4LalTBYsdLL/kFWbmVSEIkLGwmdMntijhdTRVY2UEn7V97ARc9rC/ljnXbACRUILSAMlZriopRwxXUGCkKoHyhgWsSQZt595xOvxmuArOf3YYgGxEgiwva4nYbdYtS3CatRmYoqOpJlSW1SbREqB7A+WGGQyOaepDq6rYFvBqPBk7ak5oME80X3wpzWxJgwk7OyKT4hdqC/u6CIKp1ELzLMlTZRcQxkTYRG2M3n637RVEBU1QOgHmT0A3Jxo83w7M+FVonw2/eBi+tF1xqMyzC6z17kYU8JyrU3LkCQdI0sGv1goSOw36/QabWMBc0dlPtTaXnPJX5un8gEQq6ZMTbUBeY+lt8S8VxWBWq1KQokM4k6QCDoBPRenX6E1EJZHAUDWBYyQSxKhbgkb3joLjBOcqmoKIKhS1WQ+1nLAgnqFInrEnuZViEeYTw6BPOfRV5Su6OlSrxFSoUEKauYhrdR4cET1xW9Qq9R34iNLg6AHzBA1XEjw4BAO3THtQ5ZaqUWo7jSrGsQOWItp9P74oq5+k6szZQjTURY8Y7xAJ5QRAUdDgAyTYH/imB4cM/wDwq9lZuUZ0ElSwvXMz/wDrBn+W5wvqqrZ0MjB1q06hkAgcy1REMAe3TecNeH8RpNqc5ZUZWCyKrEyLAHaI0/d74DOaoLmqCLSUFuUMKj2lmtBsdz9cE0kSIMweHDkpWENq4JHqk/CazeBWnZfDjyiogP442TVadRRWePEPJU7kiCtQXEkqhUiReCdzjGfDtfVTrDceGW9wyN+WNTkqyrltRUn94BaDBZNxYxddt79JnBeKEOnWfcD7I6v6TkDxDLhmJRIRUMAJpJAl4KjrYiesHA/DUqlwNKwxUHWvQ2mSJi5E/wBMPOEg1KlMlh4ZfSwJErr5Huel58hO+FeupTGoEAkgGGkbxaegM+Vj544PkYQvLdUxBKeJ0mChmEgVAASN5DH8u198bzgOZCqwLKL2uZ69gf164yvxENVLXI0tVUz9rVobXtIsR3mGHlDnhzVF1aNVzNoHl1Ze2KCcXhiTxHymM3nN6H4Q9LOQS5gmCJiQWncg/wBN43ucU1OJHRUAVZYBQQAI5g7SO0LA338hjsdhb2NLmdAkeDG/5rNcQcDMlzcIylvYywH34+kV+N0kQpTpEvK8zEHqTMMCCZNiRaMdjsL8U2QzvgqvGOLcIHP4XmT4hroZt0Y02C0+bYr+8J3UTt5bk9MLErZogMrVChPWq0xbu2942jyx2Ox5xhjn211/xCVUc5rWQdP5FVV8zmKdWqBWqtNQAAvaRzaRJhBcCw+6ce5+vWR0PjVDrp6iC7WgqLAGJ7nrOPcdihsWsLj4XoUqjjXffUe6DrZtyqh6jsulTJdjzQYsZm+847O0FqKimZklTMXBG9jjsdjfpII7sue44KpnKPhLs8twCTskSZjnNp7W/HAGZpHQWA5QQs+bSRY3vpb6fXsdi5mQTaX6QRfDtJcT1WAO+pWWPv62M9IuRnqpKGIggGB67H39cdjsa4XCFOuB8PLU2r6AypUTrDfZYQZ+vXf3R/EuXK1oho8JSNRBNzE7m3vN8djsIpuO3I70SsIFVXcEJajWpMrEEpI1WHPJI85AA9Thbl2tPmfugY7HYo496KlmZV2WoByqMLG354Y0uGJQAZHlyx1BhsBGkAixm/TofLHuOwlzjiw6IK7Q4QV41CW1vAidgYvFibntcThBxNYcyDIMkEjfUJ9frjsdhtLNI8M0B56K4srJV5RMjvI+X8YP3Ynn1hLqLyZk30gmfLpjsdjciO9F6Wh71ViUwNR0idREeiER9ZwwyaAggjYtIGwtCnvcn+sxfsdhb7hS+LANIq3PPLKSAQKiT9PlPtIPS1rRiDVJ8JAqiHqEQLjYRe2kQIv3x7jsTDLvmkn6P9v8VTmczmEq0xQdtTMRAIAYgTcHljfDtKPFGqKSzBC3NpNPY7HeZ9Oo7Y7HYl8VX2bWw0HPMcyqaAljTOg9gvKuS4uWXS9QAzIDppB6fa1R9T64hxjKcXJHhGqRB1AVUAmBHzVNt8eY7EjPHOxjcb5Jhp3Bk+aUVMhnUqPUzStehVUOzq0wjEfKxO84YcMqBqFVYmChE3idQ9/Pyn0x2Ox6ZqF9MOIAyy6pFYf03dD7KqjQqBlhILEaACBYxBsbWnqIN77YI/7vZuuwKU+QlR86jeGJ87TffyOOx2B2xBmF5FJgc5K/irh1SihpusAVljm1KIWpAmxMi8lRteMMaJKydJhtiGImJB2b06DHY7Ho0HY/DSdSPYpgEPaP8vcL/9k=",
		hours: "10am–8pm"
	}
];

const religiousItems: ReligiousItem[] = [
	{
		name: "Hanuman Setu Mandir",
		faith: "Hindu",
		area: "Near Lucknow University",
		visitInfo: "Morning–late evening · Footwear outside",
		image: "https://temple.yatradham.org/public/Product/temple/temple_cLLnKb5m_202409061629010.jpg",
		history: "Popular riverside temple; Tuesday-Saturday heavy footfall."
	},
	{
		name: "Asafi Masjid",
		faith: "Islam",
		area: "Bara Imambara complex",
		visitInfo: "Prayer times; respectful attire",
		image: "https://lucknow.me/lucknow/wp-content/uploads/2013/08/SOH7.jpg",
		history: "1770s mosque within Imambara precinct; Mughal-Awadhi arches."
	},
	{
		name: "Shah Najaf Imambara",
		faith: "Islam (Shia)",
		area: "Gomti riverbank",
		visitInfo: "6am–8pm; modest dress",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb9LuWwq61wTKh9ueM0xAUeFbUYyDnGnzslQ&s",
		history: "Mausoleum of Ghazi-ud-Din Haider; onion domes, silver tomb."
	},
	{
		name: "St. Joseph's Cathedral",
		faith: "Christian",
		area: "Hazratganj",
		visitInfo: "Daytime visits; Sunday mass",
		image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/CathedralSchoolLucknow.jpg",
		history: "Victorian-era cathedral; stained glass and spire."
	},
	{
		name: "Gurudwara Yahiyaganj",
		faith: "Sikh",
		area: "Yahiyaganj",
		visitInfo: "Head covering required; langar",
		image: "https://www.tourmyindia.com/socialimg/gurudwara-yahiyaganj-lucknow.jpg",
		history: "Historic gurudwara serving daily langar; community hub."
	}
];

const festivalItems: FestivalItem[] = [
	
	{
    name: "Bada Mangal",
    month: "May–June (Jyeshtha month)",
    areas: "Aliganj Hanuman Temple, Aminabad, Charbagh, Chowk",
    highlights: "Massive Hanuman temple fairs, free bhandaras, cultural rituals",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKz-uSyD0yRVukF80JtxctIG9_yQkRq90lpA&s",
		history: "A unique Lucknow tradition where devotees organize large-scale community feasts (bhandaras) every Tuesday of Jyeshtha, symbolizing communal harmony and devotion to Lord Hanuman."
	},

	{
		name: "Holi in Chowk",
		month: "March",
		areas: "Old Lucknow lanes",
		highlights: "Gulal, dhol, street sweets",
		image: "https://static.wixstatic.com/media/70da2c_b12ba7dd0eca4ae5bb9771ba04d4da67~mv2.jpg/v1/fill/w_568,h_380,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/70da2c_b12ba7dd0eca4ae5bb9771ba04d4da67~mv2.jpg",
		history: "Community Holi with sweets like gujiya and thandai."
	},
	{
		name: "Diwali at Hazratganj",
		month: "Oct–Nov",
		areas: "Hazratganj, Gomti riverfront",
		highlights: "Lighting, shopping rush, sweets",
		image: "https://static.newstrack.com/h-upload/2025/10/19/1938610-lucknoe-deewali.webp",
		history: "City-wide illumination and festive bazaars."
	},
	{
		name: "Eid Bazaars",
		month: "Ramadan end",
		areas: "Chowk, Aminabad",
		highlights: "Sewai, kebabs, new clothes shopping",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCwVU7-ppEHRvninUGECN8c-rusesq7Agrbw&s",
		history: "Night markets leading up to Eid celebrations."

	},
	{
		name: "Muharram Processions",
		month: "Islamic Muharram",
		areas: "Husainabad, Chowk",
		highlights: "Tazia processions, marsiya recitals",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3LrNtUKrrE7bDEU_o-6wgOLTRzzDCrSZs3A&s",
		history: "Shia commemorations integral to Lucknow’s culture."
	},
];

const destinations: Destination[] = [
	{
		name: "Bara Imambara",
		area: "Husainabad",
		category: "Monument",
		highlights: "Bhool Bhulaiyaa, Asafi mosque, stepwell",
		routes: [
			"Metro: CCS Airport → KD Singh → e-rickshaw to Imambara",
			"Auto: Charbagh station → Imambara gate (~20 min)",
			"Walk: Rumi Darwaza → Imambara (5–7 min)"
		]
	},
	{
		name: "Rumi Darwaza",
		area: "Husainabad",
		category: "Monument",
		highlights: "18th c. gateway, photo spot",
		routes: [
			"Metro: CCS → KD Singh → cab/auto to Rumi",
			"Cycle/foot: from Imambara complex (5 min)"
		]
	},
	{
		name: "Hazratganj",
		area: "Central",
		category: "Street",
		highlights: "Arcades, cafés, shopping",
		routes: [
			"Metro: Any line → Hazratganj station → exit 3",
			"Auto: Charbagh → Hazratganj (15–18 min)",
			"Walk: Hazratganj crossing → Cappuccino Blast side (8–10 min)"
		]
	},
	{
		name: "Chowk",
		area: "Old Lucknow",
		category: "Street",
		highlights: "Itar, zardozi, kebabs",
		routes: [
			"Auto: Charbagh → Chowk (20–25 min)",
			"Bus: Charbagh → Medical College stop → walk 10 min",
			"Cab: Hazratganj → Chowk (off-peak 15 min)"
		]
	},
	{
		name: "Aminabad",
		area: "Old city",
		category: "Street",
		highlights: "Textiles, food lanes, jewelry",
		routes: [
			"Auto: Charbagh → Aminabad (12–15 min)",
			"Walk: Aminabad parking → Tunday (6–8 min)",
			"Cab: Hazratganj → Aminabad (10–12 min)"
		]
	},
	{
		name: "Janeshwar Mishra Park",
		area: "Gomti Nagar",
		category: "Park",
		highlights: "Lakes, cycling, jogging",
		routes: [
			"Cab/auto: Gomti Nagar Vishal Khand gate",
			"Bus: Pickup Bharatiya Vidya Bhavan stop → walk 8 min"
		]
	},
	{
		name: "Hanuman Setu Mandir",
		area: "University",
		category: "Religious",
		highlights: "Riverfront temple, evening aarti",
		routes: [
			"Metro: KD Singh → walk/auto 6–8 min",
			"Auto: Hazratganj → Setu (6–10 min)"
		]
	},
	{
		name: "Lucknow Mahotsav",
		area: "Smriti Upvan",
		category: "Festival",
		highlights: "Crafts, food, folk shows",
		routes: [
			"Cab/auto: Smriti Upvan gate (winter fair)",
			"Bus: Alambagh depot → Smriti Upvan stop"
		]
	}
];

const Lucknow: React.FC = () => {
	const navigate = useNavigate();
	const [heroIndex, setHeroIndex] = React.useState(0);
	const [activeSection, setActiveSection] = React.useState<Section | null>(null);
	const [expandedFood, setExpandedFood] = React.useState<FoodItem | null>(null);
	const [expandedStreet, setExpandedStreet] = React.useState<StreetItem | null>(null);
	const [expandedMonument, setExpandedMonument] = React.useState<MonumentItem | null>(null);
	const [expandedPark, setExpandedPark] = React.useState<ParkItem | null>(null);
	const [expandedReligious, setExpandedReligious] = React.useState<ReligiousItem | null>(null);
	const [expandedFestival, setExpandedFestival] = React.useState<FestivalItem | null>(null);
	const [destinationQuery, setDestinationQuery] = React.useState("");
	const [originInput, setOriginInput] = React.useState("Charbagh, Lucknow");
	const [destinationInput, setDestinationInput] = React.useState("");
	const [travelMode, setTravelMode] = React.useState<"driving" | "walking" | "bicycling" | "transit">("driving");
	const [arrivalDate, setArrivalDate] = React.useState("2025-12-12");
	const [departureDate, setDepartureDate] = React.useState("2025-12-16");
	const [groupSize, setGroupSize] = React.useState(2);
	const [budgetStyle, setBudgetStyle] = React.useState<"low" | "medium" | "high">("medium");
	const [selectedInterests, setSelectedInterests] = React.useState<Set<string>>(new Set(["Food", "History", "Shopping"]));
	const [arrivalPoint, setArrivalPoint] = React.useState<CityEntryOption["id"]>("charbagh");
	const [innerCityTarget, setInnerCityTarget] = React.useState<CityTargetOption["id"]>("hazratganj");
	const [showItinerary, setShowItinerary] = React.useState(false);
	const [openDayId, setOpenDayId] = React.useState<string | null>(null);
	const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

	const destinationResults = React.useMemo(() => {
		const q = destinationQuery.trim().toLowerCase();
		if (!q) return destinations.slice(0, 6);
		return destinations.filter((d) =>
			d.name.toLowerCase().includes(q) ||
			d.area.toLowerCase().includes(q) ||
			d.category.toLowerCase().includes(q) ||
			d.highlights.toLowerCase().includes(q)
		).slice(0, 6);
	}, [destinationQuery]);

	const mapsEmbedUrl = React.useMemo(() => {
		if (!googleMapsKey || !originInput.trim() || !destinationInput.trim()) return null;
		const origin = encodeURIComponent(originInput.trim());
		const dest = encodeURIComponent(destinationInput.trim());
		const mode = encodeURIComponent(travelMode);
		return `https://www.google.com/maps/embed/v1/directions?key=${googleMapsKey}&origin=${origin}&destination=${dest}&mode=${mode}`;
	}, [googleMapsKey, originInput, destinationInput, travelMode]);

	const mapsLink = React.useMemo(() => {
		if (!originInput.trim() && !destinationInput.trim()) return null;
		const params = new URLSearchParams({ api: "1" });
		if (originInput.trim()) params.append("origin", originInput.trim());
		if (destinationInput.trim()) params.append("destination", destinationInput.trim());
		if (travelMode) params.append("travelmode", travelMode);
		return `https://www.google.com/maps/dir/?${params.toString()}`;
	}, [originInput, destinationInput, travelMode]);

	const fallbackEmbedUrl = React.useMemo(() => {
		if (googleMapsKey) return null;
		const origin = originInput.trim();
		const dest = destinationInput.trim();
		const query = origin && dest ? `${origin} to ${dest}` : dest || origin || "Lucknow";
		return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
	}, [googleMapsKey, originInput, destinationInput]);

	const tripLengthDays = React.useMemo(() => {
		const start = new Date(arrivalDate);
		const end = new Date(departureDate);
		if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
		const diff = Math.max(0, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
		return diff || 0;
	}, [arrivalDate, departureDate]);

	const formatDateLabel = React.useCallback((value: string) => {
		const parsed = new Date(value);
		if (Number.isNaN(parsed.getTime())) return value;
		return parsed.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
	}, []);

	const dateRangeLabel = React.useMemo(() => {
		if (!arrivalDate || !departureDate) return "Set your dates";
		const range = `${formatDateLabel(arrivalDate)} to ${formatDateLabel(departureDate)}`;
		return `${range} (${tripLengthDays || 1} days)`;
	}, [arrivalDate, departureDate, formatDateLabel, tripLengthDays]);

	const budgetPerDay = 3000;
	const totalBudget = React.useMemo(() => (tripLengthDays > 0 ? tripLengthDays * budgetPerDay : budgetPerDay), [tripLengthDays]);

	const toggleInterest = (interest: string) => {
		setSelectedInterests((prev) => {
			const next = new Set(prev);
			if (next.has(interest)) {
				next.delete(interest);
			} else {
				next.add(interest);
			}
			return new Set(next);
		});
	};

	const selectedInterestList = React.useMemo(() => {
		const list = Array.from(selectedInterests);
		return list.length ? list.join(", ") : "Food, History, Shopping";
	}, [selectedInterests]);

	const activeArrival = React.useMemo(() => cityEntryOptions.find((opt) => opt.id === arrivalPoint), [arrivalPoint]);
	const activeTarget = React.useMemo(() => cityTargetOptions.find((opt) => opt.id === innerCityTarget), [innerCityTarget]);

	const activeRoutePlan: CityRoutePlan = React.useMemo(() => {
		const presetKey = activeArrival && activeTarget ? `${activeArrival.id}-${activeTarget.id}` : "";
		const preset = presetKey ? cityRoutePresets[presetKey] : undefined;
		const fallbackStops = [activeArrival?.name, ...(activeTarget?.stops || []), activeTarget?.name].filter(Boolean) as string[];
		return {
			summary: preset?.summary || `${activeArrival?.name || "Start"} → ${activeTarget?.name || "Destination"}`,
			note: preset?.note || activeTarget?.category,
			stops: preset?.stops || fallbackStops,
		};
	}, [activeArrival, activeTarget]);

	const itineraryCopyText = React.useMemo(() => {
		const parts = itineraryDays.map((day) => {
			const stops = day.stops.map((stop) => `- ${stop.time} ${stop.title} (${stop.cost})`).join("\n");
			return `${day.title} | ${day.summary} | ${day.stats}\n${stops}`;
		});
		return `Lucknow itinerary (${dateRangeLabel})\nInterests: ${selectedInterestList}\nBudget style: ${budgetStyle}\nTrip length: ${tripLengthDays || 1} days\n${parts.join("\n\n")}`;
	}, [budgetStyle, dateRangeLabel, selectedInterestList, tripLengthDays]);

	React.useEffect(() => {
		if (activeArrival?.mapsQuery) {
			setOriginInput(activeArrival.mapsQuery);
		}
		if (activeTarget?.mapsQuery) {
			setDestinationInput(activeTarget.mapsQuery);
		}
	}, [activeArrival, activeTarget]);

	const whatsappRouteLink = "https://www.google.com/maps/dir/?api=1&origin=Lucknow%20Junction%20Railway%20Station&destination=The%20Drowning%20Street%20Lucknow&waypoints=Tunday%20Kababi%20Aminabad%20Lucknow|Bara%20Imambara|The%20Idly%20Room%20Lucknow|Hazratganj%20Market|Rumi%20Darwaza|Aminabad%20Market|Raheem%20Hotel%20Lucknow|Chota%20Imambara|Idrees%20Biryani|Janeshwar%20Mishra%20Park|State%20Museum%20Lucknow|Royal%20Cafe%20Lucknow|Sharma%20Ji%20Ki%20Chai|The%20Residency%20Lucknow|The%20Idly%20Room%20Lucknow|Chowk%20Lucknow|Gomti%20Riverfront%20Park|Marine%20Drive%20Lucknow|Tunday%20Kababi%20Aminabad%20Lucknow|Residency%20Lucknow%20Interpretation%20Centre|The%20Idly%20Room%20Lucknow|Capoor%20and%20Sons%20Hazratganj|Prakash%20Kulfi%20Lucknow|The%20Urban%20Terrace%20Lucknow|Tunday%20Kababi%20Aminabad%20Lucknow|Dilkusha%20Kothi|The%20Idly%20Room%20Lucknow|Avadh%20Shilpgram%20Lucknow|Hazratganj%20Market&travelmode=driving";

	React.useEffect(() => {
		const id = setInterval(() => {
			setHeroIndex((prev) => (prev + 1) % heroSlides.length);
		}, 6500);
		return () => clearInterval(id);
	}, []);

	return (
		<>
		<section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
			{/* Hero with sliding banners */}
			<div className="relative h-[56vh] w-full overflow-hidden rounded-b-[3rem] shadow-xl">
				<div
					className="absolute inset-0 transition-all duration-700"
					style={{
						backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.15)), url(${heroSlides[heroIndex].image})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>
				<div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
					<button
						onClick={() => navigate(-1)}
						className="absolute top-6 left-6 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-all"
					>
						<span className="sr-only">Back</span>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 rotate-180"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
					</button>

					<div className="max-w-5xl mx-auto w-full space-y-4 text-white">
						<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 text-[11px] font-semibold uppercase tracking-[0.35em]">
							<span>Lucknow guide desk</span>
						</div>
						<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
							<div className="space-y-3 max-w-3xl">
								<h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-sm">{heroSlides[heroIndex].title}</h1>
								<p className="text-white/85 text-lg md:text-xl leading-relaxed">{heroSlides[heroIndex].subtitle}</p>
								<div className="flex flex-wrap gap-3">
									<button className="px-4 py-2 rounded-full bg-white text-slate-900 text-sm font-semibold shadow-sm hover:shadow transition-all">
										Start exploring
									</button>
									<button className="px-4 py-2 rounded-full border border-white/60 text-white text-sm font-semibold hover:bg-white/10 transition-all">
										View plan
									</button>
								</div>
							</div>
							<div className="space-y-2 text-sm text-white/85">
								<div className="px-3 py-2 rounded-xl bg-white/10 border border-white/20">
									<p className="text-xs uppercase tracking-[0.2em]">Tagline</p>
									<p className="text-base font-semibold leading-snug">Muskuraiye, aap Lucknow mein hain</p>
									<p className="text-xs">मुस्कुराइए, आप लखनऊ में हैं · مسکرائیے، آپ لکھنؤ میں ہیں</p>
								</div>
								<div className="px-3 py-2 rounded-xl bg-white/10 border border-white/20">
									<p className="text-xs uppercase tracking-[0.2em]">Media focus</p>
									<p className="text-base font-semibold">Guides, stays, food, festivals</p>
								</div>
							</div>
						</div>

					<div className="flex items-center gap-2 mt-6">
						{heroSlides.map((_, i) => (
							<button
								key={i}
								onClick={() => setHeroIndex(i)}
								className={`h-2.5 rounded-full transition-all ${heroIndex === i ? 'w-8 bg-white' : 'w-2.5 bg-white/50'}`}
								aria-label={`Go to slide ${i + 1}`}
							/>
						))}
					</div>
				</div>
			</div>
		</div>

		{/* Highlight slide bar (auto) */}
		<div className="max-w-6xl mx-auto px-6 py-10">
			<HighlightSlideBar slides={highlightSlides} intervalMs={4000} />
		</div>

			{/* Work plan based on prompt */}
			<div className="max-w-6xl mx-auto px-6 py-14 space-y-10">
				<div className="space-y-2">
					<p className="text-xs font-semibold tracking-[0.3em] uppercase text-teal-600">Content plan</p>
					<p className="text-slate-600">Structured tasks to fill with real data, media, and verification over time.</p>
				</div>

				{/* Quick section anchors */}
				<div className="flex flex-wrap gap-2">
					{sections.map((section) => (
						<a
							key={section.id}
							href={`#${section.id}`}
							className="px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-200 text-slate-700 hover:border-teal-300 hover:text-teal-700 hover:bg-teal-50 transition-colors"
						>
							{section.title}
						</a>
					))}
				</div>

			{/* Destination search with routes */}
			<div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
					<div>
						<p className="text-xs uppercase tracking-[0.2em] text-slate-500">Destination search</p>
						<h3 className="text-xl font-semibold text-slate-900">Find a spot and see routes</h3>
						<p className="text-sm text-slate-600">Type a destination in Lucknow to view quick travel options.</p>
					</div>
					<div className="w-full md:w-80">
						<label className="sr-only" htmlFor="destination-search">Search destination</label>
						<input
							id="destination-search"
							type="text"
							value={destinationQuery}
							onChange={(e) => setDestinationQuery(e.target.value)}
							placeholder="e.g., Bara Imambara, Hazratganj"
							className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-teal-400"
						/>
					</div>
				</div>

				<div className="grid gap-3 md:grid-cols-2">
					{destinationResults.length === 0 && (
						<p className="text-sm text-slate-600">No matches yet. Try another landmark or area.</p>
					)}
					{destinationResults.map((dest, idx) => (
						<div
							key={dest.name}
							onClick={() => {
								setDestinationInput(`${dest.name}, Lucknow`);
								const planner = document.getElementById("route-planner");
								if (planner) planner.scrollIntoView({ behavior: "smooth", block: "start" });
							}}
							className="rounded-xl border border-slate-100 bg-slate-50 p-4 shadow-sm cursor-pointer hover:border-teal-200 transition-colors"
						>
							<div className="flex items-start justify-between gap-2">
								<div>
									<p className="text-xs uppercase tracking-[0.2em] text-slate-500">{dest.category}</p>
									<h4 className="text-base font-semibold text-slate-900">{dest.name}</h4>
									<p className="text-xs text-slate-500">Area: {dest.area}</p>
								</div>
								<span className="text-[11px] px-2 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-200">#{idx + 1}</span>
							</div>
							<p className="text-sm text-slate-700 mt-2">{dest.highlights}</p>
							<div className="mt-2 space-y-1">
								{dest.routes.map((route: string) => (
									<p key={route} className="text-xs text-slate-600">• {route}</p>
								))}
							</div>
							<div className="mt-3 flex flex-wrap gap-2">
								<span className="text-[11px] px-2 py-1 rounded-full bg-white text-slate-700 border border-slate-200">Tap to send to route planner</span>
								<a
									href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest.name + ", Lucknow")}`}
									target="_blank"
									rel="noreferrer"
									className="text-[11px] px-2 py-1 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition-colors"
								>
									Open in Google Maps
								</a>
							</div>
						</div>
					))}
				</div>

				<div id="route-planner" className="mt-6 grid gap-4 lg:grid-cols-[1.2fr,0.9fr]">
					<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
						<div className="flex items-center justify-between gap-3 flex-wrap">
							<div>
								<p className="text-xs uppercase tracking-[0.2em] text-slate-500">Google Maps</p>
								<h4 className="text-lg font-semibold text-slate-900">Route planner</h4>
								<p className="text-xs text-slate-600">Set origin and destination, pick a mode, then preview.</p>
							</div>
							<div className="flex gap-2 text-[11px]">
								{["driving", "walking", "bicycling", "transit"].map((mode) => (
									<button
										key={mode}
										onClick={() => setTravelMode(mode as typeof travelMode)}
										className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${travelMode === mode ? "bg-teal-600 text-white border-teal-700" : "border-slate-200 text-slate-700 hover:border-teal-300"}`}
									>
										{mode}
									</button>
								))}
							</div>
						</div>

						<div className="grid md:grid-cols-2 gap-3">
							<div className="space-y-1">
								<label className="text-xs font-semibold text-slate-600" htmlFor="origin-input">Origin</label>
								<input
									id="origin-input"
									type="text"
									value={originInput}
									onChange={(e) => setOriginInput(e.target.value)}
									placeholder="e.g., Charbagh, Lucknow"
									className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
								/>
							</div>
							<div className="space-y-1">
								<label className="text-xs font-semibold text-slate-600" htmlFor="destination-input">Destination</label>
								<input
									id="destination-input"
									type="text"
									value={destinationInput}
									onChange={(e) => setDestinationInput(e.target.value)}
									placeholder="e.g., Bara Imambara, Lucknow"
									className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
								/>
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
							{googleMapsKey ? (
								<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Maps key detected</span>
							) : (
								<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Add VITE_GOOGLE_MAPS_API_KEY to .env to enable embed</span>
							)}
							{mapsLink && (
								<a
									href={mapsLink}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-teal-600 text-white font-semibold shadow-sm hover:bg-teal-700"
								>
									Open in Google Maps
								</a>
							)}
						</div>
					</div>

					<div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm min-h-[280px]">
						{mapsEmbedUrl || fallbackEmbedUrl ? (
							<iframe
								title="Google Maps route"
								src={mapsEmbedUrl || fallbackEmbedUrl || undefined}
								width="100%"
								height="280"
								style={{ border: 0 }}
								loading="lazy"
								allowFullScreen
								referrerPolicy="no-referrer-when-downgrade"
							/>
						) : (
							<div className="h-full w-full flex items-center justify-center text-sm text-slate-600 bg-slate-50 rounded-xl border border-dashed border-slate-200 px-4 text-center">
								<p>Enter origin and destination to preview directions. With no API key, the map will show a Google search view; add VITE_GOOGLE_MAPS_API_KEY for live directions embed or use the "Open in Google Maps" button.</p>
							</div>
						)}
					</div>
				</div>

				{/* Local services snapshot */}
				<div className="grid gap-3 md:grid-cols-3">
					<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
						<p className="text-xs uppercase tracking-[0.2em] text-slate-500">Local guides</p>
						<h4 className="text-lg font-semibold text-slate-900">Booking status</h4>
						<p className="text-sm text-slate-700">Weekend slots filling fast; weekdays open.</p>
						<div className="mt-3 text-sm text-slate-600 space-y-1">
							<p>• 12 verified guides · Hindi/English</p>
							<p>• Avg response: 20–30 mins</p>
							<p>• City walks, food trails, heritage add-ons</p>
						</div>
						<a
							href="mailto:guides@darshana.travel?subject=Lucknow%20guide%20booking"
							className="inline-flex mt-3 text-sm font-semibold text-teal-700 hover:text-teal-800"
						>
							Request a guide →
						</a>
					</div>

					<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
						<p className="text-xs uppercase tracking-[0.2em] text-slate-500">Homestays</p>
						<h4 className="text-lg font-semibold text-slate-900">Availability</h4>
						<p className="text-sm text-slate-700">Gomti Nagar & Hazratganj have mid-week openings; weekends ~70% full.</p>
						<div className="mt-3 text-sm text-slate-600 space-y-1">
							<p>• Avg night: ₹1800–₹3200</p>
							<p>• Amenities: Wi‑Fi, breakfast, late check-in</p>
							<p>• Ask for old city courtyards if you want heritage vibes</p>
						</div>
						<a
							href="https://www.google.com/maps/search/homestay+lucknow"
							target="_blank"
							rel="noreferrer"
							className="inline-flex mt-3 text-sm font-semibold text-teal-700 hover:text-teal-800"
						>
							View nearby homestays →
						</a>
					</div>

					<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
						<div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
							<p className="text-sm text-slate-800">Evening rush at Chowk and Aminabad; morning nihari near Akbari Gate.</p>
							<ul className="mt-3 text-sm text-slate-700 space-y-1 list-disc list-inside leading-relaxed">
								<li><span className="font-semibold text-slate-900">Kebabs:</span> Tunday (Aminabad) · Raheem (Chowk)</li>
								<li><span className="font-semibold text-slate-900">Sweets:</span> Prakash Kulfi · Ram Asrey (sweets)</li>
								<li><span className="font-semibold text-slate-900">Tea:</span> Sharma Tea (Lalbagh) · JJ Bakers corners</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

				{/* Plan your Lucknow escape */}
				<section className="py-10 md:py-14 bg-gradient-to-br from-teal-50 via-white to-orange-50 rounded-3xl border border-teal-100 shadow-sm">
					<div className="max-w-6xl mx-auto px-4 md:px-8">
						<div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-teal-100 p-6 md:p-10">
							<header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
								<div>
									<h2 className="text-2xl font-serif font-semibold text-teal-800">Plan Your Lucknow Escape</h2>
									<p className="text-sm text-slate-600">Personalise arrival, interests, and budget to craft a Nawabi day-by-day plan.</p>
								</div>
								<div className="flex items-center gap-2 text-xs text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
									<Sparkles size={14} />
									<span>Smart itinerary intelligence for Lucknow</span>
								</div>
							</header>

							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-4">
									<label className="block text-xs font-semibold text-slate-500 uppercase">Arrival Date</label>
									<input
										type="date"
										value={arrivalDate}
										onChange={(e) => setArrivalDate(e.target.value)}
										className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
									/>
								</div>
								<div className="space-y-4">
									<label className="block text-xs font-semibold text-slate-500 uppercase">Departure Date</label>
									<input
										type="date"
										min={arrivalDate}
										value={departureDate}
										onChange={(e) => setDepartureDate(e.target.value)}
										className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
									/>
								</div>
								<div className="space-y-4">
									<div className="flex items-center justify-between gap-2">
										<div>
											<label className="block text-xs font-semibold text-slate-500 uppercase">City</label>
											<input
												readOnly
												value="Lucknow"
												className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700"
												type="text"
											/>
										</div>
										<span className="text-[11px] text-teal-700 font-semibold bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">Routes auto-fill below</span>
									</div>

									<div className="grid md:grid-cols-2 gap-3 mt-3">
										<div className="space-y-2">
											<p className="text-[11px] font-semibold text-slate-600">Where will you arrive?</p>
											<select
												value={arrivalPoint}
												onChange={(e) => setArrivalPoint(e.target.value)}
												className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
											>
												{cityEntryOptions.map((opt) => (
													<option key={opt.id} value={opt.id}>{opt.name} — {opt.area}</option>
												))}
											</select>
											<p className="text-xs text-slate-500">{activeArrival?.note || "Pick your starting point in Lucknow."}</p>
										</div>
										<div className="space-y-2">
											<p className="text-[11px] font-semibold text-slate-600">Where do you want to go?</p>
											<select
												value={innerCityTarget}
												onChange={(e) => setInnerCityTarget(e.target.value)}
												className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
											>
												{cityTargetOptions.map((opt) => (
													<option key={opt.id} value={opt.id}>{opt.name} — {opt.area}</option>
												))}
											</select>
											<p className="text-xs text-slate-500">{activeTarget?.category || "Select a spot inside the city."}</p>
										</div>
									</div>

									<div className="mt-3 space-y-2 rounded-2xl bg-slate-50 border border-slate-200 p-3">
										<div className="flex items-center justify-between gap-2 text-xs text-slate-600">
											<span className="font-semibold text-slate-800">Suggested short route</span>
											<span className="text-[11px] text-teal-700">{activeRoutePlan.summary}</span>
										</div>
										<div className="flex flex-wrap gap-2">
											{activeRoutePlan.stops.map((stop) => (
												<span key={stop} className="text-[11px] px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shadow-sm">{stop}</span>
											))}
										</div>
										<p className="text-[11px] text-slate-500">{activeRoutePlan.note || "We’ll keep it simple: start → key food/market spots → destination."}</p>
										<p className="text-[11px] text-slate-500">Origin/destination above also update the map embed in the Route Planner.</p>
									</div>
								</div>
								<div className="space-y-4">
									<label className="block text-xs font-semibold text-slate-500 uppercase">Group Size</label>
									<div className="relative">
										<Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
										<select
											value={groupSize}
											onChange={(e) => setGroupSize(Number(e.target.value))}
											className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm pl-10 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
										>
											{Array.from({ length: 10 }).map((_, idx) => (
												<option key={idx + 1} value={idx + 1}>{idx + 1} traveller{idx === 0 ? "" : "s"}</option>
											))}
										</select>
									</div>
								</div>

								<div className="md:col-span-2 space-y-3">
									<label className="block text-xs font-semibold text-slate-500 uppercase">Interests</label>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
										{interestOptions.map((interest) => {
											const active = selectedInterests.has(interest);
											return (
												<button
													key={interest}
													type="button"
													onClick={() => toggleInterest(interest)}
													className={`rounded-xl border px-4 py-3 text-sm font-medium transition hover:shadow-sm ${active ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-500"}`}
												>
													{interest}
												</button>
											);
										})}
									</div>
								</div>

								<div className="md:col-span-2">
									<label className="block text-xs font-semibold text-slate-500 uppercase mb-3">Budget Style</label>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
										{([
											{ id: "low", title: "Low", hint: "Street eats + autos" },
											{ id: "medium", title: "Medium", hint: "Mix of diners & cabs" },
											{ id: "high", title: "High", hint: "Premium dining & guides" },
										] as const).map((option) => {
											const active = budgetStyle === option.id;
											return (
												<label
													key={option.id}
													className={`flex cursor-pointer flex-col rounded-2xl border p-4 text-sm transition hover:border-teal-400 hover:shadow ${active ? "border-teal-500 bg-teal-50 text-teal-800" : "border-slate-200 bg-white"}`}
												>
													<span className="flex items-center justify-between">
														<span className="text-base font-semibold">{option.title}</span>
														<input
															type="radio"
															value={option.id}
															checked={active}
															onChange={() => setBudgetStyle(option.id)}
															className="h-4 w-4 text-teal-500"
														/>
													</span>
													<span className="mt-2 text-slate-500 text-xs">{option.hint}</span>
												</label>
											);
										})}
									</div>
								</div>
							</div>

							<div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
								<div className="text-xs text-slate-600">
									<span className="font-semibold text-teal-700">Trip length:</span> {tripLengthDays || 1} {tripLengthDays === 1 ? "day" : "days"} | Daily budget baseline: ₹{budgetPerDay.toLocaleString()}
								</div>
								<button
									type="button"
									onClick={() => setShowItinerary(true)}
									className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-300"
								>
									<Sparkles size={16} />
									Generate Plan
								</button>
							</div>
						</div>
					</div>
				</section>

				{/* Where to stay (reintroduced with refreshed UI) */}
				<div className="mt-10 bg-slate-50 border border-slate-200 rounded-3xl shadow-sm p-6 md:p-8 space-y-6">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
						<div>
							<p className="text-xs uppercase tracking-[0.3em] text-slate-500">Where to stay</p>
							<h3 className="text-2xl md:text-3xl font-bold text-slate-900">Curated accommodations for every budget</h3>
							<p className="text-sm text-slate-600 mt-1">Picked for easy booking near food hubs and heritage spots.</p>
						</div>
						<a
							href="#foods"
							className="text-sm font-semibold text-teal-700 hover:text-teal-800"
						>
							See foods board →
						</a>
					</div>

					<div className="space-y-4">
						{stayOptions.map((stay) => (
							<div
								key={stay.name}
								className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6 rounded-3xl bg-white shadow-md p-4 md:p-6 border border-slate-100"
							>
								<div className="flex items-start gap-4">
									<img src={stay.image} alt={stay.name} className="h-16 w-20 md:h-20 md:w-24 rounded-xl object-cover shadow-sm" />
									<div className="space-y-1">
										<h4 className="text-lg md:text-xl font-semibold text-slate-900">{stay.name}</h4>
										<div className="flex items-center gap-2 text-sm text-slate-700">
											<span className={`px-3 py-1 rounded-full text-xs font-semibold ${stayTagStyles[stay.tag]}`}>{stay.tag}</span>
											<span className="flex items-center gap-1">★ {stay.rating.toFixed(1)}</span>
										</div>
									</div>
								</div>
								<div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
									<div className="text-right">
										<p className="text-xs text-slate-500">per night</p>
										<p className="text-xl font-bold text-slate-900">{stay.price}</p>
									</div>
									{stay.link ? (
										<a
											href={stay.link}
											target="_blank"
											rel="noreferrer"
											className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 shrink-0"
										>
											Book
										</a>
									) : (
										<button className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold shrink-0" disabled>
											Book
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					{sections.map((section) => {
						const isClickable = ["foods", "streets", "monuments", "parks", "religious", "festivals"].includes(section.id);
						return (
							<article
								id={section.id}
								key={section.id}
								onClick={() => (isClickable ? setActiveSection(section) : null)}
								onKeyDown={(e) => {
									if (isClickable && (e.key === "Enter" || e.key === " ")) {
										e.preventDefault();
										setActiveSection(section);
									}
								}}
								role={isClickable ? "button" : undefined}
								tabIndex={isClickable ? 0 : -1}
								className="rounded-2xl border border-slate-100 shadow-sm bg-white p-6 flex flex-col gap-3 scroll-mt-24 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
							>
							<div className="flex items-start justify-between gap-2">
								<div>
									<p className="text-xs uppercase tracking-[0.2em] text-slate-500">{section.id}</p>
									<h3 className="text-xl font-semibold text-slate-900">{section.title}</h3>
									<p className="text-sm text-teal-700 font-medium">Goal: {section.goal}</p>
								</div>
								<span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColor[section.status]}`}>
									{section.status}
								</span>
							</div>
							<div className="space-y-2 pt-1">
								<ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
									{section.tasks.map((task) => (
										<li key={task}>{task}</li>
									))}
								</ul>
								<div className="h-2 bg-slate-100 rounded-full overflow-hidden">
									<div
										className="h-full bg-gradient-to-r from-teal-500 to-blue-500"
										style={{ width: `${statusProgress[section.status]}%` }}
									/>
								</div>
							</div>
						</article>
						);
					})}
				</div>

			</div>
		</section>

		{showItinerary && (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
				<div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
					<button
						type="button"
						onClick={() => setShowItinerary(false)}
						className="absolute right-5 top-5 rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-teal-400 hover:text-teal-600"
						aria-label="Close itinerary"
					>
						<X size={18} />
					</button>
					<div className="flex flex-col gap-6 overflow-y-auto p-8 max-h-[78vh] pr-2">
						<header className="space-y-2">
							<h3 className="text-2xl font-semibold text-teal-800">Daily Itinerary</h3>
							<p className="text-sm text-slate-500 flex items-center gap-2">
								<Calendar size={16} className="text-teal-500" />
								{dateRangeLabel}
							</p>
							<p className="text-xs text-slate-500">Interests: {selectedInterestList} · Budget: {budgetStyle} · Group size: {groupSize}</p>
						</header>

						<div className="flex flex-wrap gap-3">
							<button
								type="button"
								onClick={() => navigator.clipboard?.writeText(itineraryCopyText).catch(() => null)}
								className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-teal-400 hover:text-teal-600"
							>
								<Copy size={14} /> Copy itinerary
							</button>
							<button
								type="button"
								className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-teal-400 hover:text-teal-600"
							>
								<Printer size={14} /> Print / Export PDF
							</button>
							<button
								type="button"
								className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-medium text-green-700 transition hover:border-green-400"
							>
								<Share2 size={14} /> Share on WhatsApp
							</button>
							<a
								href={whatsappRouteLink}
								target="_blank"
								rel="noreferrer"
								className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700 transition hover:border-blue-400"
							>
								<MapIcon size={14} /> Google Maps Route
							</a>
						</div>

						<div className="grid gap-4 rounded-2xl border border-teal-100 bg-teal-50 p-4 text-xs text-teal-700">
							<p>Daily budget guidance: ₹{budgetPerDay.toLocaleString()} for your group</p>
							<p>Total projected spend: ₹{totalBudget.toLocaleString()}</p>
							<p className="flex items-center gap-2">
								<Clock size={14} className="text-teal-600" /> Walking avg: 14.4 km | Auto rides: 10 | Cab hops: 9
							</p>
							<ul className="list-disc pl-5 space-y-1 text-slate-700">
								<li>Mix autos for short hops and pre-book cabs for Gomti Nagar evenings.</li>
								<li>Reserve dining slots on weekends to skip queues.</li>
								<li>Weekday mornings are best for Residency walks before it warms up.</li>
							</ul>
						</div>

						<div className="space-y-4">
							{itineraryDays.map((day) => {
								const open = openDayId === day.id;
								return (
									<div key={day.id} className="rounded-2xl border border-slate-200">
										<button
											type="button"
											onClick={() => setOpenDayId(open ? null : day.id)}
											className="flex w-full items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-left"
										>
											<div>
												<h4 className="text-sm font-semibold text-teal-700">{day.title}</h4>
												<p className="text-xs text-slate-500">{day.summary} | {day.stats}</p>
											</div>
											<Clock size={16} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
										</button>
										{open && (
											<div className="space-y-4 px-4 py-4">
												{day.stops.map((stop) => (
													<div key={`${day.id}-${stop.time}-${stop.title}`} className="rounded-xl border border-slate-200 p-4 shadow-sm">
														<div className="flex items-start justify-between gap-3">
															<div>
																<p className="text-xs font-medium text-slate-400">{stop.time}</p>
																<h5 className="text-sm font-semibold text-slate-800">{stop.title}</h5>
																<p className="mt-1 text-xs text-slate-500">{stop.description}</p>
																{stop.tip && <p className="mt-2 text-xs text-teal-600">💡 {stop.tip}</p>}
															</div>
															<div className="text-right text-xs text-slate-500">
																<p>{stop.duration}</p>
																<p>{stop.transit}</p>
																<p>{stop.cost}</p>
															</div>
														</div>
													</div>
												))}
											</div>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		)}

		{activeSection?.id === "foods" && (
			<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
				<div className="bg-white max-w-5xl w-full rounded-2xl shadow-xl overflow-hidden">
					<div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
						<div>
							<p className="text-xs uppercase tracking-[0.2em] text-slate-500">foods</p>
							<h3 className="text-2xl font-bold text-slate-900">Foods detail board</h3>
							<p className="text-sm text-slate-700">20+ dishes · 5–10 techniques · 30+ restaurants · 100+ photos</p>
						</div>
						<button
							onClick={() => setActiveSection(null)}
							className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
							aria-label="Close"
						>
							×
						</button>
					</div>

					<div className="grid md:grid-cols-3 gap-4 px-6 py-5">
						<div className="space-y-3 md:col-span-1">
							<p className="text-xs uppercase tracking-[0.2em] text-slate-500">Context & history</p>
							<div className="rounded-xl border border-orange-100 bg-orange-50/70 p-4 text-sm text-slate-800 shadow-sm">
								<p className="font-semibold text-orange-900">Awadhi food arc</p>
								<p className="mt-1">Courtly kitchens balanced aroma and tenderness—dum, saffron, kewra, slow coal smoke.</p>
								<p className="mt-2 text-slate-700">Add 3–4 lines per hero dish about origin, who serves it best, and photo cues (smoke, glaze, garnish).</p>
							</div>
							<div className="rounded-xl border border-purple-100 bg-purple-50/60 p-4 text-sm text-slate-800 shadow-sm">
								<p className="font-semibold text-purple-900">Technique checklist</p>
								<ul className="list-disc list-inside space-y-1 text-slate-700">
									<li>Dum (sealed pot steam)</li>
									<li>Raw papaya tenderizing</li>
									<li>Coal smoke finish (dhungar)</li>
									<li>Layered yakhni rice</li>
									<li>Tandoor charring</li>
								</ul>
								<p className="text-xs text-slate-600 mt-1">Attach short clips/photos to each; keep notes to 30–40 words.</p>
							</div>
						</div>

						<div className="md:col-span-2">
							<p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Dishes, places, visuals</p>
							<div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
								{foodItems.map((item, idx) => (
									<div
										key={item.name}
										onClick={() => setExpandedFood(item)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												setExpandedFood(item);
											}
										}}
										role="button"
										tabIndex={0}
										className="flex gap-3 rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden hover:border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-300"
									>
										<div className="relative w-28 h-28 flex-shrink-0">
											<img src={item.image} alt={item.name} className="w-full h-full object-cover" />
											<span className="absolute top-1 left-1 px-2 py-0.5 rounded-full bg-black/70 text-white text-[11px] font-semibold">#{idx + 1}</span>
										</div>
										<div className="flex-1 p-3 space-y-1">
											<h4 className="text-base font-semibold text-slate-900">{item.name}</h4>
											<p className="text-sm text-slate-700">{item.description}</p>
											<p className="text-xs text-slate-500">Spot: {item.place}</p>
											<p className="text-xs text-slate-600">History: {item.history}</p>
										</div>
									</div>
								))}
							</div>

							{expandedFood && (
								<div className="mt-4 border border-slate-100 rounded-xl bg-slate-50 p-4 flex gap-4 items-start">
									<div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
										<img src={expandedFood.image} alt={expandedFood.name} className="w-full h-full object-cover" />
									</div>
									<div className="space-y-1">
										<p className="text-xs uppercase tracking-[0.2em] text-slate-500">Selected</p>
										<h4 className="text-lg font-semibold text-slate-900">{expandedFood.name}</h4>
										<p className="text-sm text-slate-700">{expandedFood.description}</p>
										<p className="text-sm text-slate-700">History: {expandedFood.history}</p>
										<p className="text-sm text-slate-600">Location / area: {expandedFood.place}</p>
										<p className="text-xs text-slate-500">Click another image to switch the detail view.</p>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
						<button
							onClick={() => setActiveSection(null)}
							className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-100"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		)}

		{activeSection?.id === "streets" && (
			<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
				<div className="bg-white max-w-5xl w-full rounded-2xl shadow-xl overflow-hidden">
					<div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
						<div>
							<p className="text-xs uppercase tracking-[0.2em] text-slate-500">historic streets</p>
							<h3 className="text-2xl font-bold text-slate-900">Street detail board</h3>
							<p className="text-sm text-slate-700">8–10 streets · ~100 shops each · 150+ photos</p>
						</div>
						<button
							onClick={() => {
								setExpandedStreet(null);
								setActiveSection(null);
							}}
							className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
							aria-label="Close"
						>
							×
						</button>
					</div>

					<div className="grid md:grid-cols-3 gap-4 px-6 py-5">
						<div className="space-y-3 md:col-span-1">
							<p className="text-xs uppercase tracking-[0.2em] text-slate-500">Plan & notes</p>
							<div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-slate-800 shadow-sm">
								<p className="font-semibold text-blue-900">Survey approach</p>
								<p className="mt-1">Walk each street end-to-end; note shop clusters (food, textiles, crafts, books).</p>
								<p className="mt-2 text-slate-700">Target ~100 shop/landmark entries per street with category + price cue + nav link.</p>
							</div>
							<div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-slate-800 shadow-sm">
								<p className="font-semibold text-emerald-900">Photo checklist</p>
								<ul className="list-disc list-inside space-y-1 text-slate-700">
									<li>Wide street ambience</li>
									<li>Shopfront signage</li>
									<li>People flow & evening lights</li>
									<li>Food stalls & craft work</li>
								</ul>
								<p className="text-xs text-slate-600 mt-1">Aim 150 photos across all streets; keep WebP/AVIF.</p>
							</div>
						</div>

						<div className="md:col-span-2">
							<p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Streets, shops, visuals</p>
							<div className="grid gap-4 sm:grid-cols-2 max-h-[480px] overflow-y-auto pr-1">
								{streetItems.map((item, idx) => {
									const isActive = expandedStreet?.name === item.name;
									const rating = (4.3 + idx * 0.05).toFixed(1);
									return (
										<button
											key={item.name}
											onClick={() => setExpandedStreet(item)}
											className={`text-left rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden hover:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${
												isActive ? 'ring-2 ring-blue-400' : ''
											}`}
										>
											<div className="relative h-40 w-full overflow-hidden">
												<img src={item.image} alt={item.name} className="w-full h-full object-cover" />
												<span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 text-white text-[11px] font-semibold">#{idx + 1}</span>
											</div>
											<div className="p-4 space-y-1">
												<div className="flex items-center justify-between gap-2">
													<h4 className="text-lg font-semibold text-slate-900 leading-snug">{item.name}</h4>
													<span className="flex items-center gap-1 text-amber-600 text-sm font-semibold">
														<span aria-hidden>★</span>
														<span>{rating}</span>
													</span>
												</div>
												<p className="text-sm text-slate-700">{item.highlights}</p>
												<p className="text-xs text-slate-500">Area: {item.area}</p>
												<p className="text-xs text-slate-500">Shops: {item.shopsCount}</p>
											</div>
										</button>
									);
								})}
							</div>

							{expandedStreet && (
								<div className="mt-4 border border-slate-100 rounded-xl bg-slate-50 p-4 flex gap-4 items-start">
									<div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
										<img src={expandedStreet.image} alt={expandedStreet.name} className="w-full h-full object-cover" />
									</div>
									<div className="space-y-1">
										<p className="text-xs uppercase tracking-[0.2em] text-slate-500">Selected</p>
										<h4 className="text-lg font-semibold text-slate-900">{expandedStreet.name}</h4>
										<p className="text-sm text-slate-700">{expandedStreet.highlights}</p>
										<p className="text-sm text-slate-700">History: {expandedStreet.history}</p>
										<p className="text-sm text-slate-600">Area: {expandedStreet.area}</p>
										<p className="text-sm text-slate-600">Shops: {expandedStreet.shopsCount}</p>
										<p className="text-xs text-slate-500">Click another image to switch the detail view.</p>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
						<button
							onClick={() => {
								setExpandedStreet(null);
								setActiveSection(null);
							}}
							className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-100"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		)}

		{activeSection?.id === "monuments" && (
			<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
				<div className="bg-white max-w-5xl w-full rounded-2xl shadow-xl overflow-hidden">
					<div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
						<div>
							<p className="text-xs uppercase tracking-[0.2em] text-slate-500">monuments</p>
							<h3 className="text-2xl font-bold text-slate-900">Monuments detail board</h3>
							<p className="text-sm text-slate-700">15–20 sites · hours/fees/guides · 200+ photos</p>
						</div>
						<button
							onClick={() => {
								setExpandedMonument(null);
								setActiveSection(null);
							}}
							className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
							aria-label="Close"
						>
							×
						</button>
					</div>

					<div className="grid md:grid-cols-3 gap-4 px-6 py-5">
						<div className="space-y-3 md:col-span-1">
							<p className="text-xs uppercase tracking-[0.2em] text-slate-500">Visit plan</p>
							<div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm text-slate-800 shadow-sm">
								<p className="font-semibold text-indigo-900">Capture checklist</p>
								<ul className="list-disc list-inside space-y-1 text-slate-700">
									<li>Hours + ticket + guide availability</li>
									<li>2–3 angles per site (wide, detail, people)</li>
									<li>Geo/map link per site</li>
								</ul>
								<p className="text-xs text-slate-600 mt-1">Aim ~200 photos total; prefer WebP.</p>
							</div>
						</div>

						<div className="md:col-span-2">
							<p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Sites, info, visuals</p>
							<div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
								{monumentItems.map((item, idx) => (
									<div
										key={item.name}
										onClick={() => setExpandedMonument(item)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												setExpandedMonument(item);
											}
										}}
										role="button"
										tabIndex={0}
										className="flex gap-3 rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden hover:border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
									>
										<div className="relative w-28 h-28 flex-shrink-0">
											<img src={item.image} alt={item.name} className="w-full h-full object-cover" />
											<span className="absolute top-1 left-1 px-2 py-0.5 rounded-full bg-black/70 text-white text-[11px] font-semibold">#{idx + 1}</span>
										</div>
										<div className="flex-1 p-3 space-y-1">
											<h4 className="text-base font-semibold text-slate-900">{item.name}</h4>
											<p className="text-sm text-slate-700">{item.info}</p>
											<p className="text-xs text-slate-500">Area: {item.area}</p>
											<p className="text-xs text-slate-600">History: {item.history}</p>
										</div>
									</div>
								))}
							</div>

							{expandedMonument && (
								<div className="mt-4 border border-slate-100 rounded-xl bg-slate-50 p-4 flex gap-4 items-start">
									<div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
										<img src={expandedMonument.image} alt={expandedMonument.name} className="w-full h-full object-cover" />
									</div>
									<div className="space-y-1">
										<p className="text-xs uppercase tracking-[0.2em] text-slate-500">Selected</p>
										<h4 className="text-lg font-semibold text-slate-900">{expandedMonument.name}</h4>
										<p className="text-sm text-slate-700">{expandedMonument.info}</p>
										<p className="text-sm text-slate-700">History: {expandedMonument.history}</p>
										<p className="text-sm text-slate-600">Area: {expandedMonument.area}</p>
										<p className="text-xs text-slate-500">Click another image to switch the detail view.</p>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
						<button
							onClick={() => {
								setExpandedMonument(null);
								setActiveSection(null);
							}}
							className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-100"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		)}

		{activeSection?.id === "parks" && (
			<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
				<div className="bg-white max-w-5xl w-full rounded-2xl shadow-xl overflow-hidden">
					<div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
						<div>
							<p className="text-xs uppercase tracking-[0.2em] text-slate-500">parks</p>
							<h3 className="text-2xl font-bold text-slate-900">Parks detail board</h3>
							<p className="text-sm text-slate-700">5–10 parks · facilities · 80+ photos</p>
						</div>
						<button
							onClick={() => {
								setExpandedPark(null);
								setActiveSection(null);
							}}
							className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
							aria-label="Close"
						>
							×
						</button>
					</div>

					<div className="grid md:grid-cols-3 gap-4 px-6 py-5">
						<div className="space-y-3 md:col-span-1">
							<p className="text-xs uppercase tracking-[0.2em] text-slate-500">Visit plan</p>
							<div className="rounded-xl border border-green-100 bg-green-50/70 p-4 text-sm text-slate-800 shadow-sm">
								<p className="font-semibold text-green-900">Capture checklist</p>
								<ul className="list-disc list-inside space-y-1 text-slate-700">
									<li>Facilities (play, jogging, boating, restrooms)</li>
									<li>Hours and ticket (if any)</li>
									<li>Evening lights and crowd flow</li>
								</ul>
								<p className="text-xs text-slate-600 mt-1">Aim ~80 photos total; wide + activity shots.</p>
							</div>
						</div>

						<div className="md:col-span-2">
							<p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Parks, facilities, visuals</p>
							<div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
								{parkItems.map((item, idx) => (
									<div
										key={item.name}
										onClick={() => setExpandedPark(item)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												setExpandedPark(item);
											}
										}}
										role="button"
										tabIndex={0}
										className="flex gap-3 rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden hover:border-green-200 focus:outline-none focus:ring-2 focus:ring-green-300"
									>
										<div className="relative w-28 h-28 flex-shrink-0">
											<img src={item.image} alt={item.name} className="w-full h-full object-cover" />
											<span className="absolute top-1 left-1 px-2 py-0.5 rounded-full bg-black/70 text-white text-[11px] font-semibold">#{idx + 1}</span>
										</div>
										<div className="flex-1 p-3 space-y-1">
											<h4 className="text-base font-semibold text-slate-900">{item.name}</h4>
											<p className="text-sm text-slate-700">{item.features}</p>
											<p className="text-xs text-slate-500">Area: {item.area}</p>
											<p className="text-xs text-slate-600">Hours: {item.hours}</p>
										</div>
									</div>
								))}
							</div>

							{expandedPark && (
								<div className="mt-4 border border-slate-100 rounded-xl bg-slate-50 p-4 flex gap-4 items-start">
									<div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
										<img src={expandedPark.image} alt={expandedPark.name} className="w-full h-full object-cover" />
									</div>
									<div className="space-y-1">
										<p className="text-xs uppercase tracking-[0.2em] text-slate-500">Selected</p>
										<h4 className="text-lg font-semibold text-slate-900">{expandedPark.name}</h4>
										<p className="text-sm text-slate-700">{expandedPark.features}</p>
										<p className="text-sm text-slate-700">Area: {expandedPark.area}</p>
										<p className="text-sm text-slate-600">Hours: {expandedPark.hours}</p>
										<p className="text-xs text-slate-500">Click another image to switch the detail view.</p>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
						<button
							onClick={() => {
								setExpandedPark(null);
								setActiveSection(null);
							}}
							className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-100"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		)}

		{activeSection?.id === "religious" && (
			<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
				<div className="bg-white max-w-5xl w-full rounded-2xl shadow-xl overflow-hidden">
					<div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
						<div>
							<p className="text-xs uppercase tracking-[0.2em] text-slate-500">religious places</p>
							<h3 className="text-2xl font-bold text-slate-900">Religious detail board</h3>
							<p className="text-sm text-slate-700">20–30 sites · timings/rules · 100+ photos</p>
						</div>
						<button
							onClick={() => {
								setExpandedReligious(null);
								setActiveSection(null);
							}}
							className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
							aria-label="Close"
						>
							×
						</button>
					</div>

					<div className="grid md:grid-cols-3 gap-4 px-6 py-5">
						<div className="space-y-3 md:col-span-1">
							<p className="text-xs uppercase tracking-[0.2em] text-slate-500">Visit notes</p>
							<div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4 text-sm text-slate-800 shadow-sm">
								<p className="font-semibold text-amber-900">Checklist</p>
								<ul className="list-disc list-inside space-y-1 text-slate-700">
									<li>Timings and prayer schedules</li>
									<li>Rules (dress, photography, footwear)</li>
									<li>Respectful distance for photos</li>
								</ul>
								<p className="text-xs text-slate-600 mt-1">Aim ~100 photos: facade, interiors, rituals (with permission).</p>
							</div>
						</div>

						<div className="md:col-span-2">
							<p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Sites, faith, rules</p>
							<div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
								{religiousItems.map((item, idx) => (
									<div
										key={item.name}
										onClick={() => setExpandedReligious(item)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												setExpandedReligious(item);
											}
										}}
										role="button"
										tabIndex={0}
										className="flex gap-3 rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden hover:border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
									>
										<div className="relative w-28 h-28 flex-shrink-0">
											<img src={item.image} alt={item.name} className="w-full h-full object-cover" />
											<span className="absolute top-1 left-1 px-2 py-0.5 rounded-full bg-black/70 text-white text-[11px] font-semibold">#{idx + 1}</span>
										</div>
										<div className="flex-1 p-3 space-y-1">
											<h4 className="text-base font-semibold text-slate-900">{item.name}</h4>
											<p className="text-sm text-slate-700">Faith: {item.faith}</p>
											<p className="text-xs text-slate-500">Area: {item.area}</p>
											<p className="text-xs text-slate-600">Visit: {item.visitInfo}</p>
											<p className="text-xs text-slate-600">History: {item.history}</p>
										</div>
									</div>
								))}
							</div>

							{expandedReligious && (
								<div className="mt-4 border border-slate-100 rounded-xl bg-slate-50 p-4 flex gap-4 items-start">
									<div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
										<img src={expandedReligious.image} alt={expandedReligious.name} className="w-full h-full object-cover" />
									</div>
									<div className="space-y-1">
										<p className="text-xs uppercase tracking-[0.2em] text-slate-500">Selected</p>
										<h4 className="text-lg font-semibold text-slate-900">{expandedReligious.name}</h4>
										<p className="text-sm text-slate-700">Faith: {expandedReligious.faith}</p>
										<p className="text-sm text-slate-700">Visit: {expandedReligious.visitInfo}</p>
										<p className="text-sm text-slate-700">History: {expandedReligious.history}</p>
										<p className="text-sm text-slate-600">Area: {expandedReligious.area}</p>
										<p className="text-xs text-slate-500">Click another image to switch the detail view.</p>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
						<button
							onClick={() => {
								setExpandedReligious(null);
								setActiveSection(null);
							}}
							className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-100"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		)}

		{activeSection?.id === "festivals" && (
			<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
				<div className="bg-white max-w-5xl w-full rounded-2xl shadow-xl overflow-hidden">
					<div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
						<div>
							<p className="text-xs uppercase tracking-[0.2em] text-slate-500">festivals</p>
							<h3 className="text-2xl font-bold text-slate-900">Festivals detail board</h3>
							<p className="text-sm text-slate-700">10–15 festivals · dates/events · 80+ photos</p>
						</div>
						<button
							onClick={() => {
								setExpandedFestival(null);
								setActiveSection(null);
							}}
							className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
							aria-label="Close"
						>
							×
						</button>
					</div>

					<div className="grid md:grid-cols-3 gap-4 px-6 py-5">
						<div className="space-y-3 md:col-span-1">
							<p className="text-xs uppercase tracking-[0.2em] text-slate-500">Plan & notes</p>
							<div className="rounded-xl border border-pink-100 bg-pink-50/70 p-4 text-sm text-slate-800 shadow-sm">
								<p className="font-semibold text-pink-900">Capture checklist</p>
								<ul className="list-disc list-inside space-y-1 text-slate-700">
									<li>Month/date + key locations</li>
									<li>Signature rituals or performances</li>
									<li>Permission for close-up photos</li>
								</ul>
								<p className="text-xs text-slate-600 mt-1">Aim ~80 photos: crowd, stage, food stalls, lights.</p>
							</div>
						</div>

						<div className="md:col-span-2">
							<p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Festivals, timing, visuals</p>
							<div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
								{festivalItems.map((item, idx) => (
									<div
										key={item.name}
										onClick={() => setExpandedFestival(item)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												setExpandedFestival(item);
											}
										}}
										role="button"
										tabIndex={0}
										className="flex gap-3 rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden hover:border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
									>
										<div className="relative w-28 h-28 flex-shrink-0">
											<img src={item.image} alt={item.name} className="w-full h-full object-cover" />
											<span className="absolute top-1 left-1 px-2 py-0.5 rounded-full bg-black/70 text-white text-[11px] font-semibold">#{idx + 1}</span>
										</div>
										<div className="flex-1 p-3 space-y-1">
											<h4 className="text-base font-semibold text-slate-900">{item.name}</h4>
											<p className="text-sm text-slate-700">{item.highlights}</p>
											<p className="text-xs text-slate-500">Month: {item.month}</p>
											<p className="text-xs text-slate-600">Areas: {item.areas}</p>
											<p className="text-xs text-slate-600">History: {item.history}</p>
										</div>
									</div>
								))}
							</div>

							{expandedFestival && (
								<div className="mt-4 border border-slate-100 rounded-xl bg-slate-50 p-4 flex gap-4 items-start">
									<div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
										<img src={expandedFestival.image} alt={expandedFestival.name} className="w-full h-full object-cover" />
									</div>
									<div className="space-y-1">
										<p className="text-xs uppercase tracking-[0.2em] text-slate-500">Selected</p>
										<h4 className="text-lg font-semibold text-slate-900">{expandedFestival.name}</h4>
										<p className="text-sm text-slate-700">{expandedFestival.highlights}</p>
										<p className="text-sm text-slate-700">Month: {expandedFestival.month}</p>
										<p className="text-sm text-slate-700">Areas: {expandedFestival.areas}</p>
										<p className="text-sm text-slate-700">History: {expandedFestival.history}</p>
										<p className="text-xs text-slate-500">Click another image to switch the detail view.</p>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
						<button
							onClick={() => {
								setExpandedFestival(null);
								setActiveSection(null);
							}}
							className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-100"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		)}

		</>
	);
};

export default Lucknow;
