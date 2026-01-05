import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LicenseExpired } from "@/components/LicenseExpired";
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
    <div className="min-h-screen bg-background flex flex-col">
      <Sidebar />
      <div className="ml-64 flex flex-col flex-1">
        <Header />
        <main className="p-6 animate-fade-in flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
