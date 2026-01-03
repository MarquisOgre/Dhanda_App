import { useState } from "react";
import { Clock, HardDrive, Settings, CheckCircle, AlertCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const backupHistory = [
  { id: 1, date: "02 Jan 2026, 11:30 PM", size: "12.5 MB", status: "success" },
  { id: 2, date: "01 Jan 2026, 11:30 PM", size: "12.3 MB", status: "success" },
  { id: 3, date: "31 Dec 2025, 11:30 PM", size: "12.1 MB", status: "success" },
  { id: 4, date: "30 Dec 2025, 11:30 PM", size: "11.9 MB", status: "failed" },
  { id: 5, date: "29 Dec 2025, 11:30 PM", size: "11.8 MB", status: "success" },
];

export default function AutoBackup() {
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [frequency, setFrequency] = useState("daily");
  const [time, setTime] = useState("23:30");
  const [retention, setRetention] = useState("30");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Auto Backup</h1>
          <p className="text-muted-foreground">Configure automatic data backups</p>
        </div>
      </div>

      {/* Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Auto Backup Status</p>
            {autoBackupEnabled ? (
              <CheckCircle className="w-5 h-5 text-success" />
            ) : (
              <AlertCircle className="w-5 h-5 text-warning" />
            )}
          </div>
          <p className={`text-xl font-bold mt-2 ${autoBackupEnabled ? 'text-success' : 'text-warning'}`}>
            {autoBackupEnabled ? 'Enabled' : 'Disabled'}
          </p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Last Backup</p>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xl font-bold mt-2">02 Jan 2026</p>
          <p className="text-xs text-muted-foreground">11:30 PM</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Backups</p>
            <HardDrive className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xl font-bold mt-2">127</p>
          <p className="text-xs text-muted-foreground">58.5 MB total</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="metric-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Backup Settings
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Enable Auto Backup</Label>
                <p className="text-sm text-muted-foreground">Automatically backup your data</p>
              </div>
              <Switch
                checked={autoBackupEnabled}
                onCheckedChange={setAutoBackupEnabled}
              />
            </div>

            <div className="space-y-2">
              <Label>Backup Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Every Hour</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Backup Time</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Retention Period</Label>
              <Select value={retention} onValueChange={setRetention}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="14">14 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                  <SelectItem value="365">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Backups older than {retention} days will be automatically deleted
              </p>
            </div>

            <Button className="btn-gradient w-full">Save Settings</Button>
          </div>
        </div>

        {/* Backup History */}
        <div className="metric-card">
          <h3 className="font-semibold mb-4">Recent Backups</h3>
          
          <div className="space-y-3">
            {backupHistory.map((backup) => (
              <div
                key={backup.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  {backup.status === "success" ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{backup.date}</p>
                    <p className="text-xs text-muted-foreground">{backup.size}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  backup.status === "success" 
                    ? "bg-success/10 text-success" 
                    : "bg-destructive/10 text-destructive"
                }`}>
                  {backup.status === "success" ? "Success" : "Failed"}
                </span>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-4">
            View All Backups
          </Button>
        </div>
      </div>
    </div>
  );
}
