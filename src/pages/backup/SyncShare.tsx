import {
  Cloud,
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  Clock,
  Smartphone,
  Monitor,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const syncedDevices = [
  { id: 1, name: "Desktop - Office", type: "desktop", lastSync: "2 minutes ago", status: "synced" },
  { id: 2, name: "Laptop - Home", type: "laptop", lastSync: "1 hour ago", status: "synced" },
  { id: 3, name: "Mobile - Samsung", type: "mobile", lastSync: "3 hours ago", status: "pending" },
];

const sharedUsers = [
  { id: 1, name: "Rajesh Kumar", email: "rajesh@company.com", role: "Admin", status: "active" },
  { id: 2, name: "Priya Sharma", email: "priya@company.com", role: "Accountant", status: "active" },
  { id: 3, name: "Amit Singh", email: "amit@company.com", role: "View Only", status: "pending" },
];

export default function SyncShare() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sync & Share</h1>
          <p className="text-muted-foreground">Manage data synchronization and sharing</p>
        </div>
        <Button className="btn-gradient gap-2">
          <RefreshCw className="w-4 h-4" />
          Sync Now
        </Button>
      </div>

      {/* Sync Status */}
      <div className="metric-card bg-gradient-to-r from-primary to-accent text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">All Data Synced</span>
            </div>
            <p className="text-2xl font-bold">Last sync: 2 minutes ago</p>
            <p className="text-sm opacity-80 mt-2">
              3 devices synced • 2.4 MB uploaded • 1.8 MB downloaded
            </p>
          </div>
          <Cloud className="w-20 h-20 opacity-30" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Synced Devices */}
        <div className="metric-card">
          <h3 className="font-semibold text-lg mb-4">Synced Devices</h3>
          <div className="space-y-4">
            {syncedDevices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {device.type === "mobile" ? (
                      <Smartphone className="w-5 h-5 text-primary" />
                    ) : (
                      <Monitor className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{device.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {device.lastSync}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    device.status === "synced"
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  )}
                >
                  {device.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shared Users */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Shared With</h3>
            <Button variant="outline" size="sm" className="gap-2">
              <Users className="w-4 h-4" />
              Invite User
            </Button>
          </div>
          <div className="space-y-4">
            {sharedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-muted">
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Backup Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Cloud className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold">Auto Backup</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Automatic daily backup to cloud
          </p>
          <Button variant="outline" className="mt-4 w-full">
            Configure
          </Button>
        </div>
        <div className="metric-card text-center">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Download className="w-6 h-6 text-accent" />
          </div>
          <h3 className="font-semibold">Download Backup</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Download data to your computer
          </p>
          <Button variant="outline" className="mt-4 w-full">
            Download
          </Button>
        </div>
        <div className="metric-card text-center">
          <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-warning" />
          </div>
          <h3 className="font-semibold">Restore Backup</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Restore data from a backup file
          </p>
          <Button variant="outline" className="mt-4 w-full">
            Restore
          </Button>
        </div>
      </div>
    </div>
  );
}
