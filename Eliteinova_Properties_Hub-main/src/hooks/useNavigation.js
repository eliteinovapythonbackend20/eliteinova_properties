import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchByCategory, searchByPropertyType, searchBySubCategory, searchByPurpose } from '../services/filterService';

// ============================================
// HOUSE TYPES
// ============================================
const houseTypes = [
  { name: "Independent House", path: "/individual/independent-house" },
  { name: "Independent Villa", path: "/individual/independent-villa" },
  { name: "Duplex Unit", path: "/individual/duplex-residential-unit" },
];

// ============================================
// APARTMENT TYPES
// ============================================
const apartmentTypes = [
  { name: "Rental Apartment", path: "/apartment/rental-apartment" },
  { name: "Serviced Apartment", path: "/apartment/serviced-apartment" },
  { name: "Lease Apartment", path: "/apartment/lease-apartment" },
  { name: "Residential Apartment", path: "/apartment/residential-apartments" },
  { name: "Gated Community Apartment", path: "/apartment/gated-community-apartment" },
  { name: "Studio Apartment", path: "/apartment/studio-apartment" },
  { name: "Duplex Apartment", path: "/apartment/duplex-apartment" },
  { name: "Luxury Apartment", path: "/apartment/luxury-apartment" },
  { name: "Condominium (Condo)", path: "/apartment/condominium" },
  { name: "Penthouse Apartment", path: "/apartment/penthouse-apartment" }
];

// ============================================
// COMMERCIAL TYPES
// ============================================
const commercialTypes = [
  { name: "Office Space", path: "/commercial/office-space"},
  { name: "Retail Shop", path: "/commercial/retail-shop"},
  { name: "Showroom", path: "/commercial/showroom" },
  { name: "Commercial Land / Plot", path: "/commercial/commercial-land-plot"},
  { name: "Warehouse / Godown", path: "/commercial/warehouse-godown"},
  { name: "Industrial Property / Factory", path: "/commercial/industrial-property-factory"},
  { name: "Co-working Space", path: "/commercial/coworking-space"},
  { name: "Business Center", path: "/commercial/business-center"},
  { name: "Shopping Mall Space", path: "/commercial/shopping-mall-space"},
  { name: "Commercial Complex", path: "/commercial/commercial-complex"},
  { name: "Restaurant / Café Space", path: "/commercial/restaurant-cafe-space"},
  { name: "Hotel / Lodge / Resort Property", path: "/commercial/hotel-lodge-resort-property"},
  { name: "Clinic / Hospital Space", path: "/commercial/clinic-hospital-space"},
  { name: "Educational Institution Property", path: "/commercial/educational-institution-property"},
  { name: "IT Park / Tech Park Space", path: "/commercial/it-park-tech-park-space"},
  { name: "Multiplex / Entertainment Space", path: "/commercial/multiplex-entertainment-space"},
  { name: "Petrol Bunk / Fuel Station", path: "/commercial/petrol-bunk-fuel-station"},
  { name: "Cold Storage / Logistics Hub", path: "/commercial/cold-storage-logistics-hub"},
  { name: "Mixed-use Commercial Property", path: "/commercial/mixed-use-commercial-property"},
  { name: "Agricultural Commercial Property", path: "/commercial/agricultural-commercial-property"}
];

// ============================================
// LAND & PLOTS TYPES
// ============================================
const landTypes = [
  { name: "All", path: "/land-plots" },
  { name: "Residential Land / Plots", path: "/land-plots/residential-land-plots" },
  { name: "Commercial Land / Plots", path: "/land-plots/commercial-land-plots" },
  { name: "Agricultural Land", path: "/land-plots/agricultural-land-plots" },
  { name: "Industrial Land", path: "/land-plots/industrial-land-plots" },
  { name: "Mixed-Use Land", path: "/land-plots/mixed-use-land-plots" },
  { name: "Institutional Land", path: "/land-plots/institutional-land-plots" },
  { name: "Investment & Special Purpose Land", path: "/land-plots/investment-land-plots" }
];

