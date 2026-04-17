import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardHero from "@/components/dashboard/DashboardHero";
import AccountStatusCard from "@/components/dashboard/AccountStatusCard";
import UsageCard from "@/components/dashboard/UsageCard";
import DownloadInstallSection from "@/components/dashboard/DownloadInstallSection";
import SettingsOverview from "@/components/dashboard/SettingsOverview";
import TestingSection from "@/components/dashboard/TestingSection";
import HelpSection from "@/components/dashboard/HelpSection";
import ConnectExtension from "@/components/ConnectExtension";
import Reveal from "@/components/landing/Reveal";
import SendSmartUsageCard from "@/components/SendSmartUsageCard";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="animate-fade-in">
        <DashboardHero />
      </div>

      <div className="container mx-auto px-6 pb-24 space-y-8">
        {/* Top row: Account + Usage */}
        <div className="grid md:grid-cols-2 gap-6">
          <Reveal className="hover-scale"><AccountStatusCard /></Reveal>
          <Reveal delay={80} className="hover-scale"><UsageCard /></Reveal>
        </div>

        {/* Send Smart usage (live from Send Smart backend) */}
        <Reveal delay={100}>
          <SendSmartUsageCard />
        </Reveal>

        {/* Pair Chrome extension */}
        <Reveal delay={120}>
          <div id="extension">
            <ConnectExtension />
          </div>
        </Reveal>

        {/* Download & Install */}
        <Reveal delay={160}>
          <DownloadInstallSection />
        </Reveal>

        {/* Settings overview */}
        <Reveal delay={200}>
          <SettingsOverview />
        </Reveal>

        {/* Two-column: Testing + Help */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Reveal delay={240} className="hover-scale"><TestingSection /></Reveal>
          <Reveal delay={300} className="hover-scale"><HelpSection /></Reveal>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
