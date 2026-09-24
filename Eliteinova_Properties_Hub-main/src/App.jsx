import React, { useState, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./context/authContext.jsx";
import ProtectedRoute from "./models/ProtectedRoute.jsx";

import Header from "./components/common/Header";
import CustomerLoginWrapper  from "./components/login/CustomerLoginWrapper.jsx";
import HomePage from "./pages/HomePage.jsx";
// const HomePage = lazy(() => import("./pages/HomePage"));
const PostPropertyPage = lazy(() => import("./pages/PostPropertyPage"));
const CustomerPortalPage = lazy(() => import("./pages/CustomerPortalPage"));
const IndividualPage = lazy(() => import("./pages/Individual/IndividualPage"));
const BuyPage = lazy(() => import("./pages/BuyPage"));
const LeasePage = lazy(() => import("./pages/LeasePage"));
// import RentPage from "./pages/RentPage";
// import SellPage from "./pages/SellPage";
const ApartmentPage = lazy(() => import("./pages/Apartment/ApartmentPage"));
const CommercialPage = lazy(() => import("./pages/Commercial/CommercialPage"));
const LandPlotsPage = lazy(() => import("./pages/LandAndPlots/LandAndPlotsPage"));
const HostelPage = lazy(() => import("./pages/Hostel/HostelPage"));

// Import all house type pages
const IndependentHousePage = lazy(() => import("./pages/Individual/IndependentHousePage"));
const IndependentVillaPage = lazy(() => import("./pages/Individual/IndependentVillaPage"));
const ResidentialApartmentPage = lazy(() => import("./pages/Individual/ResidentialApartmentPage"));
const DuplexResidentialUnitPage = lazy(() => import("./pages/Individual/DuplexResidentialUnitPage"));
const RowHousePage = lazy(() => import("./pages/Individual/RowHousePage"));

// Import all apartment type pages
const RentalApartmentPage = lazy(() => import('./pages/Apartment/RentalApartmentPage'));
const ServicedApartmentPage = lazy(() => import('./pages/Apartment/ServicedApartmentPage'));
const LeaseApartmentPage = lazy(() => import('./pages/Apartment/LeaseApartmentPage'));
const ResidentialApartmentsPage = lazy(() => import('./pages/Apartment/ResidentialApartmentsPage'));
const GatedCommunityApartmentPage = lazy(() => import('./pages/Apartment/GatedCommunityApartmentPage'));
const StudioApartmentPage = lazy(() => import('./pages/Apartment/StudioApartmentPage'));
const DuplexApartmentPage = lazy(() => import('./pages/Apartment/DuplexApartmentPage'));
const LuxuryApartmentPage = lazy(() => import('./pages/Apartment/LuxuryApartmentPage'));
const CondominiumApartmentPage = lazy(() => import('./pages/Apartment/CondominiumApartmentPage'));
const PentHouseApartmentPage = lazy(() => import('./pages/Apartment/PentHouseApartmentPage'));

//Import all commercial type pages
const OfficeSpacePage = lazy(() => import('./pages/Commercial/OfficeSpacePage'));
const RetailShopPage = lazy(() => import('./pages/Commercial/RetailShopPage'));
const ShowroomPage = lazy(() => import('./pages/Commercial/ShowroomPage'));
const CommercialLandPage = lazy(() => import('./pages/Commercial/CommercialLandPage'));
const WareHousePage = lazy(() => import('./pages/Commercial/WareHousePage'));
const IndustrialPropertyPage = lazy(() => import('./pages/Commercial/IndustrialPropertyPage'));
const CoWorkingSpacePage = lazy(() => import('./pages/Commercial/CoWorkingSpacePage'));
const BusinessCenterPage = lazy(() => import('./pages/Commercial/BusinessCenterPage'));
const ShoppingMallSpacePage = lazy(() => import('./pages/Commercial/ShoppingMallSpacePage'));
const CommercialComplexPage = lazy(() => import('./pages/Commercial/CommercialComplexPage'));
const RestaurantPage = lazy(() => import('./pages/Commercial/RestaurantPage'));
const HotelPage = lazy(() => import('./pages/Commercial/HotelPage'));
const ClinicPage = lazy(() => import('./pages/Commercial/ClinicPage'));
const EducationalPage = lazy(() => import('./pages/Commercial/EducationalPage'));
const ITParkPage = lazy(() => import('./pages/Commercial/ITParkPage'));
const MultiplexPage = lazy(() => import('./pages/Commercial/MultiplexPage'));
const PertrolBunkPage = lazy(() => import('./pages/Commercial/PetrolBunkPage'));
const ColdStoragePage = lazy(() => import('./pages/Commercial/ColdStoragePage'));
const MixedUsePage = lazy(() => import('./pages/Commercial/MixedUsePage'));
const AgriculturalPage = lazy(() => import('./pages/Commercial/AgriculturalPage'));

// Import all land and plot type pages
const ResidentialLandPlotsPage = lazy(() => import('./pages/LandAndPlots/ResidentialLandPlotsPage'));
const ResidentialPlotPage = lazy(() => import('./pages/LandAndPlots/ResidentialPlotPage'));
const DTCPPlotPage = lazy(() => import('./pages/LandAndPlots/DTCPPlotPage'));
const GatedCommunityPlotPage = lazy(() => import('./pages/LandAndPlots/GatedCommunityPlotPage'));
const VillaPlotPage = lazy(() => import('./pages/LandAndPlots/VillaPlotPage'));
const FarmHousePlotPage = lazy(() => import('./pages/LandAndPlots/FarmHousePlotPage'));
const CommonPlotPage = lazy(() => import('./pages/LandAndPlots/CommonPlotPage'));
const DuplexHousePlotPage = lazy(() => import('./pages/LandAndPlots/DuplexHousePlotPage'));
const IndependentHousePlotPage = lazy(() => import('./pages/LandAndPlots/IndependentHousePlotPage'));
const RowHousePlotPage = lazy(() => import('./pages/LandAndPlots/RowHousePlotPage'));

const CommercialLandPlotsPage = lazy(() => import('./pages/LandAndPlots/CommercialLandPlotsPage'));
const CommercialPlotPage = lazy(() => import('./pages/LandAndPlots/CommercialPlotPage'));
const OfficeSpaceLandPage = lazy(() => import('./pages/LandAndPlots/OfficeSpaceLandPage'));
const RetailShopPlotPage = lazy(() => import('./pages/LandAndPlots/RetailShopPlotPage'));
const ShowroomPlotPage = lazy(() => import('./pages/LandAndPlots/ShowroomPlotPage'));
const ShoppingComplexLandPage = lazy(() => import('./pages/LandAndPlots/ShoppingComplexLandPage'));
const HotelResortLandPage = lazy(() => import('./pages/LandAndPlots/HotelResortLandPage'));
const PetrolBunkPlotPage = lazy(() => import('./pages/LandAndPlots/PetrolBunkPlotPage'));
const ITParkLandPage = lazy(() => import('./pages/LandAndPlots/ITParkLandPage'));
const WarehouseLandPage = lazy(() => import('./pages/LandAndPlots/WarehouseLandPage'));
const IndustrialCommercialPlotPage = lazy(() => import('./pages/LandAndPlots/IndustrialCommercialPlotPage'));

const AgriculturalLandPlotsPage = lazy(() => import('./pages/LandAndPlots/AgriculturalLandPlotsPage'));
const AgriculturalLandPage = lazy(() => import('./pages/LandAndPlots/AgriculturalLandPage'));
const FarmLandPage = lazy(() => import('./pages/LandAndPlots/FarmLandPage'));
const OrganicFarmingLandPage = lazy(() => import('./pages/LandAndPlots/OrganicFarmingLandPage'));
const CoconutFarmLandPage = lazy(() => import('./pages/LandAndPlots/CoconutFarmLandPage'));
const MangoGroveLandPage = lazy(() => import('./pages/LandAndPlots/MangoGroveLandPage'));
const TeaCoffeeLandPage = lazy(() => import('./pages/LandAndPlots/TeaCoffeeLandPage'));
const DairyFarmLandPage = lazy(() => import('./pages/LandAndPlots/DairyFarmLandPage.jsx'));
const FisheriesAquacultureLandPage = lazy(() => import('./pages/LandAndPlots/FisheriesAquacultureLandPage'));
const PoultryFarmLandPage = lazy(() => import('./pages/LandAndPlots/PoultryFarmLandPage'));

const IndustrialLandPlotPage = lazy(() => import("./pages/LandAndPlots/IndustrialLandPlotPage.jsx"));
const IndustrialPlotPage = lazy(() => import('./pages/LandAndPlots/IndustrialPlotPage'));
const FactoryLandPage = lazy(() => import('./pages/LandAndPlots/FactoryLandPage'));
const ManufacturingUnitPlotPage = lazy(() => import('./pages/LandAndPlots/ManufacturingUnitPlotPage'));
const LogisticsHubLandPage = lazy(() => import('./pages/LandAndPlots/LogisticsHubLandPage'));
const WarehousePlotPage = lazy(() => import('./pages/LandAndPlots/WarehousePlotPage'));
const ColdStorageLandPage = lazy(() => import('./pages/LandAndPlots/ColdStorageLandPage'));
const SEZLandPage = lazy(() => import('./pages/LandAndPlots/SEZLandPage'));

const MixedUseLandPlotPage = lazy(() => import('./pages/LandAndPlots/MixedUseLandPlotPage'));
const ResidentialCommercialPlotPage = lazy(() => import('./pages/LandAndPlots/ResidentialCommercialPlotPage'));
const CommercialIndustrialLandPage = lazy(() => import('./pages/LandAndPlots/CommercialIndustrialLandPage'));
const TownshipDevelopmentLandPage = lazy(() => import('./pages/LandAndPlots/TownshipDevelopmentLandPage'));
const MultiPurposeDevelopmentLandPage = lazy(() => import('./pages/LandAndPlots/MultiPurposeDevelopmentLandPage'));

const InstitutionalLandPlotPage = lazy(() => import('./pages/LandAndPlots/InstitutionalLandPlotPage'));
const SchoolCollegeLandPage = lazy(() => import('./pages/LandAndPlots/SchoolCollegeLandPage'));
const HospitalClinicLandPage = lazy(() => import('./pages/LandAndPlots/HospitalClinicLandPage'));
const TrainingInstitutePlotPage = lazy(() => import('./pages/LandAndPlots/TrainingInstitutePlotPage'));
const ReligiousInstitutionLandPage = lazy(() => import('./pages/LandAndPlots/ReligiousInstitutionLandPage'));

const InvestmentLandPlotPage = lazy(() => import('./pages/LandAndPlots/InvestmentLandPlotPage'));
const HighwayFacingPlotPage = lazy(() => import('./pages/LandAndPlots/HighwayFacingPlotPage'));
const LakeViewPlotPage = lazy(() => import('./pages/LandAndPlots/LakeViewPlotPage'));
const HillViewPlotPage = lazy(() => import('./pages/LandAndPlots/HillViewPlotPage'));
const BeachSidePlotPage = lazy(() => import('./pages/LandAndPlots/BeachSidePlotPage'));
const RiverSideLandPage = lazy(() => import('./pages/LandAndPlots/RiverSideLandPage'));
const EcoTourismLandPage = lazy(() => import('./pages/LandAndPlots/EcoTourismLandPage'));
const LayoutDevelopmentLandPage = lazy(() => import('./pages/LandAndPlots/LayoutDevelopmentLandPage'));
const FutureInvestmentPlotPage = lazy(() => import('./pages/LandAndPlots/FutureInvestmentPlotPage'));

//Hostel
const GirlsHostelPage = lazy(() => import("./pages/Hostel/GirlsHostelPage"));
const BoysHostelPage = lazy(() => import("./pages/Hostel/BoysHostelPage.jsx"));
const CoLivingSpacePage = lazy(() => import("./pages/Hostel/CoLivingSpacePage.jsx"));
const WorkingProfessionalHostelPage = lazy(() => import("./pages/Hostel/WorkingProfessionalHostelPage.jsx"));

// Import all form modals
// import OwnerFormModal from "./components/Forms/OwnerFormModal";
// import AgentFormModal from "./components/Forms/AgentFormModal";
// import BuilderFormModal from "./components/Forms/BuilderFormModal";
// import HostelFormModal from "./components/Forms/HostelFormModal";
// import PropertyManagementFormModal from "./components/Forms/PropertyManagementFormModal";


const OwnerProfile = lazy(() => import("./components/profiles/OwnerProfile.jsx"));
const AgentProfile = lazy(() => import("./components/profiles/AgentProfile.jsx"));
const BuilderProfile = lazy(() => import("./components/profiles/BuilderProfile.jsx"));
const PropertyManagementProfile = lazy(() => import("./components/profiles/PropertyManagementProfile"));
const AdminDashboard = lazy(() => import("./components/dashboard/AdminDashboard"));

function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Access denied</h1>
      <p className="text-gray-500">You don't have permission to view this page.</p>
    </div>
  );
}

