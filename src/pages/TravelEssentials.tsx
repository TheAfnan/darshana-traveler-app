import { ArrowRight, Bed, Bus, Car, Clock, ExternalLink, Home, MapPin, Plane, ShieldCheck, Train, Utensils } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const transportOptions = [
	{
		id: 'flight',
		name: 'Flights',
		description: 'Search and book domestic or international flights in minutes.',
		cta: 'Book flights',
		icon: Plane,
		link: 'https://www.makemytrip.com/flights/',
		badge: 'Best fares',
	},
	{
		id: 'train',
		name: 'Trains',
		description: 'Check live availability and book IRCTC-authorized train tickets.',
		cta: 'Book trains',
		icon: Train,
		link: 'https://www.irctc.co.in/',
		badge: 'IRCTC partner',
	},
	{
		id: 'bus',
		name: 'Buses',
		description: 'Choose trusted operators with real-time seat maps and ratings.',
		cta: 'Book buses',
		icon: Bus,
		link: 'https://www.redbus.in/',
		badge: 'Live seats',
	},
	{
		id: 'cab',
		name: 'Cabs & Rentals',
		description: 'Airport pickups, intercity rides, and rentals with top safety checks.',
		cta: 'Get a ride',
		icon: Car,
		link: 'https://www.uber.com/in/',
		badge: 'On-demand',
	},
];

const readyPackages = [
	{
		id: 'delhi-agra',
		title: 'Delhi ⇄ Agra day trip',
		duration: '1 day, sunrise to night',
		highlights: ['AC cab with driver', 'Taj entry assist', 'Lunch stop recos'],
		price: 'From ₹2,999',
	},
	{
		id: 'jaipur-run',
		title: 'Jaipur weekend run',
		duration: '2 nights, flexible',
		highlights: ['Flight or train options', 'Hotel + cab bundle', 'Local guide add-on'],
		price: 'From ₹6,499',
	},
	{
		id: 'goa-easy',
		title: 'Goa fly + drive',
		duration: '3-4 nights',
		highlights: ['Flight + self-drive', 'Beach stays shortlist', 'Late checkout friendly'],
		price: 'From ₹9,999',
	},
];

const stayOptions = [
	{
		id: 'taj-palace',
		title: 'Taj Palace, Delhi',
		type: 'Luxury hotel',
		location: 'Diplomatic Enclave, New Delhi',
		price: 'From ₹8,500/night',
		highlights: ['Pool + spa', 'Airport pickup', 'Breakfast included'],
		link: 'https://www.tajhotels.com/en-in/taj/taj-palace-new-delhi/',
		map: 'https://maps.google.com/?q=Taj+Palace+Delhi',
	},
	{
		id: 'jaipur-haveli',
		title: 'Samode Haveli, Jaipur',
		type: 'Heritage stay',
		location: 'Gangapole, Jaipur',
		price: 'From ₹6,200/night',
		highlights: ['Courtyard pool', 'Guided city tour', 'Breakfast included'],
		link: 'https://www.samode.com/samode-haveli',
		map: 'https://maps.google.com/?q=Samode+Haveli+Jaipur',
	},
	{
		id: 'goa-villa',
		title: 'Assagao Quiet Villa, Goa',
		type: 'Villa / homestay',
		location: 'Assagao, North Goa',
		price: 'From ₹4,500/night',
		highlights: ['Private garden', 'Chef on call', 'Near beaches'],
		link: 'https://www.airbnb.co.in/rooms/plus/335716',
		map: 'https://maps.google.com/?q=Assagao+Goa',
	},
];

