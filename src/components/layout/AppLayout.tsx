import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LicenseExpired } from "@/components/LicenseExpired";
import { LicenseReminder } from "@/components/LicenseReminder";
import { isLicenseValid } from "@/lib/license";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  // Check license validity
  if (!isLicenseValid()) {
    return <LicenseExpired />;
  }

  return (
    <div className="min-h-screen bg-background">
      <LicenseReminder />
      <Sidebar />
      <div className="ml-64 pb-14">
        <Header />
        <main className="p-6 animate-fade-in">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