// ============================================
// LAND SUBMENU TYPES
// ============================================
const landSubMenuTypes = [
  // Residential submenus
  { propertyName: "Residential Land / Plots", name: "Gated Community Plot", path: "/land-plots/residential-land-plots/gated-community-plot" },
  { propertyName: "Residential Land / Plots", name: "DTCP & CMDA Approved Plot", path: "/land-plots/residential-land-plots/dtcp-cmda-approved-plot" },
  { propertyName: "Residential Land / Plots", name: "Residential Plot", path: "/land-plots/residential-land-plots/residential-plot" },
  { propertyName: "Residential Land / Plots", name: "Villa Plot", path: "/land-plots/residential-land-plots/villa-plot" },
  { propertyName: "Residential Land / Plots", name: "Farm House Plot", path: "/land-plots/residential-land-plots/farm-house-plot" },
  { propertyName: "Residential Land / Plots", name: "Common Plot", path: "/land-plots/residential-land-plots/common-plot" },
  { propertyName: "Residential Land / Plots", name: "Independent House Plot", path: "/land-plots/residential-land-plots/independent-house-plot" },
  { propertyName: "Residential Land / Plots", name: "Duplex House Plot", path: "/land-plots/residential-land-plots/duplex-house-plot" },
  { propertyName: "Residential Land / Plots", name: "Row House Plot", path: "/land-plots/residential-land-plots/row-house-plot" },
  // Commercial submenus
  { propertyName: "Commercial Land / Plots", name: "Commercial Plot", path: "/land-plots/commercial-land-plots/commercial-plot" },
  { propertyName: "Commercial Land / Plots", name: "Office Space Land", path: "/land-plots/commercial-land-plots/office-space-land" },
  { propertyName: "Commercial Land / Plots", name: "Retail Shop Plot", path: "/land-plots/commercial-land-plots/retail-shop-plot" },
  { propertyName: "Commercial Land / Plots", name: "Showroom Plot", path: "/land-plots/commercial-land-plots/showroom-plot" },
  { propertyName: "Commercial Land / Plots", name: "Shopping Complex Land", path: "/land-plots/commercial-land-plots/shopping-complex-land" },
  { propertyName: "Commercial Land / Plots", name: "Hotel / Resort Land", path: "/land-plots/commercial-land-plots/hotel-resort-land" },
  { propertyName: "Commercial Land / Plots", name: "Petrol Bunk Plot", path: "/land-plots/commercial-land-plots/petrol-bunk-plot" },
  { propertyName: "Commercial Land / Plots", name: "IT Park Land", path: "/land-plots/commercial-land-plots/it-park-land" },
  { propertyName: "Commercial Land / Plots", name: "Warehouse Land", path: "/land-plots/commercial-land-plots/warehouse-land" },
  { propertyName: "Commercial Land / Plots", name: "Industrial Commercial Plot", path: "/land-plots/commercial-land-plots/industrial-commercial-plot" },
  // Agricultural submenus
  { propertyName: "Agricultural Land", name: "Agricultural Land", path: "/land-plots/agricultural-land-plots/agricultural-land" },
  { propertyName: "Agricultural Land", name: "Farm Land", path: "/land-plots/agricultural-land-plots/farm-land" },
  { propertyName: "Agricultural Land", name: "Organic Farming Land", path: "/land-plots/agricultural-land-plots/organic-farming-land" },
  { propertyName: "Agricultural Land", name: "Coconut Farm Land", path: "/land-plots/agricultural-land-plots/coconut-farm-land" },
  { propertyName: "Agricultural Land", name: "Mango Grove Land", path: "/land-plots/agricultural-land-plots/mango-grove-land" },
  { propertyName: "Agricultural Land", name: "Tea / Coffee Estate", path: "/land-plots/agricultural-land-plots/tea-coffee-estate" },
  { propertyName: "Agricultural Land", name: "Poultry Farm Land", path: "/land-plots/agricultural-land-plots/poultry-farm-land" },
  { propertyName: "Agricultural Land", name: "Dairy Farm Land", path: "/land-plots/agricultural-land-plots/dairy-farm-land" },
  { propertyName: "Agricultural Land", name: "Fisheries / Aquaculture Land", path: "/land-plots/agricultural-land-plots/fisheries-aquaculture-land" },
  // Industrial submenus
  { propertyName: "Industrial Land", name: "Industrial Plot", path: "/land-plots/industrial-land-plots/industrial-plot" },
  { propertyName: "Industrial Land", name: "Factory Land", path: "/land-plots/industrial-land-plots/factory-land" },
  { propertyName: "Industrial Land", name: "Manufacturing Unit Plot", path: "/land-plots/industrial-land-plots/manufacturing-unit-plot" },
  { propertyName: "Industrial Land", name: "Logistics Hub Land", path: "/land-plots/industrial-land-plots/logistics-hub-land" },
  { propertyName: "Industrial Land", name: "Warehouse Plot", path: "/land-plots/industrial-land-plots/warehouse-plot" },
  { propertyName: "Industrial Land", name: "Cold Storage Land", path: "/land-plots/industrial-land-plots/cold-storage-land" },
  { propertyName: "Industrial Land", name: "SEZ Land", path: "/land-plots/industrial-land-plots/sez-land" },
  // Mixed-Use submenus
  { propertyName: "Mixed-Use Land", name: "Residential + Commercial Plot", path: "/land-plots/mixed-use-land-plots/residential-commercial-plot" },
  { propertyName: "Mixed-Use Land", name: "Commercial + Industrial Land", path: "/land-plots/mixed-use-land-plots/commercial-industrial-land" },
  { propertyName: "Mixed-Use Land", name: "Township Development Land", path: "/land-plots/mixed-use-land-plots/township-development-land" },
  { propertyName: "Mixed-Use Land", name: "Multi-purpose Development Land", path: "/land-plots/mixed-use-land-plots/multi-purpose-development-land" },
  // Institutional submenus
  { propertyName: "Institutional Land", name: "School / College Land", path: "/land-plots/institutional-land-plots/school-college-land" },
  { propertyName: "Institutional Land", name: "Hospital / Clinic Land", path: "/land-plots/institutional-land-plots/hospital-clinic-land" },
  { propertyName: "Institutional Land", name: "Training Institute Plot", path: "/land-plots/institutional-land-plots/training-institute-plot" },
  { propertyName: "Institutional Land", name: "Religious Institution Land", path: "/land-plots/institutional-land-plots/religious-institution-land" },
  // Investment submenus
  { propertyName: "Investment & Special Purpose Land", name: "Highway Facing Plot", path: "/land-plots/investment-land-plots/highway-facing-plot" },
  { propertyName: "Investment & Special Purpose Land", name: "Lake View Plot", path: "/land-plots/investment-land-plots/lake-view-plot" },
  { propertyName: "Investment & Special Purpose Land", name: "Hill View Plot", path: "/land-plots/investment-land-plots/hill-view-plot" },
  { propertyName: "Investment & Special Purpose Land", name: "Beach Side Plot", path: "/land-plots/investment-land-plots/beach-side-plot" },
  { propertyName: "Investment & Special Purpose Land", name: "River Side Land", path: "/land-plots/investment-land-plots/river-side-land" },
  { propertyName: "Investment & Special Purpose Land", name: "Eco Tourism Land", path: "/land-plots/investment-land-plots/eco-tourism-land" },
  { propertyName: "Investment & Special Purpose Land", name: "Layout Development Land", path: "/land-plots/investment-land-plots/layout-development-land" },
  { propertyName: "Investment & Special Purpose Land", name: "Future Investment Plot", path: "/land-plots/investment-land-plots/future-investment-plot" }
];


