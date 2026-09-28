// src/components/data/loan/loanIcons.jsx

import {
  Home,
  Landmark,
  Building,
  Wallet,
  RefreshCw,
  TrendingUp,
  Globe,
  Home as HomeIcon,
  Trees,
  Building2,
  RefreshCcw,
  DollarSign,
  Users,
} from "lucide-react";

export const ICONS = {
  Home,
  HomeIcon,
  Landmark,
  Building,
  Building2,
  Wallet,
  RefreshCw,
  RefreshCcw,
  TrendingUp,
  Globe,
  Trees,
  DollarSign,
  Users,
};

export const getIcon = (name, props) => {
  const Cmp = ICONS[name] || Building2;
  return <Cmp {...props} />;
};
