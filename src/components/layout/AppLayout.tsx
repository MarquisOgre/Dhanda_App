import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LicenseExpired } from "@/components/LicenseExpired";
import { LicenseReminder } from "@/components/LicenseReminder";
import { useLicenseSettings } from "@/hooks/useLicenseSettings";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isLicenseValid, isLoading } = useLicenseSettings();

  // Show loading or check license validity
  if (!isLoading && !isLicenseValid()) {
    return <LicenseExpired />;
  }

  return (
    <div className="min-h-screen bg-background">
      <LicenseReminder />
      <Sidebar />
      <div className="ml-64 pb-16">
        <Header />
        <main className="p-6 animate-fade-in">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