const hostelType = [
    { name: "Girls Hostel", path: "/hostel/girls-hostel"},
    { name: "Boys Hostel", path: "/hostel/boys-hostel"},
    { name: "Co Living Space", path: "/hostel/co-living-hostel"},
    { name: "Working Professional Hostel", path: "/hostel/working-professional-hostel"}
  ];



// ============================================
// COMMON CATEGORY
// ============================================
const commonCategory = [
  { label: "Individual", path: "/individual" },
  { label: "Apartment", path: "/apartment" },
  { label: "Commercial", path: "/commercial" },
  { label: "Land & Plots", path: "/land-plots" },
  { label: "Hostel", path: "/hostel" }
];



const purpose = [
  {name:"SELL", path:"/buy"},
  {name:"RENT",path:"/rent"},
  {name:"Lease",path:"/lease"}
]

// ============================================
// CREATE MAPS FOR QUICK LOOKUP
// ============================================

const housePathMap = new Map(houseTypes.map(type => [type.path, type.name]));
const apartmentPathMap = new Map(apartmentTypes.map(type => [type.path, type.name]));
const commercialPathMap = new Map(commercialTypes.map(type => [type.path, type.name]));
const landPathMap = new Map(landTypes.map(type => [type.path, type.name]));

// Land submenu maps
const landSubMenuPathMap = new Map(landSubMenuTypes.map(type => [type.path, type]));
const landSubMenuNameMap = new Map(landSubMenuTypes.map(type => [type.name, type]));
const landSubMenuPropertyMap = new Map(landSubMenuTypes.map(type => [type.propertyName, type]));

