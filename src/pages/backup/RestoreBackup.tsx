import { useState } from "react";
import { Upload, AlertTriangle, FileText, CheckCircle, Clock, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const availableBackups = [
  { id: 1, name: "Auto Backup - 02 Jan 2026", date: "02 Jan 2026, 11:30 PM", size: "12.5 MB", type: "auto" },
  { id: 2, name: "Auto Backup - 01 Jan 2026", date: "01 Jan 2026, 11:30 PM", size: "12.3 MB", type: "auto" },
  { id: 3, name: "Manual Backup - 30 Dec 2025", date: "30 Dec 2025, 04:15 PM", size: "12.1 MB", type: "manual" },
  { id: 4, name: "Auto Backup - 29 Dec 2025", date: "29 Dec 2025, 11:30 PM", size: "11.9 MB", type: "auto" },
];

export default function RestoreBackup() {
  const [selectedBackup, setSelectedBackup] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [progress, setProgress] = useState(0);
  const [restoreMethod, setRestoreMethod] = useState<"cloud" | "file">("cloud");

  const handleRestore = () => {
    if (!selectedBackup && !uploadedFile) return;
    
    setIsRestoring(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRestoring(false);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Restore Backup</h1>
          <p className="text-muted-foreground">Restore your data from a previous backup</p>
        </div>
      </div>

      {/* Warning */}
      <div className="metric-card bg-warning/10 border-warning/20">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-warning" />
          <div>
            <h3 className="font-semibold text-warning">Important Warning</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Restoring a backup will replace all current data with the backup data. 
              This action cannot be undone. We recommend creating a backup of current data before restoring.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cloud Backups */}
        <div className="metric-card">
          <div className="flex items-center gap-2 mb-4">
            <HardDrive className="w-5 h-5" />
            <h3 className="font-semibold">Restore from Cloud</h3>
          </div>
          
          <div className="space-y-3">
            {availableBackups.map((backup) => (
              <div
                key={backup.id}
                onClick={() => {
                  setSelectedBackup(backup.id);
                  setRestoreMethod("cloud");
                  setUploadedFile(null);
                }}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedBackup === backup.id && restoreMethod === "cloud"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {selectedBackup === backup.id && restoreMethod === "cloud" ? (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  ) : (
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{backup.name}</p>
                    <p className="text-xs text-muted-foreground">{backup.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-muted px-2 py-1 rounded">{backup.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Backup */}
        <div className="metric-card">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5" />
            <h3 className="font-semibold">Restore from File</h3>
          </div>
          
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                uploadedFile ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              {uploadedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Drag and drop your backup file here</p>
                  <p className="text-sm text-muted-foreground">or</p>
                </>
              )}
              <Label htmlFor="backup-file" className="cursor-pointer">
                <Input
                  id="backup-file"
                  type="file"
                  accept=".bak,.backup,.zip"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setUploadedFile(e.target.files[0]);
                      setRestoreMethod("file");
                      setSelectedBackup(null);
                    }
                  }}
                />
                <Button variant="outline" className="mt-4" asChild>
                  <span>Browse Files</span>
                </Button>
              </Label>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Supported formats: .bak, .backup, .zip
            </p>
          </div>
        </div>
      </div>

      {/* Restore Action */}
      <div className="metric-card">
        <h3 className="font-semibold mb-4">Restore Data</h3>
        
        {isRestoring && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Restoring backup...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        <div className="flex gap-4">
          <Button
            className="btn-gradient gap-2"
            onClick={handleRestore}
            disabled={isRestoring || (!selectedBackup && !uploadedFile)}
          >
            <Upload className="w-4 h-4" />
            {isRestoring ? "Restoring..." : "Restore Backup"}
          </Button>
          
          {(selectedBackup || uploadedFile) && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedBackup(null);
                setUploadedFile(null);
              }}
            >
              Clear Selection
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
