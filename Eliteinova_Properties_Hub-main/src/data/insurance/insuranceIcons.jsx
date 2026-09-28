// src/components/data/insurance/insuranceIcons.jsx

import {
  Shield,
  Home,
  Building,
  Building2,
  Landmark,
  Car,
  Heart,
  Briefcase,
  Plane,
  Umbrella,
  FileText,
  Users,
  Truck,
  Factory,
  Warehouse,
  Store,
  Hotel,
  TreePine,
  Anchor,
  Bike,
  Train,
  Ship,
  Stethoscope,
  GraduationCap,
  PawPrint,
  Smartphone,
  Laptop,
  Gem,
  Camera,
  Music,
  Dumbbell,
} from "lucide-react";

const iconMap = {
  shield: Shield,
  home: Home,
  building: Building,
  building2: Building2,
  landmark: Landmark,
  car: Car,
  heart: Heart,
  briefcase: Briefcase,
  plane: Plane,
  umbrella: Umbrella,
  file: FileText,
  users: Users,
  truck: Truck,
  factory: Factory,
  warehouse: Warehouse,
  store: Store,
  hotel: Hotel,
  tree: TreePine,
  anchor: Anchor,
  bike: Bike,
  train: Train,
  ship: Ship,
  stethoscope: Stethoscope,
  graduation: GraduationCap,
  paw: PawPrint,
  smartphone: Smartphone,
  laptop: Laptop,
  gem: Gem,
  camera: Camera,
  music: Music,
  dumbbell: Dumbbell,
};

export const getIcon = (iconName, props = {}) => {
  const IconComponent = iconMap[iconName];

  if (!IconComponent) return null;

  return <IconComponent {...props} />;
};

export default iconMap;
