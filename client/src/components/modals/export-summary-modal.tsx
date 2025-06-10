import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, FileText, X } from "lucide-react";

interface ExportSummaryData {
  capabilities: number;
  applications: number;
  itComponents: number;
  interfaces: number;
  dataObjects: number;
  initiatives: number;
  level: number;
  filenames: string[];
  totalFiles: number;
}

interface ExportSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportData: ExportSummaryData | null;
}

export default function ExportSummaryModal({ isOpen, onClose, exportData }: ExportSummaryModalProps) {
  if (!exportData) return null;

  const totalRecords = exportData.capabilities + exportData.applications + 
                      exportData.itComponents + exportData.interfaces + 
                      exportData.dataObjects + exportData.initiatives;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Export Completed Successfully
          </DialogTitle>
          <DialogDescription>
            Your contextual export has been completed. Here's a summary of the exported data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{exportData.totalFiles}</div>
              <div className="text-sm text-blue-800">Files Generated</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalRecords}</div>
              <div className="text-sm text-green-800">Total Records</div>
            </div>
          </div>

          {/* Current Level Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-600">Export Scope</div>
            <div className="text-lg font-semibold">
              Level {exportData.level} Capabilities and Related Data
            </div>
          </div>

          {/* Record Breakdown */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Records Exported:</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex justify-between items-center p-2 border rounded">
                <span className="text-sm">Business Capabilities</span>
                <Badge variant="secondary">{exportData.capabilities}</Badge>
              </div>
              <div className="flex justify-between items-center p-2 border rounded">
                <span className="text-sm">Applications</span>
                <Badge variant="secondary">{exportData.applications}</Badge>
              </div>
              <div className="flex justify-between items-center p-2 border rounded">
                <span className="text-sm">IT Components</span>
                <Badge variant="secondary">{exportData.itComponents}</Badge>
              </div>
              <div className="flex justify-between items-center p-2 border rounded">
                <span className="text-sm">Interfaces</span>
                <Badge variant="secondary">{exportData.interfaces}</Badge>
              </div>
              <div className="flex justify-between items-center p-2 border rounded">
                <span className="text-sm">Data Objects</span>
                <Badge variant="secondary">{exportData.dataObjects}</Badge>
              </div>
              <div className="flex justify-between items-center p-2 border rounded">
                <span className="text-sm">Initiatives</span>
                <Badge variant="secondary">{exportData.initiatives}</Badge>
              </div>
            </div>
          </div>

          {/* Generated Files */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Generated Files:</h4>
            <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
              {exportData.filenames.map((filename, index) => (
                <div key={index} className="flex items-center gap-2 py-1">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-mono text-gray-700">{filename}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}