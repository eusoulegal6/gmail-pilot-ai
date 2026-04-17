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
    // Magic-link callback always lands with auth tokens in the URL hash
    // (e.g. #access_token=...&type=magiclink). When present, the user just
    // clicked an email sign-in link — forward them to /extension-login.
    const hash = window.location.hash || "";
    const isMagicLinkCallback =
      hash.includes("access_token") || hash.includes("type=magiclink");
    const flagged = localStorage.getItem("pendingExtensionLogin") === "1";

    if (isMagicLinkCallback || flagged) {
      localStorage.removeItem("pendingExtensionLogin");
      navigate("/extension-login" + hash, { replace: true });
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
