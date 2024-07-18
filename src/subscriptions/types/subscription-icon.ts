import type { ComboboxData } from "@mantine/core";

export const subscriptionIcons = [
	"telegram",
	"netflix",
	"jetbrains",
	"github",
	"youtube",
	"house",
	"headspace",
	"godaddy",
	"moovit",
	"tooth",
	"car",
	"eye",
	"heart",
	"city",
	"plane-departure",
	"plane-arrival",
	"car-burst",
	"dumbbell",
	"bolt",
	"people-group",
	"sack-dollar",
	"yin-yang",
	"cat",
	"kit-medical",
	"proton-mail",
	"google",
	"spotify",
	"landmark",
	"faucet-drip",
	"fire-flame-simple",
	"scissors",
	"receipt",
	"globe",
	"building",
	"phone",
	"credit-card",
	"cake-candles",
] as const;
export type SubscriptionIcon = (typeof subscriptionIcons)[number];

export const subscriptionIconToLabel = {
	telegram: "Telegram",
	netflix: "Netflix",
	jetbrains: "JetBrains",
	github: "GitHub",
	youtube: "YouTube",
	house: "House",
	headspace: "HeadSpace",
	godaddy: "GoDaddy",
	moovit: "Moovit",
	tooth: "Tooth",
	car: "Car",
	eye: "Eye",
	heart: "Heart",
	city: "City",
	"plane-departure": "Plane Departure",
	"plane-arrival": "Plane Arrival",
	"car-burst": "Car Burst",
	dumbbell: "Dumbbell",
	bolt: "Bolt",
	"people-group": "People Group",
	"sack-dollar": "Sack Dollar",
	"yin-yang": "Yin Yang",
	cat: "Cat",
	"kit-medical": "Kit Medical",
	"proton-mail": "Proton Mail",
	google: "Google",
	spotify: "Spotify",
	landmark: "Landmark",
	"faucet-drip": "Faucet Drip",
	"fire-flame-simple": "Fire Flame Simple",
	scissors: "Scissors",
	receipt: "Receipt",
	globe: "Globe",
	building: "Building",
	phone: "Phone",
	"credit-card": "Credit Card",
	"cake-candles": "Cake Candles",
} as const satisfies Record<SubscriptionIcon, string>;

export const subscriptionIconsComboboxData: ComboboxData = subscriptionIcons
	.map((icon) => ({
		value: icon,
		label: subscriptionIconToLabel[icon],
	}))
	.toSorted((a, b) => a.label.localeCompare(b.label));