function AppLayout() {
  const [openOwnerForm, setOpenOwnerForm] = useState(false);
  const [openAgentForm, setOpenAgentForm] = useState(false);
  const [openBuilderForm, setOpenBuilderForm] = useState(false);
  const [openHostelForm, setOpenHostelForm] = useState(false);
  const [openPropertyManagementForm, setOpenPropertyManagementForm] = useState(false);

  // Central control from Header
  const handlePostPropertyClick = (type) => {
    console.log("Form clicked:", type);

    if (type === "Owner") {
      setOpenOwnerForm(true);
    } else if (type === "Agent") {
      setOpenAgentForm(true);
    } else if (type === "Builder") {
      setOpenBuilderForm(true);
    } else if (type === "Hostel") {
      setOpenHostelForm(true);
    } else if (type === "Property Management") {
      setOpenPropertyManagementForm(true);
    }
  };

  return (
    <>
      {/* HEADER (fixed) */}
      <Header
        onMenuToggle={() => {}}
        onPostPropertyClick={handlePostPropertyClick}
      />

      {/* FORM MODALS */}
      {openOwnerForm && (
        <OwnerFormModal
          isOpen={openOwnerForm}
          onClose={() => setOpenOwnerForm(false)}
        />
      )}

      {openAgentForm && (
        <AgentFormModal
          isOpen={openAgentForm}
          onClose={() => setOpenAgentForm(false)}
        />
      )}

      {openBuilderForm && (
        <BuilderFormModal
          isOpen={openBuilderForm}
          onClose={() => setOpenBuilderForm(false)}
        />
      )}

      {openHostelForm && (
        <HostelFormModal
          isOpen={openHostelForm}
          onClose={() => setOpenHostelForm(false)}
        />
      )}

      {openPropertyManagementForm && (
        <PropertyManagementFormModal
          isOpen={openPropertyManagementForm}
          onClose={() => setOpenPropertyManagementForm(false)}
        />
      )}

      {/* MAIN CONTENT — compensate fixed header height */}
      <main className="pt-[90px] md:pt-[132px]">
        <Suspense fallback={null}>
        <Routes>

          <Route path="/login" element={<CustomerLoginWrapper />} />
          <Route path="/profile/owner" element={<OwnerProfile/>} />
           <Route path="/profile/agent" element={<AgentProfile/>} />
           <Route path="/profile/builder" element={<BuilderProfile/>} />
          <Route path="/profile/property-management" element={<PropertyManagementProfile/>} />


          <Route path="/" element={<HomePage />} />
          <Route path="/customer-portal" element={<CustomerPortalPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']} redirectTo="/login">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Customer Portal Routes */}
          <Route path="/individual" element={<IndividualPage />} />
          <Route path="/apartment" element={<ApartmentPage />} />
          <Route path="/commercial" element={<CommercialPage />} />
          <Route path="/land-plots" element={<LandPlotsPage />} />
          <Route path="/hostel" element={<HostelPage />} />
          {/* <Route path="/rent" element={<RentPage />} />
          <Route path="/buy" element={<BuyPage />} />
          <Route path="/lease" element={<LeasePage />} />
          <Route path="/sell" element={<SellPage />} /> */}


          {/* Individual House Type Routes */}
          <Route path="/individual/independent-house" element={<IndependentHousePage />} />
          <Route path="/individual/independent-villa" element={<IndependentVillaPage />} />
          <Route path="/individual/residential-apartment" element={<ResidentialApartmentPage />} />
          <Route path="/individual/duplex-residential-unit" element={<DuplexResidentialUnitPage />} />
          <Route path="/individual/row-house" element={<RowHousePage />} />

          {/* Apartment House  Type Routes */}
          <Route path="/apartment/rental-apartment" element={<RentalApartmentPage />} />
          <Route path="/apartment/serviced-apartment" element={<ServicedApartmentPage />} />
          <Route path="/apartment/lease-apartment" element={<LeaseApartmentPage />} />
          <Route path="/apartment/residential-apartments" element={<ResidentialApartmentsPage />} />
          <Route path="/apartment/gated-community-apartment" element={<GatedCommunityApartmentPage/>} />
          <Route path="/apartment/studio-apartment" element={<StudioApartmentPage/>} />
          <Route path="/apartment/duplex-apartment" element={<DuplexApartmentPage/>} />
          <Route path="/apartment/luxury-apartment" element={<LuxuryApartmentPage/>} />
          <Route path="/apartment/condominium" element={<CondominiumApartmentPage/>} />
          <Route path="/apartment/penthouse-apartment" element={<PentHouseApartmentPage/>} />

          {/* Commercial Type Routes */}
          <Route path="/commercial/office-space" element={<OfficeSpacePage />} />
          <Route path="/commercial/retail-shop" element={<RetailShopPage />} />
          <Route path="/commercial/showroom" element={<ShowroomPage />} />
          <Route path="/commercial/commercial-land-plot" element={<CommercialLandPage />} />
          <Route path="/commercial/warehouse-godown" element={<WareHousePage />} />
          <Route path="/commercial/industrial-property-factory" element={<IndustrialPropertyPage />} />
          <Route path="/commercial/coworking-space" element={<CoWorkingSpacePage />} />
          <Route path="/commercial/business-center" element={<BusinessCenterPage />} />
          <Route path="/commercial/shopping-mall-space" element={<ShoppingMallSpacePage />} />
          <Route path="/commercial/commercial-complex" element={<CommercialComplexPage />} />
          <Route path="/commercial/restaurant-cafe-space" element={<RestaurantPage />} />
          <Route path="/commercial/hotel-lodge-resort-property" element={<HotelPage />} />
          <Route path="/commercial/clinic-hospital-space" element={<ClinicPage />} />
          <Route path="/commercial/educational-institution-property" element={<EducationalPage />} />
          <Route path="/commercial/it-park-tech-park-space" element={<ITParkPage />} />
          <Route path="/commercial/multiplex-entertainment-space" element={<MultiplexPage />} />
          <Route path="/commercial/petrol-bunk-fuel-station" element={<PertrolBunkPage />} />
          <Route path="/commercial/cold-storage-logistics-hub" element={<ColdStoragePage />} />
          <Route path="/commercial/mixed-use-commercial-property" element={<MixedUsePage/>} />
          <Route path="/commercial/agricultural-commercial-property" element={<AgriculturalPage/>} />

          {/* Land and Plots Type Routes */}
          <Route path="/land-plots/residential-land-plots" element={<ResidentialLandPlotsPage/>} />
          <Route path="/land-plots/residential-land-plots/residential-plot" element={<ResidentialPlotPage/>} />
          <Route path="/land-plots/residential-land-plots/dtcp-cmda-approved-plot" element={<DTCPPlotPage/>} />
          <Route path="/land-plots/residential-land-plots/gated-community-plot" element={<GatedCommunityPlotPage/>} />
          <Route path="/land-plots/residential-land-plots/villa-plot" element={<VillaPlotPage/>} />
          <Route path="/land-plots/residential-land-plots/farm-house-plot" element={<FarmHousePlotPage/>} />
          <Route path="/land-plots/residential-land-plots/common-plot" element={<CommonPlotPage/>} />
          <Route path="/land-plots/residential-land-plots/row-house-plot" element={<RowHousePlotPage/>} />
          <Route path="/land-plots/residential-land-plots/duplex-house-plot" element={<DuplexHousePlotPage/>} />
          <Route path="/land-plots/residential-land-plots/independent-house-plot" element={<IndependentHousePlotPage/>} />

          <Route path="/land-plots/commercial-land-plots" element={<CommercialLandPlotsPage/>} />
          <Route path="/land-plots/commercial-land-plots/commercial-plot" element={<CommercialPlotPage/>} />
          <Route path="/land-plots/commercial-land-plots/office-space-land" element={<OfficeSpaceLandPage/>} />
          <Route path="/land-plots/commercial-land-plots/retail-shop-plot" element={<RetailShopPlotPage/>} />
          <Route path="/land-plots/commercial-land-plots/showroom-plot" element={<ShowroomPlotPage/>} />
          <Route path="/land-plots/commercial-land-plots/shopping-complex-land" element={<ShoppingComplexLandPage/>} />
          <Route path="/land-plots/commercial-land-plots/hotel-resort-land" element={<HotelResortLandPage/>} />
          <Route path="/land-plots/commercial-land-plots/petrol-bunk-plot" element={<PetrolBunkPlotPage/>} />
          <Route path="/land-plots/commercial-land-plots/it-park-land" element={<ITParkLandPage/>} />
          <Route path="/land-plots/commercial-land-plots/warehouse-land" element={<WarehouseLandPage/>} />
          <Route path="/land-plots/commercial-land-plots/industrial-commercial-plot" element={<IndustrialCommercialPlotPage/>} />

         <Route path="/land-plots/agricultural-land-plots" element={<AgriculturalLandPlotsPage/>} />
        <Route path="/land-plots/agricultural-land-plots/agricultural-land" element={<AgriculturalLandPage/>} />
        <Route path="/land-plots/agricultural-land-plots/farm-land" element={<FarmLandPage/>} />
        <Route path="/land-plots/agricultural-land-plots/organic-farming-land" element={<OrganicFarmingLandPage/>} />
        <Route path="/land-plots/agricultural-land-plots/coconut-farm-land" element={<CoconutFarmLandPage/>} />
        <Route path="/land-plots/agricultural-land-plots/mango-grove-land" element={<MangoGroveLandPage/>} />
        <Route path="/land-plots/agricultural-land-plots/tea-coffee-estate" element={<TeaCoffeeLandPage/>} />
        <Route path="/land-plots/agricultural-land-plots/poultry-farm-land" element={<PoultryFarmLandPage/>} />
        <Route path="/land-plots/agricultural-land-plots/dairy-farm-land" element={<DairyFarmLandPage/>} />
        <Route path="/land-plots/agricultural-land-plots/fisheries-aquaculture-land" element={<FisheriesAquacultureLandPage/>} />


        {/* Industrial land  Routes */}

           <Route path="/land-plots/industrial-land-plots" element={<IndustrialLandPlotPage/>} />
           <Route path="/land-plots/industrial-land-plots/industrial-plot" element={<IndustrialPlotPage/>} />
           <Route path="land-plots/industrial-land-plots/factory-land" element={<FactoryLandPage/>} />
           <Route path="/land-plots/industrial-land-plots/manufacturing-unit-plot" element={<ManufacturingUnitPlotPage/>} />
           <Route path="/land-plots/industrial-land-plots/logistics-hub-land" element={<LogisticsHubLandPage/>} />
           <Route path="/land-plots/industrial-land-plots/warehouse-plot" element={<WarehousePlotPage/>} />
           <Route path="/land-plots/industrial-land-plots/cold-storage-land" element={<ColdStorageLandPage/>} />
           <Route path="/land-plots/industrial-land-plots/sez-land" element={<SEZLandPage/>} />

           {/* Mixed-Use land  Routes */}

           <Route path="/land-plots/mixed-use-land-plots" element={<MixedUseLandPlotPage/>} />
           <Route path="/land-plots/mixed-use-land-plots/residential-commercial-plot" element={<ResidentialCommercialPlotPage/>} />
           <Route path="/land-plots/mixed-use-land-plots/commercial-industrial-land" element={<CommercialIndustrialLandPage/>} />
           <Route path="/land-plots/mixed-use-land-plots/township-development-land" element={<TownshipDevelopmentLandPage/>} />
           <Route path="/land-plots/mixed-use-land-plots/multi-purpose-development-land" element={<MultiPurposeDevelopmentLandPage/>} />

           {/* Institutional land  Routes */}

           <Route path="/land-plots/institutional-land-plots" element={<InstitutionalLandPlotPage/>} />
           <Route path="/land-plots/institutional-land-plots/school-college-land" element={<SchoolCollegeLandPage/>} />
           <Route path="/land-plots/institutional-land-plots/hospital-clinic-land" element={<HospitalClinicLandPage/>} />
           <Route path="/land-plots/institutional-land-plots/training-institute-plot" element={<TrainingInstitutePlotPage/>} />
           <Route path="/land-plots/institutional-land-plots/religious-institution-land" element={<ReligiousInstitutionLandPage/>} />

           {/* Investment land  Routes */}

           <Route path="/land-plots/investment-land-plots" element={<InvestmentLandPlotPage/>} />
           <Route path="/land-plots/investment-land-plots/highway-facing-plot" element={<HighwayFacingPlotPage/>} />
           <Route path="/land-plots/investment-land-plots/lake-view-plot" element={<LakeViewPlotPage/>} />
           <Route path="/land-plots/investment-land-plots/hill-view-plot" element={<HillViewPlotPage/>} />
           <Route path="/land-plots/investment-land-plots/beach-side-plot" element={<BeachSidePlotPage/>} />
           <Route path="/land-plots/investment-land-plots/river-side-land" element={<RiverSideLandPage/>} />
           <Route path="/land-plots/investment-land-plots/eco-tourism-land" element={<EcoTourismLandPage/>} />
           <Route path="/land-plots/investment-land-plots/layout-development-land" element={<LayoutDevelopmentLandPage/>} />
           <Route path="/land-plots/investment-land-plots/future-investment-plot" element={<FutureInvestmentPlotPage/>} />

          {/* Hostel */}

          <Route path="/hostel/girls-hostel" element={<GirlsHostelPage/>} />
          <Route path="/hostel/boys-hostel" element={<BoysHostelPage/>} />
          <Route path="/hostel/co-living-hostel" element={<CoLivingSpacePage/>} />
          <Route path="/hostel/working-professional-hostel" element={<WorkingProfessionalHostelPage/>} />

          <Route
            path="/post-property"
            element={<PostPropertyPage onPostPropertyClick={handlePostPropertyClick} />}
          />
        </Routes>
        </Suspense>
      </main>
    </>
  );
}





export default function App() {
  return (
   <AuthProvider>
    <Router>
      <AppLayout />
    </Router>
    </AuthProvider>
  );
}
