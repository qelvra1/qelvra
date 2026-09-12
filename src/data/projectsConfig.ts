/**
 * Modular Multi-Model Array Configuration
 *
 * Each model entry defines its folder location inside /public/demos/ and metadata.
 * Adding a new model is as simple as appending a new object:
 * { id, folderName, title, niche, category, tags, description }
 *
 * `niche`  — Short niche label shown as an overlay badge on the card image.
 *             Keep it concise (1–3 words). Used for visual scanning and SEO.
 * `tags`   — 4–5 niche-specific, keyword-rich tags. Shown as chips below
 *             the description. Target terms that clients actually search for.
 */

export interface ProjectConfigItem {
  id: string;
  folderName: string;
  title: string;
  /** Short niche label shown as overlay badge on the card preview image. */
  niche: string;
  category: string;
  tags: string[];
  description: string;
}

export const PROJECTS_CONFIG: ProjectConfigItem[] = [
  {
    id: "oak-blade",
    folderName: "oak-blade",
    title: "OAK & BLADE Barbering Atelier",
    niche: "Barbershop",
    category: "Websites",
    tags: ["Barbershop", "Chair Booking", "Brand Identity", "Local SEO", "Tailwind CSS"],
    description:
      "Heritage barbershop atelier with stylist profiles, live chair booking and local SEO built in from the ground up.",
  },
  {
    id: "velocity",
    folderName: "velocity",
    title: "Velocity Rental Car",
    niche: "Car Rental",
    category: "Websites",
    tags: ["Car Rental", "Fleet Management", "Instant Booking", "Stripe Payments", "PWA"],
    description:
      "Premium car rental platform with instant booking flows, real-time fleet availability and integrated payment processing.",
  },
  {
    id: "cripsyland",
    folderName: "cripsyland",
    title: "CrispyLand Fast Food",
    niche: "Fast Food",
    category: "Websites",
    tags: ["Fast Food", "Online Ordering", "Delivery Tracking", "Loyalty Rewards", "Restaurant Tech"],
    description:
      "Fast-food ordering site with combo builder, live order tracking, loyalty rewards program and a full digital menu.",
  },
  {
    id: "medicare",
    folderName: "medicare",
    title: "Medicare Health Clinic",
    niche: "Healthcare",
    category: "Websites",
    tags: ["Healthcare", "Patient Portal", "Appointment Booking", "Clinic Website", "HIPAA-ready"],
    description:
      "Patient-first clinic website with online appointment scheduling, specialist directory and a secure patient portal.",
  },
  {
    id: "peak-performannce",
    folderName: "peak-performannce",
    title: "Peak Performance Fitness",
    niche: "Fitness Studio",
    category: "Websites",
    tags: ["Fitness Studio", "Workout Tracker", "Coach Analytics", "Wearables Integration", "PWA"],
    description:
      "Fitness studio site with class schedules, coach performance insights, wearables integration and progress tracking.",
  },
  {
    id: "lumiere-haven",
    folderName: "lumiere-haven",
    title: "Lumière Haven · Hotel & Resort",
    niche: "Hotel & Resort",
    category: "Websites",
    tags: ["Hotel & Resort", "Room Reservations", "Hospitality Tech", "Luxury Brand", "CRM"],
    description:
      "Boutique resort experience site with curated room listings, seamless reservations and an integrated guest CRM.",
  },
  {
    id: "archetype",
    folderName: "archetype",
    title: "ARCHETYPE Private Estates",
    niche: "Real Estate",
    category: "Websites",
    tags: ["Real Estate", "Property Listings", "3D Virtual Tours", "Advanced Search", "MLS Integration"],
    description:
      "Luxury real estate platform with immersive property listings, interactive 3D virtual tours and MLS-ready search.",
  },
  {
    id: "aurelia",
    folderName: "aurelia",
    title: "AURELIA FINE DINING",
    niche: "Fine Dining",
    category: "Websites",
    tags: ["Fine Dining", "Table Reservations", "Event Booking", "Seasonal Menu", "Restaurant"],
    description:
      "Fine-dining experience with rotating seasonal menus, live table reservations and exclusive private event booking.",
  },
  {
    id: "nexora",
    folderName: "nexora",
    title: "NEXORA MARKETPLACE",
    niche: "Marketplace",
    category: "Marketplace",
    tags: ["Multi-vendor", "Escrow Payments", "Seller Analytics", "E-commerce Platform", "React"],
    description:
      "Multi-vendor marketplace with escrow-based payment protection, real-time seller analytics and vendor dashboard.",
  },
  {
    id: "burger-chaos",
    folderName: "burger-chaos",
    title: "Burger Chaos",
    niche: "Fast Food Brand",
    category: "Websites",
    tags: ["Fast Food Brand", "Online Ordering", "Motion Design", "Restaurant Tech", "React"],
    description:
      "Bold Australian burger brand site with vibrant motion design, a full online ordering system and a cart experience.",
  },
  {
    id: "greenrush",
    folderName: "greenrush",
    title: "GreenRush",
    niche: "Healthy Food",
    category: "Websites",
    tags: ["Healthy Food", "Eco-commerce", "Sustainability", "Green Tech", "React"],
    description:
      "Eco-conscious healthy food brand connecting sustainable farms with health-first consumers through a digital storefront.",
  },
  {
    id: "starbucks",
    folderName: "starbucks",
    title: "Starbucks — BREWSCAPE",
    niche: "Coffee Brand",
    category: "Websites",
    tags: ["Coffee Brand", "Loyalty Program", "Menu Explorer", "Brand Experience", "React"],
    description:
      "Immersive Starbucks-inspired coffee experience with seasonal menu exploration, loyalty rewards and brand storytelling.",
  },
  {
    id: "food-lover",
    folderName: "food-lover",
    title: "Food Lover",
    niche: "Gourmet & Bistro",
    category: "Websites",
    tags: ["Restaurant", "Gourmet", "Online Menu", "Table Booking", "React"],
    description:
      "Fresh food and bistro platform featuring handcrafted burgers, signature pasta, online menu ordering, and table reservations.",
  },
];
