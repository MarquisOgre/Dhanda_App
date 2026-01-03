import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ImportItems() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null);
  const [duplicateAction, setDuplicateAction] = useState("skip");

  const handleImport = () => {
    if (!uploadedFile) return;
    
    setIsImporting(true);
    setProgress(0);
    setImportResult(null);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsImporting(false);
          setImportResult({ success: 145, failed: 3 });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Import Items</h1>
          <p className="text-muted-foreground">Import items from Excel or CSV file</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Download Template
        </Button>
      </div>

      {/* Instructions */}
      <div className="metric-card bg-primary/5 border-primary/20">
        <h3 className="font-semibold mb-3">Import Instructions</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• Download the sample template to see the required format</li>
          <li>• Fill in your item data in the template</li>
          <li>• Required columns: Item Name, Category, Unit, Sale Price</li>
          <li>• Optional columns: HSN Code, Purchase Price, Opening Stock, Min Stock</li>
          <li>• Upload the completed file (Excel or CSV)</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="metric-card">
          <h3 className="font-semibold mb-4">Upload File</h3>
          
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
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setUploadedFile(null);
                    setImportResult(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Drag and drop your file here</p>
                <p className="text-sm text-muted-foreground">or</p>
              </>
            )}
            <Label htmlFor="import-file" className="cursor-pointer">
              <Input
                id="import-file"
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setUploadedFile(e.target.files[0]);
                    setImportResult(null);
                  }
                }}
              />
              {!uploadedFile && (
                <Button variant="outline" className="mt-4" asChild>
                  <span>Browse Files</span>
                </Button>
              )}
            </Label>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-2">
            Supported formats: .xlsx, .xls, .csv
          </p>
        </div>

        {/* Import Options */}
        <div className="metric-card">
          <h3 className="font-semibold mb-4">Import Options</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>If duplicate item found</Label>
              <Select value={duplicateAction} onValueChange={setDuplicateAction}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skip">Skip duplicate items</SelectItem>
                  <SelectItem value="update">Update existing items</SelectItem>
                  <SelectItem value="create">Create as new item</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isImporting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Importing items...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {importResult && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="font-medium text-success">{importResult.success} items imported successfully</span>
                </div>
                {importResult.failed > 0 && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <span className="font-medium text-destructive">{importResult.failed} items failed to import</span>
                  </div>
                )}
              </div>
            )}

            <Button
              className="btn-gradient w-full gap-2"
              onClick={handleImport}
              disabled={isImporting || !uploadedFile}
            >
              <Upload className="w-4 h-4" />
              {isImporting ? "Importing..." : "Import Items"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
