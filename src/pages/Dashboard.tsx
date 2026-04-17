import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardHero from "@/components/dashboard/DashboardHero";
import AccountStatusCard from "@/components/dashboard/AccountStatusCard";
import UsageCard from "@/components/dashboard/UsageCard";
import SetupChecklist from "@/components/dashboard/SetupChecklist";
import DownloadInstallSection from "@/components/dashboard/DownloadInstallSection";
import SettingsOverview from "@/components/dashboard/SettingsOverview";
import TestingSection from "@/components/dashboard/TestingSection";
import HelpSection from "@/components/dashboard/HelpSection";
import ExtensionPromoCard from "@/components/dashboard/ExtensionPromoCard";

const Dashboard = () => {
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

        {/* Chrome extension promo */}
        <ExtensionPromoCard />

        {/* Setup checklist */}
        <SetupChecklist />

        {/* Download & Install */}
        <DownloadInstallSection />

        {/* Settings overview */}
        <SettingsOverview />

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
