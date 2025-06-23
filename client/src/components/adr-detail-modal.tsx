import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, X, Edit, Save, Undo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AdrVersionTimeline from "./adr-version-timeline";

interface Adr {
  id: number;
  adrId: string;
  title: string;
  status: string;
  date: string;
  applicationId?: string;
  capabilityIds?: string;
  problemStatement?: string;
  businessDrivers?: string;
  currentState?: string;
  constraints?: string;
  decisionCriteria?: string;
  optionsConsidered?: string;
  selectedOption?: string;
  justification?: string;
  actionItems?: string;
  impactAssessment?: string;
  verificationMethod?: string;
  positiveConsequences?: string;
  negativeConsequences?: string;
  risksAndMitigations?: string;
  notes?: string;
  references?: string;
  approvals?: string;
  revisionHistory?: string;
  decisionMakers?: string;
  relatedStandard?: string;
  impactedSystems?: string;
  classification?: string;
  auditTrail?: string;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
  version?: number;
}

interface AdrDetailModalProps {
  adr: Adr | null;
  onClose: () => void;
  applicationName?: string;
}

interface AuditEntry {
  timestamp: string;
  user: string;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  version: number;
  changes?: string[];
}

export default function AdrDetailModal({ adr, onClose, applicationName }: AdrDetailModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedAdr, setEditedAdr] = useState<Adr | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number>(adr?.version || 1);
  const [currentAdrData, setCurrentAdrData] = useState<Adr>(adr);

  // Fetch specific version data
  const { data: versionData } = useQuery({
    queryKey: ['/api/adrs', adr.adrId, 'versions', selectedVersion],
    queryFn: async () => {
      if (selectedVersion === adr.version) {
        return adr; // Use current ADR data for latest version
      }
      const response = await fetch(`/api/adrs/${adr.adrId}/versions/${selectedVersion}`);
      if (!response.ok) return adr;
      return await response.json();
    },
    enabled: !!adr.adrId
  });

  // Update current ADR data when version changes
  useEffect(() => {
    if (versionData) {
      setCurrentAdrData(versionData);
    }
  }, [versionData]);

  // Memoize the field update function to prevent re-renders
  const updateField = useCallback((field: keyof Adr, value: string) => {
    setEditedAdr(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  // Initialize edited ADR when switching to edit mode
  const startEditing = () => {
    setEditedAdr({ ...adr });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditedAdr(null);
    setIsEditing(false);
  };

  const updateAdrMutation = useMutation({
    mutationFn: async (updatedData: Partial<Adr>) => {
      const response = await apiRequest(`/api/adrs/${adr.id}`, 'PATCH', updatedData);
      return response.json();
    },
    onSuccess: (updatedAdr) => {
      queryClient.invalidateQueries({ queryKey: ['/api/adrs'] });
      toast({
        title: "ADR Updated",
        description: "Architecture Decision Record has been updated successfully.",
      });
      // Update the current ADR data with the response
      Object.assign(adr, updatedAdr);
      setIsEditing(false);
      setEditedAdr(null);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update ADR. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveChanges = () => {
    if (!editedAdr) return;
    
    // Detect which fields were changed
    const changedFields: string[] = [];
    if (editedAdr) {
      Object.keys(editedAdr).forEach(key => {
        if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && 
            editedAdr[key as keyof Adr] !== adr[key as keyof Adr]) {
          changedFields.push(key);
        }
      });
    }

    // Create audit entry for the changes
    const auditEntry: AuditEntry = {
      timestamp: new Date().toISOString(),
      user: "Current User", // TODO: Get from auth context
      action: "Updated",
      version: (adr.version || 1) + 1,
      changes: changedFields
    };

    // Prepare clean data without timestamp and problematic fields
    const { 
      id, 
      createdAt, 
      updatedAt, 
      lastModifiedAt, 
      date,
      ...cleanEditedAdr 
    } = editedAdr;
    
    const updatedData = {
      ...cleanEditedAdr,
      auditTrail: JSON.stringify([
        ...(adr.auditTrail ? JSON.parse(adr.auditTrail) : []),
        auditEntry
      ]),
      lastModifiedBy: "Current User", // TODO: Get from auth context
      version: (adr.version || 1) + 1
    };

    updateAdrMutation.mutate(updatedData);
  };

  const exportToFormat = (format: 'md' | 'docx' | 'html') => {
    const exportAdr = isEditing ? editedAdr || currentAdrData : currentAdrData;
    let content: string;
    let mimeType: string;
    let fileExtension: string;

    switch (format) {
      case 'md':
        content = generateMarkdown(exportAdr, applicationName);
        mimeType = 'text/markdown';
        fileExtension = 'md';
        break;
      case 'html':
        content = generateHTML(exportAdr, applicationName);
        mimeType = 'text/html';
        fileExtension = 'html';
        break;
      case 'docx':
        content = generateDocx(exportAdr, applicationName);
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        fileExtension = 'docx';
        break;
      default:
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportAdr.adrId.toLowerCase().replace(/[^a-z0-9]/g, '-')}-v${selectedVersion}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "ADR Exported",
      description: `${exportAdr.adrId} v${selectedVersion} exported as ${format.toUpperCase()}.`,
    });
  };

  const generateHTML = (adr: Adr, appName?: string): string => {
    const markdown = generateMarkdown(adr, appName);
    
    // Simple markdown to HTML conversion
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${adr.adrId} - ${adr.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1, h2, h3 { color: #333; }
        .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .section { margin: 20px 0; }
        .badge { background: #007cba; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 4px; }
        code { background: #f0f0f0; padding: 2px 4px; border-radius: 2px; }
    </style>
</head>
<body>
    ${markdown
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\`(.*?)\`/g, '<code>$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
    }
</body>
</html>`;
  };

  const generateDocx = (adr: Adr, appName?: string): string => {
    // Simple DOCX-style XML content (basic format)
    const content = generateMarkdown(adr, appName);
    return `<?xml version="1.0" encoding="UTF-8"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:t>${content.replace(/\n/g, '</w:t></w:r></w:p><w:p><w:r><w:t>')}</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>`;
  };

  const generateMarkdown = (adr: Adr, appName?: string): string => {
    return `# ${adr.adrId}: ${adr.title}

## Metadata

| Field | Value |
|-------|-------|
| **Status** | ${adr.status} |
| **Date** | ${new Date(adr.date).toLocaleDateString()} |
| **Decision Makers** | ${adr.decisionMakers || '[TO BE DETERMINED]'} |
| **Related Standard** | ${adr.relatedStandard || '[TO BE DETERMINED]'} |
| **Impacted Systems** | ${adr.impactedSystems || '[TO BE DETERMINED]'} |
| **Classification** | ${adr.classification || '[TO BE DETERMINED]'} |
| **Application** | ${appName || 'Unassigned'} |

## Context

### Problem Statement
${adr.problemStatement || '[TO BE DETERMINED]'}

### Business Drivers
${adr.businessDrivers || '[TO BE DETERMINED]'}

### Current State
${adr.currentState || '[TO BE DETERMINED]'}

### Constraints
${adr.constraints || '[TO BE DETERMINED]'}

## Decision Criteria
${adr.decisionCriteria || '[TO BE DETERMINED]'}

## Options Considered
${adr.optionsConsidered || '[TO BE DETERMINED]'}

## Decision

### Selected Option
${adr.selectedOption || '[TO BE DETERMINED]'}

### Justification
${adr.justification || '[TO BE DETERMINED]'}

## Implementation

### Action Items
${adr.actionItems || '[TO BE DETERMINED]'}

### Impact Assessment
${adr.impactAssessment || '[TO BE DETERMINED]'}

### Verification Method
${adr.verificationMethod || '[TO BE DETERMINED]'}

## Consequences

### Positive Consequences
${adr.positiveConsequences || '[TO BE DETERMINED]'}

### Negative Consequences
${adr.negativeConsequences || '[TO BE DETERMINED]'}

### Risks and Mitigations
${adr.risksAndMitigations || '[TO BE DETERMINED]'}

## Notes
${adr.notes || '[TO BE DETERMINED]'}

## References
${adr.references || '[TO BE DETERMINED]'}

## Approvals
${adr.approvals || '[TO BE DETERMINED]'}

## Revision History
${adr.revisionHistory || '[TO BE DETERMINED]'}

---
*Generated on ${new Date().toLocaleDateString()} from Enterprise ADR Management System*
`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'proposed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'deprecated': return 'bg-red-100 text-red-800 border-red-200';
      case 'superseded': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'rejected': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Create a stable Section component to prevent focus loss
  const Section = ({ title, content, field }: { title: string; content?: string; field?: keyof Adr }) => {
    if (!isEditing && (!content || content.trim() === '')) return null;
    
    const currentAdr = isEditing ? editedAdr : currentAdrData;
    const currentValue = (currentAdr?.[field] as string) || '';
    
    return (
      <div className="space-y-3">
        <h4 className="font-semibold text-base text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1">
          {title}
        </h4>
        {isEditing && field && selectedVersion === adr.version ? (
          <Textarea
            key={`${field}-editing`}
            value={currentValue}
            onChange={(e) => updateField(field, e.target.value)}
            className="min-h-[120px] text-sm leading-relaxed resize-vertical border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg p-4"
            placeholder={`Enter ${title.toLowerCase()}...

You can use markdown formatting:
- **bold text**
- *italic text*  
- \`code\`
- Lists with - or 1.
- Links: [text](url)`}
          />
        ) : (
          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 leading-relaxed">
            {content || (
              <span className="text-gray-400 italic">[TO BE DETERMINED]</span>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!adr) return null;

  const auditTrail: AuditEntry[] = adr.auditTrail ? JSON.parse(adr.auditTrail) : [];

  return (
    <Dialog open={!!adr} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="space-y-2 flex-1">
            <DialogTitle className="text-xl font-bold">{adr.adrId}</DialogTitle>
            <h2 className="text-lg text-gray-700 dark:text-gray-300">{adr.title}</h2>
            <div className="flex items-center gap-4">
              <Badge className={`${getStatusColor(adr.status)} border`}>
                {adr.status}
              </Badge>
              <span className="text-sm text-gray-500">
                {formatDate(adr.date)}
              </span>
              {applicationName && (
                <Badge variant="outline" className="text-xs">
                  🏢 {applicationName}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="default" size="sm" onClick={saveChanges} disabled={updateAdrMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={cancelEditing}>
                  <Undo className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={startEditing}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={exportToMarkdown}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Version Timeline */}
        <AdrVersionTimeline 
          adr={adr}
          selectedVersion={selectedVersion}
          onVersionSelect={setSelectedVersion}
        />

        {/* Version Notice */}
        {selectedVersion !== adr.version && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <span className="text-sm font-medium">
                📜 Viewing Version {selectedVersion} (Historical)
              </span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              This is a read-only view of a previous version. Switch to the latest version to make edits.
            </p>
          </div>
        )}

        <div className="space-y-8 mt-6">
          <Section title="Problem Statement" content={currentAdrData.problemStatement} field="problemStatement" />
          <Section title="Business Drivers" content={currentAdrData.businessDrivers} field="businessDrivers" />
          <Section title="Current State" content={currentAdrData.currentState} field="currentState" />
          <Section title="Constraints" content={currentAdrData.constraints} field="constraints" />
          <Section title="Decision Criteria" content={currentAdrData.decisionCriteria} field="decisionCriteria" />
          <Section title="Options Considered" content={currentAdrData.optionsConsidered} field="optionsConsidered" />
          
          <div className="my-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full">
                Decision
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
            </div>
          </div>
          
          <Section title="Selected Option" content={currentAdrData.selectedOption} field="selectedOption" />
          <Section title="Justification" content={currentAdrData.justification} field="justification" />
          
          <div className="my-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-3 py-1 rounded-full">
                Implementation
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>
            </div>
          </div>
          
          <Section title="Action Items" content={currentAdrData.actionItems} field="actionItems" />
          <Section title="Impact Assessment" content={currentAdrData.impactAssessment} field="impactAssessment" />
          <Section title="Verification Method" content={currentAdrData.verificationMethod} field="verificationMethod" />
          
          <div className="my-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950 px-3 py-1 rounded-full">
                Consequences
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
            </div>
          </div>
          
          <Section title="Positive Consequences" content={currentAdrData.positiveConsequences} field="positiveConsequences" />
          <Section title="Negative Consequences" content={currentAdrData.negativeConsequences} field="negativeConsequences" />
          <Section title="Risks and Mitigations" content={currentAdrData.risksAndMitigations} field="risksAndMitigations" />
          
          <div className="my-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 px-3 py-1 rounded-full">
                Additional Information
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>
          </div>
          
          <Section title="Notes" content={currentAdrData.notes} field="notes" />
          <Section title="References" content={currentAdrData.references} field="references" />

          {auditTrail.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Audit Trail</h4>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded border max-h-40 overflow-y-auto">
                  {auditTrail.map((entry, index) => (
                    <div key={index} className="text-xs text-gray-600 dark:text-gray-400 mb-2 last:mb-0">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">v{entry.version} - {entry.action}</span>
                        <span>{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                      <div>by {entry.user}</div>
                      {entry.field && (
                        <div className="mt-1 pl-2 border-l-2 border-gray-300">
                          <span className="font-medium">{entry.field}:</span> {entry.oldValue} → {entry.newValue}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="text-xs text-gray-400 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Decision Makers:</span> {adr.decisionMakers || '[TO BE DETERMINED]'}
              </div>
              <div>
                <span className="font-medium">Classification:</span> {adr.classification || '[TO BE DETERMINED]'}
              </div>
              <div>
                <span className="font-medium">Related Standard:</span> {adr.relatedStandard || '[TO BE DETERMINED]'}
              </div>
              <div>
                <span className="font-medium">Impacted Systems:</span> {adr.impactedSystems || '[TO BE DETERMINED]'}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}