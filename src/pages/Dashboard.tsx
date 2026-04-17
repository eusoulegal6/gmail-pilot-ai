import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardHero from "@/components/dashboard/DashboardHero";
import AccountStatusCard from "@/components/dashboard/AccountStatusCard";
import UsageCard from "@/components/dashboard/UsageCard";
import DownloadInstallSection from "@/components/dashboard/DownloadInstallSection";
import TestingSection from "@/components/dashboard/TestingSection";
import HelpSection from "@/components/dashboard/HelpSection";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("pendingExtensionLogin") === "1") {
      localStorage.removeItem("pendingExtensionLogin");
      navigate("/extension-login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardHero />

      <div className="container mx-auto px-6 pb-24 space-y-8">
        {/* Top row: Account + Usage */}
        <div className="grid md:grid-cols-2 gap-6">
          <AccountStatusCard />
          <UsageCard />
        </div>

        {/* Download & Install */}
        <DownloadInstallSection />

        {/* Two-column: Testing + Help */}
        <div className="grid lg:grid-cols-2 gap-6">
          <TestingSection />
          <HelpSection />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