const hostelPathMap = new Map(hostelType.map(type => [type.path,type.name]));

const purposePathMap = new Map(purpose.map(purpose=>[purpose.path,purpose.name]));

// ============================================
// RAW TYPE LISTS (named exports)
// ============================================
// Property-type option lists per category, and the true Land & Plots
// subcategory list (landSubMenuTypes) - exported so other screens (e.g. the
// admin dashboard's Edit Property form) can source the exact same
// canonical property_type / sub_category strings used for browse filtering
// here, instead of hand-maintaining a second, drifting copy.
export { houseTypes, apartmentTypes, commercialTypes, landTypes, landSubMenuTypes, hostelType };

// ============================================
// USE NAVIGATION HOOK
// ============================================
function useNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [activeHouseType, setActiveHouseType] = useState("All");
  const [activeApartmentType, setActiveApartmentType] = useState("All");
  const [activeCommercialType, setActiveCommercialType] = useState("All");
  const [activeLandType, setActiveLandType] = useState("All");
  const [activeLandSubMenuType, setActiveLandSubMenuType] = useState(null);
  const [activeHostelType,setActiveHostelType] = useState("All");
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ============================================
  // FETCH DATA FUNCTION
  // ============================================
  const fetchFilteredData = async (currentPath) => {
    try {
      setLoading(true);
      
      // Check common category (main pages)
      const category = commonCategory.find(c => c.path === currentPath);
      if (category) {
        const response = await searchByCategory(category.label.toUpperCase());
        const filteredData = response?.data || [];
        setData(filteredData);
        console.log(`${category.label} Response:`, response);
        return;
      }
      
      // Check house types
      if (housePathMap.has(currentPath)) {
        const typeName = housePathMap.get(currentPath);
        const response = await searchByPropertyType(typeName);
        console.log(`response: ${response}`);
        const filteredData = response?.data?.data || response?.data || [];
        setData(filteredData);
        console.log("response: ",response);
        return;
      }
      
      // Check apartment types
      if (apartmentPathMap.has(currentPath)) {
        const typeName = apartmentPathMap.get(currentPath);
        const response = await searchByPropertyType(typeName);
        const filteredData = response?.data?.data || response?.data || [];
        setData(filteredData);
        console.log(`Apartment - ${typeName} Response:`, response);
        return;
      }
      
      // Check commercial types
      if (commercialPathMap.has(currentPath)) {
        const typeName = commercialPathMap.get(currentPath);
        const response = await searchByPropertyType(typeName);
        const filteredData = response?.data?.data || response?.data || [];
        
        setData(filteredData);

        console.log("data: ",data);
        return;
      }

      // ✅ Check land types
      if (landPathMap.has(currentPath)) {
        const typeName = landPathMap.get(currentPath);
        const response = await searchByPropertyType(typeName);
        const filteredData = response?.data?.data || response?.data || [];
        setData(filteredData);
        console.log(`Land - ${typeName} Response:`, response);
        return;
      }

      // ✅ Check land submenus
      if (landSubMenuPathMap.has(currentPath)) {
        const subMenu = landSubMenuPathMap.get(currentPath);
        const response = await searchBySubCategory(subMenu.name);
        const filteredData = response?.data?.data || response?.data || [];
        setData(filteredData);
        console.log(`Land SubMenu - ${subMenu.name} Response:`, response);
        return;
      }
      if(hostelPathMap.has(currentPath)){
        const typeName = hostelPathMap.get(currentPath);
        const response = await searchByPropertyType(typeName);
        const filteredData = response?.data?.data || response?.data || [];
        setData(filteredData);
        console.log(`Land - ${typeName} Response:`, response);
        return;
      }

      if(purposePathMap.has(currentPath)){
        const purpose = purposePathMap.get(currentPath);
        const response = await searchByPurpose(purpose);
        const filteredData = response?.data?.data || response?.data || [];
        setData(filteredData);
        console.log(`Listing Purpose - ${purpose} Response: `, response);
        return;
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // EFFECT - WATCH URL CHANGES
  // ============================================
  useEffect(() => {
    const currentPath = location.pathname;

    // Update active types based on URL
    if (housePathMap.has(currentPath)) {
      const typeName = housePathMap.get(currentPath);
      if (typeName !== activeHouseType) {
        setActiveHouseType(typeName);
      }
    } else if (apartmentPathMap.has(currentPath)) {
      const typeName = apartmentPathMap.get(currentPath);
      if (typeName !== activeApartmentType) {
        setActiveApartmentType(typeName);
      }
    } else if (commercialPathMap.has(currentPath)) {
      const typeName = commercialPathMap.get(currentPath);
      if (typeName !== activeCommercialType) {
        setActiveCommercialType(typeName);
      }
    } else if (landPathMap.has(currentPath)) {
      const typeName = landPathMap.get(currentPath);
      if (typeName !== activeLandType) {
        setActiveLandType(typeName);
        setActiveLandSubMenuType(null); // Reset submenu when main category is selected
      }
    } else if (landSubMenuPathMap.has(currentPath)) {
      const subMenu = landSubMenuPathMap.get(currentPath);
      if (subMenu.name !== activeLandSubMenuType) {
        setActiveLandSubMenuType(subMenu.name);
        // Also set the parent land type
        if (subMenu.propertyName !== activeLandType) {
          setActiveLandType(subMenu.propertyName);
        }
      }
    }
    else if(hostelPathMap.has(currentPath)){
      const typeName = hostelPathMap.get(currentPath);
      if (typeName !== activeHostelType) {
        setActiveHostelType(typeName);
      }
    }

    // Fetch data for matching paths
    if (
      commonCategory.some(b => b.path === currentPath) ||
      housePathMap.has(currentPath) ||
      apartmentPathMap.has(currentPath) ||
      commercialPathMap.has(currentPath) ||
      landPathMap.has(currentPath) ||
      landSubMenuPathMap.has(currentPath) ||
      hostelPathMap.has(currentPath) ||
      purposePathMap.has(currentPath)
    ) {
      fetchFilteredData(currentPath);
    }
    
  }, [location.pathname]);

  // ============================================
  // NAVIGATION HANDLER
  // ============================================
  const handleNavigation = (path, typeName = null) => {
    if (typeName) {
      if (housePathMap.has(path)) {
        setActiveHouseType(typeName);
      } else if (apartmentPathMap.has(path)) {
        setActiveApartmentType(typeName);
      } else if (commercialPathMap.has(path)) {
        setActiveCommercialType(typeName);
      } else if (landPathMap.has(path)) {
        setActiveLandType(typeName);
        setActiveLandSubMenuType(null);
      } else if (landSubMenuPathMap.has(path)) {
        const subMenu = landSubMenuPathMap.get(path);
        setActiveLandSubMenuType(typeName);
        setActiveLandType(subMenu.propertyName);
      }
      else if(hostelPathMap.has(path)){
        setActiveHostelType(typeName);
      }
    }
    navigate(path);
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  const getLandSubMenuDetails = (path) => {
    return landSubMenuPathMap.get(path) || null;
  };

  const getSubMenusByProperty = (propertyName) => {
    return landSubMenuTypes.filter(type => type.propertyName === propertyName);
  };

  // ============================================
  // RETURN
  // ============================================
  return {
    // Data
    data,
    loading,
    
    // Active types
    activeHouseType,
    activeApartmentType,
    activeCommercialType,
    activeLandType,
    activeLandSubMenuType,
    
    // Navigation
    handleNavigation,
    
    // Land helpers
    getLandSubMenuDetails,
    getSubMenusByProperty,
    landSubMenuPathMap,
    landSubMenuNameMap,
    landSubMenuPropertyMap,
    
    // Validation
    isValidPath: (path) => {
      return commonCategory.some(c => c.path === path) ||
             housePathMap.has(path) ||
             apartmentPathMap.has(path) ||
             commercialPathMap.has(path) ||
             landPathMap.has(path) ||
             landSubMenuPathMap.has(path);
    },
    
    getActiveType: (path) => {
      if (housePathMap.has(path)) return housePathMap.get(path);
      if (apartmentPathMap.has(path)) return apartmentPathMap.get(path);
      if (commercialPathMap.has(path)) return commercialPathMap.get(path);
      if (landPathMap.has(path)) return landPathMap.get(path);
      if (landSubMenuPathMap.has(path)) return landSubMenuPathMap.get(path).name;
      return null;
    }
  };
}

export default useNavigation;