const foodSpots = [
	{ id: 'delhi-chole', title: 'Sitaram Diwan Chand', city: 'Delhi', special: 'Chole Bhature', highlights: ['Authentic Delhi taste', 'Since 1910', 'Crowd-favorite'], since: '1910', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Sitaram+Diwan+Chand+Paharganj' },
	{ id: 'delhi-butter', title: 'Moti Mahal', city: 'Delhi', special: 'Butter Chicken', highlights: ['Original creators', 'Since 1947', 'Iconic seating'], since: '1947', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Moti+Mahal+Daryaganj' },
	{ id: 'delhi-paranthe', title: 'Paranthe Wali Gali', city: 'Delhi', special: 'Stuffed Parathas', highlights: ['Since 1872', 'Street-side charm', 'Veg only'], since: '1872', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Paranthe+Wali+Gali' },
	{ id: 'agra-petha', title: 'Panchhi Petha', city: 'Agra', special: 'Petha', highlights: ['Signature sweet', 'Multiple variants', 'Gift packing'], since: '1950', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Panchhi+Petha+Agra' },
	{ id: 'agra-mughlai', title: 'Pinch of Spice', city: 'Agra', special: 'Mughlai Food', highlights: ['Family dining', 'Consistent ratings', 'AC seating'], since: '2005', authenticity: 'Modern', link: 'https://maps.google.com/?q=Pinch+of+Spice+Agra' },
	{ id: 'lucknow-tunday', title: 'Tunday Kababi', city: 'Lucknow', special: 'Tunday Kabab', highlights: ['Melt-in-mouth', 'Since 1905', 'Iconic Aminabad'], since: '1905', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Tunday+Kababi+Aminabad' },
	{ id: 'lucknow-biryani', title: 'Idrees Biryani', city: 'Lucknow', special: 'Awadhi Biryani', highlights: ['Copper handi biryani', 'Since 1968', 'Old Lucknow vibe'], since: '1968', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Idrees+Biryani+Lucknow' },
	{ id: 'varanasi-kachori', title: 'Kachori Gali', city: 'Varanasi', special: 'Kachori Sabzi', highlights: ['Morning queues', 'Street classic', 'Crispy + spicy'], since: '1920', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Kachori+Gali+Varanasi' },
	{ id: 'varanasi-paan', title: 'Keshav Tambul Bhandar', city: 'Varanasi', special: 'Banarasi Paan', highlights: ['Traditional paan', 'Since 1950', 'Near ghats'], since: '1950', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Keshav+Tambul+Bhandar+Varanasi' },
	{ id: 'jaipur-dalbaati', title: 'Chokhi Dhani', city: 'Jaipur', special: 'Dal Baati Churma', highlights: ['Village theme', 'Rajasthani thali', 'Live folk shows'], since: '1994', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Chokhi+Dhani+Jaipur' },
	{ id: 'jaipur-pyaz', title: 'Rawat Mishthan Bhandar', city: 'Jaipur', special: 'Pyaz Kachori', highlights: ['Crisp & spicy', 'Always fresh', 'Takeaway friendly'], since: '1957', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Rawat+Mishthan+Bhandar+Jaipur' },
	{ id: 'jodhpur-mirchi', title: 'Surya Namkeen', city: 'Jodhpur', special: 'Mirchi Vada', highlights: ['Hot & crispy', 'Local favorite', 'Quick bite'], since: '1970', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Surya+Namkeen+Jodhpur' },
	{ id: 'jodhpur-lassi', title: 'Mishrilal Hotel', city: 'Jodhpur', special: 'Makhaniya Lassi', highlights: ['Rich & thick', 'Clock Tower spot', 'Takeaway friendly'], since: '1933', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Mishrilal+Hotel+Jodhpur' },
	{ id: 'amritsar-kulcha', title: 'Kesar Da Dhaba', city: 'Amritsar', special: 'Amritsari Kulcha', highlights: ['Desi ghee loaded', 'Since 1916', 'Family legacy'], since: '1916', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Kesar+Da+Dhaba+Amritsar' },
	{ id: 'amritsar-lassi', title: 'Ahuja Milk Bhandar', city: 'Amritsar', special: 'Lassi', highlights: ['Frothy & sweet', 'Near Golden Temple', 'Quick service'], since: '1940', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Ahuja+Milk+Bhandar+Amritsar' },
	{ id: 'kolkata-rosogolla', title: 'Balaram Mullick & Radharaman Mullick', city: 'Kolkata', special: 'Rosogolla', highlights: ['Bengali sweets', 'Multiple outlets', 'Gift packs'], since: '1885', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Balaram+Mullick+Kolkata' },
	{ id: 'kolkata-kathi', title: "Nizam's", city: 'Kolkata', special: 'Kathi Roll', highlights: ['Origin of rolls', 'Late-night stop', 'Iconic flavor'], since: '1932', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Nizam%27s+Kolkata' },
	{ id: 'mumbai-vadapav', title: 'Ashok Vada Pav', city: 'Mumbai', special: 'Vada Pav', highlights: ['Street classic', 'Since 1966', 'Budget friendly'], since: '1966', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Ashok+Vada+Pav+Dadar' },
	{ id: 'mumbai-pavbhaji', title: 'Sardar Pav Bhaji', city: 'Mumbai', special: 'Pav Bhaji', highlights: ['Butter-loaded', 'Since 1966', 'Late-night option'], since: '1966', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Sardar+Pav+Bhaji+Mumbai' },
	{ id: 'pune-misal', title: 'Katakirr Misal', city: 'Pune', special: 'Misal Pav', highlights: ['Spicy tarri', 'Popular queues', 'Quick service'], since: '1990', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Katakirr+Misal+Pune' },
	{ id: 'pune-bhakri', title: 'Shree Upahar Gruha', city: 'Pune', special: 'Bhakri-Pithla', highlights: ['Home-style', 'Affordable', 'Local favorite'], since: '1995', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Shree+Upahar+Gruha+Pune' },
	{ id: 'hyderabad-biryani', title: 'Paradise Biryani', city: 'Hyderabad', special: 'Hyderabadi Biryani', highlights: ['Since 1953', 'Flagship Secunderabad', 'Takeaway ready'], since: '1953', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Paradise+Biryani+Secunderabad' },
	{ id: 'hyderabad-haleem', title: 'Pista House', city: 'Hyderabad', special: 'Haleem', highlights: ['Ramzan favorite', 'Since 1997', 'Pan-India delivery'], since: '1997', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Pista+House+Hyderabad' },
	{ id: 'chennai-dosa', title: 'Murugan Idli Shop', city: 'Chennai', special: 'Dosa & Idli', highlights: ['Soft idlis', 'Multiple chutneys', 'Since 1993'], since: '1993', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Murugan+Idli+Shop+Chennai' },
	{ id: 'chennai-coffee', title: 'Sangeetha Veg Restaurant', city: 'Chennai', special: 'Filter Coffee', highlights: ['Classic filter coffee', 'Veg meals', 'Since 1985'], since: '1985', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Sangeetha+Veg+Restaurant+Chennai' },
	{ id: 'indore-poha', title: 'Chappan Dukan', city: 'Indore', special: 'Poha Jalebi', highlights: ['Breakfast street', '56 shops', 'Since 1970s'], since: '1970', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Chappan+Dukan+Indore' },
	{ id: 'indore-kees', title: 'Guru Kripa', city: 'Indore', special: 'Bhutte ka Kees', highlights: ['Corn specialty', 'Family spot', 'Evening rush'], since: '1992', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Guru+Kripa+Indore' },
	{ id: 'ahmedabad-dhokla', title: 'Iscon Thal', city: 'Ahmedabad', special: 'Dhokla', highlights: ['Gujarati thali', 'Clean seating', 'Family friendly'], since: '1993', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Iscon+Thal+Ahmedabad' },
	{ id: 'ahmedabad-fafda', title: 'Chandravilas Restaurant', city: 'Ahmedabad', special: 'Fafda Jalebi', highlights: ['Since 1900', 'Old city vibe', 'Breakfast rush'], since: '1900', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Chandravilas+Restaurant+Ahmedabad' },
	{ id: 'patna-litti', title: 'Litti Chokha Junction', city: 'Patna', special: 'Litti Chokha', highlights: ['Smoky litti', 'Street seating', 'Budget friendly'], since: '2008', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Litti+Chokha+Junction+Patna' },
	{ id: 'patna-khaja', title: 'Hari Om Khaja Bhandar', city: 'Patna', special: 'Khaja', highlights: ['Crisp layers', 'Sweet shop', 'Local favorite'], since: '1975', authenticity: 'Authentic', link: 'https://maps.google.com/?q=Hari+Om+Khaja+Bhandar+Patna' },
];

const LinkCard: React.FC<{
	name: string;
	description: string;
	cta: string;
	icon: React.ComponentType<{ className?: string }>;
	link: string;
	badge: string;
}> = ({ name, description, cta, icon: Icon, link, badge }) => (
	<a
		href={link}
		target="_blank"
		rel="noreferrer"
		className="group flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
	>
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-3">
				<div className="rounded-xl bg-blue-50 p-3 text-blue-700">
					<Icon className="h-6 w-6" />
				</div>
				<div>
					<p className="text-sm font-semibold text-blue-700">{badge}</p>
					<h3 className="text-xl font-bold text-gray-900">{name}</h3>
				</div>
			</div>
			<ExternalLink className="h-5 w-5 text-gray-400 transition group-hover:text-gray-700" />
		</div>
		<p className="text-sm text-gray-600">{description}</p>
		<div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
			{cta}
			<ArrowRight className="h-4 w-4" />
		</div>
	</a>
);

const PackageCard: React.FC<{
	title: string;
	duration: string;
	highlights: string[];
	price: string;
  bookingUrl: string;
}> = ({ title, duration, highlights, price, bookingUrl }) => (
	<div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
		<div className="flex items-center justify-between">
			<div>
				<h3 className="text-lg font-bold text-gray-900">{title}</h3>
				<p className="text-sm font-semibold text-gray-600">{duration}</p>
			</div>
			<ShieldCheck className="h-5 w-5 text-emerald-600" />
		</div>
		<ul className="flex flex-wrap gap-2 text-sm text-gray-700">
			{highlights.map((item) => (
				<li key={item} className="rounded-full bg-gray-100 px-3 py-1 font-semibold">
					{item}
				</li>
			))}
		</ul>
		<div className="flex items-center justify-between pt-1">
			<span className="text-base font-bold text-emerald-700">{price}</span>
			<Link
				to={bookingUrl}
				className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
			>
				Plan with us
			</Link>
		</div>
	</div>
);

const StayCard: React.FC<{
	title: string;
	type: string;
	location: string;
	price: string;
	highlights: string[];
	link: string;
	map: string;
  bookingUrl: string;
}> = ({ title, type, location, price, highlights, link, map, bookingUrl }) => (
	<div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
		<div className="flex items-start justify-between gap-3">
			<div>
				<p className="text-sm font-semibold text-indigo-600">{type}</p>
				<h3 className="text-lg font-bold text-gray-900">{title}</h3>
				<p className="flex items-center gap-2 text-sm font-semibold text-gray-600">
					<MapPin className="h-4 w-4" />
					{location}
				</p>
			</div>
			<div className="rounded-full bg-indigo-50 p-3 text-indigo-700">
				{type.toLowerCase().includes('villa') ? <Home className="h-5 w-5" /> : <Bed className="h-5 w-5" />}
			</div>
		</div>
		<ul className="flex flex-wrap gap-2 text-sm text-gray-700">
			{highlights.map((item) => (
				<li key={item} className="rounded-full bg-gray-100 px-3 py-1 font-semibold">
					{item}
				</li>
			))}
		</ul>
		<div className="flex items-center justify-between pt-1">
			<span className="text-base font-bold text-emerald-700">{price}</span>
			<div className="flex gap-2">
				<a
					href={map}
					target="_blank"
					rel="noreferrer"
					className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-indigo-200 hover:text-indigo-700"
				>
					View map
				</a>
				<a
					href={link}
					target="_blank"
					rel="noreferrer"
					className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
				>
					Partner site
				</a>
				<Link
					to={bookingUrl}
					className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
				>
					Book with us
				</Link>
			</div>
		</div>
	</div>
);

const FoodCard: React.FC<{
	title: string;
	city: string;
	special: string;
	highlights: string[];
	link: string;
	since: string;
	authenticity: string;
}> = ({ title, city, special, highlights, link, since, authenticity }) => (
	<div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
		<div className="flex items-start justify-between gap-3">
			<div>
				<p className="text-sm font-semibold text-orange-600">{city}</p>
				<h3 className="text-lg font-bold text-gray-900">{title}</h3>
				<p className="flex items-center gap-2 text-sm font-semibold text-gray-600">
					<Utensils className="h-4 w-4" />
					{special}
				</p>
				<p className="inline-flex items-center gap-2 text-xs font-semibold text-orange-700 bg-orange-50 px-3 py-1 rounded-full mt-2">
					{authenticity} • Since {since}
				</p>
			</div>
			<div className="rounded-full bg-orange-50 p-3 text-orange-700">
				<MapPin className="h-5 w-5" />
			</div>
		</div>
		<ul className="flex flex-wrap gap-2 text-sm text-gray-700">
			{highlights.map((item) => (
				<li key={item} className="rounded-full bg-gray-100 px-3 py-1 font-semibold">
					{item}
				</li>
			))}
		</ul>
		<div className="flex items-center justify-between pt-1">
			<span className="text-base font-bold text-emerald-700">Visit this place</span>
			<a
				href={link}
				target="_blank"
				rel="noreferrer"
				className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
			>
				Open in maps
			</a>
		</div>
	</div>
);

const TravelEssentials: React.FC = () => {
	const buildBookingUrl = (destination: string, category: string) =>
		`/booking?destination=${encodeURIComponent(destination)}&category=${encodeURIComponent(category)}`;

	const [foodQuery, setFoodQuery] = useState('');

	const filteredFood = useMemo(() => {
		if (!foodQuery.trim()) return foodSpots;
		const q = foodQuery.toLowerCase();
		return foodSpots.filter(
			(item) =>
				item.city.toLowerCase().includes(q) ||
				item.title.toLowerCase().includes(q) ||
				item.special.toLowerCase().includes(q)
		);
	}, [foodQuery]);

	return (
		<div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
			<section className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-2">
						<p className="text-sm font-semibold uppercase tracking-wide text-blue-100">Travel essentials</p>
						<h1 className="text-3xl font-black sm:text-4xl">Book travel fast, stay covered</h1>
						<p className="max-w-2xl text-sm sm:text-base text-blue-100">
							One place for flights, trains, buses, and cabs. Jump to your booking partner or choose a ready package and we will stitch it together.
						</p>
					</div>
					<div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">
						<Clock className="h-5 w-5" />
						Instant links • 24x7 assistance
					</div>
				</div>
			</section>

			<section className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-semibold text-blue-700">Book a mode</p>
						<h2 className="text-2xl font-bold text-gray-900">Trusted partners, direct links</h2>
						<p className="text-sm text-gray-600">Flights for speed, trains for overnight comfort, buses for budgets, and cabs for door-to-door hops.</p>
					</div>
				</div>
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					{transportOptions.map((option) => (
						<LinkCard key={option.id} {...option} />
					))}
				</div>
			</section>

			<section className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-semibold text-emerald-700">Ready packages</p>
						<h2 className="text-2xl font-bold text-gray-900">Curated travel bundles</h2>
					</div>
				</div>
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{readyPackages.map((pkg) => (
						<PackageCard
							key={pkg.id}
							{...pkg}
							bookingUrl={buildBookingUrl(pkg.title, 'package')}
						/>
					))}
				</div>
			</section>

				<section className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-semibold text-indigo-700">Stay ready</p>
							<h2 className="text-2xl font-bold text-gray-900">Hotel, villa, and homestay picks</h2>
						</div>
					</div>
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{stayOptions.map((stay) => (
							<StayCard key={stay.id} {...stay} bookingUrl={buildBookingUrl(stay.title, 'stay')} />
						))}
					</div>
				</section>

				<section className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-semibold text-orange-600">Local Food & Famous Shops</p>
							<h2 className="text-2xl font-bold text-gray-900">Must-try eats with locations</h2>
						</div>
						<div className="w-full max-w-sm">
							<label className="sr-only" htmlFor="food-search">Search food spots</label>
							<div className="relative">
								<input
									type="text"
									id="food-search"
									value={foodQuery}
									onChange={(e) => setFoodQuery(e.target.value)}
									placeholder="Search city, dish, or shop"
									className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
								/>
								<span className="absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-gray-500">{filteredFood.length}</span>
							</div>
						</div>
					</div>
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
						{filteredFood.map((spot) => (
							<FoodCard key={spot.id} {...spot} />
						))}
					</div>
				</section>
		</div>
	);
};

export default TravelEssentials;
