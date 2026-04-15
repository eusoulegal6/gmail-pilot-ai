import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ProductModesSection from "@/components/landing/ProductModesSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import InstallSection from "@/components/landing/InstallSection";
import CustomizationSection from "@/components/landing/CustomizationSection";
import PricingSection from "@/components/landing/PricingSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <ProductModesSection />
      <BenefitsSection />
      <InstallSection />
      <CustomizationSection />
      <PricingSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
};

export default Index;
