/**
 * Modular Multi-Model Array Configuration
 *
 * Each model entry defines its folder location inside /public/demos/ and metadata.
 * Adding a new model is as simple as appending a new object:
 * { id, folderName, title, category, tags, description }
 */

export interface ProjectConfigItem {
  id: string;
  folderName: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
}

export const PROJECTS_CONFIG: ProjectConfigItem[] = [
  {
    id: "oak-blade",
    folderName: "oak-blade",
    title: "OAK & BLADE Barbering Atelier",
    category: "Websites",
    tags: ["Brand", "Booking", "Tailwind"],
    description: "Heritage barbershop atelier with stylist profiles and chair booking.",
  },
  {
    id: "velocity",
    folderName: "velocity",
    title: "Velocity Rental Car",
    category: "Websites",
    tags: ["Fleet", "Payments", "PWA"],
    description: "Premium car rental platform with instant booking and fleet tracking.",
  },
  {
    id: "cripsyland",
    folderName: "cripsyland",
    title: "CripsyLand Fast food",
    category: "Websites",
    tags: ["Ordering", "Delivery", "Rewards"],
    description: "Fast-food ordering site with combos, live tracking and rewards.",
  },
  {
    id: "medicare",
    folderName: "medicare",
    title: "Medicare Health Clinic",
    category: "Websites",
    tags: ["Healthcare", "Scheduling", "Portal"],
    description: "Patient-first clinic site with appointments and specialist directories.",
  },
  {
    id: "peak-performannce",
    folderName: "peak-performannce",
    title: "Peak Performannce Fitness",
    category: "Websites",
    tags: ["Programs", "Analytics", "Wearables"],
    description: "Fitness studio site with programs, coach insights and progress tracking.",
  },
  {
    id: "lumiere-haven",
    folderName: "lumiere-haven",
    title: "Lumière Haven · Hotel & Resort",
    category: "Websites",
    tags: ["Hospitality", "Reservations", "CRM"],
    description: "Boutique resort experience: rooms, rates and guest flow in one calm site.",
  },
  {
    id: "archetype",
    folderName: "archetype",
    title: "ARCHETYPE Private Estates",
    category: "Websites",
    tags: ["Listings", "3D Tours", "Search"],
    description: "Luxury real estate platform with immersive listings and virtual tours.",
  },
  {
    id: "aurelia",
    folderName: "aurelia",
    title: "AURELIA FINE DINING",
    category: "Websites",
    tags: ["Menus", "Reservations", "Events"],
    description: "Fine-dining experience with seasonal menus and private event booking.",
  },
  {
    id: "nexora",
    folderName: "nexora",
    title: "NEXORA MARKETPLACE",
    category: "Marketplace",
    tags: ["Multi-vendor", "Escrow", "React"],
    description: "Multi-vendor marketplace with escrow payments and seller analytics.",
  },
];
